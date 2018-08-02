<template>
  <span style="z-index:1">
    <a href="" data-hbutton="true"></a>
    <script>
      if (thisNode.selected) DomMethods.setActive(thisNode); //restablish the active status after clonning parent rel and when refreshing setSelected
      thisNode.writeProperty(thisElement, "code");
      var launcher = new Node();
      launcher.thisNode = thisNode;
      launcher.editElement = thisElement;
      launcher.btposition="btmiddleleft";
      launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
      var admnlauncher=new Node();
      admnlauncher.thisNode=thisNode;
      admnlauncher.editElement = thisElement;
      admnlauncher.btposition="btmiddleright";
      admnlauncher.elementsListPos="vertical";
      admnlauncher.newNode=thisNode.parentNode.newNode.cloneNode(0, null); // we duplicate it so newNode can be reused
      admnlauncher.newNode.loadasc(thisNode, 2, "id"); //the parent is not the same
      admnlauncher.newNode.sort_order=thisNode.sort_order + 1;
      admnlauncher.appendThis(thisElement.parentElement, "includes/templates/addadmnbuts.php");

      thisElement.addEventListener("click", function(event) {
	event.preventDefault();
	DomMethods.setActive(thisNode);
	webuser.extra.language=thisNode;
	loadLabels();
	domelementsrootmother.dispatchEvent("changeLanguage");
	return false;
      });
    </script>
  </span>
</template>