<template>
  <table class="formtable">
    <tr></tr>
    <script>
      thisNode.getRelationship("usersdata").loadfromhttp({action: "load my children", user_id: webuser.properties.id}, function() {
	this.children[0].refreshPropertiesView(thisElement,"includes/templates/singlefield.php");
	thisNode.getRelationship("addresses").loadfromhttp({action: "load my children", user_id: webuser.properties.id}, function() {
	  this.children[0].refreshPropertiesView(thisElement,"includes/templates/singlefield.php",function(){
	    var myTable=intoColumns.apply(thisElement, [3]);
	    thisElement.innerHTML='';
	    var myCell = thisElement.insertCell();
	    myCell.appendChild(myTable);
	  });
	});
      });
    </script>
  </table>
</template>