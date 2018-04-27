<template  id="butclosetp">
  <a style="" href="" class="singleadminedit butopen">
    <img src="includes/css/images/close.png"/>
  </a>
  <script>
    //thisNode,myNode, thisNode,editelement and thisNode.editpropertyname must have been initiated before. optional thisNode.allowedHTML
    //normalize
    var launcher=thisNode;
    var thisNode=launcher.myNode;
    var containeradmin=thisElement.parentElement.previousElementSibling;
    var containeropen=thisElement.parentElement;
    thisElement.onclick=function(){
      containeradmin.innerHTML="";
      launcher.refreshView(containeropen, document.getElementById("butopentp").content);
      return false;
    }
  </script>
</template>