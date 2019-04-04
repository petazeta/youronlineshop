<template>
  <a href="" class="butadd">
    <img src="css/images/plus.png"/>
  </a>
  <script>
    //normalize
    var launcher=thisNode;
    thisElement.addEventListener("click", function(event) {
      event.preventDefault();
      launcher.newNode.loadfromhttp({action:"add my tree", language:webuser.extra.language.properties.id, user_id: webuser.properties.id}, function(){
	launcher.thisParent.addChild(launcher.newNode);
	launcher.thisParent.refreshChildrenView();
	launcher.thisParent.dispatchEvent("addNewNode", [launcher.newNode]);
	//We copy the data row to any language
	if (languages && languages.children.length>1) {
	  var restLanguages=languages.children.slice(0); //copy languages
	  var pos;
	  for (pos=0; pos<restLanguages.length; pos++) {
	    if (restLanguages[pos].properties.id==webuser.extra.language.properties.id) break;
	  }
	  restLanguages.splice(pos,1); //remove the active language from the list
	  var newNodes=launcher.newNode.arrayFromTree();
	  for (var j=0; j<restLanguages.length; j++) {
	    for (var i=0;i<newNodes.length;i++) {
	      if (newNodes[i].constructor==NodeFemale && newNodes[i].properties.language) {
		newNodes[i].loadfromhttp({action:"add my children", language:restLanguages[j].properties.id, user_id: webuser.properties.id});
	      }
	    }
	  }
	}
      });
      return false;
    });
  </script>
</template>