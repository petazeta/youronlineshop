//
import NodeBase from './../../shared/modules/nodebasic.js';
import {NodeMixing, NodeMaleMixing, NodeFemaleMixing} from './../../shared/modules/nodesmixing.js';
import * as db from './dbgateway.js';

const NodeBackMixing=Sup => class extends Sup {
  static dataToNode(source){
    const myClon= Node.detectGender(source)=="female" ? new NodeFemale() : new NodeMale();
    return myClon.load(source);
  }
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
    if (!result) return [];
    if (!Array.isArray(result)) result=[result];
    return result.map(row=>new NodeMale().loadProperties(row))
  }
  
  //foreignkey props removal EXPERIMENTAL
  static async removeSysProps(children, parent, type='foreignkey', forceLoad=false){
    const totalKeys = await NodeFemale.getAllChildKeysAsync(parent, forceLoad);
    const sysKeys=totalKeys.syschildtablekeys;
    const sysInfo=totalKeys.syschildtablekeysinfo;

    for (const child of children) {
      child.props = Object.fromEntries(Object.entries(child.props).filter(keyValue => {
        const index=sysKeys.indexOf(keyValue[0]);
        if (index==-1 || sysInfo[index].type!=type) {
          return true;
        }
      }));
    }
    return children;
  }
  
  static async getSysKeyAsync(parentNode, type='foreignkey', forceLoad=false) {
    if (forceLoad || !parentNode.syschildtablekeysinfo || parentNode.syschildtablekeysinfo.length==0) {
      const pElement=await NodeFemale.dbGetChildTableKeys(parentNode.props.childtablename);
      pElement.props=parentNode.props;
      return super.getSysKey(pElement, type);
    }
    return super.getSysKey(parentNode, type);
  }
  
  getMySysKeyAsync(type='foreignkey', forceLoad=false){
    //Get foreign keys from the actual relatioship
    return NodeFemale.getSysKeyAsync(this, type, forceLoad);
  }
  
  static async getChildKeysAsync(parentNode, type, forceLoad=false) {
    if (forceLoad || !parentNode.syschildtablekeysinfo || parentNode.syschildtablekeysinfo.length==0) {
      const pElement=await NodeFemale.dbGetChildTableKeys(parentNode.props.childtablename);
      pElement.props=parentNode.props;
      return super.getChildKeys(pElement, type);
    }
    return super.getChildKeys(parentNode, type);
  }
  
  getMyChildKeysAsync(type, forceLoad=false){
    //Get foreign keys from the actual relatioship
    return NodeFemale.getChildKeysAsync(this, type, forceLoad);
  }
  
  static async getAllChildKeysAsync(parentNode, forceLoad=false) {
    if (forceLoad || !parentNode.syschildtablekeysinfo || parentNode.syschildtablekeysinfo.length==0) {
      const pElement=await NodeFemale.dbGetChildTableKeys(parentNode.props.childtablename);
      pElement.props=parentNode.props;
      return pElement;
    }
    return parentNode;
  }
  
  //Get foreignkeys from the rel and from extraParents related to the same child
  static async getRealForeignKeys(data, extraParents=null, forceLoad=false){
    const foreigns=[];
    const myforeign= await NodeFemale.getSysKeyAsync(data, 'foreignkey', forceLoad);
    if (myforeign) foreigns.push(myforeign);
    if (!extraParents) return foreigns;
    if (!Array.isArray(extraParents)) extraParents=[extraParents];
    //We filter the extraParents foreign key cause it could be a generic request (load my tree with a language for example.)
    //**********¿?¿?
    for (const extraParent of extraParents) {
      let fkey= await NodeFemale.getSysKeyAsync(extraParent, 'foreignkey', forceLoad);
      if (data.syschildtablekeys.includes(fkey)) foreigns.push(fkey);
    }
    return foreigns;
  }
  
  getMyRealForeignKeys(extraParents=null, forceLoad=false){
    return NodeFemale.getRealForeignKeys(this, extraParents, forceLoad);
  }

  static async dbGetChildTableKeys(tableName){
    const wrapper={};
    wrapper.childtablekeys=[];
    wrapper.childtablekeysinfo=[];
    wrapper.syschildtablekeys=[];
    wrapper.syschildtablekeysinfo=[];
    
    //lets load systablekeys (referenced columns)
    let result = await db.dbRequest("get foreign keys", [(await db.getTableList()).get(tableName)]);
    for (const keyObj of result) {
      let sysKey={};
      sysKey.type='foreignkey';
      Node.copyProperties(sysKey, keyObj);
      // to constant table names
      sysKey.parenttablename=(await db.getTableRef()).get(sysKey.parenttablename);
      
      wrapper.syschildtablekeysinfo.push(sysKey);
      wrapper.syschildtablekeys.push(sysKey.name);
    }
    
    //Now the childtablekeys and positions skey
    result = await db.dbRequest("get table keys", [(await db.getTableList()).get(tableName)]);
    for (const keyObj of result) {
      if (keyObj.Positioning=="yes") {
        let sysKey={};
        sysKey.type='sort_order';
        sysKey.name=keyObj.Field;
        const refkey=keyObj.ref;
        sysKey.parenttablename=tableName; // own table position by default
        for (const keyinfo of wrapper.syschildtablekeysinfo) {
          if (keyinfo.name==refkey) {
            sysKey.parenttablename=keyinfo.parenttablename;
            break;
          }
        }
        wrapper.syschildtablekeysinfo.push(sysKey);
        wrapper.syschildtablekeys.push(keyObj.Field);
        continue;
      }
      if (keyObj.Primary=="yes") {
        let sysKey={};
        sysKey.type='primary';
        sysKey.name=keyObj.Field;
        wrapper.syschildtablekeysinfo.push(sysKey);
        wrapper.syschildtablekeys.push(keyObj.Field);
        continue;
      }
      if (wrapper.syschildtablekeys.includes(keyObj.Field)) continue;
      wrapper.childtablekeys.push(keyObj.Field);
      let infokeys={};
      Node.copyProperties(infokeys, keyObj);
      wrapper.childtablekeysinfo.push(infokeys);
    }
    return wrapper;
  }
  
  dbGetMyChildTableKeys(){
    return NodeFemale.dbGetChildTableKeys(this.props.childtablename);
  }
  
  async dbLoadMyChildTableKeys(){
    return this.loadChildTableKeys(await this.dbGetMyChildTableKeys());
  }
  
  static async dbGetRoot(data) {
    const foreignKey= await NodeFemale.getSysKeyAsync(data);
    let result = await db.dbRequest("get root", [foreignKey, data]);

    return NodeFemale.readQuery(result)[0] || null;
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
  
  static async dbGetChildren(data, extraParents=null, filterProp={}, limit=[]) {
    const foreigncolumnnames=await NodeFemale.getRealForeignKeys(data, extraParents);
    const positioncolumnname=await NodeFemale.getSysKeyAsync(data, 'sort_order');
    let result = await db.dbRequest("get children", [foreigncolumnnames, positioncolumnname, data, extraParents, filterProp, limit]);
    let children = NodeFemale.readQuery(result.data);
    children = await NodeFemale.removeSysProps(children, data);
    result.data=children;
    return result;
  }
  
  dbGetMyChildren(extraParents=null, filterProp={}, limit=[]) {
    return NodeFemale.dbGetChildren(this, extraParents, filterProp, limit);
  }
  
  async dbLoadMyChildren(extraParents=null, filterProp={}, limit=[]) {
    const result = await this.dbGetMyChildren(extraParents, filterProp, limit);
    const children=result.data;
    for (const child of children) {
      this.addChild(child);
    }
    this.props.total=result.total;
    return children;
  }
  static async dbGetAllChildren(data, filterProp={}, limit=[]) {
    let result = await db.dbRequest("elements from table", [data, filterProp, limit]);
    let children = NodeFemale.readQuery(result.data);
    children = await NodeFemale.removeSysProps(children, data);
    result.data=children;
    return result;
  }
  
  async dbLoadAllMyChildren( filterProp={}, limit=[]){
    const result = await this.dbGetAllMyChildren(filterProp, limit);
    const children=result.data;
    for (const child of children) {
      this.addChild(child);
    }
    this.props.total=result.total;
    return children;
  }
  
  async dbLoadMyTree(extraParents=null, level=null, filterProp={}, limit=[]) {
    if (level===0) return true;
    if (level) level--;
    if (this.partnerNode) await this.dbLoadMyChildren(extraParents, filterProp, limit);
    else await this.dbLoadAllMyChildren(filterProp, limit);
    for (const child of this.children) {
      await child.dbLoadMyTree(extraParents, level);
    }
    return {data: this.children, total: this.props.total};
  }
  
  async dbGetMyTree(extraParents=null, level=null, filterProp={}, limit=[]) {
    const result = await this.dbLoadMyTree(extraParents, level, filterProp, limit);
    for (const child of this.children)  {
      child.parentNode=null;
    }
    return result;
  }

  async dbGetMyPartner(childId) {
    const foreignKey = await this.getMySysKeyAsync();
    const result = await db.dbRequest("get partner", [foreignKey, this, childId]);
    const partnerNode=new NodeMale();
    partnerNode.loadProperties(result);
    NodeFemale.removeSysProps([partnerNode], new NodeFemale(this.props.parenttablename))
    return partnerNode;
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
  dbGetAllMyChildren(filterProp={}, limit=[]) {
    return NodeFemale.dbGetAllChildren(this, filterProp, limit);
  }
  
  //<-- insert queries
  // This and the following two functions are the most important
  // update siblings order is the argument that indicates when we are inserting a new node (not just adding a existing one) so we need to modify positions for siblings
  async dbInsertMyChild(thisChild, extraParents=null, updateSiblingsOrder=false) {
    if (!thisChild) return false;
    if (extraParents && !Array.isArray(extraParents)) extraParents=[extraParents];
    const foreigncolumnnames=await this.getMyRealForeignKeys(extraParents);
    const positioncolumnname=await this.getMySysKeyAsync('sort_order');
    return await db.dbRequest("insert child", [foreigncolumnnames, positioncolumnname, this, thisChild, extraParents, updateSiblingsOrder]);
  }
  
  async dbInsertMyLink(thisChild, extraParents=null) {
    const afected= await this.dbSetMyLink(thisChild, extraParents);
    if (afected<=0) return afected;
    const foreigncolumnnames=await this.getMyRealForeignKeys(extraParents);
    const positioncolumnname=await this.getMySysKeyAsync('sort_order');

    //We try to update sort_order at the rest of elements
    if (!thisChild.props[positioncolumnname]) return afected;
    await db.dbRequest("set siblings order on insert", [(await db.getTableList()).get(this.props.childtablename), positioncolumnname, thisChild.props[positioncolumnname], thisChild.props.id, foreigncolumnnames[0], this.partnerNode.props.id]);
    return afected;
  }
  
  async dbSetMyLink(thisChild, extraParents=null) {
    if (extraParents && !Array.isArray(extraParents)) extraParents=[extraParents];
    const foreigncolumnnames=await this.getMyRealForeignKeys(extraParents);
    const positioncolumnname=await this.getMySysKeyAsync('sort_order');
    return await db.dbRequest("set child link", [foreigncolumnnames, positioncolumnname, this, thisChild, extraParents]);
  }
  
  //<-- it seems this is not needed anymore
  async dbInsertMyTreeOld(level=null, extraParents=null) {
    if (level===0) return true;
    if (level) level--;
    const myResult=new NodeFemale();
    for (const child of this.children) {
      myResult.addChild(await child.dbInsertMyTree(level, extraParents));
    }
    return myResult;
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
    const myResult=new NodeFemale();
    for (const child of this.children) {
      myResult.addChild(await child.dbInsertMyTreeTableContent(table, level, extraParents));
    }
    return myResult;
  }
  
  async dbInsertMyChildren(extraParents=null){
    return this.children.map(async child=>await this.dbInsertMyChild(child, extraParents))
  }
  
  async dbLoadInsertMyChildren(extraParents=null) {
    const child_ids = await this.dbInsertMyChildren(extraParents);
    this.children((child, i)=>child.props.id=child_ids[i]);
    return this.children;
  }
  
  //<-- delete queries
  //To ensure deletion we load first the tree
  async dbDeleteMyTree(load=true){
    if (load) await this.dbLoadMyTree();
    const affected=[];
    for (const child of this.children)  {
      affected.push(child.dbDeleteMyTree(false));
    }
    return affected;
  }
  
  async dbDeleteMyTreeTableContent(table, load=true){
    if (load) await this.dbLoadMyTree();
    const affected=[];
    for (const child of this.children)  {
      affected.push(child.dbDeleteMyTreeTableContent(table, false));
    }
    return affected;
  }
  
  // We consider we are deleting just one so we are updating siblings order to fit the new brothers number
  async dbDeleteMyLink(child) {
    const afected = await this.dbReleaseMyLink(child);
    if (afected==0) return afected;
    const foreigncolumnname=await this.getMySysKeyAsync();
    const positioncolumnname=await this.getMySysKeyAsync('sort_order');
    if (!positioncolumnname) return afected;
    //Now we got to update the sort_order of the borothers
    if (foreigncolumnname) await db.dbRequest("set siblings order on delete", [(await db.getTableList()).get(this.props.childtablename), positioncolumnname, child.props.id, foreigncolumnname, this.partnerNode.props.id]);
    else db.dbRequest("set siblings order on delete", [(await db.getTableList()).get(this.props.childtablename), positioncolumnname, child.props.id]);
    return afected;
  }

  //Pure link deletion
  async dbReleaseMyLink(child){
    if (!child.props.id) return false;
    const foreigncolumnname=await this.getMySysKeyAsync();
    if (!foreigncolumnname) throw new Error('Imposible to delete link');
    const afected = db.dbRequest("delete child link", [(await db.getTableList()).get(this.props.childtablename), foreigncolumnname, child.props.id])
    const positioncolumnname=await this.getMySysKeyAsync('sort_order');
    if (!positioncolumnname) return afected;
    await db.dbRequest("set siblings order on delete", [(await db.getTableList()).get(this.props.childtablename), positioncolumnname, child.props.id, foreigncolumnname, this.partnerNode.props.id]);
    return afected;
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
    const result = await db.dbRequest("get relationships from table", [(await db.getTableList()).get(data.parentNode.props.childtablename)]);
    const relationships=[];
    for (const data of result) {
      const myRel=new NodeFemale();
      myRel.loadProperties(data);
      myRel.props.childtablename = (await db.getTableRef()).get(myRel.props.childtablename);
      myRel.props.parenttablename = (await db.getTableRef()).get(myRel.props.parenttablename);
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
  /* ********** que ocurre con el propio parent, se toman los extra parents pero no el propio parent?????      */
  async dbLoadMyParent() {
    let myTableName;
    if (this.parentNode) {
      myTableName=this.parentNode.props.childtablename;
    }
    else if (this.relationships.length > 0) myTableName=this.relationships[0].props.parenttablename;
    else return false;
    const result = await db.dbRequest("get extra parents from table", [(await db.getTableList()).get(myTableName)]);
    this.parentNode=result.length > 0 ? [] : null;
    for (let i=0; i<result.length; i++) {
      this.parentNode[i] = new NodeFemale();
      this.parentNode[i].loadProperties(result[i]);
      this.parentNode[i].props.childtablename=(await db.getTableRef()).get(this.parentNode[i].props.childtablename);
      this.parentNode[i].props.parenttablename=(await db.getTableRef()).get(this.parentNode[i].props.parenttablename);
      await this.parentNode[i].dbLoadMyChildTableKeys();
      this.parentNode[i].children[0]=this;
    }
    
    if (Array.isArray(this.parentNode) && this.parentNode.length==1) this.parentNode=this.parentNode[0];
    return this.parentNode;
  }
  
  async dbLoadMyTree(extraParents=null, level=null, filterProp={}, limit=[], myself=false) {
    if (level===0) return true;
    if (level) level--;
    if (myself) this.dbLoadMySelf();
    await this.dbLoadMyRelationships();
    for (const rel of this.relationships)  {
      await rel.dbLoadMyTree(extraParents, level, filterProp, limit);
    }
    return this.relationships;
  }
  
  async dbGetMyTree(extraParents=null, level=null, filterProp={}, limit=[], myself=false) {
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
    const result = await db.dbRequest("get my props", [(await db.getTableList()).get(this.parentNode.props.childtablename), this.props.id]);
    if (result) {
      this.loadProperties(result[0]);
    }
    return 1;
  }

  //<-- Insert queries
  dbInsertMySelf(extraParents=null, updateSiblingsOrder=false){
    console.log("insert myself");
    return this.parentNode.dbInsertMyChild(this, extraParents, updateSiblingsOrder);
  }
  
  dbInsertMyLink(extraParents=null){
    return this.parentNode.dbInsertMyLink(this, extraParents);
  }
  
  //It inserts myself by default
  async dbInsertMyTree_old(level=null, extraParents=null, myself=true, updateSiblingsOrder=false) {
    if (level===0) return true;
    if (level) level--;
    let newId=this.props.id;
    if (myself!==false) {
      newId=await this.dbInsertMySelf(extraParents, updateSiblingsOrder);
    }
    const myReturn = new NodeMale().loadProperties({id: newId});
    for (const rel of this.relationships) {
      myReturn.addRelationship(await rel.dbInsertMyTree(level, extraParents));
    }
    return myReturn;
  }
  
  async dbInsertMyTree(level=null, extraParents=null, myself=true, updateSiblingsOrder=false) {
    if (level===0) return true;
    if (level) level--;
    if (myself!==false) {
      this.props.id=await this.dbInsertMySelf(extraParents, updateSiblingsOrder);
    }
    for (const rel of this.relationships) {
      await rel.dbInsertMyTree(level, extraParents);
    }
    return this;
  }
  
  async dbInsertMyTreeTableContent(table, level=null, extraParents=null) {
    if (level===0) return true;
    if (level) level--;
    let newId=this.props.id;
    const isTableContent = this.parentNode && this.parentNode.syschildtablekeysinfo &&
    this.parentNode.syschildtablekeysinfo.some(syskey=>syskey.type=='foreignkey' && syskey.parenttablename==table);
    if (isTableContent) newId = await this.dbInsertMySelf(extraParents);
    const myReturn = new NodeMale().loadProperties({id: newId});
    for (const rel of this.relationships) {
      myReturn.addRelationship(await rel.dbInsertMyTreeTableContent(table, level, extraParents));
    }
    return myReturn;
  }
  
  //<-- Delete queries
  //This function is not really needed because usually database system deletes in cascade. It is better to use deleteMySelf
  async dbDeleteMyTree(load=true){
    if (load) await this.dbLoadMyTree();
    const affected=await this.dbDeleteMySelf();
    for (const rel of this.relationships) {
      await rel.dbDeleteMyTree(false);
    }
    return affected;
  }
  
  async dbDeleteMyTreeTableContent(table, load=true){
    const isTableContent = this.parentNode && this.parentNode.syschildtablekeysinfo &&
    this.parentNode.syschildtablekeysinfo.some(syskey=>syskey.type=='foreignkey' && syskey.parenttablename==table);
    if (load) await this.dbLoadMyTree();
    console.log("isTable", isTableContent);
    let affected=false;
    if (isTableContent) affected = await this.dbDeleteMySelf();
    for (const rel of this.relationships) {
      await rel.dbDeleteMyTreeTableContent(table, false);
    }
    return affected;
  }

  // Deletes a node. Usually deleting it means also removing the nodes below.
  // We consider we are deleting just one so we are updating siblings order to fit the new brothers number
  async dbDeleteMySelf() {
    console.log("delete myself");
    if (!this.props.id) return false;
    const foreigncolumnname=await this.parentNode.getMySysKeyAsync();
    const positioncolumnname=await this.parentNode.getMySysKeyAsync('sort_order');
    if (foreigncolumnname && this.parentNode.partnerNode && this.parentNode.partnerNode.props.id) {
      //await this.parentNode.dbReleaseMyLink(this); //****** para que borrar el link si el link va en el propio elemento?????
      //Now we got to update the sort_order of the brothers
      if (positioncolumnname) await db.dbRequest("set siblings order on delete", [(await db.getTableList()).get(this.parentNode.props.childtablename), positioncolumnname, this.props.id, foreigncolumnname, this.parentNode.partnerNode.props.id]);
    }
    else if (positioncolumnname) await db.dbRequest("set siblings order on delete", [(await db.getTableList()).get(this.parentNode.props.childtablename), positioncolumnname, this.props.id]);
    
    return await db.dbRequest("delete me", [(await db.getTableList()).get(this.parentNode.props.childtablename), this.props.id]);
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
    if (!this.props.id) return false;
    return await db.dbRequest("update me", [(await db.getTableList()).get(this.parentNode.props.childtablename), this.props.id, proparray]);
  }
  /*** me voy por aqui **/
  async dbUpdateMySortOrder(newSortOrder){
    if (!Number.isInteger(this.props.id) || !Number.isInteger(newSortOrder)) return false;
    const positioncolumnname=await this.parentNode.getMySysKeyAsync('sort_order');
    const myProps = await db.dbRequest("get my props", [(await db.getTableList()).get(this.parentNode.props.childtablename), this.props.id]);
    const oldSortOrder=myProps[positioncolumnname];
    const proparray={[positioncolumnname]: newSortOrder};
    const updated = await db.dbRequest("update me", [(await db.getTableList()).get(this.parentNode.props.childtablename), this.props.id, proparray]);
    if (!updated) return updated;
    const foreigncolumnname=await this.parentNode.getMySysKeyAsync();
    if (foreigncolumnname) { //update sibling sort_order
      await db.dbRequest("set siblings order on update", [(await db.getTableList()).get(this.parentNode.props.childtablename), positioncolumnname, this.props.id, newSortOrder, oldSortOrder, foreigncolumnname, this.parentNode.partnerNode.props.id]);
    }
    else await db.dbRequest("set siblings order on update", [(await db.getTableList()).get(this.parentNode.props.childtablename), positioncolumnname, this.props.id, newSortOrder, oldSortOrder]);
    return updated;
  }
}

const NodeMale = NodeMaleBackMixing(NodeMaleMixing(Node));
  
export {Node, NodeFemale, NodeMale}