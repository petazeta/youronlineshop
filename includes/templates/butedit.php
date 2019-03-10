<template>
  <template>
    <input type="hidden">
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
      var originalEditElement=editElement;
      editElement=getTpContent(thisElement.parentElement.querySelector("template")).querySelector("input").cloneNode(true);
      var originalAttribute=thisAttribute;
      thisAttribute="value";
      inlineEdition=true;
      thisElement.appendChild(editElement);
    }
    var buttonElement=getTpContent(thisElement.parentElement.querySelectorAll("template")[1]).querySelector("button").cloneNode(true);
    thisElement.appendChild(buttonElement);
    if (typeof autoeditFunc=="function") buttonElement.onclick=function() {
      thisNode.addEventListener("finishAutoEdit", changeProperty, "autoedit");
      autoeditFunc();
    }
    else if (createInput) buttonElement.onclick=function() {
      var activeEdition=function(){
	editElement.type="text";
	//removing Config.onEmptyValueText => property is null
	if (editElement[thisAttribute]==Config.onEmptyValueText && thisNode.properties[thisProperty]!=Config.onEmptyValueText) {
	  editElement[thisAttribute]="";
	}
	// Hide admin buttons when write
	var editButton=editElement.parentElement.querySelector("button"); //edit and admin buttons
	editButton.style.display="none";
	editElement.focus();
      };
      var unActiveEdition=function() {
	editElement.type="hidden";
	//For empty values lets put some content in the element
	if (editElement[thisAttribute]=="") {
	  editElement[thisAttribute]= Config.onEmptyValueText;
	}
	if (!createInput) {
	  editElement.setAttribute("contenteditable","false");
	  editElement.className=editElement.className.replace(/ contenteditableactive/g,'');
	}
	//Set visible edit and admin buttons
	var editButton=editElement.parentElement.querySelector("button"); //edit and admin buttons
	editButton.style.display="inline-block";
      };
      thisNode.writeProperty(editElement, thisProperty, thisAttribute);
      // Hide admin buttons when write
      activeEdition();
      editElement.addEventListener("blur", function(e){
	if (!thisNode.changedByIntroKey) {
	  changeProperty(function(){
	    originalEditElement[originalAttribute]=thisNode.properties[thisProperty];
	    unActiveEdition();
	  });
	}
	thisNode.changedByIntroKey=false; //reset
      });
      editElement.addEventListener('keydown', function(e) {
	introKey(e, function(){
	  changeProperty(function(){
	    originalEditElement[originalAttribute]=thisNode.properties[thisProperty];
	    unActiveEdition();
	  });
	  thisNode.changedByIntroKey=true;
	});
      });
    }
    else {
      function setVisibilityButtons(vis){
	function changeVisibility(buts, vis){
	  for (var i=0; i<buts.length; i++) {
	    buts[i].style.visibility=vis;
	  }
	}
	var editbuts=editElement.parentElement.querySelectorAll("[data-id=butedit]");
	changeVisibility(editbuts, vis);
	var admnbuts=editElement.parentElement.querySelectorAll("[data-id=admnbuts]");
	changeVisibility(admnbuts, vis);
      }
      var activeEdition=function(){
	//removing Config.onEmptyValueText => property is null
	if (editElement[thisAttribute]==Config.onEmptyValueText && thisNode.properties[thisProperty]!=Config.onEmptyValueText) {
	  editElement[thisAttribute]="";
	}
	editElement.setAttribute("contenteditable","true");
	editElement.className=editElement.className.replace(/ contenteditableactive/g,"");
	editElement.className+=" contenteditableactive";
	// Hide admin buttons when write
	setVisibilityButtons("hidden");
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
	setVisibilityButtons("visible");
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