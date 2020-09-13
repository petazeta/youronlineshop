<script type="text/javascript">
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  //We load menus and its relationships. We would like to load menus domelementsdata children but not domelements children
  this.getChild().getNextChild({name: "texts"}).loadfromhttp({action:"load my tree", deepLevel: 5}).then(function(myNode){
    var menusMother=myNode.getNextChild({name: "nav"}).getRelationship();
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
    menusMother.appendThis(document.querySelector("div.menuscontainer"), "templates/admnlisteners.php");

    menusMother.refreshChildrenView(document.querySelector("div.menuscontainer"), "templates/menu.php").then(function(myNode){
      //document.getElementById("centralcontent").innerHTML=""; //We remove any data at the paragraph section for when webadmin is logged
      //the header is hidden till the data is loaded
      //document.querySelector("header > table").style.visibility="visible";
      //remove the init loader image
      document.querySelector("#initloader").style.display="none";
    });
  });
});
</script>
