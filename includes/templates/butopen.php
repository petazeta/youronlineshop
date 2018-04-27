<template  id="butopentp">
  <a style="" href="" class="singleadminedit butopen">
    <img src="includes/css/images/open.png"/>
  </a>
  <script>
    //thisNode,myNode, thisNode,editelement and thisNode.editpropertyname must have been initiated before. optional thisNode.allowedHTML
    //normalize
    var launcher=thisNode;
    var thisNode=launcher.myNode;
    var containeradmin=thisElement.parentElement.previousElementSibling;
    var containeropen=thisElement.parentElement;
    thisElement.onclick=function(){
      launcher.refreshView(containeradmin, document.getElementById("lnadmnbutstp").content);
      launcher.refreshView(containeropen, document.getElementById("butclosetp").content);
      return false;
    }
  </script>
</template>