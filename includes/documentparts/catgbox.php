<div class="sidebox" id="catalogbox">
  <div class="boxtitle">
  </div>
  <div class="boxbody">
  </div>
</div>
<template id="catgboxheadtp">
  <span data-note="relative position container for admn buttons">
    <span></span>
    <script>
      thisNode.writeProperty(thisElement);
      //adding the edition pencil
      var launcher = new Node();
      launcher.thisNode = thisNode;
      launcher.editElement = thisElement;
      launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
    </script>
  </span>
</template>
<template id="categorytbtp">
  <table class="boxlist">
    <tr>
      <td class="boxlist">
      </td>
    </tr>
  </table>
</template>
<template id="categorytp">
  <span style="z-index:1">
    <a href=""></a>
    <script>
      thisNode.getRelationship({name: "itemcategoriesdata"}).loadfromhttp({action: "load my children", language: webuser.extra.language.properties.id}, function(){
	this.getChild().writeProperty(thisElement);
	var launcher = new Node();
	launcher.thisNode = this.getChild();
	launcher.editElement = thisElement;
	launcher.btposition="btmiddleleft";
	launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
	var admnlauncher=new Node();
	admnlauncher.thisNode=thisNode;
	admnlauncher.editElement = thisElement;
	admnlauncher.btposition="btmiddleright";
	admnlauncher.elementsListPos="vertical";
	admnlauncher.newNode=thisNode.parentNode.newNode.cloneNode(0, null); // we duplicate it so newNode can be reused
	admnlauncher.newNode.loadasc(thisNode, 2, "id"); //the parent is not the same
	admnlauncher.newNode.sort_order=thisNode.sort_order + 1;
	admnlauncher.appendThis(thisElement.parentElement, "includes/templates/addadmnbuts.php");
      });
      thisElement.addEventListener("click", function(event) {
	event.preventDefault();
	DomMethods.setActive(thisNode);
	thisNode.getRelationship().loadfromhttp({action:"load my tree", deepLevel: 2}, function(){
	  this.newNode=thisNode.parentNode.newNode.cloneNode(0, null); // we duplicate it so newNode can be reused
	  this.newNode.parentNode=new NodeFemale(); //the parentNode is not the same
	  this.newNode.parentNode.load(this, 1, 0, null, "id");
	  this.appendThis(document.getElementById("centralcontent"), "includes/templates/admnlisteners.php");
	  this.refreshView(document.getElementById("centralcontent"),"includes/templates/catalog.php");
	});
	return false;
      });
    </script>
  </span>
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
    categoriesroot.loadfromhttp({action: "load my tree", deepLevel: 3, language: webuser.extra.language.properties.id}, function() {
      var categoriesMother=this.getRelationship();
      var newNode=new NodeMale();
      newNode.parentNode=new NodeFemale();
      newNode.parentNode.load(categoriesMother, 1, 0, "id");
      //new node comes with datarelationship attached
      newNode.addRelationship(categoriesMother.partnerNode.getRelationship("itemcategories").cloneNode(0, 0));
      newNode.addRelationship(categoriesMother.partnerNode.getRelationship("itemcategoriesdata").cloneNode(0, 0));
      newNode.addRelationship(categoriesMother.partnerNode.getRelationship("items").cloneNode(0, 0));
      newNode.getRelationship("itemcategoriesdata").addChild(new NodeMale());
      categoriesMother.newNode=newNode;
      categoriesMother.appendThis(document.querySelector("#catalogbox .boxbody"), "includes/templates/admnlisteners.php");
      categoriesMother.addEventListener("refreshChildrenView", function(){
	//to set the result in a one column table
	document.querySelector("#catalogbox .boxbody").appendChild(DomMethods.intoColumns(document.querySelector("#categorytbtp").content.querySelector("table").cloneNode(true), document.querySelector("#catalogbox .boxbody"), 1));
      });
      categoriesMother.refreshChildrenView(document.querySelector("#catalogbox .boxbody"),  document.querySelector("#categorytp"), function(){
      });
    });
  });
});
</script>