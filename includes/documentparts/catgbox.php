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
      categoriesMother.appendThis(document.querySelector("#catalogbox .boxbody"), "templates/admnlisteners.php", function() {
        this.refreshChildrenView(document.querySelector("#catalogbox .boxbody"),  "templates/category.php", function(){
          if (window.location.search) {
            regex = /category=(\d+)/;
            if (window.location.search.match(regex)) var id = window.location.search.match(regex)[1];
            if (id) {
              var link=document.querySelector("a[href='?category=" + id + "']");
              if (link) {
                link.click();
              }
            }
          }
          //Now we click first cat at page start (if no url)
          if (this.children.length > 0 && !webuser.isWebAdmin() && Config.defaultcat_On) { //When webadmin is logged we dont click because we have to wait for the login to be effect I think
            regex = /(\d+)/; //No number then no url state
            if (!(window.location.search && window.location.search.match(regex))) {
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
          }
        });
      });
    });
  });
});
</script>
