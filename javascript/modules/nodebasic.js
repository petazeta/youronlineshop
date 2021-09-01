import {parseNumber} from './datainput.js'; 
//Node is the basic object, it will contain data and relationship links to other nodes
export default class NodeBasic{
  constructor(){
    this.props = {};
    this.params={}; // Standard way to send parameters to templates
    this.extra={}; // Standard way to save some extra data
    this.nodelist=[]; // Standard way to save multiple re results ****DEPRECATED****
    //this.events=[]; // Event handler storing
    //this.initEventListener=initEventListener;
    //this.initEventListener();
  }
  static detectGender(element){
    if (element.parentNode!==undefined) return "male";
    else return "female";
  }
  detectMyGender(){
    return this.constructor.detectGender(this);
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
        if (isNaN(parseNumber(source.props[key]))) continue;
         value=parseNumber(source.props[key]);
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
    let container=[];
    container.push(this);
    if (this.constructor.detectGender(this)=="female") {
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
}

