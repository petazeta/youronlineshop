<template>
  <span>
    <button class="btn"></button>
    <script>
      thisNode.writeProperty(thisElement);
      var launcher = new Node();
      launcher.thisNode = thisNode;
      launcher.editElement = thisElement;
      launcher.createInput=true;
      launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
      thisElement.onclick=function(){  
	mycart.tocheckout();
      }
    </script>
  </span>
</template>