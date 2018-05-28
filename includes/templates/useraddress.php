<template>
  <template>
    <table class="formtable">
      <tr>
	<td>
	</td>
      </tr>
    </table>
  </template>
  <div></div>
  <script>
    thisNode.getRelationship("usersdata").loadfromhttp({action: "load my children", user_id: webuser.properties.id}, function() {
      this.children[0].appendProperties(thisElement,"includes/templates/singlefield.php");
      thisNode.getRelationship("addresses").loadfromhttp({action: "load my children", user_id: webuser.properties.id}, function() {
	this.children[0].appendProperties(thisElement,"includes/templates/singlefield.php",function(){
	  thisElement.appendChild(intoColumns(thisElement.previousElementSibling.content.querySelector("table").cloneNode(true), thisElement, 3));
	});
      });
    });
  </script>
</template>