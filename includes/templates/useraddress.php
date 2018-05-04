<template>
  <table class="formtable">
    <tr></tr>
    <script>
      var addressrel=thisNode.getRelationship({"name":"users_addresses"});
      var myform=document.getElementById("formgeneric").cloneNode(true);
      myform.elements.parameters.value=JSON.stringify({action: "load my children", user_id: webuser.properties.id});
      addressrel.setView(myform);
      addressrel.loadfromhttp(myform, function() {
	var addressdata=thisNode.getRelationship({"name":"users_addresses"}).children[0];
	var userdata=thisNode.getRelationship({"name":"user_userdata"}).children[0];
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