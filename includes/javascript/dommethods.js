//Some functions that will be applied to dom elements
DomMethods={
  activeEdition: function (thisNode, thisElement, thisProperty, thisAttribute, inlineEdition){
    if (!thisProperty) thisProperty=thisNode.getFirstPropertyKey();
    if (thisElement.tagName=="input") {
      thisAttribute="value";
      inlineEdition=true;
    }
    if (!thisAttribute) {
      thisAttribute="innerHTML";
    }
    //removing emptyValueText => property is null
    if (thisElement[thisAttribute]==emptyValueText && thisNode.properties[thisProperty]!=emptyValueText) {
      thisElement[thisAttribute]=null;
    }
    if (thisAttribute=="innerHTML" || thisAttribute=="textContent") {
      thisElement.setAttribute("contenteditable","true");
      thisElement.className=thisElement.className.replace(/ contenteditableactive/g,"");
      thisElement.className+=" contenteditableactive";
    }
    thisElement.focus();
    // Hide edit button when write
    if (thisElement.className.match(/adminsinglelauncher/)) var tableAdmin=thisElement.querySelector("table.adminedit");
    else var tableAdmin=thisElement.parentElement.querySelector("table.adminedit");
    if (tableAdmin) {
      tableAdmin.style.visibility="hidden";
    }
  },
  unActiveEdition: function(thisNode, thisElement, thisProperty, thisAttribute) {
    //For empty values lets put some content in the element
    if (thisElement.tagName=="input") {
      thisAttribute="value";
    }
    if (thisElement[thisAttribute]=="") {
      thisElement[thisAttribute]= emptyValueText;
    }
    if (thisElement.tagName=="input") {
      return;
    }
    thisElement.setAttribute("contenteditable","false");
    thisElement.className=thisElement.className.replace(/ contenteditableactive/g,'');
    //Set visible edit button
    var tableAdmin=thisElement.parentElement.querySelector("table.adminedit");
    if (tableAdmin) {
      tableAdmin.style.visibility="visible";
    }
  },
  setSelected: function(element) {
    element.className=element.className.replace(/ selected/g,"");
    element.className+=" selected";
  },
  setUnselected: function(element) {
    element.className=element.className.replace(/ selected/g,'');
  },
  closesttagname: function(element, tagname){
    //if !myreturn.parentElement.tagName => document fragment
    var myreturn=element;
    while(myreturn && myreturn.parentElement && myreturn.parentElement.tagName && myreturn.parentElement.tagName!=tagname) {
      myreturn=myreturn.parentElement;
    }
    return myreturn.parentElement;
  },
  intoColumns: function(tableElement, elements, cellsNumber) {
    // columns distribution applied to a row
    // tableElement a table template, elements a document fragment o dom element containing elements
    var myRow=tableElement.rows[0].cloneNode();
    var myCell=tableElement.rows[0].cells[0].cloneNode();
    tableElement.innerHTML='';
    while (elements.firstElementChild) {
      if (!elements.firstElementChild.tagName) continue;
      var newRow=myRow.cloneNode();
      tableElement.appendChild(newRow);
      if (cellsNumber == 0) {
	while (elements.firstElementChild) {
	  var newCell=myCell.cloneNode();
	  newCell.style.width=cellsWidth;
	  newCell.appendChild(elements.firstElementChild);
	  newRow.appendChild(newCell);
	}
	return tableElement;
      }
      var i=cellsNumber;
      while(i--) {
	var cellsWidth=Math.round(100/cellsNumber) + "%";
	if (elements.firstElementChild) {
	  var newCell=myCell.cloneNode();
	  newCell.style.width=cellsWidth;
	  newCell.appendChild(elements.firstElementChild);
	  //don't forget the element script
	  if (elements.firstElementChild && elements.firstElementChild.tagName=="SCRIPT") {
	    newCell.appendChild(elements.firstElementChild);
	  }
	  newRow.appendChild(newCell);
	}
	else {
	  var newCell=myCell.cloneNode();
	  newCell.style.width=cellsWidth;
	  newRow.appendChild(newCell);
	}
      }
    }
    return tableElement;
  },
  validateEmail: function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },
  checklength: function(value, min, max){
    if (typeof value=="number") value=value.toString();
    if (typeof value == "string") {
      if (value.length >= min && value.length <= max) return true;
    }
    return false;
  },
  setActive: function(thisNode) {
    thisNode.parentNode.activeChildren=thisNode;
    var myPointer=thisNode.getrootnode();
    myPointer.activeNode=thisNode;
    var i= thisNode.parentNode.children.length;
    while(i--) {
      thisNode.parentNode.children[i].selected=false;
      var doms=thisNode.parentNode.children[i].getMyDomNodes();
      if (doms.length>0) {
	DomMethods.setUnselected(doms[0]);
      }
    }
    thisNode.selected=true;
    var doms=thisNode.getMyDomNodes()
    if (doms) {
      DomMethods.setSelected(doms[0]);
    }
  }
}

function Alert() {
  NodeMale.call(this);
}
Alert.prototype=Object.create(NodeMale.prototype);
Alert.prototype.constructor=Alert;


Alert.prototype.showalert=function() {
  var alertcontainer=document.createElement("div");
  document.body.appendChild(alertcontainer);
  this.myContainer=alertcontainer;
  this.refreshView();
};
Alert.prototype.hidealert=function() {
  var remove=function(element){
    element.parentElement.removeChild(element);
  };
  var myContainer=this.myContainer;
  if (this.properties.timeout>0) {
    window.setTimeout(function(){remove(myContainer);},this.properties.timeout);
  }
  else remove(myContainer);
};

DbMethods={
  changeProperty: function (thisNode, thisProperty) {
    if (!thisProperty) thisProperty=thisNode.getFirstPropertyKey();
    var writeNode=new NodeMale();
    writeNode.loadasc(thisNode, 1, ["id", thisProperty]);
    console.log(writeNode);
    writeNode.loadfromhttp({action:"edit my properties", user_id: webuser.properties.id}, function(){
      thisNode.parentNode.updateChild(writeNode);
      thisNode.dispatchEvent("propertychange", [thisProperty]);
    });
  }
};