<template  id="butclosetp">
  <a href="javascript:" class="butopen">
    <img src="includes/css/images/close.png"/>
  </a>
  <script>
    //normalize
    var launcher=thisNode;
    var admnbuts=launcher.admnbuts;
    thisElement.onclick=function(){
      admnbuts.style.display="none";
      launcher.refreshView(thisElement.parentElement, document.getElementById("butopentp"));
      return false;
    }
  </script>
</template>