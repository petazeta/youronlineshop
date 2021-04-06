//Node is the basic object, it will contain data and relationship links to other nodes
class Node {
  constructor(){
    this.properties = {};
    this.params={}; // Standard way to send parameters to templates
    this.extra={}; // Standard way to save some extra data
    this.nodelist=[]; // Standard way to save multiple re results ****DEPRECATED****
    this.events=[]; // Event handler storing
  }

  //This function is to quickly copy properties from a source object. string numbers become numbers
  //if the source is an array, it takes it as the properties
  copyProperties(source, someKeys=null) {
    Node.copyCleanValues(source.properties, this.properties, someKeys);
  }
  
  // It loads the object to the node. if the container object has some properites it doesn't remove them but replace if there is coincidence.
  // thisProperties argument defines which object properties we wish to load
  load(source, thisProperties) {
    if (typeof source=="string") source=JSON.parse(source);
    if (typeof thisProperties=="string") thisProperties=[thisProperties];
    
    if (source.properties) this.copyProperties(source, thisProperties);

    if (source.extra) {
      Object.keys(source.extra).forEach((key) => {
        this.extra[key]=source.extra[key];
      });
    }
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
          //When loading nodes the object can be different so we check by properties.id combined with the table name
          if (event.targetNode.constructor.name=="NodeFemale") {
            if (event.targetNode.properties.name==this.events[i].targetNode.properties.name
              && event.targetNode.partnerNode && event.targetNode.partnerNode.properties.id == this.events[i].targetNode.partnerNode.properties.id) {
              return i;
            }
          }
          else if (event.targetNode.properties.id && this.events[i].targetNode.properties.id==event.targetNode.properties.id) {
            if (event.targetNode.parentNode && event.targetNode.parentNode.properties.childtablename==this.events[i].targetNode.parentNode.properties.childtablename) {
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
        this.events[i-1].listenerFunction.call(this, this, ...args);
        if (this.events[i-1].oneTime==true) {
          this.events.splice(i-1,1);
          i--;
        }
      }
      i--;
    }
  }
  //This function is to quickly copy plain properties from one object to another
  static copyCleanValues(sourceObj, targetObj=null, copyKeys=null){
    if (targetObj===null) targetObj={};
    for (let key in sourceObj) {
      if (Array.isArray(copyKeys) && !copyKeys.includes(key)) continue;
      if (typeof sourceObj[key] == "string" && !isNaN(sourceObj[key]) && !sourceObj[key]=='') targetObj[key]=Number(sourceObj[key]);
      else targetObj[key]=sourceObj[key];
    }
    return targetObj;
  }
}

class NodeFemale extends Node {
  constructor() {
    super();
    this.partnerNode=null;
    this.children=[];
    this.childtablekeys=[];
    this.childtablekeysinfo=[];
    this.syschildtablekeys=[];
    this.syschildtablekeysinfo=[];
  }

  load(source, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown) {
    super.load(source); //No thisProperties filter for females
    if (source.childtablekeys) {
      for (var i=0;i<source.childtablekeys.length;i++) {
        this.childtablekeys[i]=source.childtablekeys[i];
      }
    }
    if (source.childtablekeysinfo) {
      for (var i=0;i<source.childtablekeysinfo.length;i++) {
        this.childtablekeysinfo[i]=Node.copyCleanValues(source.childtablekeysinfo[i]);
      }
    }
    if (source.syschildtablekeys) {
      for (var i=0;i<source.syschildtablekeys.length;i++) {
        this.syschildtablekeys[i]=source.syschildtablekeys[i];
      }
    }
    if (source.syschildtablekeysinfo) {
      for (var i=0;i<source.syschildtablekeysinfo.length;i++) {
        this.syschildtablekeysinfo[i]=Node.copyCleanValues(source.syschildtablekeysinfo[i]);
      }
    }
    if (levelup !== 0 && !(levelup < 0)) { //level null and undefined like infinite
      this.loadasc(source, levelup, thisPropertiesUp);
    }
    if (leveldown !== 0 && !(leveldown < 0)) {
      this.loaddesc(source, leveldown, thisPropertiesDown);
    }
  }
  
  cloneNode(levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown) {
    var myClon=new this.constructor();
    myClon.load(this, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown);
    return myClon;
  }

  loaddesc(source, level, thisProperties) {
    super.loaddesc(source);
    
    if (level===0) return false;
    if (level) level--;
    if (!source.children) return false;
    for (var i=0;i<source.children.length;i++) {
      var myConstructor=NodeMale;
      if (source.children[i].constructor.name!='Object') myConstructor=source.children[i].constructor;
      this.children[i]=new myConstructor;
      this.children[i].parentNode=this;
      this.children[i].load(source.children[i], 0, 0, thisProperties);
      this.children[i].loaddesc(source.children[i], level, thisProperties);
    }
  }

  loadasc(source, level, thisProperties) {
    super.loadasc(source);
    if (!source.partnerNode) return false;
    if (level===0) return false;
    if (level) level--;
    if (Array.isArray(source.partnerNode)) {
      if (!Array.isArray(this.partnerNode)) this.partnerNode=[this.partnerNode];
      for (var i=0; i < source.partnerNode.length; i++) {
        var myConstructor=NodeMale;
        if (source.partnerNode[i].constructor.name!='Object') myConstructor=source.partnerNode[i].constructor;
        this.partnerNode[i]=new myConstructor;
        this.partnerNode[i].load(source.partnerNode[i], 0, 0, thisProperties);
        this.partnerNode[i].loadasc(source.partnerNode[i], level, thisProperties);
      }
    }
    else {
      var myConstructor=NodeMale;
      if (source.partnerNode.constructor.name!='Object') myConstructor=source.partnerNode.constructor;
      if (!this.partnerNode) this.partnerNode=new myConstructor;
      this.partnerNode.load(source.partnerNode, 0, 0, thisProperties);
      this.partnerNode.loadasc(source.partnerNode, level, thisProperties);
    }
  }

  avoidrecursion(){
    super.avoidrecursion();
    if (this.partnerNode) {
      if (Array.isArray(this.partnerNode)) {
        this.partnerNode.forEach(function (pNode) {
          pNode.avoidrecursionup();
        });
      }
      else {
        this.partnerNode.avoidrecursionup();
      }
    }
    this.children.forEach(function(child) {
      child.avoidrecursiondown();
    });
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
      if (Array.isArray(this.partnerNode)) {
        this.parentNode.forEach(function(pNode) {
          pNode.avoidrecursionup();
        });
      }
      else this.partnerNode.avoidrecursionup();
    }
  }
  execfuncdown(myfunc){
    this.partnerNode=null;
    this.children.forEach(function(child) {
      myfunc(child);
      child.execfuncdown(myfunc);
    });
  }
  //skipping female
  getrootnode(tableName) {
    if (!this.partnerNode) return this;
    else return this.partnerNode.getrootnode(tableName);
  }

  replaceChild(oldchild,newchild) {
    var i= this.children.length;
    while(i--) {
      if (this.children[i].properties.id == oldchild.properties.id) {
        this.children[i]=newchild;
        this.children[i].parentNode=this;
      }
    }
  }

  updateChild(obj) {
    var i= this.children.length;
    while(i--) {
      if (this.children[i].properties.id == obj.properties.id) {
        var myelement=this.children[i];
        break;
      }
    }
    if (!myelement) return false;
    
    myelement.copyProperties(obj);
    Object.keys(obj.extra).forEach((key) => {
      myelement.extra[key]=obj.extra[key];
    });
    if (obj.sort_order && obj.sort_order!=myelement.sort_order) {
      var i= this.children.length;
      while(i--) {
        if (this.children[i].sort_order == obj.sort_order) {
          this.children[i].sort_order=myelement.sort_order;
          break;
        }
      }
      myelement.sort_order=obj.sort_order;
    }
    return myelement;
  }

  removeChild(obj) {
    var removed=false;
    for (var i=0; i<this.children.length; i++) {
      if (this.children[i]==obj || (obj.properties.id && this.children[i].properties.id==obj.properties.id)) {
        this.children.splice(i,1);
        removed=true;
        break;
      }
    }
    if (removed && obj.sort_order) {
      var i= this.children.length;
      while(i--) {
        if (this.children[i].sort_order > obj.sort_order) {
          this.children[i].sort_order--;
        }
      }
    }
  }

  addChild(obj) {
    var i= this.children.length;
    while(i--) {
      if (obj.sort_order && (this.children[i].sort_order >= obj.sort_order)) {
        this.children[i].sort_order++;
      }
    }
    this.children.push(obj);
    obj.parentNode=this;
    return obj;
  }

  getChild(obj) {
    if (!obj) return this.children[0];
    if (typeof obj=="string") obj={id: obj}; //Default string is id
    var keyname=Object.keys(obj)[0];
    var i= this.children.length;
    while(i--) {
      if (Object.keys(this.children[i].properties).indexOf(keyname)!=-1 && this.children[i].properties[keyname]==obj[keyname])
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
    super.load(source, thisProperties);
    if (source.sort_order) this.sort_order=Number(source.sort_order);
    if (levelup !== 0 && !(levelup < 0)) { //level null and undefined like infinite
      this.loadasc(source, levelup, thisPropertiesUp);
    }
    if (leveldown !== 0 && !(leveldown < 0)) {
      this.loaddesc(source, leveldown, thisPropertiesDown);
    }
  }
  
  cloneNode(levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown) {
    var myClon=new this.constructor();
    myClon.load(this, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown);
    return myClon;
  }
  
  loaddesc(source, level, thisProperties) {
    super.loaddesc(source);
    if (source.sort_order) this.sort_order=Number(source.sort_order);
    if (level===0) return false;
    if (level) level--;
    if (!source.relationships) return false;
    for (var i=0;i<source.relationships.length; i++) {
      var myConstructor=NodeFemale;
      if (source.relationships[i].constructor.name!='Object') myConstructor=source.relationships[i].constructor;
      this.relationships[i]=new myConstructor;
      this.relationships[i].partnerNode=this;
      this.relationships[i].load(source.relationships[i], 0, 0, thisProperties);
      this.relationships[i].loaddesc(source.relationships[i], level, thisProperties);
    }
  }

  getNextChild(obj) {
    return this.relationships[0].getChild(obj);
  }

  loadasc(source, level, thisProperties) {
    super.loadasc(source);
    if (source.sort_order) this.sort_order=Number(source.sort_order);
    if (!source.parentNode) return false;
    if (level===0) return false;
    if (level) level--;
    if (Array.isArray(source.parentNode)) {
      if (!Array.isArray(this.parentNode)) this.parentNode=[this.parentNode];
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
      if (!this.parentNode) this.parentNode=new myConstructor;
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
  cloneRelationship(){
    return this.cloneRelationships(null, "parent")[0];
  }
  cloneRelationships(selecting, keyword) {
    if (typeof selecting=="string") selecting={name: selecting};
    if (!selecting) {
      selecting={};
    }
    var cloned=[];
    switch (keyword) {
      case "all":
        for (var i=0; i<this.parent.partner.relationships.length; i++) {
          cloned[i]=this.parent.partner.relationships[i].cloneNode(0);
        }
        break;
      case "parent":
        cloned[0]=this.parentNode.cloneNode(0);
        break;
      default:
        for (var i=0; i<this.parentNode.partnerNode.relationships.length; i++) {
          var keys=Object.keys(selecting);
          var passed=true;
          for (var j=0; j<keys.length; j++) {
            if (this.parentNode.partnerNode.relationships[i].properties[keys[j]]!=selecting[keys[j]]) {
              passed=false
              break;
            }
          }
          if (passed) cloned.push(this.parentNode.partnerNode.relationships[i].cloneNode(0));
        }
    }
    //We don't everwrite existing rels (push)
    for (var i=0; i<cloned.length; i++) {
      this.relationships.push(cloned[i]);
      cloned[i].partnerNode=this;
    }
    return this.relationships;
  }

  addRelationship(rel) {
    this.relationships.push(rel);
    rel.partnerNode=this;
    return rel;
  }
  //gets root (root is a male node)
  //if tableName, get first belonging tablename
  getrootnode(tableName) {
    if (this.parentNode && this.parentNode.partnerNode &&
      (!tableName || this.parentNode.properties.childtablename!=tableName)) {
      return this.parentNode.partnerNode.getrootnode(tableName);
    }
    else if (!tableName || this.parentNode && this.parentNode.properties.childtablename==tableName) return this;
  }

  getRelationship(obj) {
    if (!obj) return this.relationships[0];
    if (typeof obj == "string") obj={name: obj};
    var keyname=Object.keys(obj)[0];
    var i= this.relationships.length;
    while(i--) {
      if (Object.keys(this.relationships[i].properties).indexOf(keyname)!=-1 && this.relationships[i].properties[keyname]==obj[keyname])
        return this.relationships[i];
    }
    return false;
  }
}
