<template>
  <table class="formtable">
    <tr></tr>
    <script>
      var addressrel=thisNode.getRelationship({"name":"addresses"});
      addressrel.loadfromhttp({action: "load my children", user_id: webuser.properties.id}, function() {
	var addressdata=thisNode.getRelationship({"name":"addresses"}).children[0];
	var userdata=thisNode.getRelationship({"name":"usersdata"}).children[0];
	addressdata.getTp("includes/templates/singlefield.php", function(){
	  var celltp=addressdata.xmlTp.cloneNode(true);
	  userdata.refreshPropertiesView(thisElement,celltp);
	  addressdata.refreshPropertiesView(thisElement,celltp);
	  // 2 columns distribution	  
	  intoColumns.apply(thisElement, [3]);
	});
      });
    </script>
  </table>
</template>