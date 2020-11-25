<!-- 
This template shows the user data and user address.
Param showAddress to show also address data
Param fieldtype: input / textnode
-->
<div class="useraddressbox"></div>
<script>
var fieldtp="templates/singleinput.php";
if (thisParams.fieldtype=="textnode") {
  fieldtp="templates/singlefield.php";
}
thisNode.getRelationship("usersdata").loadfromhttp({action: "load my children"}).then(function(myNode) {
  var tableLabels=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name: myNode.properties.childtablename});
  myNode.getChild().refreshPropertiesView(thisElement, fieldtp, {labelNode: tableLabels});
  if (thisParams.showAddress) {
    thisNode.getRelationship("addresses").loadfromhttp({action: "load my children"}).then(function(myNode) {
      var tableLabels=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name: myNode.properties.childtablename});
      myNode.getChild().appendProperties(thisElement, fieldtp, {labelNode: tableLabels});
    });
  }
});
</script>