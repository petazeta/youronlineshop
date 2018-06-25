<template id="butedittp">
  <template>
    <input type="text">
  </template>
  <template>
    <button type="button" class="butedit">
      <img src="includes/css/images/pen.png"/>
    </button>
  </template>
  <div style="display:table"></div>
  <script>
    //normalize
    var launcher=thisNode;
    var thisNode=launcher.thisNode;
    var thisProperty=launcher.thisProperty;
    var editElement=launcher.editElement;
    var inlineEdition=launcher.inlineEdition;
    var thisAttribute=launcher.thisAttribute;
    var autoeditFunc=launcher.autoeditFunc;
    var createInput=launcher.createInput;

    if (!thisAttribute) {
      thisAttribute="innerHTML";
    }
    if (!thisProperty) thisProperty=thisNode.getFirstPropertyKey();
    if (createInput) {
      originalEditElement=editElement;
      originalAttribute=thisAttribute;
      editElement=thisElement.parentElement.querySelector("template").content.querySelector("input").cloneNode(true);
      thisNode.writeProperty(editElement, thisProperty, "value");
      thisAttribute="value";
      inlineEdition=true;
      editElement.addEventListener("blur", function(e){
	if (!thisNode.changedByIntroKey) {
	  changeProperty(function(){
	      originalEditElement[originalAttribute]=thisNode.properties[thisProperty];
	  });
	}
	thisNode.changedByIntroKey=false; //reset
      });
      editElement.addEventListener('keydown', function(e) {
	introKey(e, function(){
	  changeProperty(function(){
	    originalEditElement[originalAttribute]=thisNode.properties[thisProperty];
	  });
	  thisNode.changedByIntroKey=true;
	});
      });
      thisElement.appendChild(editElement);
    }
    else {
      var buttonElement=thisElement.parentElement.querySelectorAll("template")[1].content.querySelector("button").cloneNode(true);
      thisElement.appendChild(buttonElement);
    
      if (typeof autoeditFunc=="function") buttonElement.onclick=function() {
	thisNode.addEventListener("finishAutoEdit", changeProperty, "autoedit");
	autoeditFunc();
      }
      else {
	var activeEdition=function(){
	  //removing Config.onEmptyValueText => property is null
	  if (editElement[thisAttribute]==Config.onEmptyValueText && thisNode.properties[thisProperty]!=Config.onEmptyValueText) {
	    editElement[thisAttribute]=null;
	  }
	  editElement.setAttribute("contenteditable","true");
	  editElement.className=editElement.className.replace(/ contenteditableactive/g,"");
	  editElement.className+=" contenteditableactive";
	  // Hide admin buttons when write
	  var tablesAdmin=editElement.parentElement.querySelectorAll("table.adminedit"); //edit and admin buttons
	  for (var i=0; i<tablesAdmin.length; i++) {
	    tablesAdmin[i].style.visibility="hidden";
	  }
	  editElement.focus();
	};
	var unActiveEdition=function() {
	  //For empty values lets put some content in the element
	  if (editElement[thisAttribute]=="") {
	    editElement[thisAttribute]= Config.onEmptyValueText;
	  }
	  editElement.setAttribute("contenteditable","false");
	  editElement.className=editElement.className.replace(/ contenteditableactive/g,'');
	  //Set visible edit and admin buttons
	  var tablesAdmin=editElement.parentElement.querySelectorAll("table.adminedit"); //edit and admin buttons
	  for (var i=0; i<tablesAdmin.length; i++) {
	    tablesAdmin[i].style.visibility="visible";
	  }
	};
	var listenerIntroKey=function(e) {
	   introKey(e, finishEdition);
	};
	var finishEdition=function(){
	  changeProperty();
	  unActiveEdition();
	  if (!(inlineEdition===false)) {
	    //disable Intro keyCode for new Line and enable it for submith
	    editElement.removeEventListener('keydown', listenerIntroKey);
	  }
	  editElement.removeEventListener("blur", finishEdition);
	};
	
	buttonElement.onclick=function() {
	  activeEdition();
	  if (!(inlineEdition===false)) {
	    //disable Intro keyCode for new Line and enable it for submith
	    editElement.addEventListener('keydown', listenerIntroKey);
	  }
	  editElement.addEventListener("blur", finishEdition);
	};
      }
    }
    function introKey(e, callBack) {
      var key = e.which || e.keyCode;
      if (key == 13) {
	e.preventDefault(); //Not to submit but I think it doesn't work
	callBack();
      }
    };
    function changeProperty(callBack){
      var elementValue=null;
      if (editElement.getAttribute(thisAttribute)!==null && thisAttribute!="value") elementValue=editElement.getAttribute(thisAttribute);
      // src, href we want the relative address (attribute rather than property) but for value we want the actual value (proerty rather than attribute
      else elementValue=editElement[thisAttribute];
      if (thisNode.properties[thisProperty] != elementValue) { //just when content change and not void
	thisNode.loadfromhttp({action:"edit my properties", user_id: webuser.properties.id, properties:{[thisProperty]: elementValue}}, function(){
	  this.properties[thisProperty]=elementValue;
	  this.dispatchEvent("changeProperty", [thisProperty]);
	  if (callBack) callBack();
	});
      }
      else {
	thisNode.dispatchEvent("changeProperty", [thisProperty]);
        if (callBack) callBack();
      }
    };
  </script>
</template>