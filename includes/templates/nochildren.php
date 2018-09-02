<template>
  <div class="adminlauncherfix"></div>
  <script>
    var launcher=thisNode;
    var thisNode=launcher.thisNode;
    var newNode=launcher.newNode;
    var admnlauncher=new Node();
    admnlauncher.buttons=[{
      template: "includes/templates/butaddnewnode.php",
      args: {thisParent: thisNode, newNode: newNode}
    }];
    admnlauncher.appendThis(thisElement, "includes/templates/admnbuts.php");
  </script>
</template>