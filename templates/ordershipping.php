<template>
  <table style="margin-left:auto;">
    <tr>
      <td>
	<span style="margin-right:0.5em"></span>
	<script>
	  thisNode.writeProperty(thisElement, "name");
	  var launcher = new Node();
	  launcher.thisNode = thisNode;
	  launcher.editElement = thisElement;
	  launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
	</script>
      </td>
      <td>
	<span></span>
	<script>
	  thisNode.writeProperty(thisElement, "price");
	  var launcher = new Node();
	  launcher.thisNode = thisNode;
	  launcher.editElement = thisElement;
	  launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
	</script>
	<span></span>
	<script>
	  var currency=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"currency"}).getRelationship({name: "domelementsdata"}).getChild();
	  currency.writeProperty(thisElement);
	</script>
      </td>
    </tr>
  </table>
</template>