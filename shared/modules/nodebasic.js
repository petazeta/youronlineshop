import {parseNumber} from './datainput.js'; 
//Node is the basic object, it will contain data and relationship links to other nodes
export default class NodeBasic{
  constructor(props){
    this.props= {};
    if (props) Object.assign(this.props, props);
  }
  //This function is to quickly copy props from a source object. string numbers become numbers
  static copyProperties(target, source, someKeys=null) {
    const isNumberField=(property)=>{
      let keyIndex=-1;
      if (target.parentNode && target.parentNode.childtablekeys && target.parentNode.childtablekeys.length>0) keyIndex=target.parentNode.childtablekeys.indexOf(property);
      if (keyIndex!==-1) return  target.parentNode.childtablekeysinfo[keyIndex]['Type'].includes("int") || target.parentNode.childtablekeysinfo[keyIndex]['Type'].includes("decimal");
    }
    let sourceProps=source;
    if (source.props) sourceProps=source.props;
    for (const key in sourceProps) {
      if (Array.isArray(someKeys) && !someKeys.includes(key)) continue;
      let value=sourceProps[key];
      if (isNumberField(key)) {
        if (isNaN(parseNumber(sourceProps[key]))) continue;
         value=parseNumber(sourceProps[key]);
      }
      let targetProps=target;
      if (target.props) targetProps=target.props;
      if (typeof value=="string" || typeof value=="number") targetProps[key]=value;
      if (typeof value=="object" && value instanceof Date) targetProps[key]=value.toLocaleString();
    }
  }
  
  loadProperties(source, someKeys=null) {
    NodeBasic.copyProperties(this, source, someKeys);
  }
  
  // It loads the object to the node. if the container object has some properites it doesn't remove them but replace if there is coincidence.
  // thisProperties argument defines which object props we wish to load
  load(source, thisProperties) {
    if (Array.isArray(source)) return; //load from children or relationships
    if (typeof source=="string") source=JSON.parse(source);
    if (typeof thisProperties=="string") thisProperties=[thisProperties];
    if (source.props) this.loadProperties(source, thisProperties);
    return this;
  }
  // The same as load but create a new node
  cloneNode(thisProperties) {
    return new this.constructor().load(this, thisProperties);
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
}

