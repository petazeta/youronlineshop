<template>
  <div class="loader">
    <img src="css/images/loader-2.gif">
  </div>
  <div style="padding-top:1em;"></div>
  <script>
    thisNode.getRelationship("domelements").loadfromhttp({action: "load my tree", language: webuser.extra.language.properties.id}).then(function(myNode) {
      myNode.newNode=thisNode.parentNode.newNode.cloneNode(0, null); // we duplicate it so newNode can be reused
      myNode.newNode.parentNode=new NodeFemale();
      myNode.newNode.parentNode.load(this, 1, "id");
      myNode.appendThis(thisElement, "templates/admnlisteners.php");
      myNode.refreshChildrenView(thisElement, "templates/paragraph.php");
    });
  </script>
</template>
