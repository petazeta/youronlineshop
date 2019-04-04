<template>
  <div></div>
  <script>
    var launcher=thisNode;
    var thisNode=launcher.thisNode;
    var newNode=launcher.newNode;
    var admnlauncher=new Node();
    admnlauncher.buttons=[{
      template: "templates/butaddnewnode.php",
      args: {thisParent: thisNode, newNode: newNode}
    }];
    admnlauncher.appendThis(thisElement, "templates/admnbuts.php");
  </script>
</template>