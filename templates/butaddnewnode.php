<!--
  thisNode: it is the parent
-->
<button type="button" class="butadd">
  <div class="plusimage"></div>
  <script>
    if (window.getComputedStyle(thisElement).backgroundImage) {
      DomMethods.setSizeFromStyle(thisElement);
    }
  </script>
</button>
<script>
  thisElement.addEventListener("click", function(event) {
    event.preventDefault();
    var newNode=thisParams.newNode;
    newNode.loadfromhttp({action:"add my tree", language:webuser.extra.language.properties.id}).then((myNode)=>{
      thisNode.addChild(newNode);
      thisNode.refreshChildrenView().then(()=>thisNode.dispatchEvent("addNewNode", [newNode]));
      //We copy the data row to any language
      if (languages && languages.children.length>1) {
        var restLanguages=languages.children.filter(lang => lang.properties.id!=webuser.extra.language.properties.id);
        var newNodes=newNode.arrayFromTree();
        for (var j=0; j<restLanguages.length; j++) {
          for (var i=0;i<newNodes.length;i++) {
            if (newNodes[i].constructor==NodeFemale && newNodes[i].properties.language) {
              newNodes[i].loadfromhttp({action:"add my children", language:restLanguages[j].properties.id});
            }
          }
        }
      }
    });
    return false;
  });
</script>