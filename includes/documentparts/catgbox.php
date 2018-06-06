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
  <table style="width:100%">
    <tr>
      <td class="row border-bottom">
      </td>
    </tr>
  </table>
</template>
<template id="categorytp">
  <div class="adminlauncher adminsinglelauncher">
    <a href=""></a>
    <script>
      thisNode.getRelationship({name: "itemcategoriesdata"}).loadfromhttp({action: "load my children", language: webuser.extra.language}, function(){
	thisElement.textContent=this.getChild().properties.name || emptyValueText;
      });
      if (thisNode.selected) setSelected.call(closesttagname.call(thisElement, "TR"));
      thisElement.onclick=function(){
	thisNode.setActive();
	var myrel=thisNode.cloneRelationship();
	myrel.loadfromhttp({action:"load my children"}, function(){
	  this.refreshView(document.getElementById("centralcontent"),"includes/templates/catalog.php");
	});
	return false;
      };
    </script>
    <div class="btrightadmn"></div>
    <script>
      if (webuser.isWebAdmin()) {
	var admnlauncher=new NodeMale();
	admnlauncher.myNode=thisNode.getRelationship({name: "itemcategoresdata"}).getChild();
	admnlauncher.buttons=[
	  {
	    template: document.getElementById("butedittp"),
	    args:{editpropertyname:"name", allowedHTML:false, editelement:thisElement.parentElement.firstElementChild}
	  },
	  {template: document.getElementById("butvchpostp")},
	  {template: document.getElementById("butaddnewnodetp"), args:{sort_order: thisNode.sort_order + 1}},
	  {template: document.getElementById("butdeletetp")}
	];
	admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
      }
      var listenerId=thisNode.parentNode.properties.childtablename + "-" + thisNode.properties.id;
      webuser.addEventListener("log", function() {
	  if (!this.isWebAdmin()) {
	    thisElement.innerHTML="";
	  }
	  else {
	    thisNode.render(thisElement.nextElementSibling);
	  }
      }, listenerId);
      thisNode.addEventListener("deleteNode", function() {
	webuser.removeEventListener("log", listenerId);
      });
    </script>
  </div>
</template>
<script>
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  var cartbox=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"ctgbxtt"}).getRelationship({name: "domelementsdata"}).getChild();
  cartbox.refreshView(document.querySelector("#catalogbox .boxtitle"), document.querySelector("#catgboxheadtp"));

  var categoriesrootmother=new NodeFemale();
  categoriesrootmother.properties.childtablename="TABLE_ITEMCATEGORIES";
  categoriesrootmother.properties.parenttablename="TABLE_ITEMCATEGORIES";
  categoriesrootmother.loadfromhttp({action:"load root"}, function(){
    var categoriesroot=this.getChild();
    categoriesroot.loadfromhttp({action: "load my tree", deepLevel: 3}, function() {
      var categoriesMother=this.getRelationship();
      categoriesMother.addEventListener("appendChildren", function() {
	if (this.children==0){
	  //Add the nochildren node that will be the container of the addnode button in case user is web admin
	  var element=this.addChild(new NodeMale());
	  element.refreshView(this.childContainer, document.getElementById("nochildrentp"));
	}
      });
      //When admin add a new node it will be selected
      categoriesMother.addEventListener("addNewNode", function(newnodeadded) {
	newnodeadded.getMyDomNodes()[0].querySelector("a").click();
      });
      //When admin delete a node si estaba seleccionado seleccionamos otro y si era el último borramos lo de la parte central
      categoriesMother.addEventListener("deleteNode", function(nodedeleted) {
	if (nodedeleted.selected) {
	  if (this.children.length>0 && this.children[0].properties.id) {
	    this.children[0].getMyDomNodes()[0].querySelector("a").click();
	  }
	}
	if (this.children.length==1 && !this.children[0].properties.id) {
	  //remove subcategories flaps in case we just remove all categories
	  document.getElementById("centralcontent").innerHTML='';
	}
      });
      //showing categories
      var catContainer=document.querySelector("#catalogbox .boxbody");
      categoriesMother.appendChildren(catContainer,  document.querySelector("#categorytp"));
      catContainer.appendChild(intoColumns(document.querySelector("#categorytp").previousElementSibling.content.querySelector("table").cloneNode(true), catContainer, 1));
      //to refresh the nochildren element when log
      webuser.addEventListener("log", function(){
	if (categoriesMother.children.length==1 && !categoriesMother.children[0].properties.id) {
	  categoriesMother.children=[];
	  categoriesMother.appendChildren();
	}
      });
    });
  });
});
</script>