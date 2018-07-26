<template>
  <a href="" class="butadd">
    <img src="includes/css/images/plus.png"/>
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
      });
      return false;
    });
  </script>
</template>