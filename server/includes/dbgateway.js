import config from './../cfg/main.js';
import dbConfig from './../cfg/dbmain.js';

const queryMap=new Map();

// Engine function
export function dbRequest(query, params=[]) {
  return queryMap.get(query).get(dbConfig.dbsys)(...params);
}

// <-- Start List of table names

const tableList=new Map();
const tableRef=new Map();

export async function getTableList() {
  if (tableList.size==0) {
    const tables = await dbRequest("get tables");
    for (const tableName of tables) {
      tableList.set('TABLE_' + tableName.toUpperCase(), tableName);
      tableRef.set(tableName, 'TABLE_' + tableName.toUpperCase());
    }
  }
  return tableList;
}

export async function getTableRef() {
  if (tableList.size==0) {
    await getTableList();
  }
  return tableRef;
}

// <-- End List of table names

// <-- Start utils

// we need the promise because it is not posible to collect result other way
// return query result, could be type object or others
async function dbQuery(sql) {
  return dbRequest("get db link")
  .then(db=>new Promise((resolve, reject) => {
    if (dbConfig.dbsys=="mysql") {
      return db.query(sql, (err, result) => {
        if (err) {
          return reject(err.sqlMessage);
        }
        resolve(result);
      });
    }
    if (dbConfig.dbsys=="pgsql") {
      return db.query(sql, null, (err, result) => {
        if (err) {
          return reject(err.stack);
        }
        resolve(result);
      });
    }
  }));
}

export function dbEscape(str, singleQuotes=false) {
  if (str===null) return 'NULL';
  if (typeof str == "number") return str;
  if (typeof str == "boolean") return str==true ? 1: 0;
  if (typeof str != "string")  str='';
  let escaped;
  if (dbConfig.dbsys=="mysql") {
    escaped = str
      .replace(/\\/g, "\\\\")
      .replace(/\'/g, "\\\'");
  }
  else if (dbConfig.dbsys=="pgsql") {
    escaped = str
      .replace(/\'/g, '\'\'');
  }
  if (singleQuotes) escaped='\'' + escaped + '\'';
  return escaped;
}

// return an array
export async function dbSelectQuery(sql){
  if (dbConfig.dbsys=="mysql") return await dbQuery(sql);
  else if (dbConfig.dbsys=="pgsql") return (await dbQuery(sql)).rows;
}

// return integer
export async function dbUpdateQuery(sql){
  console.log(sql);
  if (dbConfig.dbsys=="mysql") return (await dbQuery(sql)).affectedRows;
  else if (dbConfig.dbsys=="pgsql") {
    return (await dbQuery(sql)).rowCount;
  }
}

// return column id content
export async function dbInsertQuery(sql){
  console.log(sql);
  if (dbConfig.dbsys=="mysql") return (await dbQuery(sql)).insertId;
  else if (dbConfig.dbsys=="pgsql") {
    sql += ' RETURNING id';
    return (await dbQuery(sql)).rows[0]['id'];
  }
}

// <-- End utils

// Database connection facility
let dbLink;
// we need the promise because it is not posible to catch error other way
queryMap.set("get db link", new Map());
queryMap.get("get db link").set("mongodb", async (getNew, myCfg=dbConfig) =>{
  if (!getNew && dbLink) return dbLink;
  const {default: mongoose} = await import('mongoose');
  const {setDbSchema} = await import('./mongodb.js');
  setDbSchema();
  dbLink = mongoose.connection;
  return new Promise((resolve, reject) => {
    mongoose.connect(myCfg.url, err => {
      if (err) {
        console.log("pgerror: ", err);
        reject(err.stack);
      }
      else resolve(dbLink);
    });
  });
});
queryMap.get("get db link").set("pgsql", async (getNew, myCfg=dbConfig) =>{
  if (!getNew && dbLink) return dbLink;
  const {default: pgsql} = await import('pg');
  dbLink = new pgsql.Client(myCfg);
  return new Promise((resolve, reject) => {
    dbLink.connect(err => {
      if (err) {
        console.log("pgerror: ", err);
        reject(err.stack);
      }
      else resolve(dbLink);
    });
  });
});
queryMap.get("get db link").set("mysql", async (getNew, myCfg=dbConfig) =>{
  if (!getNew && dbLink) return dbLink;
  const {default: mysql} = await import('mysql');
  dbLink = mysql.createConnection(myCfg);
  return new Promise((resolve, reject) => {
    dbLink.connect(err => {
      if (err) {
        reject(err.sqlMessage);
      }
      else resolve(dbLink);
    });
  });
});

// <-- Start db query Functions

queryMap.set("init db", new Map());
queryMap.get("init db").set("mongodb", async () =>{
  const fs = await import('fs');
  const {unpacking, arrayUnpacking} = await import('../../shared/modules/utils.js');
  const {impData} = await import('./utils.js');
  let data=fs.readFileSync(dbConfig.importPath + dbConfig.dbsys + '_dtbs.json', 'utf8');
  data=JSON.parse(data);
  const {Node, NodeMale, NodeFemale} = await import('./nodesback.js');

  const langs = arrayUnpacking(data.languages).map(lang=>new NodeMale().load(lang));
  const moLang=new NodeFemale("TABLE_LANGUAGES");
  for (const lang of langs) {
    moLang.addChild(lang);
  }
  await moLang.dbInsertMyTree();
  const newLangs=moLang.children;
  const usersMo=new NodeFemale().load(unpacking(data.tree.shift()));
  await usersMo.dbInsertMyTree();
  await impData(newLangs, "pageelementsdata", Node.dataToNode(unpacking(data.tree.shift())));
  await impData(newLangs, "siteelementsdata", Node.dataToNode(unpacking(data.tree.shift())));
  await impData(newLangs, "itemcategoriesdata", Node.dataToNode(unpacking(data.tree.shift())));
  await impData(newLangs, "shippingtypesdata", Node.dataToNode(unpacking(data.tree.shift())));
  await impData(newLangs, "paymenttypesdata", Node.dataToNode(unpacking(data.tree.shift())));
  return true;
});
queryMap.get("init db").set("pgsql", async () =>{
  if ((await getTableList()).length > 0) {
    return "Database tables already present. Import file manually";
  }
  const fs = await import('fs');
  let sql=fs.readFileSync(dbConfig.importPath + dbConfig.dbsys + 'db.sql', 'utf8');
  if (dbConfig.dbsys=="pgsql") {
    sql += fs.readFileSync(dbConfig.importPath + dbConfig.dbsys + 'db.sql.sync', 'utf8');
  }
  await dbRequest("get db link", [true, {multipleStatements: true, ...dbConfig}]);
  await dbQuery(sql);
  //We must load the tables names for refreshing its value
  await getTableList();
  
  return true;
});

// return array
queryMap.set("get tables", new Map());
queryMap.get("get tables").set("mongodb", async () =>Array.from(Object.keys((await dbRequest("get db link")).models)));
queryMap.get("get tables").set("pgsql", async () =>{
  const sql = `SELECT tablename FROM pg_catalog.pg_tables
    WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'`;
  return dbSelectQuery(sql)
  .then(result => result.map(elm=>elm[Object.keys(elm)[0]]));
});
queryMap.get("get tables").set("mysql", async () =>{
  const sql = "SHOW TABLES";
  return dbSelectQuery(sql)
    .then(result => result.map(elm=>elm[Object.keys(elm)[0]]));
});

queryMap.set("get foreign keys", new Map());
queryMap.get("get foreign keys").set("mongodb", async (tableName) =>{
  let result=[];
  for (const [key, value] of Object.entries((await dbRequest("get db link")).model(tableName).schema.tree)) {
    if (typeof value == "object" && value.ref) { 
      result.push({name: key, parenttablename: value.ref.toString()});
    }
  }
  return result;
});
queryMap.get("get foreign keys").set("pgsql", async (tableName) =>{
  const sql = `SELECT ccu.table_name AS parenttablename, kcu.column_name AS name
  FROM information_schema.table_constraints AS tc JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
  WHERE constraint_type = 'FOREIGN KEY' AND tc.table_name = '${tableName}'`;
  return dbSelectQuery(sql);
});
queryMap.get("get foreign keys").set("mysql", async (tableName) =>{
  const sql =`SELECT r.REFERENCED_TABLE_NAME as parenttablename, r.COLUMN_NAME as name
  FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE r
  WHERE TABLE_SCHEMA= SCHEMA() AND r.REFERENCED_TABLE_NAME IS NOT NULL
  AND r.TABLE_NAME='${tableName}'`;
  return dbSelectQuery(sql);
});

// get the relationships of table elements
queryMap.set("get relationships from table", new Map());
queryMap.get("get relationships from table").set("mongodb", async (tableName) =>{
  let result=[];
  for (const [childtablename, model] of Object.entries((await dbRequest("get db link")).models)) {
    for (const [key, value] of Object.entries(model.schema.tree)) {
      if (typeof value == "object" && value.ref && value.ref===tableName) {
        result.push({childtablename: childtablename, parenttablename: tableName, name: childtablename.toLowerCase()});
      }
    }
  }
  return result;
});
queryMap.get("get relationships from table").set("pgsql", async (tableName) =>{
  const sql=`SELECT ccu.table_name AS parenttablename, tc.table_name as childtablename, tc.table_name as name 
  FROM information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu 
    ON tc.constraint_name = kcu.constraint_name 
  JOIN information_schema.constraint_column_usage AS ccu 
    ON ccu.constraint_name = tc.constraint_name 
  WHERE constraint_type = 'FOREIGN KEY'
  AND ccu.table_name =  '${tableName}'`;
  return dbSelectQuery(sql);
});
queryMap.get("get relationships from table").set("mysql", async (tableName) =>{
  const sql = `SELECT r.TABLE_NAME as childtablename, r.REFERENCED_TABLE_NAME as parenttablename, r.TABLE_NAME as name FROM
  INFORMATION_SCHEMA.KEY_COLUMN_USAGE r
  WHERE TABLE_SCHEMA= SCHEMA()
  AND r.REFERENCED_TABLE_NAME= '${tableName}'`;
  return dbSelectQuery(sql);
});

// get the extra parents of table elements
queryMap.set("get extra parents from table", new Map());
queryMap.get("get extra parents from table").set("mongodb", async (tableName) =>{
  let result=[];
  for (const [key, value] of Object.entries((await dbRequest("get db link")).model(tableName).schema.tree)) {
    if (typeof value == "object" && value.ref) {
      result.push({childtablename: tableName, parenttablename: value.ref.toString(), name: tableName.toLowerCase()});
    }
  }
  return result;
});
queryMap.get("get extra parents from table").set("pgsql", async (tableName) =>{
  const sql=`SELECT ccu.table_name AS parenttablename, tc.table_name as childtablename
  FROM information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu 
    ON tc.constraint_name = kcu.constraint_name 
  JOIN information_schema.constraint_column_usage AS ccu 
    ON ccu.constraint_name = tc.constraint_name 
  WHERE constraint_type = 'FOREIGN KEY'
  AND tc.table_name =  '${tableName}'`;
  return dbSelectQuery(sql);
});
queryMap.get("get extra parents from table").set("mysql", async (tableName) =>{
  const sql = `SELECT r.TABLE_NAME as childtablename, r.REFERENCED_TABLE_NAME as parenttablename, r.TABLE_NAME as name FROM
  INFORMATION_SCHEMA.KEY_COLUMN_USAGE r
  WHERE TABLE_SCHEMA= SCHEMA()
  AND REFERENCED_TABLE_NAME IS NOT NULL
  AND r.TABLE_NAME= '${tableName}'`;
  return dbSelectQuery(sql);
});

queryMap.set("set siblings order on update", new Map());
queryMap.get("set siblings order on update").set("mongodb", async (tableName, positioncolumnname, thisId, newOrder, oldOrder, foreigncolumnname, foreignId) =>{
  await (await dbRequest("get db link")).model(tableName).findOneAndUpdate({ [foreigncolumnname + ".ref"]: { $eq: foreignId }, _id: {$ne: thisId}, [positioncolumnname]: newOrder},  {[positioncolumnname]: oldOrder});
  return 1;
});
queryMap.get("set siblings order on update").set("pgsql", async (tableName, positioncolumnname, thisId, newOrder, oldOrder, foreigncolumnname, foreignId) =>{
  let sql = `UPDATE ${tableName} t
  SET ${positioncolumnname} = ${oldOrder}
  WHERE t.id!=${thisId}
  AND t.${positioncolumnname} = ${newOrder}`;
  if (foreigncolumnname) sql +=` AND t.${foreigncolumnname} = ${foreignId}`;
  return dbUpdateQuery(sql);
});
queryMap.get("set siblings order on update").set("mysql", queryMap.get("set siblings order on update").get("pgsql"));

queryMap.set("set siblings order on delete", new Map());
queryMap.get("set siblings order on delete").set("mongodb", async (tableName, positioncolumnname, thisId, foreigncolumnname, foreignId) =>{
  const actualPosition = (await (await dbRequest("get db link")).model(tableName).findById(thisId, positioncolumnname)).toObject()[positioncolumnname];
  let findQuery= dbLink.model(tableName).find({ [positioncolumnname]: { $gt: actualPosition } });
  if (foreigncolumnname) findQuery=findQuery.find({ [foreigncolumnname]: { $eq: foreignId } });
  const result =await findQuery.exec();
  result.forEach(async (elm)=>{
    elm[positioncolumnname]--;
    await elm.save();
  });
  return result.length;
});
queryMap.get("set siblings order on delete").set("pgsql", async (tableName, positioncolumnname, thisId, foreigncolumnname, foreignId) =>{
  let sql = `UPDATE ${tableName} dt1
  SET ${positioncolumnname} = dt1.${positioncolumnname} - 1
  FROM ${tableName} dt2
  WHERE dt2.id=${thisId}
  AND dt1.${positioncolumnname} > dt2.${positioncolumnname}`;
  if (foreigncolumnname) sql += ` AND dt1.${foreigncolumnname} = ${foreignId}`;
  return dbUpdateQuery(sql);
});
queryMap.get("set siblings order on delete").set("mysql", async (tableName, positioncolumnname, thisId, foreigncolumnname, foreignId) =>{
  let sql = `UPDATE ${tableName} dt1
  INNER JOIN ${tableName} dt2
  ON dt2.id=${thisId}
  SET dt1.${positioncolumnname} = dt1.${positioncolumnname} - 1
  WHERE dt1.${positioncolumnname} > dt2.${positioncolumnname}`;
  if (foreigncolumnname) sql += ` AND dt1.${foreigncolumnname} = ${foreignId}`;
  return dbUpdateQuery(sql);
});

queryMap.set("set siblings order on insert", new Map());
queryMap.get("set siblings order on insert").set("mongodb", async (tableName, positioncolumnname, actualPosition, thisId, foreigncolumnname, foreignId) =>{
  let findQuery= dbLink.model(tableName).find({ [positioncolumnname]: { $gte: actualPosition} , _id: {$ne: thisId} });
  if (foreigncolumnname) findQuery=findQuery.find({ [foreigncolumnname]: { $eq: foreignId } });
  const result =await findQuery.exec();
  result.forEach(async (elm)=>{
    elm[positioncolumnname]++;
    await elm.save();
  });
  return result.length;
});
queryMap.get("set siblings order on insert").set("pgsql", async (tableName, positioncolumnname, actualPosition, thisId, foreigncolumnname, foreignId) =>{  
  let sql = `UPDATE ${tableName}
  SET ${positioncolumnname} = ${positioncolumnname} + 1
  WHERE ${positioncolumnname} >=  ${actualPosition}
  AND id != ${thisId}`;
  if (foreigncolumnname) sql += ` AND ${foreigncolumnname} = ${foreignId}`;
  return dbUpdateQuery(sql);
});
queryMap.get("set siblings order on insert").set("mysql", queryMap.get("set siblings order on insert").get("pgsql"));

queryMap.set("get table keys", new Map());
queryMap.get("get table keys").set("mongodb", async (tableName) =>{
  return Object.entries((await dbRequest("get db link")).model(tableName).schema.tree).filter(row=>!(["_id", "__v"].includes(row[0]))).map(row=>{
    const key={Field: row[0], Type: "text"};
    if (row[0]=='id') key.Primary="yes";
    const objType = row[1];
    if (typeof objType == 'function') {
      const type = objType.name;
      if (type=="Number") key.Type="integer";
      return key;
    }
    if (typeof objType == 'object') {
      if (objType.type) {
        const type = objType.type.name;
        if (type=="Number") key.Type="integer";
      }
      if (objType.positionRef) {
        key.Positioning="yes";
        key.ref=objType.positionRef;
      }
      return key;
    }
  });
});
queryMap.get("get table keys").set("pgsql", async (tableName) =>{
  const sql = `SELECT column_name as "Field", data_type as "Type", is_nullable as "Null", column_default as "Default", '' as "Extra"
  FROM information_schema.columns
  WHERE table_schema='public' AND table_name = '${tableName}'`;
  return (await dbSelectQuery(sql)).map(key=>{
    if (key.Field=='id') key.Primary="yes";
    let match=key.Field.match(/(.+)_position$/);
    if (match) {
      key.Positioning="yes";
      key.positionRef=match[1];
    }
    return key;
  })
});
queryMap.get("get table keys").set("mysql", async (tableName) =>{
  const sql =`show columns from ${tableName}`;
  return (await dbSelectQuery(sql)).map(key=>{
    if (key.Field=='id') key.Primary="yes";
    let match=key.Field.match(/(.+)_position$/);
    if (match) {
      key.Positioning="yes";
      key.ref=match[1];
    }
    return key;
  })
});

queryMap.set("create new", new Map());
queryMap.get("create new").set("mongodb", async (tableName) =>{
  const result=await (await dbRequest("get db link")).model(tableName).create({});
  return result._id;
});
queryMap.get("create new").set("pgsql", async (tableName) =>{
  const sql='INSERT INTO ' + tableName + ' DEFAULT VALUES';
  return dbInsertQuery(sql);
});
queryMap.get("create new").set("mysql", async (tableName) =>{
  const sql='INSERT INTO ' + tableName + ' VALUES()';
  return dbInsertQuery(sql);
});

queryMap.set("elements from table", new Map());
queryMap.get("elements from table").set("mongodb", async (data, filterProp={}, limit=[]) =>{
  let offset, max;
  if (limit.length == 2) {
    offset=limit[0];
    max=limit[1] - limit[0];
  }
  const query = (await dbRequest("get db link")).model((await getTableList()).get(data.props.childtablename)).find(filterProp);
  if (max) query=query.limit(max);
  if (offset) query=query.skip(offset);
  const result = (await query.exec()).map(mo=>mo.toJSON());
  return {total: Object.entries(result).length, data: result};
});
queryMap.get("elements from table").set("pgsql", async (data, filterProp={}, limit=[]) =>{
  let offset, max;
  if (limit.length == 2) {
    offset=limit[0];
    max=limit[1] - limit[0];
  }
  const searcharray = []; // search string array
  for (const key in filterProp) {
    if (filterProp[key]===null) {
      searcharray.push(`${dbEscape(key)} IS NULL`);
      continue;
    }
    searcharray.push(`${dbEscape(key)} = ${dbEscape(filterProp[key], true)}`);
  }
  let sql = 'SELECT * FROM ' + (await getTableList()).get(data.props.childtablename);
  if (searcharray.length>0) sql +=' where ' + searcharray.join(' and ');
  let countSql;
  if (max) {
    countSql=sql.replace('*' , 'COUNT(*) AS total');
    sql += ` LIMIT ${dbEscape(max)}`;
    if (offset) sql += ` OFFSET ${dbEscape(offset)}`;
  }
  const result = await dbSelectQuery(sql);
  let total = 0;
  if (countSql) {
    const result= await dbSelectQuery(countSql);
    total = result[0]["total"];
  }
  else total=result.length;
  return {total: total, data: result};
});
queryMap.get("elements from table").set("mysql", queryMap.get("elements from table").get("pgsql"));

queryMap.set("get children", new Map());
queryMap.get("get children").set("mongodb", async (foreigncolumnnames, positioncolumnname, data, extraParents=null, filterProp={}, limit=[]) =>{
  let query = (await dbRequest("get db link")).model((await getTableList()).get(data.props.childtablename)).find(Object.assign(filterProp, {[foreigncolumnnames[0]] : { $eq: data.partnerNode.props.id } }));
  if (foreigncolumnnames && foreigncolumnnames.length>0) {
    let offset, max;
    if (limit.length == 2) {
      offset=limit[0];
      max=limit[1] - limit[0];
    }
    query = query.find({[foreigncolumnnames[0]]: {$eq: data.partnerNode.props.id}});
    for (let i=1; i<foreigncolumnnames.length; i++) {
      query = query.find({[foreigncolumnnames[i]]: {$eq: extraParents[i-1].partnerNode.props.id}});
    }
    if (positioncolumnname) {
       query = query.sort({[positioncolumnname] : 1})
    }
    if (max) query=query.limit(max);
    if (offset) query=query.skip(offset);
  }
  const result = (await query.exec()).map(mo=>mo.toJSON());
  return {total: result.length, data: result};
});
queryMap.get("get children").set("pgsql", async (foreigncolumnnames, positioncolumnname, data, extraParents=null, filterProp={}, limit=[]) =>{
  const searcharray = []; // search string array
  for (let key in filterProp) {
    if (filterProp[key]===null) {
      searcharray.push(`${dbEscape(key)} IS NULL`);
      continue;
    }
    searcharray.push(`${dbEscape(key)} = ${dbEscape(filterProp[key], true)}`);
  }
  let sql = `SELECT * FROM ${(await getTableList()).get(data.props.childtablename)}`;
  let countSql;
  if (foreigncolumnnames && foreigncolumnnames.length>0) {
    let offset, max;
    if (limit.length == 2) {
      offset=limit[0];
      max=limit[1] - limit[0];
    }
    sql += ' WHERE ';
    const fsentence=[];
    fsentence.push(dbEscape(foreigncolumnnames[0]) + '=' + dbEscape(data.partnerNode.props.id));
    for (let i=1; i<foreigncolumnnames.length; i++) {
      fsentence.push(dbEscape(foreigncolumnnames[i]) + '=' + dbEscape(extraParents[i-1].partnerNode.props.id));
    }
    sql +=fsentence.concat(searcharray).join(' AND ');
    if (positioncolumnname) {
      sql += ` ORDER BY ${positioncolumnname}`;
    }
    if (max) {
      countSql=sql.replace(` ORDER BY ${positioncolumnname}` , '').replace('*' , 'COUNT(*) AS total');
      sql += ` LIMIT ${dbEscape(max)}`;
      if (offset) sql += ` OFFSET ${dbEscape(offset)}`;
    }
  }
  const result = await dbSelectQuery(sql);
  let total=0;
  if (countSql) {
    const result = await dbSelectQuery(countSql);
    total = result[0]['total'];
  }
  else {
    total=result.length;
  }
  return {total: total, data: result};
});
queryMap.get("get children").set("mysql", queryMap.get("get children").get("pgsql"));

// it returns an array of one element, of nothing found an empty array
queryMap.set("get root", new Map());
queryMap.get("get root").set("mongodb", async (foreignKey, data) =>{
  const myReturn=[];
  const result = await (await dbRequest("get db link")).model((await getTableList()).get(data.props.childtablename)).findOne({$or: [{[foreignKey] : null}, {[foreignKey] : {$exists: false}}]});
  if (result) return result.toJSON();
});
queryMap.get("get root").set("pgsql", async (foreignKey, data) =>{
  const sql =`SELECT * FROM ${(await getTableList()).get(data.props.childtablename)}
  WHERE ${foreignKey} IS NULL LIMIT 1`;
  return (await dbSelectQuery(sql))[0];
});
queryMap.get("get root").set("mysql", queryMap.get("get root").get("pgsql"));

queryMap.set("get partner", new Map());
queryMap.get("get partner").set("mongodb", async (foreignKey, data, childId) =>{
// query encontramos child, de el populate parent
  const result = await (await dbRequest("get db link")).model((await getTableList()).get(data.props.childtablename)).findOne({_id: childId}).populate(foreignKey);
  if (result && result[foreignKey]) {
    return result[foreignKey].toJSON();
  }
});
queryMap.get("get partner").set("pgsql", async (foreignKey, data, childId) =>{
  childId=dbEscape(childId);
  const sql = `SELECT t.* FROM ${(await getTableList()).get(data.props.parenttablename)} t
  inner join ${(await getTableList()).get(data.props.childtablename)} c on t.id=c.${foreignKey}
  WHERE c.id=${childId}`;
  let result = await dbSelectQuery(sql);
  if (result.length==1) {
    return result[0];
  }
});
queryMap.get("get partner").set("mysql", queryMap.get("get partner").get("pgsql"));

// return the inserted id or throw an error
queryMap.set("insert child", new Map());
queryMap.get("insert child").set("mongodb", async (foreigncolumnnames, positioncolumnname, data, thisChild, extraParents, updateSiblingsOrder) =>{
  const myProps={...thisChild.props}; //copy properties to not modify original element
  //add link relationships column properties
  let myforeigncolumnname;
  if (foreigncolumnnames.length > 0 && data.partnerNode && data.partnerNode.props.id) {
    myforeigncolumnname=foreigncolumnnames[0];
    myProps[myforeigncolumnname]=data.partnerNode.props.id;
  }
  if (positioncolumnname && !myProps[positioncolumnname]) {
    // Insert to last position order by default
    const req=myforeigncolumnname ? {[myforeigncolumnname] : data.partnerNode.props.id} : {}; 
    const result = await (await dbRequest("get db link")).model((await getTableList()).get(data.props.childtablename)).findOne(req, {[positioncolumnname]: 1, _id:0}).sort({[positioncolumnname]:-1});
    if (!result || !result[positioncolumnname]) myProps[positioncolumnname]=1;
    else myProps[positioncolumnname]=result[positioncolumnname] + 1;
  }
  if (extraParents) {
    for (let i=1; i<foreigncolumnnames.length; i++) {
      if (extraParents[i-1].partnerNode.props.id) myProps[foreigncolumnnames[i]]=extraParents[i-1].partnerNode.props.id;
    }
  }
  //Now we add a value for the props that are null and cannot be null
  if (data.childtablekeysinfo && data.syschildtablekeys) {
    for (const key in data.childtablekeys) {
      let value=data.childtablekeys[key];
      if (data.childtablekeysinfo[key]["Null"]=='NO' && !data.childtablekeysinfo[key]["Default"] && data.childtablekeysinfo[key].Extra!='auto_increment'){
        if (!Object.keys(myProps).includes(value) || myProps[value]===null) {
          if (data.childtablekeysinfo[key].Type.includes('int') || data.childtablekeysinfo[key].Type.includes('decimal')) {
            myProps[value]=0;
          }
          else {
            myProps[value]='';
          }
        }
      }
    }
  }
  if (myProps.id) delete myProps.id; //let it give the id
  if (Object.keys(myProps).length==0) {
    thisChild.props.id = await dbRequest("create new", [(await getTableList()).get(data.props.childtablename)]);
  }
  else {
    const result = await (await dbRequest("get db link")).model((await getTableList()).get(data.props.childtablename)).create(myProps);
    thisChild.props.id=result._id;
  }
  //We have to update sort_order of the siblings 
  if (updateSiblingsOrder && positioncolumnname && myProps[positioncolumnname]) {
    if (myforeigncolumnname) await dbRequest("set siblings order on insert", [(await getTableList()).get(data.props.childtablename), positioncolumnname, myProps[positioncolumnname], thisChild.props.id, myforeigncolumnname, data.partnerNode.props.id]);
    else await dbRequest("set siblings order on insert", [(await getTableList()).get(data.props.childtablename), positioncolumnname, myProps[positioncolumnname], thisChild.props.id]);
  }
  return thisChild.props.id;
});
queryMap.get("insert child").set("pgsql", async (foreigncolumnnames, positioncolumnname, data, thisChild, extraParents, updateSiblingsOrder) =>{
  const myProps={...thisChild.props}; //copy properties to not modify original element
  //add link relationships column properties
  let myforeigncolumnname;
  if (foreigncolumnnames.length > 0 && data.partnerNode && data.partnerNode.props.id) {
    myforeigncolumnname=foreigncolumnnames[0];
    myProps[myforeigncolumnname]=data.partnerNode.props.id;
  }
  if (positioncolumnname && !myProps[positioncolumnname]) {
    // Insert to last position order by default
    let sql = `SELECT MAX(${positioncolumnname}) as ${positioncolumnname} FROM ${(await getTableList()).get(data.props.childtablename)}`;
    if (myforeigncolumnname) sql += ` WHERE ${myforeigncolumnname} = ${data.partnerNode.props.id}`;
    const result = await dbSelectQuery(sql);
    if (!result[0][positioncolumnname]) myProps[positioncolumnname]=1;
    else myProps[positioncolumnname]=result[0][positioncolumnname] + 1;
  }
  if (extraParents) {
    for (let i=1; i<foreigncolumnnames.length; i++) {
      if (extraParents[i-1].partnerNode.props.id) myProps[foreigncolumnnames[i]]=extraParents[i-1].partnerNode.props.id;
    }
  }
  //Now we add a value for the props that are null and cannot be null
  if (data.childtablekeysinfo && data.syschildtablekeys) {
    for (const key in data.childtablekeys) {
      let value=data.childtablekeys[key];
      if (data.childtablekeysinfo[key]["Null"]=='NO' && !data.childtablekeysinfo[key]["Default"] && data.childtablekeysinfo[key].Extra!='auto_increment'){
        if (!Object.keys(myProps).includes(value) || myProps[value]===null) {
          if (data.childtablekeysinfo[key].Type.includes('int') || data.childtablekeysinfo[key].Type.includes('decimal')) {
            myProps[value]=0;
          }
          else {
            myProps[value]='';
          }
        }
      }
    }
  }
  if (myProps.id) delete myProps.id; //let mysql give the id
  if (Object.keys(myProps).length==0) {
    thisChild.props.id = await dbRequest("create new", [(await getTableList()).get(data.props.childtablename)]);
  }
  else {
    const cleanProps = Object.fromEntries(Object.entries(myProps).map(res=>[dbEscape(res[0]), dbEscape(res[1], true)]));
    const [cleanKeys, cleanValues] = [Object.keys(cleanProps), Object.values(cleanProps)];
    const sql = `INSERT INTO ${(await getTableList()).get(data.props.childtablename)}
    (${cleanKeys.join(', ')}) VALUES (${cleanValues.join(', ')})`;
    thisChild.props.id = await dbInsertQuery(sql);
  }
  //We have to update sort_order of the siblings 
  if (updateSiblingsOrder && positioncolumnname && myProps[positioncolumnname]) {
    if (myforeigncolumnname) await dbRequest("set siblings order on insert", [(await getTableList()).get(data.props.childtablename), positioncolumnname, myProps[positioncolumnname], thisChild.props.id, myforeigncolumnname, data.partnerNode.props.id]);
    else await dbRequest("set siblings order on insert", [(await getTableList()).get(data.props.childtablename), positioncolumnname, myProps[positioncolumnname], thisChild.props.id]);
  }
  return thisChild.props.id;
});
queryMap.get("insert child").set("mysql", queryMap.get("insert child").get("pgsql"));

queryMap.set("set child link", new Map());
queryMap.get("set child link").set("mongodb", async (foreigncolumnnames, positioncolumnname, data, thisChild, extraParents) =>{
  const updateProps = {[foreigncolumnnames[0]]: data.partnerNode.props.id};
  if (extraParents) {
    for (let i=1; i<foreigncolumnnames.length; i++) {
      Object.assing(updateProps, {[foreigncolumnnames[i]]: extraParents[i-1].partnerNode.props.id});
    }
  }
  console.log(thisChild.props.id, updateProps)
  const result = await (await dbRequest("get db link")).model((await getTableList()).get(data.props.childtablename)).findByIdAndUpdate(thisChild.props.id, updateProps);
  return result;
});
queryMap.get("set child link").set("pgsql", async (foreigncolumnnames, positioncolumnname, data, thisChild, extraParents) =>{
  //we will insert the relationship
  let sql = `UPDATE ${(await getTableList()).get(data.props.childtablename)} SET `;
  const fsentence=[];
  fsentence.push(foreigncolumnnames[0] + "=" + data.partnerNode.props.id);
  if (extraParents) {
    for (let i=1; i<foreigncolumnnames.length; i++) {
      fsentence.push(foreigncolumnnames[i] + '=' + extraParents[i-1].partnerNode.props.id);
    }
  }
  if (positioncolumnname) {
    if (!thisChild.props[positioncolumnname]) thisChild.props[positioncolumnname]=1; //first element by default
    fsentence.push(positioncolumnname + '=' + thisChild.props[positioncolumnname]);
  }
  sql +=fsentence.join(', ');
  sql +=` WHERE id = ${thisChild.props.id}`;
  return await dbUpdateQuery(sql);
});
queryMap.get("set child link").set("mysql", queryMap.get("set child link").get("pgsql"));

queryMap.set("delete child link", new Map());
queryMap.get("delete child link").set("mongodb", async (tableName, foreigncolumnname, childId) =>{
  return await (await dbRequest("get db link")).model(tableName).findByIdAndUpdate(childId, {[foreigncolumnname]: null});
});
queryMap.get("delete child link").set("pgsql", async (tableName, foreigncolumnname, childId) =>{
  const sql=`UPDATE ${tableName}
  SET ${foreigncolumnname} = NULL
  WHERE id=${childId}`;
  return await dbUpdateQuery(sql);
});
queryMap.get("delete child link").set("mysql", queryMap.get("delete child link").get("pgsql"));

queryMap.set("get my props", new Map());
queryMap.get("get my props").set("mongodb", async (tableName, thisId,  idKeyName) =>{
  return await (await dbRequest("get db link")).model(tableName).findById(childId);
});
queryMap.get("get my props").set("pgsql", async (tableName, thisId,  idKeyName) =>{
  const sql=`SELECT * FROM ${tableName}
  WHERE ${idKeyName}=${dbEscape(thisId)}`;
  const result = await dbSelectQuery(sql);
  if (result.length==1) {
    return result[0];
  }
});
queryMap.get("get my props").set("mysql", queryMap.get("get my props").get("pgsql"));

queryMap.set("delete me", new Map());
queryMap.get("delete me").set("mongodb", async (tableName, thisId) =>{
  return await (await dbRequest("get db link")).model(tableName).findByIdAndDelete(thisId);
});
queryMap.get("delete me").set("pgsql", async (tableName, thisId) =>{
  const sql=`DELETE FROM  ${tableName}
  WHERE id = ${thisId}`; //' LIMIT 1'; not valid in pgsql
  return await dbUpdateQuery(sql);
});
queryMap.get("delete me").set("mysql", queryMap.get("delete me").get("pgsql"));

queryMap.set("update me", new Map());
queryMap.get("update me").set("mongodb", async (tableName, thisId,  proparray) =>{
  return await (await dbRequest("get db link")).model(tableName).findByIdAndUpdate(thisId, proparray);
});
queryMap.get("update me").set("pgsql", async (tableName, thisId,  proparray) =>{
    const cleansentence=[];
    for (const key in proparray) {
      cleansentence.push(`${dbEscape(key)} = ${dbEscape(proparray[key], true)}`);
    }
    const sql = `UPDATE ${tableName}
    SET ${cleansentence.join(",")}
    WHERE id= ${dbEscape(thisId, true)}`;
    return await dbUpdateQuery(sql);
});
queryMap.get("update me").set("mysql", queryMap.get("update me").get("pgsql"));

// <-- End db query Functions