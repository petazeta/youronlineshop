<template>
  <span>
    <button class="btn"></button>
    <script>
      thisNode.writeProperty(thisElement);
      var launcher = new Node();
      launcher.thisNode = thisNode;
      launcher.editElement = thisElement;
      launcher.createInput=true;
      launcher.visibility="visible";
      launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
      thisElement.onclick=function(){  
	mycart.tocheckout();
      }
    </script>
  </span>
</template>