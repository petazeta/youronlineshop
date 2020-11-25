<div class="sidebox leftsidebox" id="catalogbox">
  <div class="boxtitle"></div>
  <div class="boxbody"></div>
</div>
<script>
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  var catgboxtt=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"ctgbxtt"}).getRelationship({name: "domelementsdata"}).getChild();
  catgboxtt.refreshView(document.querySelector("#catalogbox .boxtitle"), "templates/boxhead.php");

  var categoriesrootmother=new NodeFemale();
  categoriesrootmother.properties.childtablename="TABLE_ITEMCATEGORIES";
  categoriesrootmother.properties.parenttablename="TABLE_ITEMCATEGORIES";
  categoriesrootmother.loadfromhttp({action:"load root"}).then(function(myNode){
    var categoriesroot=myNode.getChild();
    categoriesroot.loadfromhttp({action: "load my tree", deepLevel: 3, language: webuser.extra.language.properties.id}).then(function(myNode) {
      DomMethods.adminListeners({thisParent: myNode.getRelationship(), refreshOnLog: true});
      myNode.getRelationship().refreshChildrenView(document.querySelector("#catalogbox .boxbody"),  "templates/category.php");
    });
  });
});
</script>
