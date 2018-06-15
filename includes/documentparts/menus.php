<nav></nav>
<template id="menutp">
  <span class="menu" data-note="relative position container for admn buttons">
    <a data-button="true" class="menu" href="javascript:"></a>
    <script>
      if (thisNode.selected) DomMethods.setActive(thisNode); //restablish the active status after clonning parent rel and when refreshing setSelected
      thisNode.getRelationship("domelementsdata").loadfromhttp({action:"load my children"}, function(){
	this.getChild().writeProperty(thisElement);
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
	var closelauncher=new Node();
	admnlauncher.appendThis(thisElement.parentElement, "includes/templates/addadmnbuts.php", function(){
	  closelauncher.admnbuts=thisElement.parentElement.lastElementChild.previousElementSibling;
	  if (webuser.isWebAdmin()) {
	    closelauncher.appendThis(thisElement.parentElement.querySelector("[data-id=containeropen]"), "includes/templates/butclose.php");
	  }
	});
	if (!webuser.eventExists("log",thisNode.parentNode.properties.childtablename + thisNode.properties.id + "butclose")) {
	  webuser.addEventListener("log", function(){
	    if (webuser.isWebAdmin()) {
	      closelauncher.appendThis(thisElement.parentElement.querySelector("[data-id=containeropen]"), "includes/templates/butclose.php");
	      closelauncher.admnbuts.style.display="block"; //we ensure they are in displayed mod
	    }
	    else {
	      thisElement.parentElement.querySelector("[data-id=containeropen]").innerHTML="";
	    }
	  },thisNode.parentNode.properties.childtablename + thisNode.properties.id + "butclose");
	  thisNode.addEventListener("deleteNode", function() {
	    webuser.removeEventListener("log", thisNode.parentNode.properties.childtablename + thisNode.properties.id + "butclose");
	  });
	}
      });
      thisElement.addEventListener('click', function(event){
	event.preventDefault();
	DomMethods.setActive(thisNode);
	thisNode.getRelationship("domelements").loadfromhttp({action: "load my tree"}, function() {
	  this.newNode=thisNode.parentNode.newNode.cloneNode(0, null); // we duplicate it so newNode can be reused
	  this.newNode.parentNode=new NodeFemale(); //the parentNode is not the same
	  this.newNode.loadasc(thisNode, 2, "id");
	  this.appendThis(document.getElementById("centralcontent"), "includes/templates/admnlisteners.php")
	  this.refreshChildrenView(document.getElementById("centralcontent"), document.querySelector("#domelementtp"));
	});
      });
    </script>
    <div class="btrightmiddle" data-id="containeropen"></div>
  </span>
</template>
<template id="domelementtp">
  <div class="paragraph">
      <div></div>
      <script>
	thisNode.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
	var launcher = new Node();
	launcher.thisNode = thisNode.getRelationship("domelementsdata").getChild();
	launcher.editElement = thisElement;
	launcher.btposition="btmiddleleft";
	launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
	var admnlauncher=new Node();
	admnlauncher.thisNode=thisNode;
	admnlauncher.editElement = thisElement;
	admnlauncher.btposition="bttopleftinside";
	//We create a schematic node to add also a domelementsdata child node to the database
	admnlauncher.newNode=thisNode.parentNode.newNode.cloneNode(0, null); // we duplicate it so newNode can be reused
	admnlauncher.newNode.loadasc(thisNode, 2, "id")
	admnlauncher.newNode.sort_order=thisNode.sort_order + 1;
	admnlauncher.appendThis(thisElement.parentElement, "includes/templates/addadmnbuts.php");
      </script>
  </div>
</template>
<script type="text/javascript">
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  //We load menus and its relationships. We would like to load menus domelementsdata children but not domelements children
  this.getChild().getNextChild({name: "texts"}).loadfromhttp({action:"load my tree", deepLevel: 5}, function(){
    var menusMother=this.getNextChild({name: "nav"}).getRelationship();
    //showing menus (after the listeners to refreshChildrenView are added). Refreshing first time first menu is clicked
    //new node schema
    var newNode=new NodeMale();
    newNode.parentNode=new NodeFemale();
    newNode.parentNode.load(menusMother, 1, 0, "id");
    //new node comes with datarelationship attached
    newNode.addRelationship(menusMother.partnerNode.getRelationship({name: "domelements"}).cloneNode(0, 0));
    newNode.addRelationship(menusMother.partnerNode.getRelationship({name: "domelementsdata"}).cloneNode(0, 0));
    newNode.getRelationship({name: "domelementsdata"}).addChild(new NodeMale());
    menusMother.newNode=newNode;
    menusMother.appendThis(document.querySelector("#menucontainer nav"), "includes/templates/admnlisteners.php")
    menusMother.refreshChildrenView(document.querySelector("#menucontainer nav"), document.querySelector("#menucontainer #menutp"), function(){
      if (this.children.length > 0) {
	var button=null;
	this.children[0].getMyDomNodes().forEach(function(domNode){
	  button=domNode.querySelector("[data-button]");
	});
	if (button) button.click();
      }
    });
  });
});
</script>