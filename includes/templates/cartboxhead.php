<template>
  <span>
    <a href="javascript:"></a>
    <script>
      thisNode.writeProperty(thisElement);
      //adding the edition pencil
      var launcher = new Node();
      launcher.thisNode = thisNode;
      launcher.editElement = thisElement;
      launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
      thisElement.addEventListener("click", function(ev){
	ev.preventDefault();
	mycart.tocheckout();
      });
    </script>
  </span>
</template>