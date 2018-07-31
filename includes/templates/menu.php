<template>
  <span class="menu" data-note="relative position container for admn buttons">
    <a data-button="true" class="menu" href="javascript:"></a>
    <script>
      if (thisNode.selected) DomMethods.setActive(thisNode); //restablish the active status after clonning parent rel and when refreshing setSelected
      thisNode.getRelationship("domelementsdata").loadfromhttp({action:"load my children"}, function(){
	this.getChild().writeProperty(thisElement);
	var closelauncher=new Node();
	closelauncher.admnbuts=[];
	var launcher = new Node();
	launcher.thisNode = this.getChild();
	launcher.editElement = thisElement;
	launcher.btposition="btbottomcenter";
	launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
	var admnlauncher=new Node();
	admnlauncher.thisNode=thisNode;
	admnlauncher.editElement = thisElement;
	admnlauncher.newNode=thisNode.parentNode.newNode.cloneNode(0, null); // we duplicate it so newNode can be reused
	admnlauncher.newNode.loadasc(thisNode, 2, "id"); //the parent is not the same
	admnlauncher.newNode.sort_order=thisNode.sort_order + 1;
	admnlauncher.appendThis(thisElement.parentElement, "includes/templates/addadmnbuts.php");
	if (webuser.isWebAdmin()) {
	  closelauncher.appendThis(thisElement.parentElement.querySelector("[data-id=containeropen]"), "includes/templates/butclose.php");
	}
	webuser.addEventListener("log", function(){
	  if (webuser.isWebAdmin()) {
	    closelauncher.appendThis(thisElement.parentElement.querySelector("[data-id=containeropen]"), "includes/templates/butclose.php", function(){
	      thisElement.parentElement.querySelector("[data-id=containeropen]").firstElementChild.click();
	    });
	  }
	  else {
	    thisElement.parentElement.querySelector("[data-id=containeropen]").innerHTML="";
	  }
	}, thisNode.produceEventId("butclose"));
	thisNode.addEventListener("deleteNode", function() {
	  webuser.removeEventListener("log", thisNode.produceEventId("butclose"));
	});
      });
      thisElement.addEventListener('click', function(event){
	event.preventDefault();
	DomMethods.setActive(thisNode);
	thisNode.getRelationship("domelements").loadfromhttp({action: "load my tree"}, function() {
	  this.newNode=thisNode.parentNode.newNode.cloneNode(0, null); // we duplicate it so newNode can be reused
	  this.newNode.parentNode=new NodeFemale();
	  this.newNode.parentNode.load(this, 1, "id");
	  console.log("pageframetp",document.getElementById("pageframetp"));
	  var pageframe=getTpContent(document.getElementById("pageframetp")).firstElementChild.cloneNode(true);
	  document.getElementById("centralcontent").innerHTML="";
	  document.getElementById("centralcontent").appendChild(pageframe);
	  this.appendThis(pageframe, "includes/templates/admnlisteners.php");
	  this.refreshChildrenView(pageframe, "includes/templates/paragraph.php");
	});
      });
    </script>
    <div class="btmiddleright" data-id="containeropen"></div>
  </span>
</template>