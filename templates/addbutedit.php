<template>
  <div data-id="butedit"></div>
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
    var visibility=launcher.visibility; //If not it is visible on mouse over
    
    if (btposition) thisElement.className=btposition;
    else thisElement.className=Config.defaultEditButtonPosition;

    function showEditButton() {
      if (thisElement.originalParentElement && !thisElement.parentElement) editElement.parentElement.appendChild(thisElement); //after the log out thisElement is removed from parent
      thisElement.parentElement.style.position="relative";
      if (!visibility) {
        DomMethods.visibleOnMouseOver({element: thisElement, parent: editElement});
      }
      else {
	thisElement.style.visibility=visibility;
      }
      var admnlauncher=new NodeMale();
      admnlauncher.buttons=[{ 
	template: "templates/butedit.php",
	args:{thisNode: thisNode, thisProperty: thisProperty, editElement: editElement, thisAttribute: thisAttribute, inlineEdition: inlineEdition, autoeditFunc: autoeditFunc, createInput: createInput}
      }]
      admnlauncher.refreshView(thisElement, "templates/admnbuts.php", function(){
	thisNode.dispatchEvent("addButEdit", [thisProperty]);
      });
    }
    if (editable || webuser.isWebAdmin()) {
      showEditButton();
    }
    //Lets add the log event
    var pointer=thisElement;
    while (pointer && pointer != document.getElementById("centralcontent")) {
      pointer=DomMethods.closesttagname(pointer, "div");
    }
    if (pointer != document.getElementById("centralcontent")) {
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
	"editButton", thisNode
      );
      //removing the listener when node is deleted
      thisNode.addEventListener("deleteNode", function() {
	webuser.removeEventListener("log", "editButton", thisNode);
      }, "deleteEditButton");
    }
  </script>
</template>