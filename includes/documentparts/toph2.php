<div></div>
<template>
  <div class="adminlauncher adminsinglelauncher">
    <h2></h2>
    <script>
      thisNode.writeProperty(thisElement);
      //adding the edition pencil
      var launcher = new Node();
      launcher.thisNode = thisNode;
      launcher.editElement = thisElement;
      launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
    </script>
  </div>
</template>
<script>
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  var headtt=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"top"}).getNextChild({"name":"headsubtitle"});
  headtt.getRelationship({name: "domelementsdata"}).getChild().refreshView(document.querySelector("#topheadsubtitle div"), document.querySelector("#topheadsubtitle template"));
});
</script>