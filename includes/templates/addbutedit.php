<template>
  <div></div>
  <script>
    var launcher=thisNode;
    var thisNode=launcher.thisNode;
    var thisProperty=launcher.thisProperty;
    var editElement=launcher.editElement;
    var inlineEdition=launcher.inlineEdition;
    var thisAttribute=launcher.thisAttribute;
    var btposition=launcher.btposition;
    var autoeditFunc=launcher.autoeditFunc;
    var editable=launcher.editable; //For address fields for example
    var createInput=launcher.createInput; //For elements that can be contenteditable
    
    if (btposition) thisElement.className=btposition;
    else thisElement.className=Config.defaultEditButtonPosition;
    
    function showEditButton() {
      thisElement.parentElement.style.position="relative";
      
      if (thisElement.originalParentElement && !thisElement.parentElement) editElement.parentElement.appendChild(thisElement); //after the log out thisElement is removed from parent

      if (!createInput) { //input is allways visible¿?
	thisElement.className += " visibleHover";
      
	editElement.addEventListener("mouseover", function(ev){
	  thisElement.className = thisElement.className.replace(/ visibleHover/g,"");
	});
	editElement.addEventListener("mouseout", function(ev){
	  thisElement.className += " visibleHover";
	});
      }
      var admnlauncher=new NodeMale();
      admnlauncher.buttons=[{ 
	template: document.getElementById("butedittp"),
	args:{thisNode: thisNode, thisProperty: thisProperty, editElement: editElement, thisAttribute: thisAttribute, inlineEdition: inlineEdition, autoeditFunc: autoeditFunc, createInput: createInput}
      }]
      admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
    }
    if (editable || webuser.isWebAdmin()) {
      showEditButton();
    }
    //Lets add the log event
    var pointer=thisElement;
    while (pointer && pointer != document.getElementById("centralcontent")) {
      pointer=DomMethods.closesttagname(pointer, "div");
    }
    if (pointer != document.getElementById("centralcontent") &&
    !webuser.eventExists("log",thisNode.parentNode.properties.childtablename + thisNode.properties.id + "editButton")) {
      //it is outside of the central content so we got to add a log event listener
      webuser.addEventListener("log", function() {
	  if (!this.isWebAdmin()) {
	    //to remove the editbutton when logs after webadmin
	    if (thisElement && thisElement.parentElement) {
	      thisElement.originalParentElement=thisElement.parentElement;
	      thisElement.parentElement.removeChild(thisElement);
	    }
	  }
	  else {
	    showEditButton();
	  }
	},
	thisNode.parentNode.properties.childtablename + thisNode.properties.id + "editButton"
      );
      //removing the listener when node is deleted
      thisNode.addEventListener("deleteNode", function() {
	webuser.removeEventListener("log", thisNode.parentNode.properties.childtablename + thisNode.properties.id + "editButton");
      });
    }
  </script>
</template>