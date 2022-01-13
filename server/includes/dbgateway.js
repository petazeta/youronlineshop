import config from './../cfg/main.js';
import dbConfig from './../cfg/dbmain.js';

let dbLink;

function dbQuery(sql) {
  return dbGetDbLink()
  .then(db=>new Promise((resolve, reject) => {
    if (dbConfig.dbsys=="mysql") {
      db.query(sql, (err, result) => {
        if (err) {
          reject(err.sqlMessage);
          return;
        }
        resolve(result);
      });
    }
    else if (dbConfig.dbsys=="pgsql") {
      db.query(sql, null, (err, result) => {
        if (err) {
          reject(err.stack);
          return;
        }
        resolve(result);
      });
    }
  }));
}

export function dbEscape(str, singleQuotes=false) {
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

export function dbGetDbLink(getNew, myCfg) {
  return new Promise((resolve, reject) => {
    if (!myCfg) myCfg=dbConfig;
    if (!dbLink || getNew) {
      if (dbConfig.dbsys=="mysql") {
        import('mysql')
        .then(({default: mysql})=>{
          dbLink = mysql.createConnection(myCfg);
          dbLink.connect(err => {
            if (err) {
              reject(err.sqlMessage);
            }
            else resolve(dbLink);
          });
        });
      }
      else if (dbConfig.dbsys=="pgsql") {
        import('pg')
        .then(({default: pgsql})=>{
          dbLink = new pgsql.Client(myCfg);
          dbLink.connect(err => {
            if (err) {
              console.log("pgerror: ", err);
              reject(err.stack);
            }
            else resolve(dbLink);
          });
        });
      }
    }
    else resolve(dbLink);
  });
}

export function dbGetTables()  {
  let sql;
  if (dbConfig.dbsys=="mysql") sql = "SHOW TABLES";
  else if (dbConfig.dbsys=="pgsql") sql = `SELECT tablename FROM pg_catalog.pg_tables
  WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'`;
  return dbSelectQuery(sql)
  .then(result => result.map(elm=>elm[Object.keys(elm)[0]]));
}

export async function dbInitDb(){
  if ((await dbGetTables()).length > 0) {
    return "Database tables already present. Import file manually";
  }
  const fs = await import('fs');
  let sql=fs.readFileSync(dbConfig.importPath + dbConfig.dbsys + 'db.sql', 'utf8');
  if (dbConfig.dbsys=="pgsql") {
    sql += fs.readFileSync(dbConfig.importPath + dbConfig.dbsys + 'db.sql.sync', 'utf8');
  }
  await dbGetDbLink(true, {multipleStatements: true, ...dbConfig});
  await dbQuery(sql);
  //We must load the tables names for refreshing its value
  const {getTableList} = await import ('./tablelist.js');
  await getTableList();
  
  return true;
}

export async function dbSelectQuery(sql){
  if (dbConfig.dbsys=="mysql") return await dbQuery(sql);
  else if (dbConfig.dbsys=="pgsql") return (await dbQuery(sql)).rows;
}

export async function dbUpdateQuery(sql){
  if (dbConfig.dbsys=="mysql") return (await dbQuery(sql)).affectedRows;
  else if (dbConfig.dbsys=="pgsql") {
    return (await dbQuery(sql)).rowCount;
  }
}

export async function dbInsertQuery(sql){
  if (dbConfig.dbsys=="mysql") return (await dbQuery(sql)).insertId;
  else if (dbConfig.dbsys=="pgsql") {
    sql += ' RETURNING id';
    return (await dbQuery(sql)).rows[0]['id'];
  }
}

export function dbGetForeignKeys(tableName){
  let sql;
  if (dbConfig.dbsys=="mysql") sql =`SELECT r.REFERENCED_TABLE_NAME as parenttablename, r.COLUMN_NAME as name
  FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE r
  WHERE TABLE_SCHEMA= SCHEMA() AND r.REFERENCED_TABLE_NAME IS NOT NULL
  AND r.TABLE_NAME='${tableName}'`;
  else if (dbConfig.dbsys=="pgsql") sql = `SELECT ccu.table_name AS parenttablename, kcu.column_name AS name
  FROM information_schema.table_constraints AS tc JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
  WHERE constraint_type = 'FOREIGN KEY' AND tc.table_name = '${tableName}'`;
  return dbSelectQuery(sql);
}

export function dbGetTablesHasForeigns(tableName){
  let sql;
  if (dbConfig.dbsys=="mysql") {
    sql = `SELECT r.TABLE_NAME as childtablename, r.REFERENCED_TABLE_NAME as parenttablename, r.TABLE_NAME as name FROM
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE r
    WHERE TABLE_SCHEMA= SCHEMA()
    AND r.REFERENCED_TABLE_NAME= '${tableName}'`;
  }
  else if (dbConfig.dbsys=="pgsql") {
    sql=`SELECT ccu.table_name AS parenttablename, tc.table_name as childtablename, tc.table_name as name 
    FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu 
      ON tc.constraint_name = kcu.constraint_name 
    JOIN information_schema.constraint_column_usage AS ccu 
      ON ccu.constraint_name = tc.constraint_name 
    WHERE constraint_type = 'FOREIGN KEY'
    AND ccu.table_name =  '${tableName}'`;
  }
  return dbSelectQuery(sql);
}

export function dbGetForeignTables(tableName){
  let sql;
  if (dbConfig.dbsys=="mysql") {    
    sql = `SELECT r.TABLE_NAME as childtablename, r.REFERENCED_TABLE_NAME as parenttablename, r.TABLE_NAME as name FROM
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE r
    WHERE TABLE_SCHEMA= SCHEMA()
    AND REFERENCED_TABLE_NAME IS NOT NULL
    AND r.TABLE_NAME= '${tableName}'`;
  }
  else if (dbConfig.dbsys=="pgsql") {
    sql=`SELECT ccu.table_name AS parenttablename, tc.table_name as childtablename
    FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu 
      ON tc.constraint_name = kcu.constraint_name 
    JOIN information_schema.constraint_column_usage AS ccu 
      ON ccu.constraint_name = tc.constraint_name 
    WHERE constraint_type = 'FOREIGN KEY'
    AND tc.table_name =  '${tableName}'`;
  }
  return dbSelectQuery(sql);
}

export function dbUpdateSiblingSortOrder(tableName, positioncolumnname, thisId, newOrder, foreigncolumnname, foreignId){
  let sql;
  if (dbConfig.dbsys=="mysql") {    
    sql = `UPDATE ${tableName} dt1
    INNER JOIN ${tableName} dt2
    ON dt2.id=${thisId}
    SET dt1.${positioncolumnname} = dt2.${positioncolumnname}
    WHERE dt1.id != ${thisId}
    AND dt1.${positioncolumnname} = ${newOrder}`;
  }
  else if (dbConfig.dbsys=="pgsql") {
    sql = `UPDATE ${tableName} dt1
    SET ${positioncolumnname} = dt2.${positioncolumnname}
    FROM ${tableName} dt2
    WHERE dt2.id=${thisId}
    AND dt1.id != ${thisId}
    AND dt1.${positioncolumnname} = ${newOrder}`;
  }
  if (foreigncolumnname) sql +=`AND dt1.${foreigncolumnname} = ${foreignId}`;
  return dbUpdateQuery(sql);
}

export function dbDeleteUpdateSiblingsOrder(tableName, positioncolumnname, thisId, foreigncolumnname, foreignId){
  let sql;
  if (dbConfig.dbsys=="mysql") {    
    sql = `UPDATE ${tableName} dt1
    INNER JOIN ${tableName} dt2
    ON dt2.id=${thisId}
    SET dt1.${positioncolumnname} = dt1.${positioncolumnname} - 1
    WHERE dt1.${positioncolumnname} > dt2.${positioncolumnname}`;
  }
  else if (dbConfig.dbsys=="pgsql") {
    sql = `UPDATE ${tableName} dt1
    SET ${positioncolumnname} = dt1.${positioncolumnname} - 1
    FROM ${tableName} dt2
    WHERE dt2.id=${thisId}
    AND dt1.${positioncolumnname} > dt2.${positioncolumnname}`;
  }
  if (foreigncolumnname) sql += ` AND dt1.${foreigncolumnname} = ${foreignId}`;
  return dbUpdateQuery(sql);
}

export function dbGetKeys(tableName){
  let sql;
  if (dbConfig.dbsys=="mysql") sql =`show columns from ${tableName}`;
  else if (dbConfig.dbsys=="pgsql") sql = `SELECT column_name as "Field", data_type as "Type", is_nullable as "Null", column_default as "Default", '' as "Extra"
  FROM information_schema.columns
  WHERE table_schema='public' AND table_name = '${tableName}'`;
  return dbSelectQuery(sql);
}

export async function dbGetTablesYaesta(){
}

export function dbInsertVoid(tableName){
  let sql='INSERT INTO ' + tableName;
  if (dbConfig.dbsys=="mysql") sql +=' VALUES()';
  else if (dbConfig.dbsys=="pgsql") sql +=' DEFAULT VALUES';
  return dbInsertQuery(sql);
}
