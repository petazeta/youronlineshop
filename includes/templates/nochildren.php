<template id="nochildrentp">
  <div class="adminlauncherfix"></div>
  <script>
    //works from a mother and prompt the addnew button
    if (webuser.isWebAdmin()) {
      //Normalize
      var launcher=thisNode;
      var thisNode=thisNode.myNode;
      var childNode=new NodeMale();
      childNode.parentNode=thisNode;
      var admnlauncher=new NodeMale();
      admnlauncher.myNode=childNode;
      admnlauncher.buttons=[{ template: document.getElementById("butaddnewnodetp"), args: launcher.args}];
      admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
    }
    else {
      thisElement.innerHTML="";
    }
  </script>
</template>