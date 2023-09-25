import {BasicLinker, BasicNode} from '../shared/linker.mjs';

const linkerModelMixin=Sup => class extends Sup {

  //returns an array of nodes from the request result object
  static readQuery(result){
    if (!result) return [];
    if (!Array.isArray(result)) result=[result];
    return result.map(row=>new this.nodeConstructor(row));
  }
  
  //foreignkey props removal EXPERIMENTAL
  static async removeSysProps(children, parent, type='foreignkey', forceLoad=false){
    const totalKeys = await this.getAllChildKeysAsync(parent, forceLoad);
    const sysKeys=totalKeys.sysChildTableKeys;
    const sysInfo=totalKeys.sysChildTableKeysInfo;

    children.forEach(child=>{
      child.props = Object.fromEntries(Object.entries(child.props).filter(([key]) => {
        const index=sysKeys.indexOf(key)
        if (index==-1 || sysInfo[index].type!=type)
          return true
      }))
    })
    return children;
  }
  
  static getSysKeyAsync(parent, type='foreignkey', forceLoad=false) {
    if (forceLoad || !parent.sysChildTableKeysInfo || parent.sysChildTableKeysInfo.length==0) {
      const pElement=this.dbGetChildTableKeys(parent.props.childTableName)
      pElement.props=parent.props
      return super.getSysKey(pElement, type)
    }
    return super.getSysKey(parent, type)
  }
  
  getMySysKeyAsync(type='foreignkey', forceLoad=false){
    //Get foreign keys from the actual relatioship
    return this.constructor.getSysKeyAsync(this, type, forceLoad);
  }
  
  static async getChildKeysAsync(parent, type, forceLoad=false) {
    if (forceLoad || !parent.sysChildTableKeysInfo || parent.sysChildTableKeysInfo.length==0) {
      const pElement=await this.dbGetChildTableKeys(parent.props.childTableName);
      pElement.props=parent.props;
      return super.getChildKeys(pElement, type);
    }
    return super.getChildKeys(parent, type);
  }
  
  getMyChildKeysAsync(type, forceLoad=false){
    //Get foreign keys from the actual relatioship
    return this.constructor.getChildKeysAsync(this, type, forceLoad);
  }
  
  static async getAllChildKeysAsync(parent, forceLoad=false) {
    if (forceLoad || !parent.sysChildTableKeysInfo || parent.sysChildTableKeysInfo.length==0) {
      const pElement=await this.dbGetChildTableKeys(parent.props.childTableName);
      pElement.props=parent.props;
      return pElement;
    }
    return parent;
  }
  
  //Get foreignkeys from the rel and from extraParents related to the same child
  static getRealForeignKeys(data, extraParents=null, forceLoad=false){
    const foreigns=[];
    const myforeign= this.getSysKeyAsync(data, 'foreignkey', forceLoad);
    if (myforeign) foreigns.push(myforeign);
    if (!extraParents) return foreigns;
    if (!Array.isArray(extraParents)) extraParents=[extraParents];
    //We filter the extraParents foreign key cause it could be a generic request (load my tree with a language for example.)
    //**********¿?¿?
    /*
    for (const extraParent of extraParents) {
      let fkey= this.getSysKeyAsync(extraParent, 'foreignkey', forceLoad);
      if (data.sysChildTableKeys.includes(fkey)) foreigns.push(fkey);
    }
    return foreigns;
    */
    return foreigns.concat(extraParents.map(extraParent=>this.getSysKeyAsync(extraParent, 'foreignkey', forceLoad)).filter(fkey=>data.sysChildTableKeys.includes(fkey)));

  }
  
  getMyRealForeignKeys(extraParents=null, forceLoad=false){
    return this.constructor.getRealForeignKeys(this, extraParents, forceLoad);
  }

  static dbGetChildTableKeys(tableName){
    const wrapper={};
    wrapper.childTableKeys=[];
    wrapper.childTableKeysInfo=[];
    wrapper.sysChildTableKeys=[];
    wrapper.sysChildTableKeysInfo=[];
    
    //lets load systablekeys (referenced columns)
    let result = this.dbGateway.getForeignKeys(this.dbGateway.tableList.get(tableName));
    for (const keyObj of result) {
      let sysKey={};
      sysKey.type='foreignkey';
      Object.assign(sysKey, keyObj);
      // to constant table names
      sysKey.parentTableName=this.dbGateway.tableRef.get(sysKey.parentTableName);
      
      wrapper.sysChildTableKeysInfo.push(sysKey);
      wrapper.sysChildTableKeys.push(sysKey.name);
    }
    
    //Now the childTableKeys and positions skey
    result = this.dbGateway.getTableKeys(this.dbGateway.tableList.get(tableName));
    for (const keyObj of result) {
      if (keyObj.Positioning=="yes") {
        let sysKey={};
        sysKey.type='sort_order';
        sysKey.name=keyObj.Field;
        sysKey.parentTableName=tableName; // own table position by default
        const parentKeyInfo=wrapper.sysChildTableKeysInfo.find(keyinfo=>keyinfo.name=='parent' + keyObj.ref);
        if (parentKeyInfo) sysKey.parentTableName=parentKeyInfo.parentTableName;

        wrapper.sysChildTableKeysInfo.push(sysKey);
        wrapper.sysChildTableKeys.push(keyObj.Field);
        continue;
      }
      if (keyObj.Primary=="yes") {
        let sysKey={};
        sysKey.type='primary';
        sysKey.name=keyObj.Field;
        wrapper.sysChildTableKeysInfo.push(sysKey);
        wrapper.sysChildTableKeys.push(keyObj.Field);
        continue;
      }
      if (wrapper.sysChildTableKeys.includes(keyObj.Field)) continue;
      wrapper.childTableKeys.push(keyObj.Field);
      wrapper.childTableKeysInfo.push({...keyObj});
    }
    return wrapper;
  }
  
  dbGetMyChildTableKeys(){
    return this.constructor.dbGetChildTableKeys(this.props.childTableName);
  }
  
  dbLoadMyChildTableKeys(){
    return this.loadChildTableKeys(this.dbGetMyChildTableKeys());
  }
  
  static async dbGetRoot(dbCollection) {
    const data=new this.linkerConstructor(dbCollection, dbCollection)
    const foreignKey= this.getSysKeyAsync(data)
    const result = await this.dbGateway.getRoot(foreignKey, data)

    return this.readQuery(result)[0] || null
  }
  
  async dbGetMyRoot() {
    return await this.constructor.dbGetRoot(this.props.childTableName)
  }
  
  async dbLoadMyRoot() {
    const myRoot=await this.dbGetMyRoot();
    if (myRoot) this.addChild(myRoot);
    return myRoot;
  }
  
  static async dbGetChildren(data, extraParents=null, filterProp={}, limit=[], count=false) {
    const foreigncolumnnames=await this.getRealForeignKeys(data, extraParents);
    const positioncolumnname=this.getSysKeyAsync(data, 'sort_order');
    let result = await this.dbGateway.getChildren(foreigncolumnnames, positioncolumnname, data, extraParents, filterProp, limit, count);
    let children = this.readQuery(result.data);
    children = await this.removeSysProps(children, data);
    result.data=children;
    return result;
  }
  
  dbGetMyChildren(extraParents=null, filterProp={}, limit=[], count=false) {
    return this.constructor.dbGetChildren(this, extraParents, filterProp, limit, count);
  }
  
  async dbLoadMyChildren(extraParents=null, filterProp={}, limit=[], count=false) {
    const result = await this.dbGetMyChildren(extraParents, filterProp, limit, count);
    const children=result.data;
    for (const child of children) {
      this.addChild(child);
    }
    this.props.total=result.total;
    return children;
  }
  static async dbGetAllChildren(data, filterProp={}, limit=[]) {
    let result = await this.dbGateway.elementsFromTable(data, filterProp, limit);
    let children = this.readQuery(result.data);
    children = await this.removeSysProps(children, data);
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
    if (this.partner) await this.dbLoadMyChildren(extraParents, filterProp, limit)
    else {
      await this.dbLoadMyRoot()
      if (!this.children.length) await this.dbLoadAllMyChildren(filterProp, limit)
      // esto ultimo habría que revisarlo para que se pudieran cargar no todos los elementos si no solo los que tuvieran padre vacio en caso de tener syskey
    }
    for (const child of this.children) {
      await child.dbLoadMyTree(extraParents, level)
    }
    return {data: this.children, total: this.props.total};
  }
  
  async dbGetMyTree(extraParents=null, level=null, filterProp={}, limit=[]) {
    const result = await this.dbLoadMyTree(extraParents, level, filterProp, limit);
    for (const child of this.children)  {
      child.parent=null;
    }
    return result;
  }

  async dbGetMyPartner(childId) {
    const foreignKey = await this.getMySysKeyAsync();
    const result = await this.constructor.dbGateway.getPartner(foreignKey, this, childId);
    const partner=new this.constructor.nodeConstructor(result);
    this.constructor.removeSysProps([partner], new this.constructor(this.props.parentTableName))
    return partner;
  }
  
  async dbLoadMyPartner(childId) {
    const myPartner = await this.dbGetMyPartner(childId);
    if (myPartner) myPartner.addRelationship(this);
    return myPartner;
  }
  
  async dbLoadMyTreeUp(level=null) {
    if (level===0) return true;
    if (level) level--;
    this.partner=null;
    await this.dbLoadMyPartner(this.getChild().props.id);
    if (this.partner) await this.partner.dbLoadMyTreeUp(level);
    return this.partner;
  }
  
  async dbGetMyTreeUp(level=null) {
    const myPartner=await this.dbLoadMyTreeUp(level);
    if (myPartner) {
      myPartner.relationships=[];
    }
    return myPartner;
  }
  dbGetAllMyChildren(filterProp={}, limit=[]) {
    return this.constructor.dbGetAllChildren(this, filterProp, limit);
  }
  
  //<-- insert queries
  // This and the following two functions are the most important
  // update siblings order is the argument that indicates when we are inserting a new node (not just adding a existing one) so we need to modify positions for siblings
  async dbInsertMyChild(thisChild, extraParents=null, updateSiblingsOrder=false) {
    if (!thisChild) return false;
    if (extraParents && !Array.isArray(extraParents)) extraParents=[extraParents];
    const foreigncolumnnames=await this.getMyRealForeignKeys(extraParents);
    const positioncolumnname=await this.getMySysKeyAsync('sort_order');
    return await this.constructor.dbGateway.insertChild(foreigncolumnnames, positioncolumnname, this, thisChild, extraParents, updateSiblingsOrder);
  }
  
  async dbInsertMyLink(thisChild, extraParents=null) {
    const afected= await this.dbSetMyLink(thisChild, extraParents);
    if (afected<=0) return afected;
    const foreigncolumnnames=await this.getMyRealForeignKeys(extraParents);
    const positioncolumnname=await this.getMySysKeyAsync('sort_order');

    //We try to update sort_order at the rest of elements
    if (!thisChild.props[positioncolumnname]) return afected;
    await this.constructor.dbGateway.setSiblingsOrderOnInsert(this.constructor.dbGateway.tableList.get(this.props.childTableName), positioncolumnname, thisChild.props[positioncolumnname], thisChild.props.id, foreigncolumnnames[0], this.partner.props.id);
    return afected;
  }
  
  async dbSetMyLink(thisChild, extraParents=null) {
    if (extraParents && !Array.isArray(extraParents)) extraParents=[extraParents];
    const foreigncolumnnames=await this.getMyRealForeignKeys(extraParents);
    const positioncolumnname=await this.getMySysKeyAsync('sort_order');
    return await this.constructor.dbGateway.setChildLink(foreigncolumnnames, positioncolumnname, this, thisChild, extraParents);
  }
  
  //<-- it seems this is not needed anymore
  async dbInsertMyTreeOld(level=null, extraParents=null) {
    if (level===0) return true;
    if (level) level--;
    const myResult=new this.constructor();
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
    const myResult=new this.constructor();
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
    if (foreigncolumnname) await this.constructor.dbGateway.setSiblingsOrderOnDelete(this.constructor.dbGateway.tableList.get(this.props.childTableName), positioncolumnname, child.props.id, foreigncolumnname, this.partner.props.id);
    else this.constructor.dbGateway.setSiblingsOrderOnDelete(this.constructor.dbGateway.tableList.get(this.props.childTableName), positioncolumnname, child.props.id);
    return afected;
  }

  //Pure link deletion
  async dbReleaseMyLink(child){
    if (!child.props.id) return false;
    const foreigncolumnname=await this.getMySysKeyAsync();
    if (!foreigncolumnname) throw new Error('Imposible to delete link');
    const afected = this.constructor.dbGateway.deleteChildLink(this.constructor.dbGateway.tableList.get(this.props.childTableName), foreigncolumnname, child.props.id);
    const positioncolumnname=await this.getMySysKeyAsync('sort_order');
    if (!positioncolumnname) return afected;
    await this.constructor.dbGateway.setSiblingsOrderOnDelete(this.constructor.dbGateway.tableList.get(this.props.childTableName), positioncolumnname, child.props.id, foreigncolumnname, this.partner.props.id);
    return afected;
  }
}

const Linker = linkerModelMixin(BasicLinker);

const dataModelMixin=Sup => class extends Sup {
  
  //<-- Database queries
  //<-- Load queries
  //It requires parent.props.childTableName

  static dbGetRelationships(data){
    return this.dbGateway.getRelationshipsFromTable(this.dbGateway.tableList.get(data.parent.props.childTableName))
    .map(rel=>new this.linkerConstructor(this.dbGateway.tableRef.get(rel.childTableName), this.dbGateway.tableRef.get(rel.parentTableName), rel.name).dbLoadMyChildTableKeys())
    .sort(rel=>rel.props.childTableName==rel.props.parentTableName ? -1 : +1) // mainBranch will be the first One
  }
  
  dbGetMyRelationsihps() {
    return this.constructor.dbGetRelationships(this);
  }
  
  dbLoadMyRelationships() {
    this.dbGetMyRelationsihps()
    .forEach(rel=>this.addRelationship(rel))
    return this
  }
  
  //It requires parent.props.childTableName or relationships[0].props.parentTableName
  /* ********** que ocurre con el propio parent, se toman los extra parents pero no el propio parent?????      */
  async dbLoadMyParent() {
    let myTableName;
    if (this.parent) {
      myTableName=this.parent.props.childTableName;
    }
    else if (this.relationships.length > 0) myTableName=this.relationships[0].props.parentTableName;
    else return false;
    const result = await this.constructor.dbGateway.getExtraParentsFromTable(this.constructor.dbGateway.tableList.get(myTableName));
    this.parent=result.length > 0 ? [] : null;
    for (let i=0; i<result.length; i++) {
      this.parent[i] = new this.constructor.linkerConstructor(this.constructor.dbGateway.tableRef.get(result[i].childTableName), this.constructor.dbGateway.tableRef.get(result[i].parentTableName), result[i].name);
      await this.parent[i].dbLoadMyChildTableKeys();
      this.parent[i].children[0]=this;
    }
    
    if (Array.isArray(this.parent) && this.parent.length==1) this.parent=this.parent[0];
    return this.parent;
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
    await this.dbLoadMyTree(extraParents, level, filterProp, limit, myself)
    if (myself) return this
    this.relationships.forEach(rel=>rel.partner=null)
    return this.relationships
  }
  
  async dbLoadMyTreeUp(level=null) {
    if (level===0) return true;
    if (level) level--;
    await this.dbLoadMyParent();
    if (!this.parent) return this.parent;
    if (Array.isArray(this.parent)) {
      for (const pNode of this.parent) {
        await pNode.dbLoadMyTreeUp(level);
      }
      return this.parent;
    }
    await this.parent.dbLoadMyTreeUp(level);
    return this.parent;
  }
  
  async dbGetMyTreeUp(level=null) {
    const parent=await this.dbLoadMyTreeUp(level)
    if (!parent) return parent
    Array.isArray(parent) ? parent.forEach(p=>p.children=[]) : parent.children=[]
    return parent
  }

  async dbGetMyProps(){
    return await this.constructor.dbGateway.getMyProps(this.constructor.dbGateway.tableList.get(this.parent.props.childTableName), this.props.id);
  }

  async dbLoadMySelf(){
    const result = await this.dbGetMyProps()
    if (!result) return 0
    Object.assign(this.props, (result[0]))
    return 1
  }

  //<-- Insert queries
  dbInsertMySelf(extraParents=null, updateSiblingsOrder=false){
    console.log("insert myself");
    return this.parent.dbInsertMyChild(this, extraParents, updateSiblingsOrder);
  }
  
  dbInsertMyLink(extraParents=null){
    return this.parent.dbInsertMyLink(this, extraParents);
  }
  
  //It inserts myself by default
  async dbInsertMyTree_old(level=null, extraParents=null, myself=true, updateSiblingsOrder=false) {
    if (level===0) return true;
    if (level) level--;
    let newId=this.props.id;
    if (myself!==false) {
      newId=await this.dbInsertMySelf(extraParents, updateSiblingsOrder);
    }
    const myReturn = new Node({id: newId});
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
    const isTableContent = this.parent && this.parent.sysChildTableKeysInfo &&
    this.parent.sysChildTableKeysInfo.some(syskey=>syskey.type=='foreignkey' && syskey.parentTableName==table);
    if (isTableContent) newId = await this.dbInsertMySelf(extraParents);
    const myReturn = new this.constructor({id: newId});
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
    const isTableContent = this.parent && this.parent.sysChildTableKeysInfo &&
    this.parent.sysChildTableKeysInfo.some(syskey=>syskey.type=='foreignkey' && syskey.parentTableName==table);
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
    const foreigncolumnname=await this.parent.getMySysKeyAsync();
    const positioncolumnname=await this.parent.getMySysKeyAsync('sort_order');
    if (foreigncolumnname && this.parent.partner && this.parent.partner.props.id) {
      //await this.parent.dbReleaseMyLink(this); //****** para que borrar el link si el link va en el propio elemento?????
      //Now we got to update the sort_order of the brothers
      if (positioncolumnname) await this.constructor.dbGateway.setSiblingsOrderOnDelete(this.constructor.dbGateway.tableList.get(this.parent.props.childTableName), positioncolumnname, this.props.id, foreigncolumnname, this.parent.partner.props.id);
    }
    else if (positioncolumnname) await this.constructor.dbGateway.setSiblingsOrderOnDelete(this.constructor.dbGateway.tableList.get(this.parent.props.childTableName), positioncolumnname, this.props.id);
    
    return await this.constructor.dbGateway.deleteMe(this.constructor.dbGateway.tableList.get(this.parent.props.childTableName), this.props.id);
  }

  dbDeleteMyLink() {
    return this.parent.dbDeleteMyLink(this);
  }
  
  //Pure link deletion
  dbReleaseMyLink(){
    return this.parent.dbReleaseMyLink(this);
  }
  //<-- Update queries
  async dbUpdateMyProps(proparray){
    if (!this.props.id) return false;
    return await this.constructor.dbGateway.updateMe(this.constructor.dbGateway.tableList.get(this.parent.props.childTableName), this.props.id, proparray);
  }

  async dbUpdateMySortOrder(newSortOrder){
    if (!this.props.id || !Number.isInteger(newSortOrder)) return false;
    const positioncolumnname=await this.parent.getMySysKeyAsync('sort_order');
    const myProps = await this.constructor.dbGateway.getMyProps(this.constructor.dbGateway.tableList.get(this.parent.props.childTableName), this.props.id);
    const oldSortOrder=myProps[positioncolumnname];
    const proparray={[positioncolumnname]: newSortOrder};
    const updated = await this.constructor.dbGateway.updateMe(this.constructor.dbGateway.tableList.get(this.parent.props.childTableName), this.props.id, proparray);
    if (!updated) return updated;
    const foreigncolumnname=await this.parent.getMySysKeyAsync();
    if (foreigncolumnname) { //update sibling sort_order
      await this.constructor.dbGateway.setSiblingsOrderOnUpdate(this.constructor.dbGateway.tableList.get(this.parent.props.childTableName), positioncolumnname, this.props.id, newSortOrder, oldSortOrder, foreigncolumnname, this.parent.partner.props.id);
    }
    else await this.constructor.dbGateway.setSiblingsOrderOnUpdate(this.constructor.dbGateway.tableList.get(this.parent.props.childTableName), positioncolumnname, this.props.id, newSortOrder, oldSortOrder);
    return updated;
  }
}

const Node = dataModelMixin(BasicNode);

export {Linker, Node}