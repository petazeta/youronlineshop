var templatesCache=[];

function Properties() {
}
Properties.prototype.cloneFromArray = function(obj, clone) {
  if (clone) {
    Object.keys(this).forEach.call(this, function(key){
      if (this.isProperty(this, key)) delete(this[key]);
    });
  }
  var myThis=this;
  Object.keys(obj).forEach(function(key){
    if (!myThis.isProperty(obj, key)) return false;
    myThis[key] = obj[key];
    if (typeof myThis[key]=="string" &&  myThis[key].length > 0 && !isNaN(myThis[key])) 
      myThis[key]=Number(myThis[key]); //numbers in strings becomes just numbers
  });
};
Properties.prototype.isProperty = function(obj, key) {
  if (!obj.hasOwnProperty(key)) return false;
  if (typeof obj[key] == 'object') return false; //We copy just values but not objects unless it is an array of objetcts
  if (typeof obj[key] == 'function') return false; //We copy just values not methods
  return true;
};

function Node() {
  this.properties = new Properties();
  this.myContainer=null;
  this.xmlTp=null;
  this.myTp=null;
  //optional variable this.extra
  //optional variable this.nodelist
}
Node.prototype.config={onAppend: null};
// nodeType 1 the properties are not in properties var
Node.prototype.load=function(source, thisProperties, nodeType) {
  if (typeof source=="string") source=JSON.parse(source);
  if (source.properties) {
    if (thisProperties) {
      if (typeof thisProperties=="string") thisProperties=[thisProperties];
      var myProperties={};
      for (var i=0; i<thisProperties.length; i++) {
	if (Object.keys(source.properties).indexOf(thisProperties[i])!=-1) {
	  myProperties[thisProperties[i]]=source.properties[thisProperties[i]];
	}
      }
      this.properties.cloneFromArray(myProperties);
    }
    else this.properties.cloneFromArray(source.properties);
  }
  if (nodeType==1) {
    this.properties=source;
  }
  if (source.nodelist && Array.isArray(source.nodelist)) {
    this.nodelist=[];
    for (var i=0; i<source.nodelist.length; i++) {
      var listNode=new Node();
      if (typeof source.nodelist[i].parentNode != "undefined") {
        listNode=new NodeMale();
      }
      else if (typeof source.nodelist[i].partnerNode != "undefined") {
        listNode=new NodeFemale();
      }
      listNode.load(source.nodelist[i]);
      this.nodelist[i]=listNode;
    }
  }
  if (source.extra) this.extra=source.extra;
}
Node.prototype.cloneNode=function(levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown) {
  var myClon=new this.constructor();
  myClon.load(this, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown);
  return myClon;
}

Node.prototype.loaddesc=function(source) {
  if (typeof source=="string") source=JSON.parse(source);
  return source;
}
Node.prototype.loadasc=function(source) {
  if (typeof source=="string") source=JSON.parse(source);
  return source;
}
Node.prototype.getTp=function (tpHref, reqlistener) {
  if (supportsTemplate() && Config.loadTemplatesAtOnce!==false) {
    var tpid="tp" + tpHref.match(/(\w+)\..+/, '$1')[1];
    if (document.getElementById(tpid)) {
      var newElement=document.getElementById(tpid).cloneNode(true);
      newElement.id=null;
      this.xmlTp=getTpContent(newElement);
      if (reqlistener) {
	reqlistener.call(this);
      }
      this.dispatchEvent("getTp");
      return;
    }
  }
  function getTpCache(tpHref) {
    var cached=false;
    for (var i=0; i<templatesCache.length; i++) {
      if (templatesCache[i].href==tpHref) {
	cached=templatesCache[i].value;
	break;
      }
    }
    return cached;
  }
  var cached=false;
  if (Config.templatesCacheOn!==false) {
    cached=getTpCache(tpHref);
  }
  if (cached) {
    this.xmlTp=cached.cloneNode(true);
  }
  else {
    var thisNode=this;
    var xmlhttp;
    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp = new XMLHttpRequest();
    }
    else {
      // code for IE6, IE5
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onload=function() {
      var container=document.createElement("template");
      container.innerHTML=this.responseText;
      //When the tp content is just a template we get that tp content
      if (getTpContent(container).querySelectorAll("template").length==1) thisNode.xmlTp=getTpContent(getTpContent(container).querySelector("template"));
      else thisNode.xmlTp=getTpContent(container);
      var newTp={};
      newTp[tpHref]=thisNode.xmlTp.cloneNode(true);
      if (Config.templatesCacheOn!==false) {
	templatesCache.push(newTp);
      }
      if (reqlistener) {
	reqlistener.call(thisNode);
      }
      thisNode.dispatchEvent("getTp");
    }
    xmlhttp.open("GET", tpHref, true);
    xmlhttp.send();
  }
};
Node.prototype.avoidrecursion=function(){
  if (this.extra) this.extra=null;
}
Node.prototype.toRequestData=function(parameters) {
  switch (parameters.action) {
    case "load unlinked":
    case "load my partner":
    case "load root":
    case "load this relationship":
    case "load my childtablekeys":
    case "load all":
    case "load tables":
    case "load children":
      var node=this.cloneNode(0, 0);
      break;
    case "load my relationships":
    case "load my children not":
    case "load my children":
    case "load my tree":
    case "delete my tree":
    case "delete my children":
    case "load myself":
      var node=this.cloneNode(1, 0, "id", "id");
      break;
    case "edit my sort_order":
    case "delete my link":
    case "add my link":
      var node=this.cloneNode(2, 0, "id", "id"); //we need the parent->partner
      break;
    case "add myself":
      var node=this.cloneNode(2, 0, null, "id"); //we need the parent->partner
      break;
    case "edit my properties":
      var node=this.cloneNode(1, 0, null, "id");
      break;
    case "load my parent":
    case "load my tree up":
      var node=this.cloneNode(1, 1, "id");
      break;
    case "add my tree":
      var node=this.cloneNode(2, null, null, "id"); //we need the parent->partner
      break;
    default:
      var node=this.cloneNode();
  }
  // Push our data into json
  node.avoidrecursion();
  return node;
}

Node.prototype.toRequestFormData=function(parameters) {
  var FD = new FormData();
  if (Array.isArray(parameters.nodes)) {
    var parametersarray=parameters.parameters;
    var nodes=parameters.nodes;
    var data=[];
    var myparameters=parametersarray;
    for (var i=0; i<nodes.length; i++) {
      data.push(nodes[i].toRequestData(parametersarray[i]));
    }
  }
  else {
    var data=this.toRequestData(parameters);
    var myparameters=parameters;
  }
  // Push our data into our FormData object
  FD.append("json", JSON.stringify(data));
  FD.append("parameters", JSON.stringify(myparameters));
  return FD;
}


//This function serves to render html template or a dom element:
//node.render(domelement), node.render(scriptelement)
Node.prototype.render = function (tp) {
  if (!tp) tp=this.myTp;
  if (tp.nodeType==3 && tp.tagName=="TEMPLATE" && supportsTemplate()) {
    tp=tp.content; //templates are not valid just its content
  }
  var elementsToBeModified=[];
  var myElements=[];
  //myElements.push(tp); //To get the outerHTML in case there is not template DEPRECATED
  if (tp.tagName=="SCRIPT") myElements.push(tp); //For when there is no descendents
  else myElements=Array.from(tp.querySelectorAll("SCRIPT")); //inner elements
  //document.thisScript=[];
  //get inside Tps
  if (!supportsTemplate()) {
    //We still dont execute scripts inside of cascading templates (IE)
    var inTps=tp.querySelectorAll("TEMPLATE");
    if (inTps.length) {
      console.log(inTps.length, inTps);
      for (var i=1; i<inTps.length; i++) { //we exclude the master tp cause somehow querySelectorAll(template) get it also
	var inTpElements=Array.from(inTps[i].querySelectorAll("SCRIPT"));
	for (var k=0; k<inTpElements.length; k++) {
	  var pos=myElements.indexOf(inTpElements[k]);
	  if (pos!=-1) {
	    console.log("encontrado", myElements[pos], myElements.length);
	    myElements.splice(pos, 1);
	  }
	}
      }
    }
  }
  for (var i=0; i<myElements.length; i++) {  
    //To avoid script execution limitation for XMLHttpRequest we make a copy of the script to a "brand new" script node
    //Also to execute script <script> for an already loaded element when we use render
    var myScript=document.createElement("SCRIPT");
    if (document.currentScript===undefined) { //IE
      var currTime= new Date().getTime();
      function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
      }
      var uniqueId=currTime + getRandomInt(99999);
      uniqueId=uniqueId.toString(32);
      myScript.id=uniqueId;
      var scriptTop="var thisScript=document.getElementById('" + uniqueId + "');"; 
    }
    else {
      var scriptTop="var thisScript=document.currentScript;";
    }
    scriptTop +="var thisElement=thisScript.previousElementSibling; var thisNode=thisScript.thisNode;"
    myScript.textContent="(function(){" + scriptTop + myElements[i].textContent + "})();"; //adding scope (encapsulation) so this variables are local and can't be modified from another scripts.
    myScript.thisNode=this;
    //document.thisScript.push(myScript);
    var container=myElements[i].parentNode;  //!!Document Fragment is not an Element => *parentNode*
    container.insertBefore(myScript, myElements[i])
    container.removeChild(myElements[i]);
  }
  return tp;
};

Node.prototype.refreshView=function (container, tp, myReqlistener) {
  if (container) this.myContainer=container;
  this.myContainer.classList.add("refreshviewloader");
  this.myContainer.innerHTML='';
  var newReqlistener=function(){
    if (myReqlistener) myReqlistener.call(this);
    this.dispatchEvent("refreshView");
    this.myContainer.classList.remove("refreshviewloader");
  }
  this.appendThis(container, tp, newReqlistener);
};

Node.prototype.appendThis=function (container, tp, reqlistener) {
  var refresh=function() {
    var clone=this.myTp.cloneNode(true);
    this.render(clone);
    if (container) {
      this.myContainer=container;
    }
    this.myContainer.appendChild(clone);
    if (typeof this.config.onAppend == 'function') {
      this.config.onAppend.call(this);
    }
    if (reqlistener) {
      reqlistener.call(this);
    }
    this.dispatchEvent("appendThis");
  };
  if (typeof tp=="string") {
    this.getTp(tp, function() {
      this.myTp=this.xmlTp.cloneNode(true);
      refresh.call(this);
    });
  }
  else {
    if (tp) {
      if (tp.tagName && tp.tagName=="TEMPLATE") {
	tp=getTpContent(tp);
      }
      this.myTp=tp;
    }
    refresh.call(this);
  }
};
Node.prototype.refreshPropertiesView=function (container, tp, myReqlistener) {
  if (container) this.propertiesContainer=container;
  this.propertiesContainer.innerHTML='';

  var newReqlistener=function(){
    if (myReqlistener) myReqlistener.call(this);
    this.dispatchEvent("refreshPropertiesView");
  }
  this.appendProperties(container, tp, newReqlistener);
};
//This function write a template record for each property
Node.prototype.appendProperties = function (container, tp, reqlistener) {
  if (container) this.propertiesContainer=container;
  if (typeof tp=="string") {
    this.getTp(tp, function() {
      this.propertyTp=this.xmlTp;
      refresh.call(this);
    });
  }
  else {
    if (tp) {
      if (tp.tagName && tp.tagName=="TEMPLATE") tp=getTpContent(tp);
      this.propertyTp=tp;
    }
    refresh.call(this);
  }
  function refresh() {
    var myThis=this;
    if (this.parentNode && this.parentNode.childtablekeys) {
      var myKeys=this.parentNode.childtablekeys;
    }
    else {
      var myKeys=[];
      Object.keys(this.properties).forEach(function(key){
	if (!myThis.properties.isProperty(myThis.properties, key)) return false;
	myKeys.push(key);
      });
    }
    myKeys.forEach(function(key){
      if (key=="id") return false;
      myThis.editpropertyname=key; //for knowing the key and for the edition facility
      var thiscol=myThis.propertyTp.cloneNode(true);
      thiscol.firstElementChild.setAttribute("data-property", key);
      myThis.render(thiscol); //we must refresh the filling of the data also cloneNode does not copy extra function and data
      container.appendChild(thiscol);
    });
    if (reqlistener) {
      reqlistener.call(this);
    }
    this.dispatchEvent("appendProperties");
  }
}

// Set children results from the given arguments and refresh the view. It uses this.childTp and this.childContainer
Node.prototype.renderChildren=function (tp) {
  if (!tp) tp=this.childTp;
  var children="children";
  if (this.constructor.name=="NodeMale") children="relationships";
  if (this[children]["length"]==0) return false;
  this[children]=this[children].sort(function(a,b){return a.sort_order-b.sort_order});
  var myreturn=document.createDocumentFragment();
  for (var i=0; i<this[children].length; i++) {
    myreturn.appendChild(this[children][i].render(tp.cloneNode(true)));
  }
  return myreturn;
};

Node.prototype.refreshChildrenView=function (container, tp, myReqlistener) {
  if (container) this.childContainer=container;
  this.childContainer.classList.add("refreshchildrenloader");
  this.childContainer.innerHTML='';
  
  var newReqlistener=function(){
    if (myReqlistener) myReqlistener.call(this);
    this.dispatchEvent("refreshChildrenView");
    this.childContainer.classList.remove("refreshchildrenloader");
  }
  this.appendChildren(container, tp, newReqlistener);
};

Node.prototype.appendChildren=function (container, tp, reqlistener) {
  if (container) this.childContainer=container;
  var refresh=function(){
    var renderedChildren=this.renderChildren();
    if (renderedChildren) this.childContainer.appendChild(renderedChildren);
    //Lets give some time for the scripts appended to be executed
    var myNode=this;
    window.setTimeout(function(){
      if (reqlistener) {
	reqlistener.call(myNode);
      }
      myNode.dispatchEvent("appendChildren");
    }, 1000);
  };
  if (typeof tp=="string") {
    this.getTp(tp, function() {
      this.childTp=this.xmlTp;
      refresh.call(this);
    });
  }
  else {
    if (tp) {
      if (tp.tagName && tp.tagName=="TEMPLATE") tp=getTpContent(tp);
      this.childTp=tp;
    }
    refresh.call(this);
  }
};

Node.prototype.writeProperty=function(container, property, attribute, onEmptyValueText) {
  if (!onEmptyValueText) onEmptyValueText=Config.onEmptyValueText;
  var myAttribute="innerHTML"; //by default
  if (container.tagName=="INPUT") myAttribute="value";
  if (attribute) myAttribute=attribute;
  if (!property) {
    property=this.getFirstPropertyKey();
  }
  //In case there is no property we assume a default value
  if (!this.properties[property] && this.properties[property]!==0) {
    if (this.parentNode && this.parentNode.childtablekeys && this.parentNode.childtablekeysinfo) {
      var pos = this.parentNode.childtablekeys.indexOf(property);
      if (pos!=-1 && this.parentNode.childtablekeysinfo[pos]['Type'].indexOf("int")!=-1) {
	//Is a integer
	container[myAttribute]="0";
      }
      else {
	container[myAttribute]=onEmptyValueText;
      }
    }
    else {
      container[myAttribute]=onEmptyValueText;
    }
  }
  else {
    container[myAttribute]=this.properties[property];
  }
}

Node.prototype.getFirstPropertyKey=function(){
  var keys;
  if (this.parentNode && this.parentNode.childtablekeys && this.parentNode.childtablekeys.length>0) {
    keys=this.parentNode.childtablekeys;
  }
  else {
    keys=Object.keys(this.properties);
  }
  for (var i=0; i<keys.length; i++) {
    if (keys[i]!="id") {
      return keys[i];
    }
  }
}

//It loads a node tree from a php script that privides it in json format. nodeType==1 then json is not node
Node.prototype.loadfromhttp=function (requestData, reqlistener, nodeType) {
  var xmlhttp;
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  }
  else {
    // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  var thisNode=this;
  var request=null, requesterFile=null, requestAction=null;
  xmlhttp.addEventListener('load', function() {
    try {
      var responseobj=JSON.parse(this.responseText);
    }
    catch(err) {
      console.log(requesterFile, requestAction);
      var parcialRes=this.responseText.replace(/.+\n/g,"");
      console.log(this.responseText);
      console.log(JSON.parse(parcialRes));
      throw err;
    }
    thisNode.load(responseobj, null, nodeType);
    if (Config.logRequests==true) {
      var childtablename= responseobj.properties && responseobj.properties.childtablename ? responseobj.properties.childtablename :
      (responseobj.parentNode && responseobj.parentNode.properties && responseobj.parentNode.childtablename) ?
      responseobj.parentNode.properties.childtablename : null;
      
      console.log(requesterFile);
      if (childtablename) console.log(childtablename.substr(6));
      if (requestAction) console.log(requestAction);
      console.log(responseobj);
      console.log(thisNode);
    }
    if (reqlistener) {
      reqlistener.call(thisNode);
    }
    thisNode.dispatchEvent("loadfromhttp");
    if (responseobj.extra && responseobj.extra.error==true) {
      console.log("Error response", requesterFile, requestAction);
      console.log(responseobj, this.responseText);
    }
  });
  xmlhttp.onreadystatechange=function() {  
    if (xmlhttp.readyState==4 && xmlhttp.status!==200) {     
      console.log('Oops! Something went wrong with the XMLHttpRequest.');
    }
  }
  xmlhttp.overrideMimeType("application/json");
  if (typeof requestData=="string") { //request with no data or with ?vars
    requesterFile=requestData;
    xmlhttp.open("GET", requesterFile, true);
    xmlhttp.send();
  }
  else if (typeof requestData=="object") {
    if (requestData.constructor === Object) {
      requesterFile=requestData.requesterFile;
      request=this.toRequestFormData(requestData);
      requestAction=requestData.action;
    }
    else if (requestData.tagName=="FORM") {
      requesterFile=requestData.action;
      request=new FormData(requestData);
    }
    else { //it is formdata
      request=requestData;
      requesterFile=requestData.action;
    }
    if (!requesterFile) requesterFile=Config.requestFilePath;
    
    xmlhttp.open("POST",requesterFile, true);
    xmlhttp.send(request); //sending just formData (archives)
  }
};
Node.prototype.addEventListener=function (eventsNames, listenerFunction, id, targetNode) {
  if (!this.events) this.events={};
  if (!Array.isArray(eventsNames)) eventsNames=[eventsNames];
  if (id) listenerFunction.id=id;
  if (targetNode) listenerFunction.targetNode=targetNode;
  for (var i=0; i<eventsNames.length; i++) {
    if (id) {
      var position=this.eventExists(eventsNames[i], id, targetNode);
      //if there is the event name we update it
      if (position!==false) {
	this.events[eventsNames[i]][position]=listenerFunction;
	continue;
      }
    }
    if (!this.events[eventsNames[i]]) this.events[eventsNames[i]]=[];
    this.events[eventsNames[i]].push(listenerFunction);
  }
}
Node.prototype.removeEventListener=function (eventName, id, targetNode) {
  if (!id && !targetNode) return false; //id || targetNode is required
  if (this.events && this.events[eventName]) {
    var i=this.events[eventName].length;
    while(i--) {
      if (id && this.events[eventName][i].id==id || !id) {
	if (targetNode && this.events[eventName][i].targetNode==targetNode || !targetNode)
	{
	  this.events[eventName].splice(i,1);
	}
      }
    }
  }
}
//Better for internal use only
Node.prototype.eventExists=function (eventName, id, targetNode) {
  if (!id && !targetNode) return false; //id || targetNode is required
  if (this.events && this.events[eventName]) {
    var i=this.events[eventName].length;
    while(i--) {
      if (id && this.events[eventName][i].id==id || !id) {
	if (targetNode)
	{
	  //When loading nodes the object can be different so we check by properties.id combined with the table name
	  if (targetNode.constructor.name=="NodeFemale") {
	    if (targetNode.properties.name==this.events[eventName][i].targetNode.properties.name
	      && targetNode.partnerNode && targetNode.partnerNode.properties.id == this.events[eventName][i].targetNode.partnerNode.properties.id) {
	      return i;
	    }
	  }
	  else if (targetNode.properties.id && this.events[eventName][i].targetNode.properties.id==targetNode.properties.id) {
	    if (targetNode.parentNode && targetNode.parentNode.properties.childtablename==this.events[eventName][i].targetNode.parentNode.properties.childtablename) {
	      return i;
	    }
	  }
	}
	else {
	  return i;
	}
      }
    }
  }
  return false;
}
Node.prototype.dispatchEvent=function (eventName, args) {
  if (this.events && this.events[eventName]) {
    var i=this.events[eventName].length;
    while(i--) {
      if (typeof this.events[eventName][i]!="function") console.log("no funcion " + this.events[eventName][i]);
      this.events[eventName][i].apply(this, args);
    }
  }
}

Node.prototype.getMyDomNodes=function () {
  if (this.parentNode && this.parentNode.childContainer) {
    //Get index
    var index=this.parentNode.children.indexOf(this);
    var length=1;
    if (this.parentNode.childTp.nodeType==11) { //document fragment
      length=this.parentNode.childTp.childNodes.length; //there is a fragment. IE doesn't support children property
      for (var i=0; i<this.parentNode.childTp.childNodes.length; i++) {
	if (this.parentNode.childTp.childNodes[i].nodeType!=1) length--;
      }
    }
    var elements=Array.from(this.parentNode.childContainer.children);
    for (var i=0; i<elements.length; i++) {
      if (elements[i].tagName=="SCRIPT") elements.splice(i,1);
    }
    if (elements.length==1 && this.parentNode.children.length>1) {
      //in this case we are wrapped the elements in a table
      if (elements[0].tagName=="TABLE") {
	var myTable=elements[0];
	elements=[];
	for (var i=0; i<myTable.rows.length; i++) {
	  for (var j=0; j<myTable.rows[i].cells.length; j++) {
	    elements.push(myTable.rows[i].cells[j]);
	  }
	}
      }
    }
    var startindex=index*length;
    var endindex=startindex + length;
    return elements.slice(startindex, endindex);
  }
  else if (this.myContainer) {
      return Array.from(this.myContainer.children);
  }
  else if (this.childContainer) {
      return Array.from(this.childContainer.children);
  }
}
Node.prototype.arrayFromTree=function () {
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

function NodeFemale() {
  Node.call(this);
  this.partnerNode=null;
  this.children=[];
  this.childtablekeys=[];
  this.childtablekeysinfo=[];
  this.syschildtablekeys=[];
  this.syschildtablekeysinfo=[];
  this.childTp=null;
  this.childContainer=null;
}
NodeFemale.prototype=Object.create(Node.prototype);
NodeFemale.prototype.constructor=NodeFemale;

NodeFemale.prototype.load=function(source, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown) {
  Node.prototype.load.call(this, source); //No thisProperties filter for females
  if (source.childtablekeys) {
    for (var i=0;i<source.childtablekeys.length;i++) {
      this.childtablekeys[i]=source.childtablekeys[i];
    }
  }
  if (source.childtablekeysinfo) {
    for (var i=0;i<source.childtablekeysinfo.length;i++) {
      this.childtablekeysinfo[i]=new Properties();
      this.childtablekeysinfo[i].cloneFromArray(source.childtablekeysinfo[i]);
    }
  }
  if (source.syschildtablekeys) {
    for (var i=0;i<source.syschildtablekeys.length;i++) {
      this.syschildtablekeys[i]=source.syschildtablekeys[i];
    }
  }
  if (source.syschildtablekeysinfo) {
    for (var i=0;i<source.syschildtablekeysinfo.length;i++) {
      this.syschildtablekeysinfo[i]=new Properties();
      this.syschildtablekeysinfo[i].cloneFromArray(source.syschildtablekeysinfo[i]);
    }
  }
  if (levelup !== 0 && !(levelup < 0)) { //level null and undefined like infinite
    this.loadasc(source, levelup, thisPropertiesUp);
  }
  if (leveldown !== 0 && !(leveldown < 0)) {
    this.loaddesc(source, leveldown, thisPropertiesDown);
  }
}

NodeFemale.prototype.loaddesc=function(source, level, thisProperties) {
  source=Node.prototype.loaddesc.call(this, source);
  if (level===0) return false;
  if (level) level--;
  if (!source.children) return false;
  for (var i=0;i<source.children.length;i++) {
    this.children[i]=new NodeMale;
    this.children[i].parentNode=this;
    this.children[i].load(source.children[i], 0, 0, thisProperties);
    this.children[i].loaddesc(source.children[i], level, thisProperties);
  }
}

NodeFemale.prototype.loadasc=function(source, level, thisProperties) {
  source=Node.prototype.loadasc.call(this, source);
  if (!source.partnerNode) return false;
  if (level===0) return false;
  if (level) level--;
  if (Array.isArray(source.partnerNode)) {
    if (!Array.isArray(this.partnerNode)) this.partnerNode=[this.partnerNode];
    for (var i=0; i < source.partnerNode.length; i++) {
      this.partnerNode[i]=new NodeMale();
      this.partnerNode[i].load(source.partnerNode[i], 0, 0, thisProperties);
      this.partnerNode[i].loadasc(source.partnerNode[i], level, thisProperties);
    }
  }
  else {
    if (!this.partnerNode) this.partnerNode=new NodeMale();
    this.partnerNode.load(source.partnerNode, 0, 0, thisProperties);
    this.partnerNode.loadasc(source.partnerNode, level, thisProperties);
  }
}

NodeFemale.prototype.avoidrecursion=function(){
  Node.prototype.avoidrecursion.call(this);
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
NodeFemale.prototype.avoidrecursiondown=function(){
  Node.prototype.avoidrecursion.call(this);
  this.partnerNode=null;
  this.children.forEach(function(child) {
    child.avoidrecursiondown();
  });
}
NodeFemale.prototype.avoidrecursionup=function(){
  Node.prototype.avoidrecursion.call(this);
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
NodeFemale.prototype.execfuncdown=function(myfunc){
  this.partnerNode=null;
  this.children.forEach(function(child) {
    myfunc(child);
    child.execfuncdown(myfunc);
  });
}
NodeFemale.prototype.getrootnode=function() {
  if (!this.partnerNode) return this;
  else if (this.partnerNode==this) return this;
  else return this.partnerNode.getrootnode();
}

NodeFemale.prototype.replaceChild=function(oldchild,newchild) {
    var i= this.children.length;
    while(i--) {
      if (this.children[i].properties.id == oldchild.properties.id) {
        this.children[i]=newchild;
        this.children[i].parentNode=this;
      }
    }
};

NodeFemale.prototype.updateChild=function(obj) {
  var i= this.children.length;
  while(i--) {
    if (this.children[i].properties.id == obj.properties.id) {
      var myelement=this.children[i];
      break;
    }
  }
  if (!myelement) return false;
  myelement.properties.cloneFromArray(obj.properties);
  myelement.extra=obj.extra;
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

NodeFemale.prototype.removeChild=function(obj) {
  var i= this.children.length;
  while(i--) {
    if (obj.sort_order && (this.children[i].sort_order > obj.sort_order)) {
      this.children[i].sort_order--;
    }
    if (this.children[i].properties.id==obj.properties.id) this.children.splice(i,1);
  }
};

NodeFemale.prototype.addChild=function(obj) {
  var i= this.children.length;
  while(i--) {
    if (obj.sort_order && (this.children[i].sort_order >= obj.sort_order)) {
      this.children[i].sort_order++;
    }
  }
  this.children.push(obj);
  obj.parentNode=this;
  return obj;
};

NodeFemale.prototype.getChild=function(obj) {
  if (!obj) return this.children[0];
  var keyname=Object.keys(obj)[0];
  var i= this.children.length;
  while(i--) {
    if (Object.keys(this.children[i].properties).indexOf(keyname)!=-1 && this.children[i].properties[keyname]==obj[keyname])
      return this.children[i];
  }
  return false;
};

function NodeMale() {
  Node.call(this);
  this.parentNode=null;
  this.relationships=[];
  //optional variable this.sort_order
}
NodeMale.prototype=Object.create(Node.prototype);
NodeMale.prototype.constructor=NodeMale;

  //It loads data from a json string or an object
NodeMale.prototype.load=function(source, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown) {
  Node.prototype.load.call(this, source, thisProperties);
  if (source.sort_order) this.sort_order=Number(source.sort_order);
  if (levelup !== 0 && !(levelup < 0)) { //level null and undefined like infinite
    this.loadasc(source, levelup, thisPropertiesUp);
  }
  if (leveldown !== 0 && !(leveldown < 0)) {
    this.loaddesc(source, leveldown, thisPropertiesDown);
  }
}
NodeMale.prototype.loaddesc=function(source, level, thisProperties) {
  source=Node.prototype.loaddesc.call(this, source);
  if (source.sort_order) this.sort_order=Number(source.sort_order);
  if (level===0) return false;
  if (level) level--;
  if (!source.relationships) return false;
  for (var i=0;i<source.relationships.length; i++) {
    this.relationships[i]=new NodeFemale();
    this.relationships[i].partnerNode=this;
    this.relationships[i].load(source.relationships[i], 0, 0, thisProperties);
    this.relationships[i].loaddesc(source.relationships[i], level, thisProperties);
  }
}

NodeMale.prototype.getNextChild=function(obj) {
  return this.relationships[0].getChild(obj);
}
NodeMale.prototype.appendNextChildren=function(container, tp, reqlistener, append) {
  return this.relationships[0].appendChildren(container, tp, reqlistener, append);
}

NodeMale.prototype.loadasc=function(source, level, thisProperties) {
  source=Node.prototype.loadasc.call(this, source);
  if (source.sort_order) this.sort_order=Number(source.sort_order);
  if (!source.parentNode) return false;
  if (level===0) return false;
  if (level) level--;
  if (Array.isArray(source.parentNode)) {
    if (!Array.isArray(this.parentNode)) this.parentNode=[this.parentNode];
    for (var i=0; i < source.parentNode.length; i++) {
      this.parentNode[i]=new NodeFemale();
      this.parentNode[i].load(source.parentNode[i], 0, 0, thisProperties);
      this.parentNode[i].loadasc(source.parentNode[i], level, thisProperties);
    }
  }
  else {
    if (!this.parentNode) this.parentNode=new NodeFemale();
    this.parentNode.load(source.parentNode,0,0,thisProperties);
    this.parentNode.loadasc(source.parentNode, level, thisProperties);
  }
}

NodeMale.prototype.avoidrecursion=function() {
  Node.prototype.avoidrecursion.call(this);
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
NodeMale.prototype.avoidrecursionup=function(){
  Node.prototype.avoidrecursion.call(this);
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
NodeMale.prototype.avoidrecursiondown=function(){
  Node.prototype.avoidrecursion.call(this);
  this.parentNode=null;
  this.relationships.forEach(function(rel){
    rel.avoidrecursiondown();
  });
}
NodeMale.prototype.execfuncdown=function(myfunc){
  this.relationships.forEach(function(rel){
    myfunc(rel);
    rel.execfuncdown(myfunc);
  });
}
NodeMale.prototype.cloneRelationship=function(){
  return this.cloneRelationships(null, "parent")[0];
}
NodeMale.prototype.cloneRelationships=function(selecting, keyword) {
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
};

NodeMale.prototype.addRelationship=function(rel) {
  this.relationships.push(rel);
  rel.partnerNode=this;
  return rel;
}

NodeMale.prototype.getrootnode=function() {
  if (!this.parentNode) return this;
  else if (this.parentNode==this) return this;
  else return this.parentNode.getrootnode();
}

NodeMale.prototype.getRelationship=function(obj) {
  if (!obj) return this.relationships[0];
  if (typeof obj == "string") obj={name: obj};
  var keyname=Object.keys(obj)[0];
  var i= this.relationships.length;
  while(i--) {
    if (Object.keys(this.relationships[i].properties).indexOf(keyname)!=-1 && this.relationships[i].properties[keyname]==obj[keyname])
      return this.relationships[i];
  }
  return false;
};
