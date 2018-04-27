<template>
  <table class="formtable"></table>
  <script>
    var addressrel=thisNode.getRelationship({"name":"users_addresses"});
    var myform=document.getElementById("formgeneric").cloneNode(true);
    myform.elements.parameters.value=JSON.stringify({action: "load my children", user_id: webuser.properties.id});
    addressrel.setView(myform);
    addressrel.loadfromhttp(myform, function() {
      var addressdata=thisNode.getRelationship({"name":"users_addresses"}).children[0];
      var userdata=thisNode.getRelationship({"name":"user_userdata"}).children[0];
      addressdata.getTp("includes/templates/singlefieldv.php", function(){
	var coltp=addressdata.xmlTp.cloneNode(true);
	userdata.refreshPropertiesView(thisElement,coltp);
	addressdata.refreshPropertiesView(thisElement,coltp);
	if (true) {
	  var i=0;
	  while (thisElement.rows[i+1]) {
	    var myCell=thisElement.rows[i].insertCell(1);
	    myCell.width="1em";
	    thisElement.rows[i].appendChild(thisElement.rows[i+1].cells[0]);
	    thisElement.deleteRow(i+1);
	    i++;
	  }
	}
      });
    });
  </script>
</template>