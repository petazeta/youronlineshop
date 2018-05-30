<template>
  <template>
    <table class="formtable">
      <tr>
	<td>
	</td>
      </tr>
    </table>
  </template>
  <div style="visibility: hidden"></div>
  <script>
    var addressColumns=3;
    if (window.screen.width < 700) {
      addressColumns=2;
    }
    thisNode.getRelationship("usersdata").loadfromhttp({action: "load my children", user_id: webuser.properties.id}, function() {
      this.children[0].appendProperties(thisElement,"includes/templates/singlefield.php");
      thisNode.getRelationship("addresses").loadfromhttp({action: "load my children", user_id: webuser.properties.id}, function() {
	this.children[0].appendProperties(thisElement,"includes/templates/singlefield.php",function(){
	  thisElement.appendChild(intoColumns(thisElement.previousElementSibling.content.querySelector("table").cloneNode(true), thisElement, addressColumns));
	  thisElement.style.visibility="visible";
	});
      });
    });
  </script>
</template>