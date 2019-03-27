<template>
  <div data-id="admnbuts"></div>
  <script>
    var launcher=thisNode;
    var thisNode=launcher.thisNode;
    var editElement=launcher.editElement;
    var newNode=launcher.newNode;
    var btposition=launcher.btposition;
    var elementsListPos=launcher.elementsListPos;
    var excludeButtons=launcher.excludeButtons;
    var visibility=launcher.visibility; //If not it is visible on mouse over
    
    if (btposition) thisElement.className=btposition;
    else thisElement.className=Config.defaultAdmnsButtonsPosition;

    function showAdmnButtons(){
      if (!thisElement.parentElement) editElement.parentElement.appendChild(thisElement); //after the log out thisElement is removed from parent
      thisElement.parentElement.style.position="relative";
      if (!visibility) {
	thisElement.style.opacity=0;
	thisElement.addEventListener("mouseover", function(ev){
	  thisElement.style.opacity=1;
	});
	thisElement.addEventListener("mouseout", function(ev){
	  thisElement.style.opacity=0;
	});
	editElement.addEventListener("mouseover", function(ev){
	  thisElement.style.opacity=1;
	});
	editElement.addEventListener("mouseout", function(ev){
	  thisElement.style.opacity=0;
	});
      }
      else {
	thisElement.style.visibility=visibility;
      }
      var posTp="templates/buthchpos.php";
      if (elementsListPos=="vertical") posTp="templates/butvchpos.php";
      var admnlauncher=new Node();
      admnlauncher.buttons=[
	{
	  template: posTp,
	  args:{thisNode: thisNode}
	},
	{
	  template: "templates/butaddnewnode.php",
	  args:{thisParent: thisNode.parentNode, newNode: newNode}
	},
	{
	  template: "templates/butdelete.php",
	  args:{thisNode: thisNode}
	}
      ];
      var buttons=admnlauncher.buttons.slice(0);
      if (excludeButtons) {
	for (var i=0; i<excludeButtons.length; i++) {
	  for (var j=0; j<buttons.length; j++) {
	    if (excludeButtons[i]==buttons[j].template) {
	      admnlauncher.buttons.splice(j, 1);
	    }
	  }
	}
      }
      admnlauncher.refreshView(thisElement, "templates/admnbuts.php", function(){
	this.dispatchEvent("addAdmnButs");
      });
    }
    
    if (webuser.isWebAdmin()) {
      showAdmnButtons();
    }
    //Lets add the log event
    var pointer=thisElement;
    while (pointer && pointer != document.getElementById("centralcontent")) {
      pointer=DomMethods.closesttagname(pointer, "div");
    }
    if (pointer != document.getElementById("centralcontent")) {
      //it is outside of the central content so we got to add a log event listener
      webuser.addEventListener("log",
	function() {
	  if (!this.isWebAdmin()) {
	    //to remove the admnbutton when logs after webadmin
	    if (thisElement && thisElement.parentElement) thisElement.parentElement.removeChild(thisElement);
	  }
	  else {
	    showAdmnButtons();
	  }
	},
	"admnButton", thisNode
      );
      thisNode.addEventListener("deleteNode", function() {
	webuser.removeEventListener("log", "admnButton", thisNode);
      }, "deleteAdmnButton");
    }
  </script>
</template>