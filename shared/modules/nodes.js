//Node is the basic object, it will contain data and relationship links to other nodes
import NodeBasic from './nodebasic.js';
import EventListenerMixing from './eventlisteners.js';
import {parseNumber} from './datainput.js';

const Node = EventListenerMixing(NodeBasic);

class NodeFemale extends Node{
  constructor(childtablename, parenttablename) {
    super();
    if (childtablename) this.props.childtablename=childtablename;
    if (parenttablename) this.props.parenttablename=parenttablename;
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

  loaddesc(source, level, thisProperties, myConstructor) {
    super.loaddesc(source);
    if (!myConstructor) myConstructor=NodeMale;
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

  loadasc(source, level, thisProperties, myConstructor) {
    super.loadasc(source);
    if (!myConstructor) myConstructor=NodeMale;
    this.partnerNode=null;
    if (!source.partnerNode) return false;
    if (level===0) return false;
    if (level) level--;
    if (source.partnerNode.constructor.name!='Object') myConstructor=source.partnerNode.constructor;
    this.partnerNode=new myConstructor;
    this.partnerNode.load(source.partnerNode, 0, 0, thisProperties);
    this.partnerNode.loadasc(source.partnerNode, level, thisProperties);
  }
  
  static getSysKey(parentNode, type='foreignkey'){
    let foreignkey=null;
    for (const syskey of parentNode.syschildtablekeysinfo) {
      if (syskey.parenttablename
        && syskey.parenttablename==parentNode.props.parenttablename
        && syskey.type==type) {
        foreignkey=syskey.name;
        break;
      }
    }
    return foreignkey;
  }
  
  getMySysKey(type='foreignkey'){
    //Get foreign keys from the actual relatioship
    return NodeFemale.getSysKey(this, type);
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

  //skipping female
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
    var removed=false;
    for (let i in this.children) {
      if (this.children[i]==obj || (obj.props.id && this.children[i].props.id==obj.props.id)) {
        removed=this.children.splice(i,1)[0];
        break;
      }
    }
    if (removed) {
      //we update the siblings sort_order
      let skey=this.getMySysKey('sort_order');
      if (skey && removed.props[skey]) {
        let i= this.children.length;
        while(i--) {
          if (this.children[i].props[skey] > removed.props[skey]) {
            this.children[i].props[skey]--;
          }
        }
      }
    }
  }

  addChild(obj) { //It doesn't keep the obj previouse parentNode but replace if present
    this.children.push(obj);
    obj.parentNode=this;
    //we update the siblings sort_order
    let skey=this.getMySysKey('sort_order');
    if (skey && obj.props[skey] && obj.props[skey]<this.children.length) {
      var i= this.children.length;
      while(i--) {
        if (this.children[i]!=obj && this.children[i].props[skey] >= obj.props[skey]) {
          this.children[i].props[skey]++;
        }
      }
    }
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
    var keyname=Object.keys(obj)[0];
    var i= this.children.length;
    while(i--) {
      if (Object.keys(this.children[i].props).includes(keyname) && this.children[i].props[keyname]==obj[keyname])
        return this.children[i];
    }
    return false;
  }
}

class NodeMale extends Node{
  constructor() {
    super();
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
  
  loaddesc(source, level, thisProperties, myConstructor) {
    super.loaddesc(source);
    if (!myConstructor) myConstructor=NodeFemale;
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

  loadasc(source, level, thisProperties, myConstructor) {
    super.loadasc(source);
    if (!myConstructor) myConstructor=NodeFemale;
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
        this.parentNode[i].loadasc(source.parentNode[i], level, thisProperties);
      }
    }
    else {
      if (source.parentNode.constructor.name!='Object') myConstructor=source.parentNode.constructor;
      this.parentNode=new myConstructor;
      this.parentNode.load(source.parentNode,0,0,thisProperties);
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
  //gets root (root is allways a male node)
  //if tableName, get first belonging tablename
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




export {Node, NodeFemale, NodeMale};