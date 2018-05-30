//Some functions that will be applied to dom elements
function activeedition(thisNode, field){
  function submit() {
    this.setAttribute("contenteditable","false");
    this.className=this.className.replace(/ contenteditableactive/g,'');
    var tableAdmin=this.parentElement.querySelector("table.adminedit");
    if (tableAdmin) {
      tableAdmin.style.visibility="visible";
    }
    //empty values are not allowed
    if (this[myproperty]=="") {
       this[myproperty]=field.value || labelsRoot.getNextChild({name: "not located"}).getNextChild({name: "emptyvallabel"}).properties.innerHTML;
      return false;
    }
    else if (field.value != this[myproperty]) { //just when content change and not void
      field.setAttribute("value",this[myproperty]);
      thisParent=thisNode.parentNode;
      var myresult=new NodeMale();
      var thisElement=this;
      myresult.loadfromhttp(field.form, function(){
        var myelement=new NodeMale();
        myelement.properties.id=thisNode.properties.id;
        myelement.properties[field.name]=field.value;
        thisParent.updateChild(myelement);
	thisNode.dispatchEvent("propertychange", [field.name]);
      });
    }
  };
  var tableAdmin=this.parentElement.querySelector("table.adminedit");
  if (tableAdmin) {
    tableAdmin.style.visibility="hidden";
  }
  
  if (this.allowedHTML) var myproperty="innerHTML";
  else {
    var myproperty="textContent";
    var myThis=this;
    this.addEventListener('keydown', function (e) {
      var key = e.which || e.keyCode;
      if (key === 13) { 
	submit.call(myThis);
      }
    });
  }
  //field contains the previous value
  //removing the initial value for null values
  if (this[myproperty]!=thisNode.properties[field.name]) {
    if (thisNode.properties[field.name]) this[myproperty]=thisNode.properties[field.name];
    else this[myproperty]=null;
  }
  field.setAttribute("value",this[myproperty]);
  this.setAttribute("contenteditable","true");
  this.className+=" contenteditableactive";
  this.focus();
  
  this.addEventListener("blur", submit);
}

function setSelected() {
  this.className+=" selected";
};
function setUnselected() {
  this.className=this.className.replace(/ selected/g,'');
};
function closesttagname(tagname){
  //if !myreturn.parentElement.tagName => document fragment
  var myreturn=this;
  while(myreturn && myreturn.parentElement && myreturn.parentElement.tagName && myreturn.parentElement.tagName!=tagname) {
    myreturn=myreturn.parentElement;
  }
  return myreturn.parentElement;
};
function intoColumns(tableElement, elements, cellsNumber) {
  // columns distribution applied to a row
  // tableElement a table template, elements a document fragment o dom element containing elements
  var myRow=tableElement.rows[0].cloneNode();
  var myCell=tableElement.rows[0].cells[0].cloneNode();
  tableElement.innerHTML='';
  while (elements.firstElementChild) {
    console.log(elements.firstElementChild.tagName);
    if (!elements.firstElementChild.tagName) continue;
    if (elements.firstElementChild.tagName=="TEMPLATE") continue;
    if (elements.firstElementChild.tagName=="SCRIPT") continue;
    var newRow=myRow.cloneNode();
    tableElement.appendChild(newRow);
    if (cellsNumber < 1) {
      while (elements.firstElementChild) {
	var newCell=myCell.cloneNode();
	newCell.style.width=cellsWidth;
	newCell.appendChild(elements.firstElementChild);
	//don't forget the element script
	if (elements.firstElementChild && elements.firstElementChild.tagName=="SCRIPT") {
	  newCell.appendChild(elements.firstElementChild);
	}
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
}
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
function checklength(value, min, max){
  if (typeof value=="number") value=value.toString();
  if (typeof value == "string") {
    if (value.length >= min && value.length <= max) return true;
  }
  return false;
}