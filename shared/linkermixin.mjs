// Extension for linksmixin.js / basicmixin.js interface for Model behavior
// Model behavior and structure
// =============================

// Defines the node relationship links operations between elements

/*
  Structure is something like:

  Node (partner) -> relationships: [rel1 linknerNode, rel2 linkerNode]

  rel1 (parent) -> chldren: [child1 Node, child2 Node]
*/

//import {copyProps} from './basicmixin.mjs';

export function detectLinker(myNode){
  return 'partner' in myNode;
}

export function isNumberField(parent, prop) {
  if (!parent.childTableKeys.length) return;
  const keyIndex=parent.childTableKeys.indexOf(prop);
  if (keyIndex==-1 || !parent.childTableKeysInfo[keyIndex]['Type']) return;
  return parent.childTableKeysInfo[keyIndex]['Type'].includes("int") || parent.childTableKeysInfo[keyIndex]['Type'].includes("decimal");
}

// detects if nodes are equivalent. It works olso for not Node instance objects
export function isEquivalentTo(nodeOne, nodeTwo) {
  if (detectLinker(nodeOne)!=detectLinker(nodeTwo)) return false;

  if (detectLinker(nodeOne)) {
    if (nodeOne.props.childTableName != nodeTwo.props.childTableName) return false;
    if (nodeOne.props.parentTableName != nodeTwo.props.parentTableName) return false;
    if (nodeOne.partner == nodeTwo.partner) return true;
    if (nodeOne.partner?.props.id === nodeTwo.partner.props.id) return true;
    return false;
  }
  if (nodeOne.props.id !== nodeTwo.props.id) return false;
  if (nodeOne.parent == nodeTwo.parent) return true;
  if (nodeOne.parent?.props.childTableName == nodeTwo.parent?.props.childTableName && nodeOne.parent.props.parentTableName == nodeTwo.parent.props.parentTableName) return true;
  return false;
}

const commonMixin=Sup => class extends Sup {
  static detectLinker(element){
    return detectLinker(element);
  }
  detectLinker(){
    return detectLinker(this);
  }
  static isNumberField(parent, prop) {
    return isNumberField(parent, prop);
  }
  static isEquivalentTo(fN, sN) {
    return isEquivalentTo(fN, sN);
  }
  isEquivalentTo(otherNode) {
    return isEquivalentTo(this, otherNode);
  }
  static clone(dataSource, levelUp, levelDown, thisProps, thisPropsUp, thisPropsDown){
    const myClon= detectLinker(dataSource) ? new this.linkerConstructor() : new this.nodeConstructor();
    return myClon.load(dataSource, levelUp, levelDown, thisProps, thisPropsUp, thisPropsDown);
  }
}

// type: primary, foreign or position. return unique value
// returns the first system key name of given type
export function getSysKey(parent, type='foreignkey'){
  if (type=="primary") {
    return parent.sysChildTableKeysInfo.find(value=>value.type=="primary")?.name;
  }
  return parent.sysChildTableKeysInfo.find(value=>value.type==type && value.parentTableName && value.parentTableName==parent.props.parentTableName)?.name;
}

// defines node relationships
const linkerMixin=Sup => class extends Sup {
  constructor(childTableName, parentTableName, name) {
    super({childTableName, parentTableName, name})
    this.childTableKeys=[]
    this.childTableKeysInfo=[]
    this.sysChildTableKeys=[]
    this.sysChildTableKeysInfo=[]
  }

  isNumberField(prop) {
    return isNumberField(this, prop)
  }

  get partner() {
    return this._parent
  }

  set partner(value) {
    this._parent=value
  }

  get children() {
    return this._children
  }

  set children(value) {
    this._children=value
  }

  load(source, levelUp, levelDown, thisProps, thisPropsUp, thisPropsDown) {
    this.loadChildTableKeys(source)
    super.load(source, levelUp, levelDown, null, thisPropsUp, thisPropsDown) //No thisProps filter for females
    return this
  }

  loadChildTableKeys(source) {
    if (source.childTableKeys) {
      this.childTableKeys=[...source.childTableKeys]
    }
    if (source.childTableKeysInfo) {
      this.childTableKeysInfo=source.childTableKeysInfo.map(keysInfo=>{return {...keysInfo}})
    }
    if (source.sysChildTableKeys) {
      this.sysChildTableKeys=[...source.sysChildTableKeys]
    }
    if (source.sysChildTableKeysInfo) {
      this.sysChildTableKeysInfo=source.sysChildTableKeysInfo.map(sysKeysInfo=>{return {...sysKeysInfo}})
    }
    return this
  }

  // We need to set nodeConstructor at the concret linker class

  loadDesc(source, level, thisProps) {
    if (!source?.children) return
    if (level===0) return
    if (level > 0) level--
    this.children=[] // reset children
    source.children.forEach(sourceChild=>{
      const targetChild=this.addChild(new this.constructor.nodeConstructor())
      this.constructor.copyProps(targetChild, sourceChild, thisProps) // loading just some props
      targetChild.loadDesc(sourceChild, level, thisProps)
    })
  }

  loadAsc(source, level, thisProps) {
    if (!source?.partner) return
    if (level===0) return
    if (level > 0) level--
    this.setPartner(new this.constructor.nodeConstructor())
    this.constructor.copyProps(this.partner, source.partner, thisProps)
    this.partner.loadAsc(source.partner, level, thisProps)
  }
  
  // type: primary, foreignkey, positionkey. return unique value
  static getSysKey(parent, type='foreignkey'){
    return getSysKey(parent, type)
  }
  
  getSysKey(type='foreignkey'){
    //Get foreign keys from the actual relatioship
    return getSysKey(this, type)
  }
  
  // returns an array
  static getChildKeys(parent, type){
    let filterKeys = parent.childTableKeysInfo
    if (type) filterKeys = parent.childTableKeysInfo.filter(value => value.type==type)
    return filterKeys.map(value => value.Field)
  }
  
  getChildKeys(type){
    return this.constructor.getChildKeys(this, type)
  }

  getChild(obj) {
    return super.getDescendent(obj)
  }

  addChild(obj) {
    if (Array.isArray(obj.parent)) {
      if (!obj.parent.includes(this))
        obj.parent.push(this)
      this.children.push(obj)
    }
    else {
      super.addDescendent(obj)
    }
    ++this.props.total
    const skey=this.getSysKey('sort_order')
    if (skey && this.children.length>0) {
      // it sorts the array in the order, it modifies original
      this.children.sort((a,b)=>a.props[skey]-b.props[skey])
    }
    return obj
  }

  removeChild(obj){
    if ( super.removeDescendent(obj) ) {
      --this.props.total
      return true
    }
    return false
  }

  removeChildren(){
    return super.removeDescendents()
  }

  getPartner(obj) {
    return super.getAscendent(obj)
  }

  setPartner(obj) {
    return super.setAscendent(obj)
  }

  removePartner(obj){
    if (Array.isArray(this.partner)) return this.partner = this.partner.filter(partner => partner != obj)
    return super.removeAscendent(obj)
  }

  removePartners(){
    return super.removeAscendent()
  }
}

const nodeMixin=Sup => class extends Sup {

  get parent() {
    return this._parent
  }

  set parent(value) {
    this._parent=value
  }

  get relationships() {
    return this._children
  }

  set relationships(value) {
    this._children=value
  }

  // We need to set linkerConstructor at the concret node class

  loadDesc(source, level, thisProps) {
    if (!source?.relationships) return
    if (level===0) return
    if (level > 0) level--
    this.relationships=[] // reset rels
    source.relationships.forEach(sourceLinker=>{
      const targetLinker=this.addRelationship(new this.constructor.linkerConstructor())
      this.constructor.copyProps(targetLinker, sourceLinker, thisProps) // loading just props
      targetLinker.loadChildTableKeys(sourceLinker)
      targetLinker.loadDesc(sourceLinker, level, thisProps)
    })
  }

  loadAsc(source, level, thisProps) {
    if (!source?.parent) return
    if (level===0) return
    if (level > 0) level--
    if (Array.isArray(source.parent)) {
      this.parent=[]
      source.parent.forEach(sourceLinker=>{
        const targetLinker=new this.constructor.linkerConstructor()
        this.constructor.copyProps(targetLinker, sourceLinker)
        targetLinker.loadChildTableKeys(sourceLinker)
        this.addParent(targetLinker)
        targetLinker.loadAsc(sourceLinker, level, thisProps)
      })
      return
    }
    const targetLinker=this.setParent(new this.constructor.linkerConstructor())
    this.constructor.copyProps(targetLinker, source.parent)
    targetLinker.loadChildTableKeys(source.parent)
    targetLinker.loadAsc(source.parent, level, thisProps)
  }

  getRelationship(relname) {
    return super.getDescendent(relname)
  }

  getYBranch(db_collection){
    return this.relationships.find(someRel=>someRel.sysChildTableKeysInfo?.some(syskey=>syskey.type=='foreignkey' && syskey.parentTableName==db_collection)) // some -db_collection- related branch
  }

  getMainBranch(){
    return this.relationships.find(mainRel=>mainRel.props.childTableName==this.getParent().props.childTableName) // main branch
  }

  addRelationship(obj) {
    return super.addDescendent(obj)
  }

  removeRelationship(obj){
    return super.removeDescendent(obj)
  }

  removeRelationships(){
    return super.removeDescendents()
  }

  getParent(objSearch) {
    if (Array.isArray(this.parent)) {
      if (!objSearch) return this.parent[0]
      return this.parent.find(parent=>
        Object.entries(objSearch).every(([objKey, objValue])=>
          Object.entries(parent.props).find(([parentKey, parentValue])=>objKey==parentKey && objValue==parentValue)))
    }
    return super.getAscendent(objSearch)
  }
  // This is not clear, probably is erroneous, better use addChild in parent
  // Multple parents is not well implemented, what about addChild? why addChild doesn't implement multple parents in child?
  addParent(obj) {
    if (!this.parent)
      this.parent = obj
    else {
      if (!Array.isArray(this.parent)) this.parent=[this.parent]
      if (!this.parent.includes(obj)) this.parent.push(obj)
    }
    if (!obj.relationships.includes(this)) obj.relationships.push(this)
  }

  setParent(obj) {
    return super.setAscendent(obj)
  }

  removeParent(obj){
    return super.removeAscendent(obj)
  }
}

// Some mothods modification for easy and shorter use

const nodeExpressMixin=Sup => class extends Sup {
  getRelationship(obj) {
    if (typeof obj=="string") {
      return super.getRelationship({"name": obj})
    }
    return super.getRelationship(obj)
  }
  getNextChild(obj) {
    return this.relationships[0].getChild(obj)
  }
}

const linkerExpressMixin=Sup => class extends Sup {
  getChild(obj) {
    if (typeof obj=="string") { // selecting first prop!=id
      const firstKey = this.childTableKeys.find(myKey=>myKey!='id')
      if (firstKey) return super.getDescendent({[firstKey]: obj})
    }
    return super.getDescendent(obj)
  }
}

export {commonMixin, linkerMixin, nodeMixin, nodeExpressMixin, linkerExpressMixin}

/**
 * 
 * Cambios
 * getRoot(tableName), getRoot ya no admite este parámetro
   parentNode => parent
   partnerNode => partner
 * childTableName => childTableName, parentTableName => parentTableName
 *     this.childTableKeys=[];
    this.childTableKeysInfo=[];
    this.sysChildTableKeys=[];
    this.sysChildTableKeysInfo=[];
    loadChildTableKeys
    foreignkey, positionkey => foreign, position
    Eliminado getEqualChild, getMyEqualChild, replaceChild
    getMySysKey => getSysKey
    getMyChildKeys => getChildKeys

  // crear un expressMixin:
  // definir getChild para que tome directamente el valor de la primera propiedad
  // y para que devuelva el primer elemento si no envia obj: if (!obj) return this._children[0];

  // quiza crear un strictMixin
  // para que getRoot devuelva siempre Node por ejemplo

  // Hay que revisar que json.stringify funcione ahora teniendo los alias. Lo ideal es que los alias funcionen y se anulen las internas. Supongo que con el tema packing esto se puede hacer
  // tambien revisar como hacer que el linker no se repita cuando es idéntico en el arbol

 * */