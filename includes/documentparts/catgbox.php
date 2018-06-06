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
	admnlauncher.myNode=thisNode;
	admnlauncher.buttons=[{
	  template: document.getElementById("butedittp"),
	  args: {editpropertyname:"value", allowedHTML:false, editelement:thisElement.parentElement.firstElementChild}
	}];
	admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
      }
      if (webuser.isWebAdmin()) {
	addadminbutts();
      }
      webuser.addEventListener("log", function() {
	if (!this.isWebAdmin()) {
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
	  admnlauncher.myNode=thisNode;
	  admnlauncher.buttons=[
	    {
	      template: document.getElementById("butedittp"),
	      args:{editpropertyname:"name", allowedHTML:false, editelement:thisElement, dataRelationship: thisNode.getRelationship({name: "itemcategoriesdata"})}
	    },
	    {template: document.getElementById("butvchpostp")},
	    {
	      template: document.getElementById("butaddnewnodetp"),
	      args:{sort_order: thisNode.sort_order + 1, dataRelationship: thisNode.getRelationship({name: "itemcategoriesdata"})}
	    },
	    {template: document.getElementById("butdeletetp")}
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
	if (this.children==0){
	  //Add the nochildren node that will be the container of the addnode button in case user is web admin
	  var noChildrenLauncher=new NodeMale();
	  noChildrenLauncher.args={dataRelationship: this.partnerNode.getRelationship({name: "itemcategoriesdata"})};
	  noChildrenLauncher.myNode=this;
	  noChildrenLauncher.refreshView(this.childContainer, document.getElementById("nochildrentp"));
	}
	else catContainer.appendChild(intoColumns(document.querySelector("#categorytp").previousElementSibling.content.querySelector("table").cloneNode(true), catContainer, 1));
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
	  document.getElementById("centralcontent").innerHTML='';
	}
      });
      //showing categories
      var catContainer=document.querySelector("#catalogbox .boxbody");
      categoriesMother.refreshChildrenView(catContainer,  document.querySelector("#categorytp"));
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