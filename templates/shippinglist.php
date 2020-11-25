<div id="shippingcontainer" class="boxframe"></div>
<script>
var shippingtypesrootmother=new NodeFemale();
shippingtypesrootmother.properties.childtablename="TABLE_SHIPPINGTYPES";
shippingtypesrootmother.properties.parenttablename="TABLE_SHIPPINGTYPES";
shippingtypesrootmother.loadfromhttp({action:"load root"}).then(function(myNode){
  myNode.getChild().loadfromhttp({action: "load my tree", language: webuser.extra.language.properties.id}).then(function(myNode) {
    DomMethods.adminListeners({thisParent: myNode.getRelationship()});
    myNode.getRelationship().refreshChildrenView(thisElement,  "templates/shippingtype.php");
  });
});
</script>