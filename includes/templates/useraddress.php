<template>
  <table class="formtable">
    <tr></tr>
    <script>
      var addressrel=thisNode.getRelationship({"name":"addresses"});
      addressrel.loadfromhttp({action: "load my children", user_id: webuser.properties.id}, function() {
	var addressdata=thisNode.getRelationship({"name":"addresses"}).children[0];
	var userdata=thisNode.getRelationship({"name":"usersdata"}).children[0];
	userdata.refreshPropertiesView(thisElement,"includes/templates/singlefield.php");
	addressdata.refreshPropertiesView(thisElement,"includes/templates/singlefield.php",function(){intoColumns.apply(thisElement, [3]);});
      });
    </script>
  </table>
</template>