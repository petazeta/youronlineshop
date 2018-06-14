<div></div>
<template>
  <div class="adminlauncher adminsinglelauncher">
    <h1></h1>
    <script>
      thisNode.writeProperty(thisElement);
      //adding the edition pencil
      var launcher = new Node();
      launcher.thisNode = thisNode;
      launcher.editElement = thisElement;
      launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
      //header title
      if (thisNode.properties.value) thisNode.writeProperty(document, null, "title");
    </script>
  </div>
</template>
<script>
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  var headtt=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"top"}).getNextChild({"name":"headtitle"});
  headtt.getRelationship({name: "domelementsdata"}).getChild().refreshView(document.querySelector("#topheadtitle div"), document.querySelector("#topheadtitle template"));
});
</script>