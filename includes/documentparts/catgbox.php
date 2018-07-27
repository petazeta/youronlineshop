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
	document.querySelector("#catalogbox .boxbody").appendChild(DomMethods.intoColumns(getTpContent(document.querySelector("#categorytbtp")).querySelector("table").cloneNode(true), document.querySelector("#catalogbox .boxbody"), 1));
      });
      categoriesMother.refreshChildrenView(document.querySelector("#catalogbox .boxbody"),  "includes/templates/category.php", function(){
      });
    });
  });
});
</script>