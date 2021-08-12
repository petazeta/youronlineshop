//Node is the basic object, it will contain data and relationship links to other nodes
class Node {
  constructor(){
    this.props = {};
    this.params={}; // Standard way to send parameters to templates
    this.extra={}; // Standard way to save some extra data
    this.nodelist=[]; // Standard way to save multiple re results ****DEPRECATED****
    this.events=[]; // Event handler storing
  }
  static detectGender(element){
    if (element.parentNode!==undefined) return "NodeMale";
    else return "NodeFemale";
  }
  //This function is to quickly copy props from a source object. string numbers become numbers
  copyProperties(source, someKeys=null) {
    const isNumberField=(property)=>{
      let keyIndex=-1;
      if (this.parentNode && this.parentNode.childtablekeys && this.parentNode.childtablekeys.length>0) keyIndex=this.parentNode.childtablekeys.indexOf(property);
      if (keyIndex!==-1) return  this.parentNode.childtablekeysinfo[keyIndex]['Type'].includes("int") || this.parentNode.childtablekeysinfo[keyIndex]['Type'].includes("decimal");
    }
    for (const key in source.props) {
      if (Array.isArray(someKeys) && !someKeys.includes(key)) continue;
      let value=source.props[key];
      if (isNumberField(key)) {
        if (isNaN(Node.utils.parseNumber(source.props[key]))) continue;
         value=Node.utils.parseNumber(source.props[key]);
      }
      if (typeof value=="string" || typeof value=="number") this.props[key]=value;
    }
  }
  
  // It loads the object to the node. if the container object has some properites it doesn't remove them but replace if there is coincidence.
  // thisProperties argument defines which object props we wish to load
  load(source, thisProperties) {
    if (Array.isArray(source)) return; //load from children or relationships
    if (typeof source=="string") source=JSON.parse(source);
    if (typeof thisProperties=="string") thisProperties=[thisProperties];
    if (source.props) this.copyProperties(source, thisProperties);
    return this;
  }
  // The same as load but create a new node
  cloneNode(thisProperties) {
    var myClon=new this.constructor();
    myClon.load(this, thisProperties);
    return myClon;
  }
  // For descendent nodes
  loaddesc(source) {
    if (typeof source=="string") source=JSON.parse(source);
    return source;
  }
  // For ascendent nodes
  loadasc(source) {
    if (typeof source=="string") source=JSON.parse(source);
    return source;
  }
  avoidrecursion(){
    // Nothing but for future
  }

  arrayFromTree() {
    var container=[];
    container.push(this);
    if (this.constructor==NodeFemale) {
      for (var i=0; i<this.children.length; i++) {
        container=container.concat(this.children[i].arrayFromTree());
      }
    }
    else {
      for (var i=0; i<this.relationships.length; i++) {
        container=container.concat(this.relationships[i].arrayFromTree());
      }
    }
    return container;
  }
  addEventListener(type, listenerFunction, id, targetNode, oneTime) {
    if (!Array.isArray(type)) type=[type];
    type.forEach(mytype => {
      var myEvent={
        type: mytype,
        listenerFunction: listenerFunction,
        id: id,
        targetNode: targetNode,
        oneTime: oneTime
      };
      if (id) {
        var position=this.eventExists(myEvent);
        //if there is the event name we update it
        if (position!=-1) {
          this.events[position]=myEvent;
        }
        else this.events.push(myEvent);
      }
      else {
        this.events.push(myEvent);
      }
    });
  }
  removeEventListener(type, id, targetNode) {
    var index=null;
    while (index!=-1) {
      index=this.eventExists({type: type, id: id, targetNode: targetNode});
      if (index!=-1) this.events.splice(index,1);
    }
  }
  //Better for internal use only
  eventExists(event) {
    if (!event.id) return -1; //id is required to search coincidences
    var i=this.events.length;
    while(i--) {
      if (this.events[i].type==event.type && this.events[i].id==event.id) {
        if (event.targetNode) {
          //When loading nodes the object can be different so we check by props.id combined with the table name
          if (event.targetNode.constructor.name=="NodeFemale") {
            if (event.targetNode.props.name==this.events[i].targetNode.props.name
              && event.targetNode.partnerNode && event.targetNode.partnerNode.props.id == this.events[i].targetNode.partnerNode.props.id) {
              return i;
            }
          }
          else if (event.targetNode.props.id && this.events[i].targetNode.props.id==event.targetNode.props.id) {
            if (event.targetNode.parentNode && event.targetNode.parentNode.props.childtablename==this.events[i].targetNode.parentNode.props.childtablename) {
              return i;
            }
          }
        }
        else {
          return i;
        }
      }
    }
    return -1;
  }
  dispatchEvent(type, ...args) {
    let i=this.events.length;
    while (i>0) {
      if (this.events[i-1].type==type) {
        this.events[i-1].listenerFunction.call(this, ...args);
        if (this.events[i-1].oneTime==true) {
          this.events.splice(i-1,1);
          i--;
        }
      }
      i--;
    }
  }
  //This function is to detect numbers as arguments that are in string format
  static parseNumberAndString(x){
    const detectNumber=(x)=>{
      if (!isNaN(x) && !(x.trim())=='') {
        return true;
      }
      return false;
    }
    if (typeof x == "string" && detectNumber(x)) return Number(x);
    if (typeof x == "string") return x;
    if (typeof x == "number") return x;
    return '';
  }
}

class NodeFemale extends Node {
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

  load(source, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown) {
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
            if (isNaN(Node.utils.parseNumber(skeysinfo[i]))) chkeysinfo[i]=skeysinfo[i];
            else chkeysinfo[i]=Node.utils.parseNumber(skeysinfo[i]);
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
            if (isNaN(Node.utils.parseNumber(sskeysinfo[i]))) schkeysinfo[i]=sskeysinfo[i];
            else schkeysinfo[i]=Node.utils.parseNumber(sskeysinfo[i]);
          }
        }
        return schkeysinfo;
      });
    }
    if (levelup !== 0 && !(levelup < 0)) { //level null and undefined like infinite
      this.loadasc(source, levelup, thisPropertiesUp);
    }
    if (leveldown !== 0 && !(leveldown < 0)) {
      this.loaddesc(source, leveldown, thisPropertiesDown);
    }
    return this;
  }
  
  cloneNode(levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown) {
    var myClon=new this.constructor();
    myClon.load(this, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown);
    return myClon;
  }

  loaddesc(source, level, thisProperties) {
    super.loaddesc(source);
    this.children=[];
    if (level===0) return false;
    if (level) level--;
    let children;
    if (Array.isArray(source)) children=source; //Allow load from children
    else children=source.children;
    if (!children) return false;
    for (var i=0;i<children.length;i++) {
      var myConstructor=NodeMale;
      if (children[i].constructor.name!='Object') myConstructor=children[i].constructor;
      this.children[i]=new myConstructor;
      this.children[i].parentNode=this;
      this.children[i].load(children[i], 0, 0, thisProperties);
      this.children[i].loaddesc(children[i], level, thisProperties);
    }
  }

  loadasc(source, level, thisProperties) {
    super.loadasc(source);
    this.partnerNode=null;
    if (!source.partnerNode) return false;
    if (level===0) return false;
    if (level) level--;
    var myConstructor=NodeMale;
    if (source.partnerNode.constructor.name!='Object') myConstructor=source.partnerNode.constructor;
    this.partnerNode=new myConstructor;
    this.partnerNode.load(source.partnerNode, 0, 0, thisProperties);
    this.partnerNode.loadasc(source.partnerNode, level, thisProperties);
  }
  getMySysKey(type='foreignkey'){
    //Get foreign keys from the actual relatioship
    let foreignkey=null;
    for (const fkey of this.syschildtablekeysinfo) {
      if (fkey.parenttablename==this.props.parenttablename && fkey.type==type) {
	foreignkey=fkey.name;
        break;
      }
    }
    return foreignkey;
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

class NodeMale extends Node {
  constructor() {
    super();
    this.parentNode=null;
    this.relationships=[];
    //optional variable this.sort_order
  }

  //It loads data from a json string or an object
  load(source, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown) {
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
      this.loadasc(source, levelup, thisPropertiesUp);
    }
    if (leveldown !== 0 && !(leveldown < 0)) {
      this.loaddesc(source, leveldown, thisPropertiesDown);
    }
    return this;
  }
  
  cloneNode(levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown) {
    var myClon=new this.constructor();
    myClon.load(this, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown);
    return myClon;
  }
  
  loaddesc(source, level, thisProperties) {
    super.loaddesc(source);
    //if (source.sort_order) this.sort_order=Number(source.sort_order);
    if (level===0) return false;
    if (level) level--;
    let relationships;
    if (Array.isArray(source)) relationships=source; //Allow load from relationships
    else relationships=source.relationships;
    if (!relationships) return false;
    for (var i=0;i<relationships.length; i++) {
      var myConstructor=NodeFemale;
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

  loadasc(source, level, thisProperties) {
    super.loadasc(source);
    this.parentNode=null;
    //if (source.sort_order) this.sort_order=Number(source.sort_order);
    if (!source.parentNode) return false;
    if (level===0) return false;
    if (level) level--;
    if (Array.isArray(source.parentNode)) {
      this.parentNode=[];
      for (var i=0; i < source.parentNode.length; i++) {
        var myConstructor=NodeFemale;
        if (source.parentNode[i].constructor.name!='Object') myConstructor=source.parentNode[i].constructor;
        this.parentNode[i]=new myConstructor;
        this.parentNode[i].load(source.parentNode[i], 0, 0, thisProperties);
        this.parentNode[i].loadasc(source.parentNode[i], level, thisProperties);
      }
    }
    else {
      var myConstructor=NodeFemale;
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
