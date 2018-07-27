<template>
  <div>
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