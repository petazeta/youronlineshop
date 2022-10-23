// Extension for linksmixin.js / basicmixin.js interface

// Defines the node relationship links operations between elements

/*
  Structure is something like:

  dataNode (partner) -> relationships: [rel1 linknerNode, rel2 linkerNode]

  rel1 (parent) -> chldren: [child1 dataNode, child2 dataNode]
*/

import {copyProps} from './basicmixin.mjs';

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
export function equivalent(nodeOne, nodeTwo) {
  if (detectLinker(nodeOne)!=detectLinker(nodeTwo)) return false;

  if (detectLinker(nodeOne)) {
    if (nodeOne.props.childTableName != nodeTwo.props.childTableName) return false;
    if (nodeOne.props.parentTableName != nodeTwo.props.parentTableName) return false;
    if (nodeOne.partner == nodeTwo.partner) return true;
    if (nodeOne.partner && nodeTwo.partner &&
      nodeOne.partner.props.id === nodeTwo.partner.props.id) return true;
    return false;
  }
  if (nodeOne.props.id !== nodeTwo.props.id) return false;
  if (nodeOne.parent == nodeTwo.parent) return true;
  if (nodeOne.parent && nodeTwo.parent &&
    nodeOne.parent.props.childTableName == nodeTwo.parent.props.childTableName &&
    nodeOne.parent.props.parentTableName == nodeTwo.parent.props.parentTableName) return true;
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
  static equivalent(fN, sN) {
    return equivalent(fN, sN);
  }
  equivalentTo(otherNode) {
    return equivalent(this, otherNode);
  }
}

// type: primary, foreign or position. return unique value
// returns the first system key name of given type
export function getSysKey(parentNode, type='foreignkey'){
  if (type=="primary") {
    const result = parentNode.sysChildTableKeysInfo.find(value=>value.type=="primary");
    if (result) return result.name;
    return;
  }
  const result = parentNode.sysChildTableKeysInfo.find(value=>value.type==type && value.parentTableName && value.parentTableName==parentNode.props.parentTableName);
  if (result) return result.name;
  return;
}

// defines node relationships
const linkerMixin=Sup => class extends Sup {
  constructor(childTableName, parentTableName, name) {
    const params = {};
    if (childTableName) params.childTableName=childTableName;
    if (parentTableName) params.parentTableName=parentTableName;
    if (name) params.name=name;
    super(params);
    this.childTableKeys=[];
    this.childTableKeysInfo=[];
    this.sysChildTableKeys=[];
    this.sysChildTableKeysInfo=[];
  }

  isNumberField(prop) {
    return isNumberField(this, prop);
  }

  get partner() {
    return this._parent;
  }

  set partner(value) {
    this._parent=value;
  }

  get children() {
    return this._children;
  }

  set children(value) {
    this._children=value;
  }

  load(source, levelUp, levelDown, thisProps, thisPropsUp, thisPropsDown) {
    this.loadChildTableKeys(source);
    super.load(source, levelUp, levelDown, null, thisPropsUp, thisPropsDown); //No thisProps filter for females
    return this;
  }

  loadChildTableKeys(source) {
    if (source.childTableKeys) {
      this.childTableKeys=[...source.childTableKeys];
    }
    if (source.childTableKeysInfo) {
      this.childTableKeysInfo=source.childTableKeysInfo.map(keysInfo=>{return {...keysInfo}});
    }
    if (source.sysChildTableKeys) {
      this.sysChildTableKeys=[...source.sysChildTableKeys];
    }
    if (source.sysChildTableKeysInfo) {
      this.sysChildTableKeysInfo=source.sysChildTableKeysInfo.map(sysKeysInfo=>{return {...sysKeysInfo}});
    }
    return this;
  }

  // We need to set dataConstructor at the concret linker class

  loadDesc(source, level, thisProps) {
    if (level===0) return;
    if (level > 0) level--;
    this.children=[]; // reset children
    if (!source.children) return;
    for (const i of Object.keys(source.children)) {
      this.children[i]=new this.constructor.dataConstructor;
      this.children[i].parent=this;
      copyProps(this.children[i], source.children[i], thisProps); // loading just some props
      this.children[i].loadDesc(source.children[i], level, thisProps);
    }
  }

  loadAsc(source, level, thisProps) {
    if (level===0) return;
    if (level > 0) level--;
    if (!source.partner) return;
    this.partner=new this.constructor.dataConstructor;
    copyProps(this.partner, source.partner, thisProps);
    this.partner.addRelationship(this); // new thing
    this.partner.loadAsc(source.partner, level, thisProps);
  }
  
  // type: primary, foreignkey, positionkey. return unique value
  static getSysKey(parentNode, type='foreignkey'){
    return getSysKey(parentNode, type);
  }
  
  getSysKey(type='foreignkey'){
    //Get foreign keys from the actual relatioship
    return this.constructor.getSysKey(this, type);
  }
  
  // returns an array
  static getChildKeys(parentNode, type){
    let filterKeys = parentNode.childTableKeysInfo;
    if (type) filterKeys = parentNode.childTableKeysInfo.filter(value => value.type==type);
    return filterKeys.map(value => value.Field);
  }
  
  getChildKeys(type){
    return this.constructor.getChildKeys(this, type);
  }

  getChild(obj) {
    return super.getDescendent(obj);
  }

  addChild(obj) {
    return super.addDescendent(obj);
  }

  removeChild(obj){
    return super.removeDescendent(obj);
  }

  removeChildren(){
    return super.removeDescendents();
  }

  getPartner(objSearch) {
    if (Array.isArray(this.partner)) {
      if (!objSearch) return this.partner[0];
      return this.partner.find(partner=>
        Object.entries(objSearch).every(([objKey, objValue])=>
          Object.entries(partner.props).find(([partnerKey, partnerValue])=>objKey==partnerKey && objValue==partnerValue)));
    }
    return super.getAscendent(objSearch);
  }

  addPartner(obj) {
    if (!this.partner) this.partner=obj;
    else {
      if (!Array.isArray(this.partner)) this.partner=[this.partner];
      this.partner.push(obj);
    }
  }

  setPartner(obj) {
    return super.setAscendent(obj);
  }

  removePartner(obj){
    if (Array.isArray(this.partner)) this.partner = this.partner.filter(partner => partner != obj);
    return super.removeAscendent(obj);
  }

  removePartners(){
    return super.removeAscendent();
  }
}

const dataMixin=Sup => class extends Sup {

  get parent() {
    return this._parent;
  }

  set parent(value) {
    this._parent=value;
  }

  get relationships() {
    return this._children;
  }

  set relationships(value) {
    this._children=value;
  }

  // We need to set linkerConstructor at the concret data class

  loadDesc(source, level, thisProps) {
    if (level===0) return;
    if (level > 0) level--;
    this.relationships=[]; // reset rels
    if (!source.relationships) return;
    for (const i of Object.keys(source.relationships)) {
      this.relationships[i]=new this.constructor.linkerConstructor;
      this.relationships[i].partner=this;
      copyProps(this.relationships[i], source.relationships[i], thisProps); // loading just props
      this.relationships[i].loadChildTableKeys(source.relationships[i]);
      this.relationships[i].loadDesc(source.relationships[i], level, thisProps);
    }
  }

  loadAsc(source, level, thisProps) {
    if (level===0) return;
    if (level > 0) level--;

    const innerLoad = (myParent, sourceParent) => {
      copyProps(myParent, sourceParent);
      myParent.addChild(this); // new thing
      myParent.loadAsc(sourceParent, level, thisProps);
    }

    if (!source.parent) return;

    if (Array.isArray(source.parent)) {
      this.parent=[];
      for (const i in source.parent) {
        this.parent[i]=new this.constructor.linkerConstructor;
        innerLoad(this.parent[i], source.parent[i]);
      }
      return;
    }
    this.parent=new this.constructor.linkerConstructor;
    innerLoad(this.parent, source.parent);
  }

  getRelationship(obj) {
    return super.getDescendent(obj);
  }

  addRelationship(obj) {
    return super.addDescendent(obj);
  }

  removeRelationship(obj){
    return super.removeDescendent(obj);
  }

  removeRelationships(){
    return super.removeDescendents();
  }

  getParent(obj) {
    return super.getAscendent(obj);
  }

  setParent(obj) {
    return super.setAscendent(obj);
  }

  removeParent(obj){
    return super.removeAscendent(obj);
  }
}

// Some mothods modification for easy and shorter use

const dataExpressMixin=Sup => class extends Sup {
  getRelationship(obj) {
    if (typeof obj=="string") {
      return super.getDescendent({"name": obj});
    }
    return super.getDescendent(obj);
  }
  getNextChild(obj) {
    return this.relationships[0].getChild(obj);
  }
}

const linkerExpressMixin=Sup => class extends Sup {
  getChild(obj) {
    if (typeof obj=="string") { // selecting first prop!=id
      const firstKey = this.childTableKeys.find(myKey=>myKey!='id');
      return super.getDescendent({[firstKey]: obj});
    }
    return super.getDescendent(obj);
  }
}

export {commonMixin, linkerMixin, dataMixin, dataExpressMixin, linkerExpressMixin};

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
  // para que getRoot devuelva siempre dataNode por ejemplo

  // Hay que revisar que json.stringify funcione ahora teniendo los alias. Lo ideal es que los alias funcionen y se anulen las internas. Supongo que con el tema packing esto se puede hacer
  // tambien revisar como hacer que el linker no se repita cuando es idéntico en el arbol

 * */