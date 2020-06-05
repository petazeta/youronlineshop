<template>
  <span>
    <a href="javascript:"></a>
    <script>
      thisNode.writeProperty(thisElement);
      //adding the edition pencil
      var launcher = new Node();
      launcher.thisNode = thisNode;
      launcher.editElement = thisElement;
      launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
      thisElement.addEventListener("click", function(ev){
        ev.preventDefault();
        document.getElementById("cartbox").style.visibility="hidden";
      });
    </script>
  </span>
</template>
