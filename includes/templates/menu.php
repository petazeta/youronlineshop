<template>
  <span class="menu" data-hbutton="true" data-note="relative position container for admn buttons">
    <a data-button="true" class="menu" href="javascript:"></a>
    <script>
      var url='?menu=' + thisNode.properties.id;
      thisElement.href=url;
      //function to show the openclosebutton
      function showOpenButton() {
	var openlauncher=new Node();
	openlauncher.appendThis(thisElement.parentElement.querySelector("[data-id=containeropen]"), "includes/templates/butopen.php", function(){
	  var openclosebutton=thisElement.parentElement.querySelector("[data-id=containeropen]").querySelector("[data-id=openclose]");
	  //The on mouse over facility
	  openclosebutton.style.opacity=0;
	  thisElement.addEventListener("mouseover", function(ev){
	    openclosebutton.style.opacity=1;
	  });
	  thisElement.addEventListener("mouseout", function(ev){
	    openclosebutton.style.opacity=0;
	  });
	  openclosebutton.addEventListener("mouseover", function(ev){
	    openclosebutton.style.opacity=1;
	  });
	  openclosebutton.addEventListener("mouseout", function(ev){
	    openclosebutton.style.opacity=0;
	  });
	});
      }
      if (thisNode.selected) DomMethods.setActive(thisNode); //restablish the active status after clonning parent rel and when refreshing setSelected
      thisNode.getRelationship("domelementsdata").loadfromhttp({action:"load my children", language: webuser.extra.language.properties.id}, function(){
	this.getChild().writeProperty(thisElement);
	var launcher = new Node();
	launcher.thisNode = this.getChild();
	launcher.editElement = thisElement;
	launcher.btposition="btbottomcenter";
	launcher.visibility="hidden";
	launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
	var admnlauncher=new Node();
	admnlauncher.thisNode=thisNode;
	admnlauncher.editElement = thisElement;
	admnlauncher.visibility="hidden";
	admnlauncher.newNode=thisNode.parentNode.newNode.cloneNode(0, null); // we duplicate it so newNode can be reused
	admnlauncher.newNode.loadasc(thisNode, 2, "id"); //the parent is not the same
	admnlauncher.newNode.sort_order=thisNode.sort_order + 1;
	admnlauncher.appendThis(thisElement.parentElement, "includes/templates/addadmnbuts.php");
      });
      thisElement.addEventListener('click', function(event){
	event.preventDefault();
	DomMethods.setActive(thisNode);
	thisNode.getRelationship("domelements").loadfromhttp({action: "load my tree", language: webuser.extra.language.properties.id}, function() {
	  this.newNode=thisNode.parentNode.newNode.cloneNode(0, null); // we duplicate it so newNode can be reused
	  this.newNode.parentNode=new NodeFemale();
	  this.newNode.parentNode.load(this, 1, "id");
	  var pageframe=getTpContent(document.getElementById("pageframetp")).querySelector("*").cloneNode(true);
	  document.getElementById("centralcontent").innerHTML="";
	  document.getElementById("centralcontent").appendChild(pageframe);
	  this.appendThis(pageframe, "includes/templates/admnlisteners.php");
	  this.refreshChildrenView(pageframe, "includes/templates/paragraph.php");
	});
	if (history.state && history.state.url==url || thisNode.sort_order==1 && history.state==null) return; //we dont grab if it is selected by default after category clicking
	history.pushState({url:url}, null, url);
      });
      //we add the edit
      if (webuser.isWebAdmin()) {
	showOpenButton();
      }
      //Lets add the log event
      webuser.addEventListener("log",
	function() {
	  if (!this.isWebAdmin()) {
	    //to remove the openbutton when logs after webadmin
	    var containerOpen=thisElement.parentElement.querySelector("[data-id=containeropen]");
	    if (containerOpen) {
	      containerOpen.innerHTML="";
	    }
	  }
	  else {
	    showOpenButton();
	  }
	},
	"openButton", thisNode
      );
      //removing the listener when node is deleted
      thisNode.addEventListener("deleteNode", function() {
	webuser.removeEventListener("log", "openButton", thisNode);
      }, "deleteOpenButton");
    </script>
    <div class="btmiddleright" data-id="containeropen"></div>
  </span>
</template>