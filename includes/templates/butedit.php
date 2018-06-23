<template id="butedittp">
  <button type="button" class="butedit">
    <img src="includes/css/images/pen.png"/>
  </button>
  <script>
    //normalize
    var launcher=thisNode;
    var thisNode=launcher.thisNode;
    var thisProperty=launcher.thisProperty;
    var editElement=launcher.editElement;
    var inlineEdition=launcher.inlineEdition;
    var thisAttribute=launcher.thisAttribute;
    var autoeditFunc=launcher.autoeditFunc;

    if (editElement.tagName=="INPUT") {
      if (editElement.type=="hidden") {
	editElement.type="text";
      }
      if (!thisAttribute) {
	thisAttribute="value";
      }
      inlineEdition=true;
    }
    if (!thisAttribute) {
      thisAttribute="innerHTML";
    }
    if (!thisProperty) thisProperty=thisNode.getFirstPropertyKey();
    
    if (typeof autoeditFunc=="function") thisElement.onclick=function() {
      thisNode.addEventListener("finishAutoEdit", changeProperty, "autoedit");
      autoeditFunc();
    }
    else {
      thisElement.onclick=function() {
	activeEdition(thisNode, editElement, thisProperty, thisAttribute, inlineEdition);
	if (!(inlineEdition===false)) {
	  //disable Intro keyCode for new Line and enable it for submith
	  editElement.addEventListener('keydown', introKey);
	}
	editElement.addEventListener("blur", finishEdition);
      };
    }
    function finishEdition(){
      changeProperty();
      unActiveEdition(thisNode, editElement, thisProperty, thisAttribute);
      if (!(inlineEdition===false)) {
	//disable Intro keyCode for new Line and enable it for submith
	editElement.removeEventListener('keydown', introKey);
      }
      editElement.removeEventListener("blur", finishEdition);
    };
    function introKey(e) {
      var key = e.which || e.keyCode;
      if (key == 13) { alert("intro");
	e.preventDefault(); //Not to submit
	finishEdition();
      }
    };
    function changeProperty(){
      var elementValue=null;
      if (editElement[thisAttribute]!==undefined) elementValue=editElement[thisAttribute]
      else elementValue=editElement.getAttribute(thisAttribute);
      if (thisNode.properties[thisProperty] != elementValue) { //just when content change and not void
	thisNode.loadfromhttp({action:"edit my properties", user_id: webuser.properties.id, properties:{[thisProperty]: elementValue}}, function(){
	  this.properties[thisProperty]=elementValue;
	  this.dispatchEvent("changeProperty", [thisProperty]);
	});
      }
      else thisNode.dispatchEvent("changeProperty", [thisProperty]);
    };
    function activeEdition(thisNode, thisElement, thisProperty, thisAttribute, inlineEdition){
      //removing Config.onEmptyValueText => property is null
      if (thisElement[thisAttribute]==Config.onEmptyValueText && thisNode.properties[thisProperty]!=Config.onEmptyValueText) {
	thisElement[thisAttribute]=null;
      }
      if (thisAttribute=="innerHTML" || thisAttribute=="textContent") {
	thisElement.setAttribute("contenteditable","true");
	thisElement.className=thisElement.className.replace(/ contenteditableactive/g,"");
	thisElement.className+=" contenteditableactive";
      }
      thisElement.focus();
      // Hide admin buttons when write
      var tablesAdmin=thisElement.parentElement.querySelectorAll("table.adminedit"); //edit and admin buttons
      for (var i=0; i<tablesAdmin.length; i++) {
	tablesAdmin[i].style.visibility="hidden";
      }
    };
    function unActiveEdition(thisNode, thisElement, thisProperty, thisAttribute) {
      //For empty values lets put some content in the element
      if (thisElement[thisAttribute]=="") {
	thisElement[thisAttribute]= Config.onEmptyValueText;
      }
      if (thisElement.tagName=="input") {
	return;
      }
      thisElement.setAttribute("contenteditable","false");
      thisElement.className=thisElement.className.replace(/ contenteditableactive/g,'');
      //Set visible edit and admin buttons
      var tablesAdmin=thisElement.parentElement.querySelectorAll("table.adminedit"); //edit and admin buttons
      for (var i=0; i<tablesAdmin.length; i++) {
	tablesAdmin[i].style.visibility="visible";
      }
    };
  </script>
</template>