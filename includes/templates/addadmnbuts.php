<div></div>
<script>
  var launcher=thisNode;
  var thisNode=launcher.thisNode;
  var editElement=launcher.editElement;
  var newNode=launcher.newNode;
  var btposition=launcher.btposition;
  
  if (btposition) thisElement.className=btposition;
  else thisElement.className=Config.defaultAdmnsButtonsPosition;

  function showAdmnButtons(){
  
    thisElement.parentElement.style.position="relative";
    thisElement.className += " visibleHover";
    editElement.addEventListener("mouseover", function(ev){
      thisElement.className = thisElement.className.replace(/ visibleHover/g,"");
    });
    editElement.addEventListener("mouseout", function(ev){
      thisElement.className += " visibleHover";
    });
  
    var admnlauncher=new Node();
    admnlauncher.buttons=[
      {
	template: document.getElementById("buthchpostp"),
	args:{thisNode: thisNode}
      },
      {
	template: document.getElementById("butaddnewnodetp"),
	args:{thisParent: thisNode.parentNode, newNode: newNode}
      },
      {
	template: document.getElementById("butdeletetp"),
	args:{thisNode: thisNode}
      }
    ];
    admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
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
	  //to remove the editbutton when logs after webadmin
	  thisElement.parentElement.removeChild(thisElement);
	}
	else {
	  showAdmnButtons();
	}
      },
      thisNode.parentNode.properties.childtablename + thisNode.properties.id
    );
      
    thisNode.addEventListener("deleteNode", function() {
      webuser.removeEventListener("log", thisNode.parentNode.properties.childtablename + thisNode.properties.id);
    });
  }
</script>