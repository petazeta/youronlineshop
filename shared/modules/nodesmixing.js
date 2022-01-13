// Node is the basic object, it will contain data and relationship links to other nodes
import {parseNumber} from './datainput.js';
import {detectGender, getRoot, equality} from './utils.js';

// const Node = EventListenerMixing(NodeBasic);
const NodeMixing=Sup => class extends Sup {
  // parentNode is Null by default at NodeMale constructor
  static detectGender(element){
    return detectGender(element);
  }
  detectMyGender(){
    return detectGender(this);
  }
  // gets root (root is allways a male node)
  // if tableName, get first belonging tablename
  static getRoot(myNode, tableName) {
    return getRoot(myNode, tableName);
  }
  getMyRoot(tableName){
    return getRoot(this, tableName);
  }
  // detects if nodes are equivalent. It works olso for not Node instance objects
  static equality(nodeOne, nodeTwo) {
    return equality(nodeOne, nodeTwo);
  }
  arrayFromTree() {
    let container=[];
    container.push(this);
    if (detectGender(this)=="female") {
      for (let i=0; i<this.children.length; i++) {
        container=container.concat(this.children[i].arrayFromTree());
      }
    }
    else {
      for (let i=0; i<this.relationships.length; i++) {
        container=container.concat(this.relationships[i].arrayFromTree());
      }
    }
    return container;
  }
}
//class NodeFemale extends Node{
const NodeFemaleMixing=Sup => class extends Sup {
  constructor(childtablename, parenttablename) {
    let params = {};
    if (childtablename) params.childtablename=childtablename;
    if (parenttablename) params.parenttablename=parenttablename;
    super(params);
    this.partnerNode=null;
    this.children=[];
    this.childtablekeys=[];
    this.childtablekeysinfo=[];
    this.syschildtablekeys=[];
    this.syschildtablekeysinfo=[];
  }

  load(source, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown, myConstructor) {
    super.load(source); //No thisProperties filter for females
    if (Array.isArray(source)) levelup=0; //load from children
    if (source.childtablekeys) {
      this.childtablekeys=source.childtablekeys;
    }
    if (source.childtablekeysinfo) {
      this.childtablekeysinfo=source.childtablekeysinfo.map(skeysinfo=>{
        const chkeysinfo={};
        for (const i in skeysinfo) {
          if (typeof skeysinfo[i]=="string" || typeof skeysinfo[i]=="number") {
            if (isNaN(parseNumber(skeysinfo[i]))) chkeysinfo[i]=skeysinfo[i];
            else chkeysinfo[i]=parseNumber(skeysinfo[i]);
          }
        }
        return chkeysinfo;
      });
    }
    if (source.syschildtablekeys) {
      this.syschildtablekeys=source.syschildtablekeys;
    }
    if (source.syschildtablekeysinfo) {
      this.syschildtablekeysinfo=source.syschildtablekeysinfo.map(sskeysinfo=>{
        const schkeysinfo={};
        for (const i in sskeysinfo) {
          if (typeof sskeysinfo[i]=="string" || typeof sskeysinfo[i]=="number") {
            if (isNaN(parseNumber(sskeysinfo[i]))) schkeysinfo[i]=sskeysinfo[i];
            else schkeysinfo[i]=parseNumber(sskeysinfo[i]);
          }
        }
        return schkeysinfo;
      });
    }
    if (levelup !== 0 && !(levelup < 0)) { //level null and undefined like infinite
      this.loadasc(source, levelup, thisPropertiesUp, myConstructor);
    }
    if (leveldown !== 0 && !(leveldown < 0)) {
      this.loaddesc(source, leveldown, thisPropertiesDown, myConstructor);
    }
    return this;
  }
  
  cloneNode(levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown, myConstructor) {
    const myClon=new this.constructor();
    myClon.load(this, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown, myConstructor);
    return myClon;
  }
  //myConstructor is NodeMale
  loaddesc(source, level, thisProperties, myConstructor) {
    super.loaddesc(source);
    this.children=[];
    if (level===0) return false;
    if (level) level--;
    let children;
    if (Array.isArray(source)) children=source; //Allow load from children
    else children=source.children;
    if (!children) return false;
    for (var i=0;i<children.length;i++) {
      if (children[i].constructor.name!='Object') myConstructor=children[i].constructor;
      this.children[i]=new myConstructor;
      this.children[i].parentNode=this;
      this.children[i].load(children[i], 0, 0, thisProperties);
      this.children[i].loaddesc(children[i], level, thisProperties);
    }
  }
  //myConstructor is NodeMale
  loadasc(source, level, thisProperties, myConstructor) {
    super.loadasc(source);
    this.partnerNode=null;
    if (!source.partnerNode) return false;
    if (level===0) return false;
    if (level) level--;
    if (source.partnerNode.constructor.name!='Object') myConstructor=source.partnerNode.constructor;
    this.partnerNode=new myConstructor;
    this.partnerNode.load(source.partnerNode, 0, 0, thisProperties);
    this.partnerNode.addRelationship(this); // new thing
    this.partnerNode.loadasc(source.partnerNode, level, thisProperties);
  }
  
  static getSysKey(parentNode, type='foreignkey'){
    for (const syskey of parentNode.syschildtablekeysinfo) {
      if (type=="primary" && syskey.type==type) {
        return syskey.name;
      }
      if (syskey.parenttablename
        && syskey.parenttablename==parentNode.props.parenttablename
        && syskey.type==type) {
        return syskey.name;
      }
    }
  }
  
  getMySysKey(type='foreignkey'){
    //Get foreign keys from the actual relatioship
    return this.constructor.getSysKey(this, type);
  }
  
  static getChildKey(parentNode, type){
    const returnkeys=[];
    for (const mykey of parentNode.childtablekeysinfo) {
      if (type && mykey.type==type) {
        returnkeys.push(mykey.Field);
      }
      else returnkeys.push(mykey.Field);
    }
    return returnkeys;
  }
  
  getMyChildKey(type){
    //Get foreign keys from the actual relatioship
    return this.constructor.getChildKey(this, type);
  }
  
  static getEqualChild(pNode, toChild){
    for (const child of pNode.children) {
      if (this.constructor.equality(child, toChild)) return child;
    }
  }
  
  getMyEqualChild(child) {
    return this.constructor.getEqualChild(this, child);
  }
  
  avoidrecursion(){
    super.avoidrecursion();
    if (this.partnerNode) {
      this.partnerNode.avoidrecursionup();
    }
    this.children.forEach(function(child) {
      child.avoidrecursiondown();
    });
    return this;
  }
  avoidrecursiondown(){
    super.avoidrecursion();
    this.partnerNode=null;
    this.children.forEach(function(child) {
      child.avoidrecursiondown();
    });
  }
  avoidrecursionup(){
    super.avoidrecursion();
    this.children=[];
    if (this.partnerNode) {
      this.partnerNode.avoidrecursionup();
    }
  }

  //skipping female DEPRECATED
  getrootnode(tableName) {
    if (!this.partnerNode) return this;
    else return this.partnerNode.getrootnode(tableName);
  }

  replaceChild(oldchild,newchild) {
    var i= this.children.length;
    while(i--) {
      if (this.children[i].props.id == oldchild.props.id) {
        this.children[i]=newchild;
        this.children[i].parentNode=this;
      }
    }
  }

  removeChild(obj) {
    let removed=false;
    for (let i in this.children) {
      if (this.children[i]==obj || (obj.props.id && this.children[i].props.id==obj.props.id)) {
        removed=this.children.splice(i,1)[0];
        break;
      }
    }
    if (!removed) return;
    //we update the siblings sort_order
    let skey=this.getMySysKey('sort_order');
    if (skey && removed.props[skey] && removed.props[skey]<this.children.length+1) {
      let i= this.children.length;
      while(i--) {
        if (this.children[i].props[skey] > removed.props[skey]) {
          this.children[i].props[skey]--;
        }
      }
    }
    return removed;
  }

  addChild(obj) { //It doesn't keep the obj previouse parentNode but replace if present
    this.children.push(obj);
    obj.parentNode=this;
    return obj;
  }

  getChild(obj) {
    if (!obj) return this.children[0];
    if (typeof obj=="string") { //first prop!=id
      if (this.childtablekeys) {
        for (const key of this.childtablekeys) {
          if (key!="id") {
            obj={[key]: obj};
            break;
          }
        }
      }
      else return false;
    }
    const keyname=Object.keys(obj)[0];
    let i= this.children.length;
    while(i--) {
      if (Object.keys(this.children[i].props).includes(keyname) && this.children[i].props[keyname]==obj[keyname])
        return this.children[i];
    }
    return false;
  }
}

//class NodeMale extends Node{
const NodeMaleMixing=Sup => class extends Sup {
  constructor(props) {
    super(props);
    this.parentNode=null;
    this.relationships=[];
    //optional variable this.sort_order
  }

  //It loads data from a json string or an object
  load(source, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown, myConstructor) {
    /* We must study to introduce a strict argument for loading just the properties. At theme tree the properties are not the same so we can not apply this restriction to everything
    if (!thisProperties && this.parentNode && this.parentNode.childtablekeys && this.parentNode.childtablekeys.length>0) {
      thisProperties=this.parentNode.childtablekeys;
      for (const syskey of this.parentNode.syschildtablekeysinfo) {
        if (syskey.type=='sort_order') thisProperties.push(syskey.name);
      }
    }
    */
    super.load(source, thisProperties);
    if (Array.isArray(source)) levelup=0; //load from relationships
    //if (source.sort_order) this.sort_order=Number(source.sort_order);
    if (levelup !== 0 && !(levelup < 0)) { //level null and undefined like infinite
      this.loadasc(source, levelup, thisPropertiesUp, myConstructor);
    }
    if (leveldown !== 0 && !(leveldown < 0)) {
      this.loaddesc(source, leveldown, thisPropertiesDown, myConstructor);
    }
    return this;
  }
  
  cloneNode(levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown, myConstructor) {
    var myClon=new this.constructor();
    myClon.load(this, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown, myConstructor);
    return myClon;
  }
  //myConstructor is NodeFemale
  loaddesc(source, level, thisProperties, myConstructor) {
    super.loaddesc(source);
    //if (source.sort_order) this.sort_order=Number(source.sort_order);
    if (level===0) return false;
    if (level) level--;
    let relationships;
    if (Array.isArray(source)) relationships=source; //Allow load from relationships
    else relationships=source.relationships;
    if (!relationships) return false;
    for (var i=0;i<relationships.length; i++) {
      if (relationships[i].constructor.name!='Object') myConstructor=relationships[i].constructor;
      this.relationships[i]=new myConstructor;
      this.relationships[i].partnerNode=this;
      this.relationships[i].load(relationships[i], 0, 0, thisProperties);
      this.relationships[i].loaddesc(relationships[i], level, thisProperties);
    }
  }

  getNextChild(obj) {
    return this.relationships[0].getChild(obj);
  }
  //myConstructor is NodeFemale
  loadasc(source, level, thisProperties, myConstructor) {
    super.loadasc(source);
    this.parentNode=null;
    //if (source.sort_order) this.sort_order=Number(source.sort_order);
    if (!source.parentNode) return false;
    if (level===0) return false;
    if (level) level--;
    if (Array.isArray(source.parentNode)) {
      this.parentNode=[];
      for (var i=0; i < source.parentNode.length; i++) {
        if (source.parentNode[i].constructor.name!='Object') myConstructor=source.parentNode[i].constructor;
        this.parentNode[i]=new myConstructor;
        this.parentNode[i].load(source.parentNode[i], 0, 0, thisProperties);
        this.parentNode[i].addChild(this); // new
        this.parentNode[i].loadasc(source.parentNode[i], level, thisProperties);
      }
    }
    else {
      if (source.parentNode.constructor.name!='Object') myConstructor=source.parentNode.constructor;
      this.parentNode=new myConstructor;
      this.parentNode.load(source.parentNode,0,0,thisProperties);
      this.parentNode.addChild(this); // new
      this.parentNode.loadasc(source.parentNode, level, thisProperties);
    }
  }

  avoidrecursion() {
    super.avoidrecursion();
    if (this.parentNode) {
      if (Array.isArray(this.parentNode)) {
        this.parentNode.forEach(function(pNode){
          pNode.avoidrecursionup();
        });
      }
      else this.parentNode.avoidrecursionup();
    }
    this.relationships.forEach(function(rel) {
      rel.avoidrecursiondown();
    });
    return this;
  }
  avoidrecursionup(){
    super.avoidrecursion();
    this.relationships=[];
    if (this.parentNode) {
      if (Array.isArray(this.parentNode)) {
        this.parentNode.forEach(function(pNode){
          pNode.avoidrecursionup();
        });
      }
      else this.parentNode.avoidrecursionup();
    }
  }
  avoidrecursiondown(){
    super.avoidrecursion();
    this.parentNode=null;
    this.relationships.forEach(function(rel){
      rel.avoidrecursiondown();
    });
  }
  execfuncdown(myfunc){
    this.relationships.forEach(function(rel){
      myfunc(rel);
      rel.execfuncdown(myfunc);
    });
  }

  addRelationship(rel) {
    this.relationships.push(rel);
    rel.partnerNode=this;
    return rel;
  }
  // gets root (root is allways a male node) DEPRECATED
  // if tableName, get first belonging tablename
  getrootnode(tableName) {
    if (this.parentNode && this.parentNode.partnerNode &&
      (!tableName || this.parentNode.props.childtablename!=tableName)) {
      return this.parentNode.partnerNode.getrootnode(tableName);
    }
    else if (!tableName || this.parentNode && this.parentNode.props.childtablename==tableName) return this;
  }

  getRelationship(obj=null) {
    if (obj===null) return this.relationships[0]; //Default first rel
    if (typeof obj == "string") obj={name: obj};
    const keyname=Object.keys(obj)[0];
    for (const rel of this.relationships) {
      if ((keyname in rel.props) && rel.props[keyname]===obj[keyname])
        return rel;
    }
    return false;
  }
}

export {NodeMixing, NodeFemaleMixing, NodeMaleMixing};