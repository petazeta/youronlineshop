<template id="nochildrentp">
  <div style="text-align:center;"></div>
  <script>
    if (webuser.isWebAdmin()) {
      var admnlauncher=new NodeMale();
      admnlauncher.myNode=thisNode;
      admnlauncher.refreshView(thisElement, document.getElementById("butaddnewnodetp").content);
    }
  </script>
</template>