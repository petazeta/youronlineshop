<nav></nav>
<template id="pageframetp">
  <div style="padding-top:1em;"></div>
</template>
<script type="text/javascript">
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  //We load menus and its relationships. We would like to load menus domelementsdata children but not domelements children
  this.getChild().getNextChild({name: "texts"}).loadfromhttp({action:"load my tree", deepLevel: 5}, function(){
    var menusMother=this.getNextChild({name: "nav"}).getRelationship();
    //showing menus (after the listeners to refreshChildrenView are added). Refreshing first time first menu is clicked
    //new node schema
    var newNode=new NodeMale();
    newNode.parentNode=new NodeFemale;
    newNode.parentNode.load(menusMother, 1, 0, "id");
    //new node comes with datarelationship attached
    newNode.addRelationship(menusMother.cloneNode(0, 0));
    newNode.addRelationship(menusMother.partnerNode.getRelationship({name: "domelementsdata"}).cloneNode(0, 0));
    newNode.getRelationship({name: "domelementsdata"}).addChild(new NodeMale());
    menusMother.newNode=newNode;
    menusMother.appendThis(document.querySelector("#menucontainer nav"), "includes/templates/admnlisteners.php", function(){
      //For convenience we start with admnbuts set to visible so we then we got to set themo to hidden
      var closeButtons=function(){
	if (webuser.isWebAdmin()) {
	  var butlist=menusMother.childContainer.querySelectorAll("[data-id=containeropen] a");
	  for (i=0; i<butlist.length; i++) {
	    butlist[i].click();
	  }
	}
      };
      menusMother.addEventListener("refreshChildrenView", closeButtons, "closeButtons");
    });

    menusMother.refreshChildrenView(document.querySelector("#menucontainer nav"), "includes/templates/menu.php", function(){
      document.getElementById("centralcontent").innerHTML=""; //We remove any data at the paragraph section for when webadmin is logged
      //Now we click first menu (page start) or the menu selected at the parameters send by the url
      if (window.location.search) {
	regex = /menu=(\d+)/;
	if (window.location.search.match(regex)) var id = window.location.search.match(regex)[1];
	
	if (id) {
	  var link=document.querySelector("a[href='?menu=" + id + "']");
	  if (link) {
	    link.click();
	    return;
	  }
	}
      }
      else if (this.children.length > 0 && !webuser.isWebAdmin()) { //When webadmin is logged we dont click because we have to wait for the login to be effect I think
	var button=null;
	var myDomNodes=this.children[0].getMyDomNodes();
	for (var i=0; i<myDomNodes.length; i++) {
	  button=myDomNodes[i].querySelector("[data-button]");
	  if (button) {
	    button.click()
	    break;
	  }
	}
      }
    });
  });
});
</script>