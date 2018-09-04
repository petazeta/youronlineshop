<template>
  <div class="paragraph">
      <div></div>
      <script>
	thisNode.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
	thisNode.render(thisElement); //To execute scripts
	var launcher = new Node();
	launcher.thisNode = thisNode.getRelationship("domelementsdata").getChild();
	launcher.editElement = thisElement;
	launcher.btposition="bttopleft";
	launcher.inlineEdition=false;
	launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
	var admnlauncher=new Node();
	admnlauncher.thisNode=thisNode;
	admnlauncher.editElement = thisElement;
	admnlauncher.btposition="bttopleftinside";
	admnlauncher.elementsListPos="vertical";
	//We create a schematic node to add also a domelementsdata child node to the database
	admnlauncher.newNode=thisNode.parentNode.newNode.cloneNode(0, null); // we duplicate it so newNode can be reused
	admnlauncher.newNode.loadasc(thisNode, 2, "id")
	admnlauncher.newNode.sort_order=thisNode.sort_order + 1;
	admnlauncher.appendThis(thisElement.parentElement, "includes/templates/addadmnbuts.php");
      </script>
  </div>
</template>