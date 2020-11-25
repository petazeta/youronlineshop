<script type="text/javascript">
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  //We load menus and its relationships. We would like to load menus domelementsdata children but not domelements children
  this.getChild().getNextChild({name: "texts"}).loadfromhttp({action:"load my tree", deepLevel: 5}).then(function(myNode){
    var menusMother=myNode.getNextChild({name: "nav"}).getRelationship();
    //showing menus (after the listeners to refreshChildrenView are added). Refreshing first time first menu is clicked
    //menusMother.appendThis(document.querySelector("div.menuscontainer"), "templates/admnlisteners.php");
    DomMethods.adminListeners({thisParent: menusMother, refreshOnLog: true});
    //remove the init loader image
    menusMother.refreshChildrenView(document.querySelector("div.menuscontainer"), "templates/menu.php").then(() => document.querySelector("#initloader").style.display="none");
  });
});
</script>
