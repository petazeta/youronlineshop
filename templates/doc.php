<template>
  <div class="loader">
    <img src="css/images/loader-2.gif">
  </div>
  <div style="padding-top:1em;"></div>
  <script>
    thisNode.getRelationship("domelements").loadfromhttp({action: "load my tree", language: webuser.extra.language.properties.id}, function() {
      this.newNode=thisNode.parentNode.newNode.cloneNode(0, null); // we duplicate it so newNode can be reused
      this.newNode.parentNode=new NodeFemale();
      this.newNode.parentNode.load(this, 1, "id");
      this.appendThis(thisElement, "templates/admnlisteners.php");
      this.refreshChildrenView(thisElement, "templates/paragraph.php");
    });
  </script>
</template>
