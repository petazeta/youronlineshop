<nav></nav>
<template id="menutp">
  <span class="adminlauncher adminsinglelauncher">
    <div class="bttopadmn" data-info='this is for the open close element'></div>
    <div class="btrightnarrow"></div>
    <a href="javascript:"></a>
    <script>
      if (thisNode.selected) DomMethods.setActive(thisNode); //restablish the active status after clonning parent rel and when refreshing setSelected
      thisNode.getRelationship("domelementsdata").loadfromhttp({action:"load my children"}, function(){
	this.getChild.appendProperty(thisElement);
	thisElement.editBtnCName="btinside";
	function showButtons(){
	  var newNode=new NodeMale();
	  newNode.sort_order=thisNode.sort_order + 1;
	  newNode.parentNode=new NodeFemale();
	  newNode.parentNode.loadasc(thisNode.parentNode, 1);
	  //new node comes with datarelationship attached
	  newNode.addRelationship(thisNode.getRelationship({name: "domelements"}).cloneNode(0));
	  newNode.addRelationship(thisNode.getRelationship({name: "domelementsdata"}).cloneNode(0));
	  newNode.getRelationship({name: "domelementsdata"}).addChild(new NodeMale());
	  var admnlauncher=new NodeMale();
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
	  admnlauncher.refreshView(thisElement.previousElementSibling, document.getElementById("butopentp"));
	}
	if (webuser.isWebAdmin()) {
	  showButtons();
	}
	webuser.addEventListener("log", function() {
	  if (!this.isWebAdmin()) {
	    thisElement.previousElementSibling.innerHTML="";
	    thisElement.previousElementSibling.previousElementSibling.innerHTML="";
	  }
	  else {
	    showButtons();
	  }
	}, "category" + thisNode.properties.id);
	thisNode.addEventListener("deleteNode", function() {
	  webuser.removeEventListener("log", "category" + thisNode.properties.id);
	});
      });
      thisNode.getRelationship("domelements").addEventListener("refreshChildrenView", function() {
	//add the add button to the page when no paragraphs
	if (this.children.length==0){
	  if (webuser.isWebAdmin()) {
	    //The node and a data node is inserted
	    var newNode=new NodeMale();
	    newNode.parentNode=new NodeFemale();
	    newNode.parentNode.loadasc(this, 1);
	    //new node comes with datarelationship attached
	    newNode.addRelationship(thisNode.getRelationship({name: "domelements"}).cloneNode(0));
	    newNode.addRelationship(thisNode.getRelationship({name: "domelementsdata"}).cloneNode(0));
	    newNode.getRelationship({name: "domelementsdata"}).addChild(new NodeMale());
	    
	    var admnlauncher=new NodeMale();
	    admnlauncher.buttons=[{
	      template: document.getElementById("butaddnewnodetp"),
	      args: {thisParent: this, newNode: newNode}
	    }];
	    admnlauncher.refreshView(this.childContainer, document.getElementById("nochildrentp"));
	  }
	  //remove the add buton to the page when log after webadmin
	  else this.childContainer.innerHTML="";
	}
      });
      thisElement.addEventListener('click', function(event){
	event.preventDefault();
	DomMethods.setActive(thisNode);
	thisNode.getRelationship("domelements").loadfromhttp({action: "load my tree"}, function() {
	  this.refreshChildrenView(document.getElementById("centralcontent"), document.querySelector("#domelementtp"));
	});
      });
    </script>
  </span>
</template>

<template id="domelementtp">
  <div class="paragraph">
    <div class="adminlauncher adminsinglelauncher">
      <div></div>
      <script>
	  thisNode.getRelationship("domelementsdata").getChild().appendProperty(thisElement);
      </script>
      <div class="btinside"></div>
      <script>
	if (webuser.isWebAdmin()) {
	  var newNode=new NodeMale();
	  newNode.sort_order=thisNode.sort_order + 1;
	  newNode.parentNode=new NodeFemale();
	  newNode.parentNode.loadasc(thisNode.parentNode, 1);
	  //new node comes with datarelationship attached
	  newNode.addRelationship(thisNode.getRelationship({name: "domelements"}).cloneNode(0));
	  newNode.addRelationship(thisNode.getRelationship({name: "domelementsdata"}).cloneNode(0));
	  newNode.getRelationship({name: "domelementsdata"}).addChild(new NodeMale());
	  var admnlauncher=new NodeMale();
	  admnlauncher.buttons=[
	    {
	      template: document.getElementById("butvchpostp"),
	      args:{thisNode: thisNode}
	    },
	    {
	      template: document.getElementById("butaddnewnodetp"),
	      args:{thisParent:thisNode.parentNode, newNode: newNode}
	    },
	    {
	      template: document.getElementById("butdeletetp"),
	      args:{thisNode: thisNode}
	    }
	  ];
	  admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
	}
      </script>
    </div>
  </div>
</template>
<script type="text/javascript">
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  //We load menus and its relationships. We would like to load menus domelementsdata children but not domelements children
  this.getChild().getNextChild({name: "texts"}).loadfromhttp({action:"load my tree", deepLevel: 5}, function(){
    var menusMother=this.getNextChild({name: "nav"}).getRelationship();
    menusMother.addEventListener("refreshChildrenView", function() {
      //add the plush buttons when no menus and webadmin
      if (this.children.length==0){
	if (webuser.isWebAdmin()) {
	  //The node and a data node is inserted
	  var newNode=new NodeMale();
	  newNode.parentNode=new NodeFemale();
	  newNode.parentNode.loadasc(this, 1);
	  //new node comes with datarelationship attached
	  newNode.addRelationship(this.partnerNode.getRelationship({name: "domelements"}).cloneNode(0));
	  newNode.addRelationship(this.partnerNode.getRelationship({name: "domelementsdata"}).cloneNode(0));
	  newNode.getRelationship({name: "domelementsdata"}).addChild(new NodeMale());
	  
	  var admnlauncher=new NodeMale();
	  admnlauncher.buttons=[{
	    template: document.getElementById("butaddnewnodetp"),
	    args: {thisParent: this, newNode: newNode}
	  }];
	  admnlauncher.refreshView(this.childContainer, document.getElementById("nochildrentp"));
	}
	//remove the bouttons when log
	else this.childContainer.innerHTML="";
      }
      else {
	//add edit buttons
	if (webuser.isWebAdmin()) {
	  var candidates=this.childContainer.querySelectorAll("*");
	  candidates.forEach(function(candidate){
	    if (candidate.editionEditable) {
	      //lets wrap it with div.adminsinglelauncher
	      //append the edit childContainer
	      //refresh it with the admnbutstp
	    }
	  });
	}
      }
    });
    //When admin add a new node it will be selected
    menusMother.addEventListener("addNewNode", function(newnodeadded) {
      //we must add relationship domelements
      newnodeadded.getMyDomNodes()[0].querySelector("a").click();
    });
    //When admin delete a node si estaba seleccionado seleccionamos otro y si era el último borramos lo de la parte central
    menusMother.addEventListener("deleteNode", function(nodeDeleted) {
      if (nodeDeleted.selected) {
	if (this.children.length>0) {
	  this.children[0].getMyDomNodes()[0].querySelector("a").click();
	}
      }
      if (this.children.length==0) {
	//remove central content (only when is displayed)
	if (nodeDeleted.getRelationship("domelements").childContainer) nodeDeleted.getRelationship("domelements").childContainer.innerHTML="";
	//to show no children when webadmin
	this.refreshChildrenView();
      }
    });
    //showing menus (after the listeners to refreshChildrenView are added). Refreshing first time first menu is clicked
    menusMother.refreshChildrenView(document.querySelector("#menucontainer nav"), document.querySelector("#menucontainer #menutp"), function(){
      if (this.children.length>0 && !webuser.isWebAdmin()) {
	this.children[0].getMyDomNodes()[0].querySelector("a").click();
      }
    });
    //to refresh the nochildren element when log
    webuser.addEventListener("log", function(){
      if (menusMother.children.length==0) {
	menusMother.refreshChildrenView();
      }
    });
  });
});
</script>