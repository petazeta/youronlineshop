// Properties is The var (object) that contains node db data
function Properties() {
}
// This function adds the object properties to itself and replace when they have the same key
Properties.prototype.cloneFromArray = function(obj) {
  Object.keys(obj).forEach((key) => {
    if (!obj.hasOwnProperty(key) || typeof obj[key] == 'object' || typeof obj[key] == 'function') return false;
    this[key] = obj[key];
    if (typeof this[key]=="string" &&  this[key].length > 0 && !isNaN(this[key])) 
      this[key]=Number(this[key]); // numbers in strings becomes just numbers
  });
};

function Node() {
  this.properties = new Properties();
  this.params={}; // Standard way to send parameters to templates
  this.extra={}; // Standard way to save some results
  this.nodelist=[]; // Standard way to save multiple re results
}

// It loads the node. if the container object has some properites it doesn't remove them but replace if there is coincidence.
// thisProperties argument defines which object properties we wish to load
Node.prototype.load=function(source, thisProperties) {
  if (typeof source=="string") source=JSON.parse(source);
  if (source.properties) {
    if (thisProperties) {
      if (typeof thisProperties=="string") thisProperties=[thisProperties];
      var myProperties={};
      for (var i=0; i<thisProperties.length; i++) {
	if (Object.keys(source.properties).includes(thisProperties[i])) {
	  myProperties[thisProperties[i]]=source.properties[thisProperties[i]];
	}
      }
      this.properties.cloneFromArray(myProperties);
    }
    else this.properties.cloneFromArray(source.properties);
  }
  if (source.nodelist && Array.isArray(source.nodelist)) {
    this.nodelist=source.nodelist.map((sourcenode) => {
      var myConstructor;
      if (sourcenode.constructor.name!='Object') {
        myConstructor=sourcenode.constructor;
      }
      else if (typeof sourcenode.parentNode != "undefined") {
        myConstructor=NodeMale;
      }
      else if (typeof sourcenode.partnerNode != "undefined") {
        myConstructor=NodeFemale;
      }
      else myConstructor=Node;
      var myNode=new myConstructor;
      myNode.load(sourcenode, thisProperties);
      return myNode;
    });
  }
  if (source.extra) {
    Object.keys(source.extra).forEach((key) => {
      this.extra[key]=source.extra[key];
    });
  }
}
// The same as load but create a new node
Node.prototype.cloneNode=function(levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown) {
  var myClon=new this.constructor();
  myClon.load(this, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown);
  return myClon;
}
// For descendent nodes
Node.prototype.loaddesc=function(source) {
  if (typeof source=="string") source=JSON.parse(source);
  return source;
}
// For ascendent nodes
Node.prototype.loadasc=function(source) {
  if (typeof source=="string") source=JSON.parse(source);
  return source;
}
// This function get a template from file.
// Templates cache can be filled completely at the first load by php config LOAD_TEMPLATES_AT_ONCE
// It contains a promise : so we must call method then();
Node.prototype.getTp=function (tpHref) {
  return new Promise((resolve, reject) => {
    if (Config && Config.templatesCacheOn!==false) {
      var tpid="tp" + tpHref.match(/(\w+)\..+/, '$1')[1];
      if (document.getElementById(tpid)) {
        var newElement=document.getElementById(tpid).cloneNode(true);
        newElement.id=null;
        resolve(newElement.content);
        this.dispatchEvent("getTp");
        return;
      }
    }
    var thisNode=this;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.addEventListener('load', function() {
      var myTp=document.createElement("template");
      myTp.innerHTML=this.responseText;
      // We save the template at the document head
      if (Config && Config.templatesCacheOn!==false) {
        myTp.id="tp" + tpHref.match(/(\w+)\..+/, '$1')[1];
        document.head.appendChild(myTp);
      }
      resolve(myTp.content.cloneNode(true));
      thisNode.dispatchEvent("getTp");
    });
    xmlhttp.onerror=function() {
      reject('loding template error');
    };
    xmlhttp.open("GET", tpHref, true);
    xmlhttp.send();
  });
};
Node.prototype.avoidrecursion=function(){
  // Nothing but for future
}
// This function regarding to de action it will take the node data needed to send it to the request function
Node.prototype.toRequestData=function(parameters) {
  switch (parameters.action) {
    case "load unlinked":
    case "load my partner":
    case "load root":
    case "load this relationship":
    case "load my childtablekeys":
    case "load all":
    case "remove all":
    case "load tables":
    case "init database":
    case "load children":
      var node=this.cloneNode(0, 0);
      break;
    case "load my relationships":
    case "load my children not":
    case "load my children":
    case "load my tree":
    case "delete my tree":
    case "load myself":
      var node=this.cloneNode(1, 0, "id", "id");
      break;
    case "edit my sort_order":
    case "delete my link":
    case "add my link":
      var node=this.cloneNode(3, 0, "id", "id"); // we need the parent->partner (and parent->partner->parent for safety check)
      break;
    case "add myself":
      var node=this.cloneNode(3, 0, null, "id"); // we need the parent->partner (and parent->partner->parent for safety check)
      break;
    case "add my children":
      var node=this.cloneNode(2, 1, "id", "id"); // we need the partner (and partner->parent for safety check)
      break;
    case "delete my children":
      var node=this.cloneNode(2, 1, "id", "id"); // we need the partner (and partner->parent for safety check)
      break;
    case "edit my properties":
      var node=this.cloneNode(1, 0, null, "id");
      break;
    case "load my parent":
    case "load my tree up":
      var node=this.cloneNode(1, 1, "id");
      break;
    case "add my tree":
      var node=this.cloneNode(3, null, null, "id"); // we need the parent->partner (and parent->partner->parent for safety check)
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


//This function serves to add scope and prepare an html template or a dom element.
//In case is a dom element it will actually render scripts but if it is a template is prerender untill it is actually inserted as a dom
//node.render(domelement), node.render(scriptelement)
Node.prototype.prerender = function (tp, params) {
  if (!params) params={};
  if (!tp) tp=this.myTp;
  if (tp.nodeType==1 && tp.tagName=="TEMPLATE") {
    tp=tp.content; //templates are not valid just its content
  }
  //for the templates we let original unmodified
  if (tp.nodeType==11) tp=tp.cloneNode(true);
  var elementsToBeModified=[];
  var myElements=[];
  //myElements.push(tp); //To get the outerHTML in case there is not template DEPRECATED
  if (tp.tagName=="SCRIPT") myElements.push(tp); //For when there is no descendents
  else myElements=Array.from(tp.querySelectorAll("SCRIPT")); //inner elements
  for (var i=0; i<myElements.length; i++) {  
    //To avoid script execution limitation for XMLHttpRequest we make a copy of the script to a "brand new" script node
    //Also to execute script <script> for an already loaded element when we use render
    var myScript=document.createElement("SCRIPT");
    var scriptTop="var thisScript=document.currentScript;";
    scriptTop +="var thisElement=thisScript.previousElementSibling; var thisNode=thisScript.thisNode; var thisParams=thisScript.thisParams;"
    myScript.textContent="(function(){" + scriptTop + myElements[i].textContent + "})();"; //adding scope (encapsulation) so this variables are local and can't be modified from another scripts.
    myScript.thisNode=this;
    myScript.thisParams=params;
    //document.thisScript.push(myScript);
    var container=myElements[i].parentNode;  //!!Document Fragment is not an Element => *parentNode*
    container.insertBefore(myScript, myElements[i])
    container.removeChild(myElements[i]);
  }
  return tp;
};
//When it is not a template we are actually executing scripts
Node.prototype.render = function (myElement) {
  return this.prerender(myElement);
};

Node.prototype.refreshView=function (container, tp, params) {
  return new Promise((resolve, reject) => {
    if (!container) container=this.myContainer; //Default value for container
    else this.myContainer=container;
    if (!tp) tp=this.myTp; //Default value for
    else this.myTp=tp;
    
    if (!container) reject('No container');
    if (container.nodeType==1) container.classList.add("refreshviewloader");
    var removecontent=function(){
      this.myContainer.innerHTML='';
    }
    removecontent.oneTime=true;
    this.addEventListener('beforeAppendThis', removecontent);
    this.appendThis(container, tp, params).then((myNode)=>{
      resolve(myNode);
      myNode.dispatchEvent("refreshView");
      if (container.nodeType==1) container.classList.remove("refreshviewloader");
    });
  });
};
Node.prototype.appendThis=function (container, tp, params) {
  return new Promise((resolve, reject) => {
    ((tp)=>{
      return new Promise((resolve, reject) => {
        if (typeof tp=="string") {
          this.getTp(tp).then((myTp) => {
            resolve(myTp);
          }).catch((err)=>{console.log(err)});
        }
        else {
          if (tp) {
            if (tp.tagName && tp.tagName=="TEMPLATE") {
              tp=tp.content;
            }
          }
          resolve(tp);
        }
      });
    })(tp).then((myTp) => {
      var clone=this.prerender(myTp, params);
      this.dispatchEvent("beforeAppendThis");
      container.appendChild(clone);
      if (Config && typeof Config.nodeOnAppend == 'function') {
        Config.nodeOnAppend.call(this);
      }
      resolve(this);
      this.dispatchEvent("appendThis");
    });
  });
};
//This function write a template record (refreshing) for each property
Node.prototype.refreshPropertiesView=function (container, tp, params) {
  return new Promise((resolve, reject) => {
    var myPropContainer=container;
    if (!myPropContainer) myPropContainer=this.propertiesContainer;
    var removecontent=function(){
      this.propertiesContainer.innerHTML='';
    }
    removecontent.oneTime=true;
    this.addEventListener('beforeAppendProperties', removecontent);
    this.appendProperties(container, tp, params).then(() => {
      resolve(this);
      this.dispatchEvent("refreshPropertiesView");
    });
  });
};
//This function write a template record for each property
Node.prototype.appendProperties = function (container, tp, params) {
  return new Promise((resolve, reject) => {
    ((tp) => {
      return new Promise((resolve, reject) => {
        if (typeof tp=="string") {
          this.getTp(tp).then((myTp) => {
            if (myTp) this.propertyTp=myTp.cloneNode(true);
            resolve(this.propertyTp);
          }).catch((err)=>{console.log(err)});
        }
        else {
          if (tp) {
            if (tp.tagName && tp.tagName=="TEMPLATE") {
              tp=tp.content;
            }
            this.propertyTp=tp;
          }
          resolve(this.propertyTp);
        }
      });
    })(tp).then((myTp) => {
      if (this.parentNode && this.parentNode.childtablekeys) {
        var myKeys=this.parentNode.childtablekeys;
      }
      else {
        var myKeys=[];
        Object.keys(this.properties).forEach((key) => {
          if (!this.properties.isProperty(this.properties, key)) return false;
          myKeys.push(key);
        });
      }
      myKeys.forEach((key) => {
        if (key=="id") return false;
        var thiscol=myTp.cloneNode(true);
        thiscol.firstElementChild.setAttribute("data-property", key);
        var myParams={...params, editpropertyname: key};
        thiscol=this.prerender(thiscol, myParams); // we must refresh the filling of the data also cloneNode does not copy extra function and data
        if (container) {
          this.propertiesContainer=container;
        }
        this.dispatchEvent("beforeAppendProperties");
        this.propertiesContainer.appendChild(thiscol);
      });
      resolve();
      this.dispatchEvent("appendProperties");
    });
  });
}

Node.prototype.refreshChildrenView=function (container, tp, params) {
  return new Promise((resolve, reject) => {
    if (!container) container=this.childContainer;
    else this.childContainer=container;
    if (!tp) tp=this.myChildTp; //Default value for
    else this.myChildTp=tp;
    if (container.nodeType==1) container.classList.add("refreshchildrenloader");
    var removecontent=function(){
      this.childContainer.innerHTML='';
    }
    removecontent.oneTime=true;
    this.addEventListener('beforeAppendChildren', removecontent);
    this.appendChildren(container, tp, params).then(()=>{
      resolve(this);
      this.dispatchEvent("refreshChildrenView");
      if (container.nodeType==1) container.classList.remove("refreshchildrenloader");
    });
  });
};

Node.prototype.appendChildren=function (container, tp, params) {
  return new Promise((resolve, reject) => {
    ((tp) => {
      return new Promise((resolve, reject) => {
        if (typeof tp=="string") {
          this.getTp(tp).then((myTp) => {
            resolve(myTp);
          }).catch((err)=>{console.log(err)});
        }
        else {
          if (tp) {
            if (tp.tagName && tp.tagName=="TEMPLATE") {
              tp=tp.content;
            }
          }
          resolve(tp);
        }
      });
    })(tp).then((myTp) => {
      if (this.children.length>0) {
        this.children=this.children.sort(function(a,b){return a.sort_order-b.sort_order});
        var renderedChildren=document.createDocumentFragment();
        for (var i=0; i<this.children.length; i++) {
          renderedChildren.appendChild(this.children[i].prerender(myTp, params));
        }
      }
      this.dispatchEvent("beforeAppendChildren");
      if (renderedChildren) {
        container.appendChild(renderedChildren);
      }
      if (Config && typeof Config.nodeOnAppend == 'function') {
        Config.nodeOnAppend.call(this);
      }
      resolve();
      this.dispatchEvent("appendChildren");
    });
  });
};

Node.prototype.writeProperty=function(container, property, attribute, onEmptyValueText) {
  if (!onEmptyValueText) onEmptyValueText=Config.onEmptyValueText;
  var myAttribute="innerHTML"; //by default
  if (attribute) myAttribute=attribute;
  else if (container.tagName=="INPUT") myAttribute="value";
  if (!property) {
    var keys=Object.keys(this.properties);
    if (this.parentNode && this.parentNode.childtablekeys && this.parentNode.childtablekeys.length>0) {
      keys=this.parentNode.childtablekeys;
    }
    property = keys.find(key => key!='id');
  }
  //In case there is no property and it is not a field we assume a default value
  if (!this.properties[property] && this.properties[property]!==0 && myAttribute!='value') {
    if (this.parentNode && this.parentNode.childtablekeys && this.parentNode.childtablekeysinfo) {
      var pos = this.parentNode.childtablekeys.indexOf(property);
      if (pos!=-1 && this.parentNode.childtablekeysinfo[pos]['Type'].indexOf("int")!=-1) {
	//Is a integer
	if (!onEmptyValueText) container[myAttribute]="0";
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

//It loads a node tree from a php script that privides it in json format.
Node.prototype.loadfromhttp=function (requestData) {
  return new Promise((resolve, reject) => {
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
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
      thisNode.load(responseobj);
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
      resolve(thisNode);
      thisNode.dispatchEvent("loadfromhttp");
      if (responseobj.extra && responseobj.extra.error==true) {
        console.log("Error response", requesterFile, requestAction);
        console.log(responseobj, this.responseText);
        //we check if user session expired and that is the cause of error
        if (responseobj.extra.errorinfo && responseobj.extra.errorinfo.type=='database safety' && 
        webuser.properties.id) {
          webuser.checkSessionActive().then(function(myresponse){
            if (myresponse===false){
              alert('USER SESSION EXPIRED, PAGE WILL RELOAD');
              window.location.reload();
            }
          });
        }
        reject(thisNode);
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
  });
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
// If function oneTime==true, this event execs just once and noother event is fired
Node.prototype.dispatchEvent=function (eventName, args) {
  if (this.events && this.events[eventName]) {
    var i=this.events[eventName].length;
    while(i--) {
      if (typeof this.events[eventName][i]!="function") console.log("no funcion " + this.events[eventName][i]);
      this.events[eventName][i].apply(this, args);
      if (this.events[eventName][i].oneTime==true) {
        this.events[eventName].splice(i,1);
        break;
      }
    }
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
}
NodeFemale.prototype=Object.create(Node.prototype); //The prototype of NodeFemale is an instance of Node.prototype
NodeFemale.prototype.constructor=NodeFemale;

NodeFemale.prototype.load=function(source, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown) {
  if (this.constructor.name!='NodeFemale' && this.constructor.prototype.hasOwnProperty('load')) this.constructor.prototype.load.call(this, source);
  else Node.prototype.load.call(this, source); //No thisProperties filter for females
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
  if (this.constructor.name!='NodeFemale' && this.constructor.prototype.hasOwnProperty('loaddesc')) source=this.constructor.prototype.loaddesc.call(this, source);
  else source=Node.prototype.loaddesc.call(this, source);
  
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

NodeFemale.prototype.loadasc=function(source, level, thisProperties) {
  if (this.constructor.name!='NodeFemale' && this.constructor.prototype.hasOwnProperty('loadasc')) source=this.constructor.prototype.loadasc.call(this, source);
  else source=Node.prototype.loadasc.call(this, source);
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

NodeFemale.prototype.avoidrecursion=function(){
  if (this.constructor.name!='NodeFemale' && this.constructor.prototype.hasOwnProperty('avoidrecursion')) this.constructor.prototype.avoidrecursion.call(this);
  else Node.prototype.avoidrecursion.call(this);
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
  if (this.constructor.name!='NodeFemale' && this.constructor.prototype.hasOwnProperty('avoidrecursion')) this.constructor.prototype.avoidrecursion.call(this);
  else Node.prototype.avoidrecursion.call(this);
  this.partnerNode=null;
  this.children.forEach(function(child) {
    child.avoidrecursiondown();
  });
}
NodeFemale.prototype.avoidrecursionup=function(){
  if (this.constructor.name!='NodeFemale' && this.constructor.prototype.hasOwnProperty('avoidrecursion')) this.constructor.prototype.avoidrecursion.call(this);
  else Node.prototype.avoidrecursion.call(this);
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

NodeFemale.prototype.removeChild=function(obj) {
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
  if (this.constructor.name!='NodeMale' && this.constructor.prototype.load!=NodeMale.prototype.load) {
    this.constructor.prototype.load.call(this, source, thisProperties);
  }
  else Node.prototype.load.call(this, source, thisProperties);
  if (source.sort_order) this.sort_order=Number(source.sort_order);
  if (levelup !== 0 && !(levelup < 0)) { //level null and undefined like infinite
    this.loadasc(source, levelup, thisPropertiesUp);
  }
  if (leveldown !== 0 && !(leveldown < 0)) {
    this.loaddesc(source, leveldown, thisPropertiesDown);
  }
}
NodeMale.prototype.loaddesc=function(source, level, thisProperties) {
  if (this.constructor.name!='NodeMale' && this.constructor.prototype.hasOwnProperty('loaddesc')) source=this.constructor.prototype.loaddesc.call(this, source);
  else source=Node.prototype.loaddesc.call(this, source);
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

NodeMale.prototype.getNextChild=function(obj) {
  return this.relationships[0].getChild(obj);
}
NodeMale.prototype.appendNextChildren=function(container, tp, reqlistener, append) {
  return this.relationships[0].appendChildren(container, tp, reqlistener, append);
}

NodeMale.prototype.loadasc=function(source, level, thisProperties) {
  if (this.constructor.name!='NodeMale' && this.constructor.prototype.hasOwnProperty('loadasc')) source=this.constructor.prototype.loadasc.call(this, source);
  else source=Node.prototype.loadasc.call(this, source);
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

NodeMale.prototype.avoidrecursion=function() {
  if (this.constructor.name!='NodeMale' && this.constructor.prototype.hasOwnProperty('avoidrecursion'))  this.constructor.prototype.avoidrecursion.call(this);
  else Node.prototype.avoidrecursion.call(this);
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
  if (this.constructor.name!='NodeMale' && this.constructor.prototype.hasOwnProperty('avoidrecursion')) this.constructor.prototype.avoidrecursion.call(this);
  else Node.prototype.avoidrecursion.call(this);
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
  if (this.constructor.name!='NodeMale'  && this.constructor.prototype.hasOwnProperty('avoidrecursion')) this.constructor.prototype.avoidrecursion.call(this);
  else Node.prototype.avoidrecursion.call(this);
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
