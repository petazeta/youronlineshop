//
import NodeBase from './../../shared/modules/nodebasic.js';
import {NodeMixing, NodeMaleMixing, NodeFemaleMixing} from './../../shared/modules/nodesmixing.js';
import * as db from './dbgateway.js';

import getTableList from './tablelist.js';

const tableList=await getTableList();

export function dataToNode(data) {
  if (data instanceof Node) return data;
  const result = Node.detectGender(data)=="female" ? new NodeFemale() : new NodeMale();
  return result.load(data);
}

const NodeBackMixing=Sup => class extends Sup {
}
const Node = NodeBackMixing(NodeMixing(NodeBase));

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
        if ( this.syschildtablekeys.includes(key) &&
        this.syschildtablekeysinfo[this.syschildtablekeys.indexOf(key)].type=="foreignkey" ) {
          delete ob[key];
        }
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
  
  static async getChildKeyAsync(parentNode, type) {
    if (!parentNode.childtablekeysinfo || parentNode.childtablekeysinfo.length==0) {
      const pElement=await NodeFemale.dbGetChildTableKeys(parentNode);
      pElement.props=parentNode.props;
      return super.getChildKey(pElement, type);
    }
    return super.getChildKey(parentNode, type);
  }
  
  getMyChildKeyAsync(type){
    //Get foreign keys from the actual relatioship
    return NodeFemale.getChildKeyAsync(this, type);
  }
  
  //Get foreignkeys from the rel and from extraParents related to the same child
  static async getRealForeignKeys(data, extraParents=null){
    const foreigns=[];
    const myforeign= await NodeFemale.getSysKeyAsync(data);
    if (myforeign) foreigns.push(myforeign);
    if (!extraParents) return foreigns;
    if (!Array.isArray(extraParents)) extraParents=[extraParents];
    //We filter the extraParents foreign key cause it could be a generic request (load my tree with a language f.e.)
    //**********¿?¿?
    for (const extraParent of extraParents) {
      let fkey= await NodeFemale.getSysKeyAsync(extraParent);
      if (data.syschildtablekeys.includes(fkey)) foreigns.push(fkey);
    }
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
    let result = await db.dbGetForeignKeys(tableList.get(data.props.childtablename));
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
    result = await db.dbGetKeys(tableList.get(data.props.childtablename));
    for (const keyObj of result) {
      let match=keyObj.Field.match(/(.+)_position/);
      if (match) {
        let sysKey={};
        sysKey.type='sort_order';
        sysKey.name=keyObj.Field;
        const refkey=match[1];
        sysKey.parenttablename=data.props.childtablename; // own table position by default
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
      if (keyObj.Field=="id") {
        let sysKey={};
        sysKey.type='primary';
        sysKey.name=keyObj.Field;
        element.syschildtablekeysinfo.push(sysKey);
        element.syschildtablekeys.push(keyObj.Field);
      }
      //****** quiza mejor que comparar con id literal que se buscara primary en syschildtablekeytypes
      if (element.syschildtablekeys.includes(keyObj.Field) && keyObj.Field!="id") continue;
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
    const primaryKey= await NodeFemale.getSysKeyAsync(data, 'primary');
    let orderBy='';
    if (primaryKey) orderBy=`ORDER BY ${primaryKey} `;
    const sql =`SELECT * FROM ${tableList.get(data.props.childtablename)}
    WHERE ${foreignKey} IS NULL ${orderBy}LIMIT 1`;
    const rqResult=await db.dbSelectQuery(sql);
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
    const foreigncolumnnames=await NodeFemale.getRealForeignKeys(data, extraParents);
    const positioncolumnname=await NodeFemale.getSysKeyAsync(data, 'sort_order');
    const searcharray = []; // search string array
    for (let key in filterProp) {
      if (filterProp[key]===null) {
        searcharray.push(`${db.dbEscape(key)} IS NULL`);
        continue;
      }
      searcharray.push(`${db.dbEscape(key)} = ${db.dbEscape(filterProp[key], true)}`);
    }
    let sql = `SELECT * FROM ${tableList.get(data.props.childtablename)}`;
    let countSql;
    if (foreigncolumnnames && foreigncolumnnames.length>0) {
      sql += ' WHERE ';
      const fsentence=[];
      fsentence.push(db.dbEscape(foreigncolumnnames[0]) + '=' + db.dbEscape(data.partnerNode.props.id));
      for (let i=1; i<foreigncolumnnames.length; i++) {
        fsentence.push(db.dbEscape(foreigncolumnnames[i]) + '=' + db.dbEscape(extraParents[i-1].partnerNode.props.id));
      }
      sql +=fsentence.concat(searcharray).join(' AND ');
      if (positioncolumnname) {
        sql += ` ORDER BY ${positioncolumnname}`;
      }
      if (limit.length == 2) {
        countSql=sql.replace(` ORDER BY ${positioncolumnname}` , '').replace('*' , 'COUNT(*) AS total');
        if (limit[0]==0) sql += ` LIMIT ${db.dbEscape(limit[1])}`;
        else sql += ` LIMIT ${limit[1] - limit[0]} OFFSET ${db.dbEscape(limit[0])}`;
      }
    }
    const result = await db.dbSelectQuery(sql);
    const children = NodeFemale.readQuery(result);
    const myReturn={};
    if (countSql) {
      const result = await db.dbSelectQuery(countSql);
      myReturn.total = result[0]['total'];
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
    const searcharray = []; // search string array
    for (const key in filterProp) {
      if (filterProp[key]===null) {
        searcharray.push(`${db.dbEscape(key)} IS NULL`);
        continue;
      }
      searcharray.push(`${db.dbEscape(key)} = ${db.dbEscape(filterProp[key], true)}`);
    }
    let sql = 'SELECT * FROM ' + tableList.get(data.props.childtablename);
    if (searcharray.length>0) sql +=' where ' + searcharray.join(' and ');
    let countSql;
    if (limit.length == 2) {
      countSql=sql.replace('*' , 'COUNT(*)');
      if (limit[0]==0) sql += ` LIMIT ${db.dbEscape(limit[1])}`;
      else sql += ` LIMIT ${limit[1] - limit[0]} OFFSET ${db.dbEscape(limit[0])}`;
    }
    const result = await db.dbSelectQuery(sql);
    const children = NodeFemale.readQuery(result);
    const myReturn={};
    if (countSql) {
      const result= await db.dbSelectQuery(countSql);
        myReturn.total = NodeFemale.readQuery(result)[0];
    }
    else myReturn.total=result.length;
    myReturn.data= await NodeFemale.removeSysProps(children, data);
    return myReturn;
  }
  
  async dbLoadAllMyChildren( filterProp=[], limit=[]){
    const result = await this.dbGetAllMyChildren(filterProp, limit);
    const children=result.data;
    for (const child of children) {
      this.addChild(child);
    }
    this.props.total=result.total;
    return children;
  }
  
  async dbLoadMyTree(extraParents=null, level=null, filterProp=[], limit=[]) {
    if (level===0) return true;
    if (level) level--;
    if (this.partnerNode) await this.dbLoadMyChildren(extraParents, filterProp, limit);
    else await this.dbLoadAllMyChildren(filterProp, limit);
    for (const child of this.children) {
      await child.dbLoadMyTree(extraParents, level);
    }
    return {data: this.children, total: this.props.total};
  }
  
  async dbGetMyTree(extraParents=null, level=null, filterProp=[], limit=[]) {
    const result = await this.dbLoadMyTree(extraParents, level, filterProp, limit);
    for (const child of this.children)  {
      child.parentNode=null;
    }
    return result;
  }
  
  async dbGetMyPartner(childId) {
    const foreignKey = await this.getMySysKeyAsync();
    childId=db.dbEscape(childId);
    const sql = `SELECT t.* FROM ${tableList.get(this.props.parenttablename)} t
    inner join ${tableList.get(this.props.childtablename)} c on t.id=c.${foreignKey}
    WHERE c.id=${childId}`;
    let result = await db.dbSelectQuery(sql);

    //remove syskeys from properties
    result=result.map(data=>{
      for (const key in data) {
        if ( this.syschildtablekeys.includes(key) &&
        this.syschildtablekeysinfo[this.syschildtablekeys.indexOf(key)].type=="foreignkey" ) {
          delete data[key];
        }
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
  dbGetAllMyChildren(filterProp=[], limit=[]) {
    return NodeFemale.dbGetAllChildren(this, filterProp, limit);
  }
  //<-- insert queries
  // This and the following two functions are the most important
  // update siblings order is the argument that indicates when we are inserting a new node (not just adding a existing one) so we need to modify positions for siblings
  async dbInsertMyChild(thisChild, extraParents=null, updateSiblingsOrder=false) {
    if (!thisChild) return false;
    if (extraParents && !Array.isArray(extraParents)) extraParents=[extraParents];
    const myProps={...thisChild.props}; //copy properties to not modify original element
    //add link relationships column properties
    const foreigncolumnnames=await this.getMyRealForeignKeys(extraParents);
    const positioncolumnname=await this.getMySysKeyAsync('sort_order');
    let myforeigncolumnname;
    if (foreigncolumnnames.length > 0 && this.partnerNode && this.partnerNode.props.id) {
      myforeigncolumnname=foreigncolumnnames[0];
      myProps[myforeigncolumnname]=this.partnerNode.props.id;
    }
    if (positioncolumnname && !myProps[positioncolumnname]) {
      // Insert to last position order by default
      let sql = `SELECT MAX(${positioncolumnname}) as ${positioncolumnname} FROM ${tableList.get(this.props.childtablename)}`;
      if (myforeigncolumnname) sql += ` WHERE ${myforeigncolumnname} = ${this.partnerNode.props.id}`;
      const result = await db.dbSelectQuery(sql);
      if (!result[0][positioncolumnname]) myProps[positioncolumnname]=1;
      else myProps[positioncolumnname]=result[0][positioncolumnname] + 1;
    }
    if (extraParents) {
      for (let i=1; i<foreigncolumnnames.length; i++) {
        myProps[foreigncolumnnames[i]]=extraParents[i-1].partnerNode.props.id;
      }
    }
    let updateSiblingsSql;
    if (updateSiblingsOrder) {
      //We have to update sort_order of the siblings 
      if (positioncolumnname && myProps[positioncolumnname]) {
        updateSiblingsSql = `UPDATE ${tableList.get(this.props.childtablename)}
        SET ${positioncolumnname} = ${positioncolumnname} + 1
        WHERE ${positioncolumnname} >=  ${myProps[positioncolumnname]}`;
        if (myforeigncolumnname) updateSiblingsSql += ` AND ${myforeigncolumnname} = ${this.partnerNode.props.id}`;
      }
    }
    //Now we add a value for the props that are null and cannot be null
    if (this.childtablekeysinfo && this.syschildtablekeys) {
      for (const key in this.childtablekeys) {
        let value=this.childtablekeys[key];
        if (this.childtablekeysinfo[key]["Null"]=='NO' && !this.childtablekeysinfo[key]["Default"] && this.childtablekeysinfo[key].Extra!='auto_increment'){
          if (!Object.keys(myProps).includes(value) || myProps[value]===null) {
            if (this.childtablekeysinfo[key].Type.includes('int') || this.childtablekeysinfo[key].Type.includes('decimal')) {
              myProps[value]=0;
            }
            else {
              myProps[value]='';
            }
          }
        }
      }
    }
    if (myProps.id) delete myProps['id']; //let mysql give the id
    if (Object.keys(myProps).length==0) {
      thisChild.props.id = await db.dbInsertVoid(tableList.get(this.props.childtablename));
    }
    else {
      const cleanKeys=[];
      const cleanValues=[];
      for (let key in myProps) {
        cleanKeys.push(db.dbEscape(key));
        cleanValues.push(db.dbEscape(myProps[key], true));
      }
      const sql = `INSERT INTO ${tableList.get(this.props.childtablename)}
      (${cleanKeys.join(', ')}) VALUES (${cleanValues.join(', ')})`;
      thisChild.props.id = await db.dbInsertQuery(sql);
    }
    if (updateSiblingsSql) {
      updateSiblingsSql += ` AND id != ${thisChild.props.id}`;
      await db.dbUpdateQuery(updateSiblingsSql);
    }
    return thisChild.props.id;
  }
  //--> it seems this is not needed anymore
  async dbInsertMyLink(thisChild, extraParents=null) {
    if (!Number.isInteger(thisChild.props.id)) return false;
    const afected= await this.dbSetMyLink(thisChild, extraParents);
    if (afected<=0) return afected;

    //We try to update sort_order at the rest of elements
    const foreigncolumnname=await this.getMySysKeyAsync();
    const positioncolumnname=await this.getMySysKeyAsync('sort_order');
    
    if (!thisChild.props[positioncolumnname]) return afected;

    const sql = `UPDATE ${tableList.get(this.props.childtablename)}
    SET ${positioncolumnname} = ${positioncolumnname} + 1
    WHERE ${foreigncolumnname} = ${this.partnerNode.props.id}
    AND id != ${thisChild.props.id}
    AND ${positioncolumnname} >=  ${thisChild.props[positioncolumnname]}`;
    return await db.dbUpdateQuery(sql);
  }
  async dbSetMyLink(thisChild, extraParents=null) {
    if (!Number.isInteger(thisChild.props.id)) return false;
    if (extraParents && !Array.isArray(extraParents)) extraParents=[extraParents];

    const foreigncolumnnames=await this.getMyRealForeignKeys(extraParents);
    const positioncolumnname=await this.getMySysKeyAsync('sort_order');
    
    //we will insert the relationship
    let sql = `UPDATE ${tableList.get(this.props.childtablename)} SET `;
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
    sql +=' WHERE id =' + thisChild.props.id;
    return await db.dbUpdateQuery(sql);
  }
  //<-- it seems this is not needed anymore
  async dbInsertMyTree(level=null, extraParents=null) {
    if (level===0) return true;
    if (level) level--;
    for (const child of this.children) {
      await child.dbInsertMyTree(level, extraParents);
    }
    return this.cloneNode(0, null, 'id', null, 'id');
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
  // We consider we are deleting just one so we are updating siblings order to fit the new brothers number
  async dbDeleteMyLink(child) {
    const afected = await this.dbReleaseMyLink(child);
    if (afected==0) return afected;
    const foreigncolumnname=await this.getMySysKeyAsync();
    const positioncolumnname=await this.getMySysKeyAsync('sort_order');
    if (!positioncolumnname) return afected;
    //Now we got to update the sort_order of the borothers
    if (foreigncolumnname) await db.dbDeleteUpdateSiblingsOrder(tableList.get(this.props.childtablename), positioncolumnname, child.props.id, foreigncolumnname, this.partnerNode.props.id);
    else await db.dbDeleteUpdateSiblingsOrder(tableList.get(this.props.childtablename), positioncolumnname, child.props.id);
    /*
    const childPositionSql= `SELECT ${positioncolumnname} FROM ${tableList.get(this.props.childtablename)} WHERE id=${child.props.id}`;
    const sql = `UPDATE ${tableList.get(this.props.childtablename)}
    SET ${positioncolumnname} = ${positioncolumnname} - 1
    WHERE ${foreigncolumnname} = ${this.partnerNode.props.id}
    AND ${positioncolumnname}  > (${childPositionSql})`;
    console.log(sql);
    await db.dbUpdateQuery(sql);
    */
    return afected;
  }
  
  //Pure link deletion
  async dbReleaseMyLink(child){
    if (!Number.isInteger(child.props.id)) return false;
    const foreigncolumnname=await this.getMySysKeyAsync();
    if (!foreigncolumnname) throw new Error('Imposible to delete link');
    let sql=`UPDATE ${tableList.get(this.props.childtablename)}
    SET ${foreigncolumnname} = NULL
    WHERE id=${child.props.id}`;
    return await db.dbUpdateQuery(sql);
  }
}

const NodeFemale = NodeFemaleBackMixing(NodeFemaleMixing(Node));

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
    const result = await db.dbGetTablesHasForeigns(tableList.get(data.parentNode.props.childtablename));
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
    const result = await db.dbGetForeignTables(tableList.get(myTableName));
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
    if (!this.parentNode) return this.parentNode;
    if (Array.isArray(this.parentNode)) {
      for (const pNode of this.parentNode) {
        await pNode.dbLoadMyTreeUp(level);
      }
      return this.parentNode;
    }
    await this.parentNode.dbLoadMyTreeUp(level);
    return this.parentNode;
  }
  
  async dbGetMyTreeUp(level=null) {
    const parentNode=await this.dbLoadMyTreeUp(level);
    if (!parentNode) return parentNode;
    if (Array.isArray(parentNode)) {
      for (const pNode of parentNode) {
        pNode.children=[];
      }
      return parentNode;
    }
    parentNode.children=[];
    return parentNode;
  }
  
  async dbLoadMySelf(){
    const sql=`SELECT * FROM ${tableList.get(this.parentNode.props.childtablename)}
    WHERE id=${db.dbEscape(this.props.id)}`;
    const result= await db.dbSelectQuery(sql);
    if (result.length==1) {
      this.loadProperties(result[0]);
    }
    return result.length;
  }

  //<-- Insert queries
  dbInsertMySelf(extraParents=null, updateSiblingsOrder=false){
    return this.parentNode.dbInsertMyChild(this, extraParents, updateSiblingsOrder);
  }
  
  dbInsertMyLink(extraParents=null){
    return this.parentNode.dbInsertMyLink(this, extraParents);
  }
  //It inserts myself by default
  async dbInsertMyTree(level=null, extraParents=null, myself=null, updateSiblingsOrder=false) {
    if (level===0) return true;
    if (level) level--;
    if (myself!==false) {
      const newId=await this.dbInsertMySelf(extraParents, updateSiblingsOrder);
    }
    for (const rel of this.relationships) {
      await rel.dbInsertMyTree(level, extraParents);
    }
    return this.cloneNode(0, null, 'id', null, 'id');
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
  //This function is not really needed because usually database system deletes in cascade. It is better to use deleteMySelf
  async dbDeleteMyTree(load=true){
    if (load) await this.dbLoadMyTree();
    const afected=await this.dbDeleteMySelf();
    for (const rel of this.relationships) {
      await rel.dbDeleteMyTree(false);
    }
    return afected;
  }
  // Deletes a node. Usually deleting it means also removing the nodes below.
  // We consider we are deleting just one so we are updating siblings order to fit the new brothers number
  async dbDeleteMySelf() {
    if (!Number.isInteger(this.props.id)) return false;
    const foreigncolumnname=await this.parentNode.getMySysKeyAsync();
    const positioncolumnname=await this.parentNode.getMySysKeyAsync('sort_order');
    if (foreigncolumnname && this.parentNode.partnerNode && this.parentNode.partnerNode.props.id) {
      await this.parentNode.dbReleaseMyLink(this);
      //Now we got to update the sort_order of the brothers
      if (positioncolumnname) await db.dbDeleteUpdateSiblingsOrder(tableList.get(this.parentNode.props.childtablename), positioncolumnname, this.props.id, foreigncolumnname, this.parentNode.partnerNode.props.id);
    }
    else if (positioncolumnname) await db.dbDeleteUpdateSiblingsOrder(tableList.get(this.parentNode.props.childtablename), positioncolumnname, this.props.id);
    const sql=`DELETE FROM  ${tableList.get(this.parentNode.props.childtablename)}
    WHERE id = ${this.props.id}`; //' LIMIT 1'; not valid in pgsql
    return await db.dbUpdateQuery(sql);
  }

  dbDeleteMyLink() {
    return this.parentNode.dbDeleteMyLink(this);
  }
  
  //Pure link deletion
  dbReleaseMyLink(){
    return this.parentNode.dbReleaseMyLink(this);
  }
  //<-- Update queries
  async dbUpdateMyProps(proparray){
    if (!Number.isInteger(this.props.id)) return false;
    //We update the fields
    //We take in acount for sql injections
    const cleansentence=[];
    for (const key in proparray) {
      cleansentence.push(`${db.dbEscape(key)} = ${db.dbEscape(proparray[key], true)}`);
    }
    const sql = `UPDATE ${tableList.get(this.parentNode.props.childtablename)}
    SET ${cleansentence.join(",")}
    WHERE id= ${this.props.id}`;
    return await db.dbUpdateQuery(sql);
  }
  
  async dbUpdateMySortOrder(newSortOrder){
    if (!Number.isInteger(this.props.id) || !Number.isInteger(newSortOrder)) return false;
    const positioncolumnname=await this.parentNode.getMySysKeyAsync('sort_order');
    const sql = `UPDATE ${tableList.get(this.parentNode.props.childtablename)}
    SET ${positioncolumnname} = ${newSortOrder}
    WHERE id= ${db.dbEscape(this.props.id)}`;
    const updated = await db.dbUpdateQuery(sql);
    if (!updated) return updated;
    const foreigncolumnname=await this.parentNode.getMySysKeyAsync();
    if (foreigncolumnname) { //update sibling sort_order
      await db.dbUpdateSiblingSortOrder(tableList.get(this.parentNode.props.childtablename), positioncolumnname, this.props.id, newSortOrder, foreigncolumnname, this.parentNode.partnerNode.props.id);
    }
    else await db.dbUpdateSiblingSortOrder(tableList.get(this.parentNode.props.childtablename), positioncolumnname, this.props.id, newSortOrder);
    return updated;
  }
}

const NodeMale = NodeMaleBackMixing(NodeMaleMixing(Node));
  
export {Node, NodeFemale, NodeMale}