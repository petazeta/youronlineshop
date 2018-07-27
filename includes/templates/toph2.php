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