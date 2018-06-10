<div class="sidebox" id="catalogbox">
  <div class="boxtitle">
  </div>
  <div class="boxbody">
  </div>
</div>
<template id="catgboxheadtp">
  <div class="adminlauncher adminsinglelauncher">
    <span></span>
    <script>
      thisElement.textContent=thisNode.properties.value || emptyValueText;
    </script>
    <div class="btrightedit"></div>
    <script>
      var addadminbutts=function(){
	var admnlauncher=new NodeMale();
	admnlauncher.buttons=[{
	  template: document.getElementById("butedittp"),
	  args: {myNode: thisNode, editpropertyname:"value", allowedHTML:false, editelement:thisElement.parentElement.firstElementChild}
	}];
	admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
      }
      if (webuser.isWebAdmin()) {
	addadminbutts();
      }
      webuser.addEventListener("log", function() {
	if (!this.isWebAdmin()) {
	  //to remove the editbutton when logs after webadmin
	  thisElement.innerHTML="";
	}
	else {
	  addadminbutts();
	}
      });
    </script>
  </div>
</template>
<template>
  <table class="boxlist">
    <tr>
      <td class="boxlist">
      </td>
    </tr>
  </table>
</template>
<template id="categorytp">
  <div class="adminlauncher adminsinglelauncher">
    <div class="btrightadmn"></div>
    <a href=""></a>
    <script>
      thisNode.getRelationship({name: "itemcategoriesdata"}).loadfromhttp({action: "load my children", language: webuser.extra.language}, function(){
	thisElement.textContent=this.getChild().properties.name || emptyValueText;
	function showButtons(){
	  var admnlauncher=new NodeMale();
	  admnlauncher.buttons=[
	    { 
	      template: document.getElementById("butedittp"),
	      args:{myNode: thisNode.getRelationship({name: "itemcategoriesdata"}).getChild(), editpropertyname:"name", allowedHTML:false, editelement:thisElement}
	    },
	    {
	      template: document.getElementById("butvchpostp"),
	      args:{myNode: thisNode}
	    },
	    {
	      template: document.getElementById("butaddnewnodetp"),
	      args:{myNode: thisNode, sort_order: thisNode.sort_order + 1, branch: thisNode.getRelationship("itemcategoriesdata")}
	    },
	    {
	      template: document.getElementById("butdeletetp"),
	      args:{myNode: thisNode}
	    }
	  ];
	  admnlauncher.refreshView(thisElement.previousElementSibling, document.getElementById("admnbutstp"));
	}
	if (webuser.isWebAdmin()) {
	  showButtons();
	}
	var listenerId=thisNode.parentNode.properties.childtablename + "-" + thisNode.properties.id;
	webuser.addEventListener("log", function() {
	    if (!this.isWebAdmin()) {
	      thisElement.previousElementSibling.innerHTML="";
	    }
	    else {
	      showButtons();
	    }
	}, listenerId);
	thisNode.addEventListener("deleteNode", function() {
	  webuser.removeEventListener("log", listenerId);
	});
      });
      thisElement.addEventListener("click", function(event) {
	event.preventDefault();
	thisNode.setActive();
	thisNode.getRelationship().loadfromhttp({action:"load my tree", deepLevel: 2}, function(){
	  this.refreshView(document.getElementById("centralcontent"),"includes/templates/catalog.php");
	});
	return false;
      });
    </script>
  </div>
</template>
<script>
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  var cartboxtt=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"ctgbxtt"}).getRelationship({name: "domelementsdata"}).getChild();
  cartboxtt.refreshView(document.querySelector("#catalogbox .boxtitle"), document.querySelector("#catgboxheadtp"));

  var categoriesrootmother=new NodeFemale();
  categoriesrootmother.properties.childtablename="TABLE_ITEMCATEGORIES";
  categoriesrootmother.properties.parenttablename="TABLE_ITEMCATEGORIES";
  categoriesrootmother.loadfromhttp({action:"load root"}, function(){
    var categoriesroot=this.getChild();
    categoriesroot.loadfromhttp({action: "load my tree", deepLevel: 3}, function() {
      var categoriesMother=this.getRelationship();
      categoriesMother.addEventListener("refreshChildrenView", function() {
	if (this.children.length==0){
	  if (webuser.isWebAdmin()) {
	    //The node and a data node is inserted
	    var childNode=new NodeMale();
	    childNode.parentNode=this;
	    childNode.relationships[0]=this.partnerNode.getRelationship({name: "itemcategoriesdata"}).cloneNode(0);
	    childNode.getRelationship().addChild(new NodeMale());
	    
	    var admnlauncher=new NodeMale();
	    admnlauncher.myNode=childNode;
	    admnlauncher.buttons=[{
	      template: document.getElementById("butaddnewnodetp"),
	      args: {myNode: childNode, branch: childNode.getRelationship()}
	    }];
	    admnlauncher.refreshView(this.childContainer, document.getElementById("nochildrentp"));
	  }
	  //To remove the add element when log
	  else this.childContainer.innerHTML="";
	}
	//refreshChildrenView listener to fit in columns
	else document.querySelector("#catalogbox .boxbody").appendChild(intoColumns(document.querySelector("#categorytp").previousElementSibling.content.querySelector("table").cloneNode(true), document.querySelector("#catalogbox .boxbody"), 1));
      });
      //When admin add a new node it will be selected
      categoriesMother.addEventListener("addNewNode", function(newnodeadded) {
	newnodeadded.getMyDomNodes()[0].querySelector("a").click();
      });
      //When admin delete a node si estaba seleccionado seleccionamos otro y si era el último borramos lo de la parte central
      categoriesMother.addEventListener("deleteNode", function(nodedeleted) {
	if (nodedeleted.selected) {
	  if (this.children.length>0) {
	    this.children[0].getMyDomNodes()[0].querySelector("a").click();
	  }
	}
	if (this.children.length==0) {
	  //remove subcategories flaps in case we just remove all categories
	  nodedeleted.getRelationship().childContainer.innerHTML="";
	}
      });
      //showing categories
      categoriesMother.refreshChildrenView(document.querySelector("#catalogbox .boxbody"),  document.querySelector("#categorytp"));
      //to refresh the nochildren element when log
      webuser.addEventListener("log", function(){
	if (categoriesMother.children.length==0) {
	  categoriesMother.refreshChildrenView();
	}
      });
    });
  });
});
</script>