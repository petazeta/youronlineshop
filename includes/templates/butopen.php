<template  id="butopentp">
  <a style="" href="" class="singleadminedit butopen">
    <img src="includes/css/images/open.png"/>
  </a>
  <script>
    //thisNode,myNode, thisNode,editelement and thisNode.editpropertyname must have been initiated before. optional thisNode.allowedHTML
    //normalize
    var launcher=thisNode;
    var containeradmin=thisElement.parentElement.previousElementSibling;
    var containeropen=thisElement.parentElement;
    thisElement.onclick=function(){
      launcher.refreshView(containeradmin, document.getElementById("admnbutstp"));
      launcher.refreshView(containeropen, document.getElementById("butclosetp"));
      return false;
    }
  </script>
</template>