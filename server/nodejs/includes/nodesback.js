//
import {Node as NodeBase, NodeFemale as NodeFemaleBase, NodeMale as NodeMaleBase} from './../../../shared/modules/nodes.js';
import {dbQuery, dbGetDbLink, dbGetTables, dbEscape} from './dbgateway.js';

import tableList from './tablelist.js';
/* ver si hace falta
import {createRequire} from "module";
const require = createRequire(import.meta.url);

const config=require('./generalcfg.json');
const dbConfig=require('./dbcfg.json');
*/

export function dataToNode(data) {
  if (data instanceof Node) return data;
  const result = Node.detectGender(data)=="female" ? new NodeFemale() : new NodeMale();
  return result.load(data);
}

const NodeBackMixing=Sup => class extends Sup {
  
  static dbCheckDbLink(){
    if (dbGetDbLink(true)) return true;
  }
  
}

const Node = NodeBackMixing(NodeBase);

const NodeFemaleBackMixing=Sup => class extends Sup {
  
  loaddesc(source, level, thisProperties, myConstructor) {
    if (!myConstructor) return super.loaddesc(source, level, thisProperties, NodeMale);
    return super.loaddesc(source, level, thisProperties, myConstructor);
  }
  
  loadasc(source, level, thisProperties, myConstructor) {
    if (!myConstructor) return super.loadasc(source, level, thisProperties, NodeMale);
    return super.loadasc(source, level, thisProperties, myConstructor);
  }
  
  cutUp(){
    this.partnerNode=null;
  }
  cutDown(){
    this.children=[];
  }
  queryToChildren(query){ //deprecated
    if (!query) return false;
    query.forEach(ob=>{
      for (let key in ob) {
        if (this.syschildtablekeys.includes(key)) delete ob[key];
      }
      const child=new NodeMale();
      child.loadProperties(ob);
      this.addChild(child);
    });
  }
  //returns an array of nodes from the request result object
  static readQuery(result){
    const out=[];
    for (const row of result) {
      const child=new NodeMale();
      child.loadProperties(row);
      out.push(child);
    }
    return out;
  }
  
  //foreignkey props removal EXPERIMENTAL
  static async removeSysProps(children, parent, type='foreignkey'){
    let sysKeys, sysInfo;
    if (!parent.syschildtablekeysinfo || parent.syschildtablekeysinfo.length==0) {
      const tableKeys=await NodeFemale.dbGetChildTableKeys(parent);
      sysKeys=tableKeys.syschildtablekeys;
      sysInfo=tableKeys.syschildtablekeysinfo;
    }
    else {
      sysKeys=parent.syschildtablekeys;
      sysInfo=parent.syschildtablekeysinfo;
    }
    for (const child of children) {
      for (const propName in child.props) {
        const index=sysKeys.indexOf(propName);
        if (index!=-1 && sysInfo[index].type==type) {
          delete (child.props[propName]);
        }
      }
    }
    return children;
  }
  static async getSysKeyAsync(parentNode, type='foreignkey') {
    if (!parentNode.syschildtablekeysinfo || parentNode.syschildtablekeysinfo.length==0) {
      const pElement=await NodeFemale.dbGetChildTableKeys(parentNode);
      pElement.props=parentNode.props;
      return super.getSysKey(pElement, type);
    }
    return super.getSysKey(parentNode, type);
  }
  
  getMySysKeyAsync(type='foreignkey'){
    //Get foreign keys from the actual relatioship
    return NodeFemale.getSysKeyAsync(this, type);
  }
  
  //Get foreignkeys from the rel and from extraParents related to the same child
  static async getRealForeignKeys(data, extraParents=null){
    const myforeign= await NodeFemale.getSysKeyAsync(data);
    if (!extraParents) return [myforeign];
    if (!Array.isArray(extraParents)) extraParents=[extraParents];
    //We filter the extraParents foreign key cause it could be a generic request (load my tree with a language f.e.)
    const foreigns=[];
    for (const extraParent of extraParents) {
      let fkey= await NodeFemale.getSysKeyAsync(extraParent);
      if (data.syschildtablekeys.includes(fkey)) foreigns.push(fkey);
    }
    foreigns.splice(0, 0, myforeign);
    return foreigns;
  }
  
  getMyRealForeignKeys(extraParents=null){
    return NodeFemale.getRealForeignKeys(this, extraParents);
  }

  static async dbGetChildTableKeys(data){
    const element={};
    element.childtablekeys=[];
    element.childtablekeysinfo=[];
    element.syschildtablekeys=[];
    element.syschildtablekeysinfo=[];
    
    //lets load systablekeys (referenced columns)
    let sql=`SELECT r.REFERENCED_TABLE_NAME as parenttablename, r.COLUMN_NAME as name FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE r WHERE TABLE_SCHEMA= SCHEMA() AND r.TABLE_NAME='${tableList.get(data.props.childtablename)}' AND r.REFERENCED_TABLE_NAME IS NOT NULL`;
    const db= await dbGetDbLink();
    let result= await dbQuery(db, sql);
    for (const keyObj of result) {
      let sysKey={};
      sysKey.type='foreignkey';
      Node.copyProperties(sysKey, keyObj);
      // to constant table names
      sysKey.parenttablename='TABLE_' + sysKey.parenttablename.toUpperCase();
      element.syschildtablekeysinfo.push(sysKey);
      element.syschildtablekeys.push(sysKey.name);
    }
    //Now the childtablekeys and positions skey
    sql=`show columns from ${tableList.get(data.props.childtablename)}`;
    result = await dbQuery(db, sql);
    for (const keyObj of result) {
      if (keyObj.Field.match(/.+_position/)) {
        let sysKey={};
        sysKey.type='sort_order';
        sysKey.name=keyObj.Field;
        const refkey=keyObj.Field.replace(/(.+)_position/, "1");
        for (const keyinfo of element.syschildtablekeysinfo) {
          if (keyinfo.name==refkey) {
            sysKey.parenttablename=keyinfo.parenttablename;
            break;
          }
        }
        element.syschildtablekeysinfo.push(sysKey);
        element.syschildtablekeys.push(keyObj.Field);
        continue;
      }
      if (element.syschildtablekeys.includes(keyObj.Field)) continue;
      element.childtablekeys.push(keyObj.Field);
      let infokeys={};
      Node.copyProperties(infokeys, keyObj);
      element.childtablekeysinfo.push(infokeys);
    }
    return(element);
  }
  
  dbGetMyChildTableKeys(){
    return NodeFemale.dbGetChildTableKeys(this);
  }
  
  async dbLoadMyChildTableKeys(){
    return this.load(await this.dbGetMyChildTableKeys());
  }
  
  static async dbGetRoot(data) {
    const foreignKey= await NodeFemale.getSysKeyAsync(data);
    const sql = `SELECT t.* FROM ${tableList.get(data.props.childtablename)} t WHERE t.${foreignKey} IS NULL LIMIT 1`;
    const db = await dbGetDbLink();
    const rqResult = await dbQuery(db, sql);
    const result=NodeFemale.readQuery(rqResult);
    if (result.length==1) return result[0];
  }
  
  async dbGetMyRoot() {
    const children= await NodeFemale.dbGetRoot(this);
    if (Array.isArray(children) && children.length>0) return children[0];
    return children;
  }
  
  async dbLoadMyRoot() {
    const myRoot=await this.dbGetMyRoot();
    if (myRoot) this.addChild(myRoot);
    return myRoot;
  }
  
  static async dbGetChildren(data, extraParents=null, filterProp=[], limit=[]) {
    const db = await dbGetDbLink();
    const foreigncolumnnames=await NodeFemale.getRealForeignKeys(data, extraParents);
    const positioncolumnname=await NodeFemale.getSysKeyAsync(data, 'sort_order');
    const searcharray = []; // search string array
    for (let key in filterProp) {
      searcharray.push(`${dbEscape(key)} = ${dbEscape(filterProp[key], true)}`);
    }
    let sql = `SELECT * FROM ${tableList.get(data.props.childtablename)}`;
    let countSql;
    if (foreigncolumnnames && foreigncolumnnames.length>0) {
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
      if (limit.length == 2) {
        countSql=sql.replace('*' , 'COUNT(*)');
        sql += ` LIMIT ${dbEscape(limit[0])} , ${dbEscape(limit[1])}`;
      }
    }
    const result = await dbQuery(db, sql);
    const children = NodeFemale.readQuery(result);
    const myReturn={};
    if (countSql) {
      const result = await dbQuery(db, sql)
      myReturn.total = NodeFemale.readQuery(result)[0];
    }
    else {
      myReturn.total=result.length;
    }
    myReturn.data = await NodeFemale.removeSysProps(children, data);
    return myReturn;
  }
  
  dbGetMyChildren(extraParents=null, filterProp=[], limit=[]) {
    return NodeFemale.dbGetChildren(this, extraParents, filterProp, limit);
  }
  
  async dbLoadMyChildren(extraParents=null, filterProp=[], limit=[]) {
    const result = await this.dbGetMyChildren(extraParents, filterProp, limit);
    const children=result.data;
    for (const child of children) {
      this.addChild(child);
    }
    this.props.total=result.total;
    return children;
  }
  static async dbGetAllChildren(data, filterProp=[], limit=[]) {
    const db = await dbGetDbLink();
    const searcharray = []; // search string array
    for (const key in filterProp) {
      searcharray.push(`${dbEscape(key)} = ${dbEscape(filterProp[key], true)}`);
    }
    let sql = 'SELECT * FROM ' + tableList.get(data.props.childtablename);
    if (searcharray.length>0) sql +=' where ' + searcharray.join(' and ');
    let countSql;
    if (limit.length == 2) {
      countSql=sql.replace('*' , 'COUNT(*)');
      sql += ` LIMIT ${dbEscape(limit[0])} , ${dbEscape(limit[1])}`;
    }
    const result = await dbQuery(db, sql);
    const children = NodeFemale.readQuery(result);
    const myReturn={};
    if (countSql) {
      const result= await dbQuery(db, sql);
        myReturn.total = NodeFemale.readQuery(result)[0];
    }
    else myReturn.total=result.length;
    myReturn.data= await NodeFemale.removeSysProps(children, data);
    return myReturn;
  }
  async dbLoadMyTree(extraParents=null, level=null, filterProp=[], limit=[]) {
    if (level===0) return true;
    if (level) level--;
    await this.dbLoadMyChildren(extraParents, filterProp, limit);
    for (const child of this.children) {
      await child.dbLoadMyTree(extraParents, level, filterProp, limit);
    }
    return {data: this.children, total: this.props.total};
  }
  async dbGetMyPartner(childId) {
    const db = await dbGetDbLink();
    const foreignKey = await this.getMySysKeyAsync();
    childId=dbEscape(childId);
    const sql = `SELECT t.* FROM ${tableList.get(this.props.parenttablename)} t inner join ${tableList.get(this.props.childtablename)} c on t.id=c.${foreignKey} WHERE c.id=${childId}`;
    let result = await dbQuery(db, sql);

    //remove syskeys from properties
    result=result.map(data=>{
      for (const key in data) {
        if (this.syschildtablekeys.includes(key)) delete data[key];
      }
      return data;
    });
        
    if (result.length==1) {
      const partnerNode=new NodeMale();
      partnerNode.loadProperties(result[0]);
      return partnerNode;
    }
  }
  
  async dbLoadMyPartner(childId) {
    const myPartner = await this.dbGetMyPartner(childId);
    if (myPartner) myPartner.addRelationship(this);
    return myPartner;
  }
  
  
  async dbLoadMyTreeUp(level=null) {
    if (level===0) return true;
    if (level) level--;
    this.partnerNode=null;
    await this.dbLoadMyPartner(this.getChild().props.id);
    if (this.partnerNode) await this.partnerNode.dbLoadMyTreeUp(level);
    return this.partnerNode;
  }
  
  async dbGetMyTreeUp(level=null) {
    const myPartner=await this.dbLoadMyTreeUp(level);
    if (myPartner) {
      myPartner.relationships=[];
    }
    return myPartner;
  }
  dbGetAllMyChildren(filterProp=[]) {
    return NodeFemale.dbGetAllchildren(this, filterProp);
  }
  //<-- insert queries
  //This and the following two functions are the most important
  async dbInsertMyChild(thisChild, extraParents=null) {
    if (!thisChild) return false;
    //Now we add a value for the props that are null and cannot be null
    if (this.childtablekeysinfo && this.syschildtablekeys) {
      for (const key in this.childtablekeys) {
        let value=this.childtablekeys[key];
        if (this.childtablekeysinfo[key]["Null"]=='NO' && !this.childtablekeysinfo[key]["Default"] && this.childtablekeysinfo[key].Extra!='auto_increment'){
          if (!Object.keys(thisChild.props).includes(value) || thisChild.props[value]===null) {
            if (this.childtablekeysinfo[key].Type.includes('int') || sthis.childtablekeysinfo[key].Type.includes('decimal')) {
              thisChild.props[value]=0;
            }
            else {
              thisChild.props[value]='';
            }
          }
        }
      }
    }
    const db = await dbGetDbLink();
    if (thisChild.props.id) delete thisChild.props['id']; //let mysql give the id
    let sql = 'INSERT INTO ' + tableList.get(this.props.childtablename);
    if (Object.keys(thisChild.props).length==0) {
      sql += ' VALUES ()';
    }
    else {
      const cleanKeys=[];
      const cleanValues=[];
      for (let key in thisChild.props) {
        cleanKeys.push(dbEscape(key));
        cleanValues.push(`${dbEscape(thisChild.props[key], true)}`);
      }
      sql += `(${cleanKeys.join(', ')}) VALUES (${cleanValues.join(', ')})`;
    }
    const result = await dbQuery(db, sql);
    thisChild.props.id = result.insertId;
    if (this.partnerNode && this.partnerNode.props.id) {
      await this.dbInsertMyLink(thisChild, extraParents);
    }
    return thisChild.props.id;
  }
  async dbInsertMyLink(thisChild, extraParents=null) {
    if (!Number.isInteger(thisChild.props.id)) return false;
    const afected= await this.dbSetMyLink(thisChild, extraParents);
    if (afected<=0) return afected;

    const db = await dbGetDbLink();
    //We try to update sort_order at the rest of elements
    const foreigncolumnname=await this.getMySysKeyAsync();
    const positioncolumnname=await this.getMySysKeyAsync('sort_order');
    
    if (!thisChild.props[positioncolumnname]) return;

    const sql = 'UPDATE ' + tableList.get(this.props.childtablename)
    + ' SET ' + positioncolumnname + '=' + positioncolumnname + ' + 1'
    + ' WHERE '
    + foreigncolumnname + '=' + this.partnerNode.props.id
    + ' AND id !=' + thisChild.props.id
    + ' AND ' + positioncolumnname + ' >= ' + thisChild.props[positioncolumnname];
    
    const result = await dbQuery(db, sql);
    return afected;
  }
  //***********
  async dbSetMyLink(thisChild, extraParents=null) {
    if (!Number.isInteger(thisChild.props.id)) return false;
    if (extraParents && !Array.isArray(extraParents)) extraParents=[extraParents];

    const foreigncolumnnames=await this.getMyRealForeignKeys(extraParents);
    const positioncolumnname=await this.getMySysKeyAsync('sort_order');
    
    //we will insert the relationship
    const db = await dbGetDbLink();
    let sql = 'UPDATE ' + tableList.get(this.props.childtablename) + ' SET ';
    const fsentence=[];
    fsentence.push(foreigncolumnnames[0] + "=" + this.partnerNode.props.id);
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
    sql +=' WHERE ' + 'id =' + thisChild.props.id;
    const result = await dbQuery(db, sql);
    return db.affected_rows; //??
  }
  async dbInsertMyTree(level=null, extraParents=null) {
    if (level===0) return true;
    if (level) level--;
    for (const child of this.children) {
      await child.dbInsertMyTree(level, extraParents);
    }
    return this;
  }
  async dbInsertMyTreeTableContent(table, level=null, extraParents=null) {
    if (level===0) return true;
    if (level) level--;
    for (const child of this.children) {
      await child.dbInsertMyTreeTableContent(table, level, extraParents);
    }
  }
  async dbInsertMyChildren(extraParents=null){
    const childrenIds=[];
    for (const child of this.children)  {
      childrenIds.push(await this.dbInsertMyChild(child, extraParents));
    }
    return childrenIds;
  }
  //<-- delete queries
  //To ensure deletion we load first the tree
  async dbDeleteMyTree(load=true){
    if (load) await this.dbLoadMyTree();
    const afected=[];
    for (const child of this.children)  {
      afected.push(child.dbDeleteMyTree(false));
    }
    return afected;
  }
}

const NodeFemale = NodeFemaleBackMixing(NodeFemaleBase);

const NodeMaleBackMixing=Sup => class extends Sup {
  
  loaddesc(source, level, thisProperties, myConstructor) {
    if (!myConstructor) return super.loaddesc(source, level, thisProperties, NodeFemale);
    return  super.loaddesc(source, level, thisProperties, myConstructor);
  }
  
  loadasc(source, level, thisProperties, myConstructor) {
    if (!myConstructor) return super.loadasc(source, level, thisProperties, NodeFemale);
    return super.loadasc(source, level, thisProperties, myConstructor);
  }
  
  cutUp(){
    this.parentNode=null;
  }
  cutDown(){
    this.relationships=[];
  }
  
  //<-- Database queries
  //<-- Load queries
  //It requires parentNode.props.childtablename
  
  static async dbGetRelationships(data){
    const db=await dbGetDbLink()
    let sql = 'SELECT r.TABLE_NAME as childtablename, r.REFERENCED_TABLE_NAME as parenttablename, r.TABLE_NAME as name FROM '
      + 'INFORMATION_SCHEMA.KEY_COLUMN_USAGE' + ' r'
      + " WHERE"
      + ' TABLE_SCHEMA= SCHEMA()'  
      + ' AND r.REFERENCED_TABLE_NAME=\'' + tableList.get(data.parentNode.props.childtablename) + '\'';
    const result = await dbQuery(db, sql);
    const relationships=[];
    for (const data of result) {
      const myRel=new NodeFemale();
      myRel.loadProperties(data);
      myRel.props.childtablename='TABLE_' + myRel.props.childtablename.toUpperCase();
      myRel.props.parenttablename='TABLE_' + myRel.props.parenttablename.toUpperCase();
      relationships.push(myRel);
      await myRel.dbLoadMyChildTableKeys();
    }
    //Rorder rels
    for (const key in relationships) {
      let rel=relationships[key];
      if (key==0 && rel.props.childtablename==rel.props.parenttablename) break;
      if (rel.props.childtablename==rel.props.parenttablename) {
        const relStep=relationships[0];
        relationships[0]=rel;
        relationships[key]=relStep;
        break;
      }
    }
    return relationships;
  }
  
  dbGetMyRelationsihps() {
    return NodeMale.dbGetRelationships(this);
  }
  
  async dbLoadMyRelationships() {
    const relationships=await this.dbGetMyRelationsihps();
    for (const rel of relationships) {
      this.addRelationship(rel);
    }
    return this;
  }
  
  //It requires parentNode.props.childtablename or relationships[0].props.parenttablename
  async dbLoadMyParent() {
    let myTableName;
    if (this.parentNode) {
      myTableName=this.parentNode.props.childtablename;
    }
    else if (this.relationships.length > 0) myTableName=this.relationships[0].props.parenttablename;
    else return false;
    const db=await dbGetDbLink();
    let sql = 'SELECT TABLE_NAME as childtablename, REFERENCED_TABLE_NAME as parenttablename, TABLE_NAME as name FROM '
      + 'INFORMATION_SCHEMA.KEY_COLUMN_USAGE'
      + ` WHERE TABLE_SCHEMA= SCHEMA() AND TABLE_NAME='${tableList.get(myTableName)}' AND REFERENCED_TABLE_NAME IS NOT NULL`;
    const result = await dbQuery(db, sql);
    this.parentNode=result.length > 0 ? [] : null;
    for (let i=0; i<result.length; i++) {
      this.parentNode[i] = new NodeFemale();
      this.parentNode[i].loadProperties(result[i]);
      this.parentNode[i].props.childtablename='TABLE_' + this.parentNode[i].props.childtablename.toUpperCase();
      this.parentNode[i].props.parenttablename='TABLE_' + this.parentNode[i].props.parenttablename.toUpperCase();
      await this.parentNode[i].dbLoadMyChildTableKeys();
      this.parentNode[i].children[0]=this;
    }
    if (Array.isArray(this.parentNode) && this.parentNode.length==1) this.parentNode=this.parentNode[0];
    return this.parentNode;
  }
  
  async dbLoadMyTree(extraParents=null, level=null, filterProp=[], limit=[], myself=false) {
    if (level===0) return true;
    if (level) level--;
    if (myself) this.dbLoadMySelf();
    await this.dbLoadMyRelationships();
    for (const rel of this.relationships)  {
      await rel.dbLoadMyTree(extraParents, level, filterProp, limit);
    }
    return this.relationships;
  }
  
  async dbGetMyTree(extraParents=null, level=null, filterProp=[], limit=[], myself=false) {
    await this.dbLoadMyTree(extraParents, level, filterProp, limit, myself);
    if (myself) return this;
    for (const rel of this.relationships)  {
      rel.partnerNode=null;
    }
    return this.relationships;
  }
  
  async dbLoadMyTreeUp(level=null) {
    if (level===0) return true;
    if (level) level--;
    await this.dbLoadMyParent();
    if (Array.isArray(this.parentNode)) {
      for (pNode of this.parentNode) {
        await pNode.dbLoadMyTreeUp(level);
      }
    }
    else if (this.parentNode) await this.parentNode.dbLoadMyTreeUp(level);
    return this.parentNode;
  }
  
  async dbGetMyTreeUp(level=null) {
    const parentNode=await this.dbLoadMyTreeUp(level);
    if (Array.isArray(parentNode)) {
      for (pNode in parentNode) {
        pNode.children=[];
      }
    }
    else if (parentNode) parentNode.children=[];
    return parentNode;
  }
  
  async dbLoadMySelf(){
    const db = await dbGetDbLink();
    const sql="SELECT * FROM " + tableList.get(this.parentNode.props.childtablename);
    const result= await dbQuery(db, sql);
    if (result.length==1) {
      this.loadProperties(result[0]);
    }
    return result.length;
  }

  //<-- Insert queries
  dbInsertMySelf(extraParents=null){
    return this.parentNode.dbInsertMyChild(this, extraParents);
  }
  
  dbInsertMyLink(extraParents=null){
    return this.parentNode.dbInsertMyLink(this, extraParents);
  }
  //It inserts myself by default
  async dbInsertMyTree(level=null, extraParents=null, myself=null) {
    if (level===0) return true;
    if (level) level--;
    if (myself!==false) {
      await this.dbInsertMySelf(extraParents);
    }
    for (const rel of this.relationships) {
      await rel.dbInsertMyTree(level, extraParents);
    }
    return this;
  }
  async dbInsertMyTreeTableContent(table, level=null, extraParents=null) {
    if (level===0) return true;
    if (level) level--;
    let isTableContent=false;
    for (const syskey of this.parentNode.syschildtablekeysinfo) {
      if (syskey.type=='foreignkey' && syskey.parenttablename==table) {
        isTableContent=true;
        break;
      }
    }
    if (isTableContent && !await this.dbInsertMySelf(extraParents)) return;
    for (const rel of this.relationships) {
      await rel.dbInsertMyTreeTableContent(level, extraParents);
    }
    return this.relationships;
  }
  //<-- Delete queries
  async dbDeleteMyTree(load=true){
    if (load) await this.dbLoadMyTree();
    const afected=await this.dbDeleteMySelf();
    for (const rel of this.relationships) {
      await rel.dbDeleteMyTree(false);
    }
    return afected;
  }
  //Deletes a node. Note: After deleting a node we must remove also the nodes below.
  async dbDeleteMySelf() {
    if (!Number.isInteger(this.props.id)) return false;
    if (this.parentNode.props.childtablename && this.parentNode.partnerNode && this.parentNode.partnerNode.props.id && await this.parentNode.getMySysKeyAsync('sort_order')) {
      await this.dbDeleteMyLink(); //The pourpose of explicity deleting the link is to update the sort order of the brothers
    }
    const db = await dbGetDbLink();
    const sql=`DELETE FROM  ${tableList.get(this.parentNode.props.childtablename)} WHERE id= ${this.props.id} LIMIT 1`;
    const result= await dbQuery(db, sql);
    return result.affectedRows;
  }

  async dbDeleteMyLink() {
    const afected = await this.dbReleaseMyLink();
    if (afected==0) return afected;
    const foreigncolumnname=await this.parentNode.getMySysKeyAsync();
    const positioncolumnname=await this.parentNode.getMySysKeyAsync('sort_order');
    if (!positioncolumnname) return;
    //Now we got to update the sort_order of the borothers
    const db = await dbGetDbLink();
    const sql = `UPDATE ${tableList.get(this.parentNode.props.childtablename)} SET  ${positioncolumnname} = ${this.props[positioncolumnname]}  - 1 WHERE ${foreigncolumnname} = ${this.parentNode.partnerNode.props.id} AND ${positioncolumnname}  > ${this.props[positioncolumnname]}`;
    const result= await dbQuery(db, sql);
    return afected;
  }
  
  //Pure link deletion
  async dbReleaseMyLink(){
    if (!Number.isInteger(this.props.id)) return false;
    const foreigncolumnname=await this.parentNode.getMySysKeyAsync();
    const db = await dbGetDbLink();
    let sql=`UPDATE ${tableList.get(this.parentNode.props.childtablename)} SET ${foreigncolumnname} = NULL WHERE id=${this.props.id}`;
    const result= await dbQuery(db, sql);
    return result.affectedRows;
  }
  //<-- Update queries
  async dbUpdateMyProps(proparray){
    if (!Number.isInteger(this.props.id)) return false;
    const db = await dbGetDbLink();
    //We update the fields
    //We take in acount for sql injections
    const cleansentence=[];
    for (const key in proparray) {
      cleansentence.push(`${dbEscape(key)} = ${dbEscape(proparray[key], true)}`);
    }
    const sql = `UPDATE ${tableList.get(this.parentNode.props.childtablename)} SET ${cleansentence.join(",")} WHERE id= ${this.props.id}`;
    const result= await dbQuery(db, sql);
    return result.affectedRows;
  }
  
  async dbUpdateMySortOrder(newSortOrder){
    if (!Number.isInteger(this.props.id) || !Number.isInteger(newSortOrder)) return false;
    const foreigncolumnname=await this.parentNode.getMySysKeyAsync();
    const positioncolumnname=await this.parentNode.getMySysKeyAsync('sort_order');
    const db = await dbGetDbLink();
    const sql = `UPDATE ${tableList.get(this.parentNode.props.childtablename)} SET ${positioncolumnname} = ${newSortOrder} WHERE id= ${this.props.id}`;
    const result= await dbQuery(db, sql);
    const updated = result.affectedRows;
    if (updated > 0) { //update sibling sort_order
      const sql = `UPDATE ${tableList.get(this.parentNode.props.childtablename)} SET ${positioncolumnname} = ${this.props[positioncolumnname]} WHERE id != ${this.props.id} AND ${foreigncolumnname} = ${this.parentNode.partnerNode.props.id} AND ${positioncolumnname} = ${newSortOrder}`;
      const result= await dbQuery(db, sql);
    }
    return updated;
  }
}

const NodeMale = NodeMaleBackMixing(NodeMaleBase);
  
export {Node, NodeFemale, NodeMale}