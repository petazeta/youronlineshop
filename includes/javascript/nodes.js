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
}

Node.prototype.load=function(source) {
  if (typeof source=="string") source=JSON.parse(source);
  if (source.properties)
    this.properties.cloneFromArray(source.properties);
  if (source.extra) this.extra=source.extra;
}
Node.prototype.loadasc=function(source) {
  if (typeof source=="string") source=JSON.parse(source);
  if (source.properties)
    this.properties.cloneFromArray(source.properties);
  if (source.extra) this.extra=source.extra;
}
Node.prototype.cloneNode=function(level) {
  if (level!==true) level=false;
  var myClon=new this.constructor();
  myClon.load(this, level);
  return myClon;
}
Node.prototype.getTp=function (tpHref, reqlistener) {
  var xmlhttp=new XMLHttpRequest();
  var thisNode=this;
  xmlhttp.onload=function() {
    if (this.responseText.search(/^\W*\<tbody/i)!=-1) var myNode=document.createElement("table");
    else if (this.responseText.search(/^\W*\<tr/i)!=-1) var myNode=document.createElement("tbody");
    else if (this.responseText.search(/^\W*\<td/i)!=-1) var myNode=document.createElement("tr");
    else if (this.responseText.search(/^\W*\<li/i)!=-1) var myNode=document.createElement("ul");
    else if (this.responseText.search(/^\W*\<option/i)!=-1) var myNode=document.createElement("select");
    else var myNode=document.createElement("div");
    myNode.innerHTML=this.responseText;
    thisNode.xmlTp=myNode.firstElementChild;
    if (thisNode.xmlTp.tagName=="TEMPLATE") {thisNode.xmlTp=thisNode.xmlTp.content;}
    reqlistener.call(thisNode);
    if (thisNode.events && thisNode.events.onGetTp) {
      var i=thisNode.events.onGetTp.length;
      while(i--) {
        thisNode.events.onGetTp[i].call(thisNode);
      }
    }
  }
  xmlhttp.open("GET",tpHref,true);
  xmlhttp.send();
};
Node.prototype.toRequestFormData=function(parameters) {
  switch (parameters.action) {
    case "load myself":
    case "load my children":
    case "load my relationships":
    case "load my tree":
    case "load my partner":
    case "delete my tree":
    case "add myself":
    case "edit my sort_order":
    case "delete my link":
    case "load unlinked":
    case "load my children not":
      var node=new this.constructor;
      node.loadasc(this,2);
      break;
    case "edit my properties":
      var node=new this.constructor;
      node.loadasc(this,2); //needs to for safety module
      break;
    case "load my childtablekeys":
    case "load root":
    case "myself":
    case "load this relationship":
      var node=new this.constructor;
      node.load(this, 0);
      break;
    case "load my parent":
    case "load my tree up":
      var node=new this.constructor;
      node.load(this,1);
      node.loadasc(this,2);
      break;
    case "load all":
      var node=new this.constructor;
      node.loadasc(this,1);
      break;
    case "with asc":
      var node=new this.constructor;
      node.loadasc(this,2);
      break;
    case "just asc":
      var node=new this.constructor;
      node.loadasc(this,2);
      //next line is not good
      node.properties.forEach(function(property){
	delete(property);
      });
      break;
    case "all":
      var node=new this.constructor;
      node.load(this);
      node.avoidrecursion();
      node.loadasc(this,3);
      break;
    default:
      var node=new this.constructor;
      node.load(this);
      node.avoidrecursion();
      node.loadasc(this);
  }
  //we make a criv of properties not needed
  if (parameters.action!="add myself" && parameters.action!="edit my properties") {
    var myPointer=node;
    while (myPointer) {
      if (myPointer.constructor.name=="NodeMale") {
	var nodeId=myPointer.properties.id;
	myPointer.properties=new Properties();
	myPointer.properties.id=nodeId;
	myPointer=myPointer.parentNode;
      }
      else myPointer=myPointer.partnerNode;
    }
  }
  var FD = new FormData();
  // Push our data into our FormData object
  FD.append("json", JSON.stringify(node));
  FD.append("parameters", JSON.stringify(parameters));
  return FD;
}


//This function serves to render html template or a dom element:
//node.render(domelement), node.render(scriptelement)
Node.prototype.render = function (tp) {
  if (!tp) tp=this.myTp;
  var elementsToBeModified=[];
  var myElements=[];
  myElements.push(tp);
  myElements=myElements.concat(Array.from(tp.querySelectorAll("*"))); //inner elements
  for (var i=0; i<myElements.length; i++) {
    if (myElements[i].tagName=="SCRIPT") {
      //To avoid script execution limitation for XMLHttpRequest we make a copy of the script to a "brand new" script node
      //Also to execute script <script> for an already loaded element when we use render
      var myScript=document.createElement("SCRIPT");
      var scriptTop="var thisElement=document.currentScript.previousElementSibling; var thisNode=document.currentScript.thisNode;";
      myScript.textContent="(function(){" + scriptTop + myElements[i].textContent + "})();"; //adding scope (encapsulation) so this variables are local and can't be modified from another scripts.
      myScript.thisNode=this;
      var container=myElements[i].parentNode;  //!!Document Fragment is not an Element => *parentNode*
      container.insertBefore(myScript, myElements[i])
      container.removeChild(myElements[i]);
      continue;
    }
    if (typeof myElements[i].getAttribute != 'function') continue;
    if (typeof myElements[i].getAttribute("data-js")!="string" || !myElements[i].getAttribute("data-js")) continue;
    var execeval=function(thisNode,thisElement,myjs) {
      try {
        eval(myjs);
      } catch(e) {
        var err = e.constructor(e.message + ' (Error in Evaled Script) '  + '\nScript content: \n' + myjs);
        throw err;
      }
    }
    execeval(this,myElements[i],myElements[i].getAttribute("data-js")); //this way we will have a local copy of node and element so if there are onclick=funcion(){thisElement... it will get the correct one)
  }
  return tp;
};

Node.prototype.refreshView=function (container, tp, reqlistener) {
  if (container) this.myContainer=container;
  this.myContainer.innerHTML='';
  this.appendThis(container, tp, reqlistener);
    if (this.events && this.events.refreshView) {
      var i=this.events.refreshView.length;
      while(i--) {
        this.events.refreshView[i].call(this);
      }
    }
};

Node.prototype.appendThis=function (container, tp, reqlistener) {
  if (container) this.myContainer=container;
  var refresh=function() {
    var clone=this.myTp.cloneNode(true);
    this.render(clone);
    this.myContainer.appendChild(clone);
    
    if (reqlistener) reqlistener.call(this);
    if (this.events && this.events.appendThis) {
      var i=this.events.appendThis.length;
      while(i--) {
        this.events.appendThis[i].call(this);
      }
    }
  };
  if (typeof tp=="string") {
    this.getTp(tp, function() {
      this.myTp=this.xmlTp;
      refresh.call(this);
    });
  }
  else {
    if (tp) {
      if (tp.tagName && tp.tagName=="TEMPLATE") tp=tp.content;
      this.myTp=tp;
    }
    refresh.call(this);
  }
};

Node.prototype.refreshPropertiesView=function (container, tp, reqlistener) {
  if (container) this.propertiesContainer=container;
  this.propertiesContainer.innerHTML='';
  this.appendProperties(container, tp, reqlistener);
    if (this.events && this.events.refreshPropertiesView) {
      var i=this.events.refreshPropertiesView.length;
      while(i--) {
        this.events.refreshPropertiesView[i].call(this);
      }
    }
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
      if (tp.tagName && tp.tagName=="TEMPLATE") tp=tp.content;
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
	var index=myKeys.push({})-1;
	myKeys[index].Field=key;
      });
    }
    myKeys.forEach(function(tableKey){
      if (tableKey.Field=="id") return false;
      myThis.editpropertyname=tableKey.Field; //for knowing the key and for the edition facility
      var thiscol=myThis.propertyTp.cloneNode(true);
      myThis.render(thiscol); //we must refresh the filling of the data also cloneNode does not copy extra function and data
      container.appendChild(thiscol);
    });
    if (reqlistener) reqlistener.call(this);
    if (this.events && this.events.appendProperties) {
      var i=this.events.appendProperties.length;
      while(i--) {
        this.events.appendProperties[i].call(this);
      }
    }
  }
}

// Set children results from the given arguments and refresh the view. It uses this.childTp and this.childContainer
Node.prototype.renderChildren=function (tp) {
  if (!tp) tp=this.childTp;
  var children="children";
  if (this.constructor.name=="NodeMale") children="relationships";
  this[children]=this[children].sort(function(a,b){return a.sort_order-b.sort_order});
  var myreturn=document.createDocumentFragment();
  for (var i=0; i<this[children].length; i++) {
    myreturn.appendChild(this[children][i].render(tp.cloneNode(true)));
  }
  return myreturn;
};

Node.prototype.refreshChildrenView=function (container, tp, reqlistener) {
  if (container) this.childContainer=container;
  this.childContainer.innerHTML='';
  this.appendChildren(container, tp, reqlistener);
    if (this.events && this.events.refreshChildrenView) {
      var i=this.events.refreshChildrenView.length;
      while(i--) {
        this.events.refreshChildrenView[i].call(this);
      }
    }
};

Node.prototype.appendChildren=function (container, tp, reqlistener) {
  if (container) this.childContainer=container;
  var refresh=function(){
    this.childContainer.appendChild(this.renderChildren());
    if (reqlistener) reqlistener.call(this);
    if (this.events && this.events.appendChildren) {
      var i=this.events.appendChildren.length;
      while(i--) {
        this.events.appendChildren[i].call(this);
      }
    }
  };
  if (typeof tp=="string") {
    var loadedtp=function() {
      this.childTp=this.xmlTp;
      refresh.call(this);
    };
    this.getTp(tp, loadedtp);
  }
  else {
    if (tp) {
      if (tp.tagName && tp.tagName=="TEMPLATE") tp=tp.content;
      this.childTp=tp;
    }
    refresh.call(this);
  }
};

//It loads a node tree from a php script that privides it in json format
Node.prototype.loadfromhttp=function (request, reqlistener) {
  var xmlhttp=new XMLHttpRequest();
  var thisNode=this;
  xmlhttp.addEventListener('load', function() {
    console.log(this.responseText);
    var responseobj=JSON.parse(this.responseText);
    if (typeof responseobj=="object") {
      thisNode.load(responseobj);
      thisNode.loadasc(responseobj);
    }
    if (typeof reqlistener == "function") reqlistener.call(thisNode);
    if (thisNode.events && thisNode.events.loadFromHTTP) {
      var i=thisNode.events.loadFromHTTP.length;
      while(i--) {
	thisNode.events.loadFromHTTP[i].call(thisNode);
      }
    }
  });
  xmlhttp.addEventListener('error', function(event) {
    alert('Oops! Something went wrong with the XMLHttpRequest.');
  });
  xmlhttp.overrideMimeType("application/json");
  if (typeof request=="string") {
    xmlhttp.open("GET", request, true);
    xmlhttp.send();
  }
  else if (typeof request=="object") {
    if (request.constructor === Object) {
      var myAction= request.requesterFile;
      var request=this.toRequestFormData(request);
      request.action=myAction;
    }
    if (!request.action) request.action="dbrequest.php";
    xmlhttp.open("POST",request.action, true);
    if (request.tagName=="FORM") {
      xmlhttp.send(new FormData(request));
    }
    else {
      xmlhttp.send(request); //sending just formData (archives)
    }
  }
};
Node.prototype.addEventListener=function (eventName, listenerFunction, id) {
  if (!this.events) this.events={};
  if (!this.events[eventName]) this.events[eventName]=[];
  /*
  var matchfound=false;
  this.events[eventName].forEach(function(func) {
    if (func.toString()==listenerFunction.toString()) matchfound=true;
  });*/
  if (id) listenerFunction.id=id;
  this.events[eventName].push(listenerFunction);
}
Node.prototype.removeEventListener=function (eventName, id) {
  if (this.events && this.events[eventName]) {
    var i=this.events[eventName].length;
    while(i--) {
      if (this.events[eventName][i].id==id) {
	this.events[eventName].splice(i,1);
      }
    }
  }
}
Node.prototype.dispatchEvent=function (eventName, args) {
  if (this.events && this.events[eventName]) {
    var i=this.events[eventName].length;
    while(i--) {
      this.events[eventName][i].apply(this, args);
    }
  }
}

Node.prototype.getMyDomNodes=function () {
  if (this.parentNode && this.parentNode.childContainer) {
    //Get index
    var index=this.parentNode.children.indexOf(this);
    var length=1;
    if (!this.parentNode.childTp.tagName) length=this.parentNode.childTp.children.length; //there is a fragment
    var startindex=index*length;
    var endindex=startindex+length;
    return Array.from(this.parentNode.childContainer.children).slice(startindex,endindex);
  }
  else if (this.myContainer) {
      return Array.from(this.myContainer.children);
  }
}

function NodeFemale() {
  Node.call(this);
  this.partnerNode=null;
  this.children=[];
  this.childtablekeys=[];
  this.childTp=null;
  this.childContainer=null;
}
NodeFemale.prototype=Object.create(Node.prototype);
NodeFemale.prototype.constructor=NodeFemale;

NodeFemale.prototype.load=function(source, level) {
  Node.prototype.load.call(this, source);
  if (source.childtablekeys) {
    for (var i=0;i<source.childtablekeys.length;i++) {
      this.childtablekeys[i]=new Properties();
      this.childtablekeys[i].cloneFromArray(source.childtablekeys[i]);
    }
  }
  if (level==0) return false;
  if (level) level--;
  if (!source.children) return false;
  for (var i=0;i<source.children.length;i++) {
    this.children[i]=new NodeMale;
    this.children[i].parentNode=this;
    this.children[i].load(source.children[i], level);
  }
}

NodeFemale.prototype.loadasc=function(source, level) {
  Node.prototype.loadasc.call(this, source);
  if (source.childtablekeys) {
    for (var i=0;i<source.childtablekeys.length;i++) {
      this.childtablekeys[i]=new Properties();
      this.childtablekeys[i].cloneFromArray(source.childtablekeys[i]);
    }
  }
  if (!source.partnerNode) return false;
  if (level==0) return false;
  if (level) level--;
  if (Array.isArray(source.partnerNode)) {
    if (!Array.isArray(this.partnerNode)) this.partnerNode=[this.partnerNode];
    for (var i=0; i < source.partnerNode.length; i++) {
      this.partnerNode[i]=new NodeMale();
      this.partnerNode[i].loadasc(source.partnerNode[i], level);
    }
  }
  else {
    if (!this.partnerNode) this.partnerNode=new NodeMale();
    this.partnerNode.loadasc(source.partnerNode, level);
  }
}

NodeFemale.prototype.avoidrecursion=function () {
  this.partnerNode=null;
  for (var i=0;i<this.children.length;i++) {
    this.children[i].avoidrecursion();
  }
};

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
NodeMale.prototype.load=function(source, level) {
  Node.prototype.load.call(this, source);
  if (source.sort_order) this.sort_order=Number(source.sort_order);
  if (level==0) return false;
  if (level) level--;
  if (!source.relationships) return false;
  for (var i=0;i<source.relationships.length; i++) {
    this.relationships[i]=new NodeFemale();
    this.relationships[i].partnerNode=this;
    this.relationships[i].load(source.relationships[i], level);
  }
}

NodeMale.prototype.getNextChild=function(obj) {
  return this.relationships[0].getChild(obj);
}
NodeMale.prototype.appendNextChildren=function(container, tp, reqlistener, append) {
  return this.relationships[0].appendChildren(container, tp, reqlistener, append);
}

NodeMale.prototype.loadasc=function(source, level) {
  Node.prototype.loadasc.call(this, source);
  if (source.sort_order) this.sort_order=Number(source.sort_order);
  if (!source.parentNode) return false;
  if (level==0) return false;
  if (level) level--;
  if (Array.isArray(source.parentNode)) {
    if (!Array.isArray(this.parentNode)) this.parentNode=[this.parentNode];
    for (var i=0; i < source.parentNode.length; i++) {
      this.parentNode[i]=new NodeFemale();
      this.parentNode[i].loadasc(source.parentNode[i], level);
    }
  }
  else {
    if (!this.parentNode) this.parentNode=new NodeFemale();
    this.parentNode.loadasc(source.parentNode, level);
  }
}

NodeMale.prototype.avoidrecursion=function () {
  this.parentNode=null;
  for (var i=0;i<this.relationships.length;i++) {
    this.relationships[i].avoidrecursion();
  }
};

NodeMale.prototype.cloneRelationship=function() {
  var relClon=this.parentNode.cloneNode();
  this.relationships[0]=relClon;
  this.relationships[0].partnerNode=this;
  return this.relationships[0];
};

NodeMale.prototype.addRelationship=function(rel) {
  this.relationships.push(rel);
  rel.partnerNode=this;
}

NodeMale.prototype.getrootnode=function() {
  if (!this.parentNode) return this;
  else return this.parentNode.getrootnode();
}

NodeMale.prototype.getRelationship=function(obj) {
  if (typeof obj == "string") obj={name: obj};
  var keyname=Object.keys(obj)[0];
  var i= this.relationships.length;
  while(i--) {
    if (Object.keys(this.relationships[i].properties).indexOf(keyname)!=-1 && this.relationships[i].properties[keyname]==obj[keyname])
      return this.relationships[i];
  }
  return false;
};