<template id="butedittp">
  <button class="butedit">
    <img src="includes/css/images/pen.png"/>
  </button>
  <script>
    //normalize
    var launcher=thisNode;
    var thisNode=launcher.thisNode;
    var thisProperty=launcher.thisProperty;
    var editElement=launcher.editElement;
    var inlineEdition=launcher.inlineEdition;
    var thisAttribute=launcher.thisAttribute;
    thisElement.addEventListener("click", function(event) {
      event.preventDefault();
      DomMethods.activeEdition(thisNode, editElement, thisProperty, thisAttribute, inlineEdition);
      if (!(inlineEdition===false)) {
	//disable Intro keyCode for new Line and enable it for submith
	editElement.addEventListener('keydown', introKey);
      }
      editElement.addEventListener("blur", editionFinished);
    });
    function introKey(e) {
      var key = e.which || e.keyCode;
      if (key == 13) { 
	editionFinished();
      }
    }
    function editionFinished(){
      if (!thisProperty) thisProperty=thisNode.getFirstPropertyKey();
      if (!thisAttribute) thisAttribute="innerHTML";
      if (thisNode.properties[thisProperty] != editElement[thisAttribute]) { //just when content change and not void
	thisNode.properties[thisProperty]=editElement[thisAttribute];
	DbMethods.changeProperty(thisNode, thisProperty);
      }
      DomMethods.unActiveEdition(thisNode, editElement, thisProperty, thisAttribute);
      if (!(inlineEdition===false)) {
	//disable Intro keyCode for new Line and enable it for submith
	editElement.removeEventListener('keydown', introKey);
      }
      editElement.removeEventListener("blur", editionFinished);
    }
  </script>
</template>