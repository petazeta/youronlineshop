<template  id="butopentp">
  <a href="javascript:" class="butopen">
    <img src="includes/css/images/open.png"/>
  </a>
  <script>
    //normalize
    var launcher=thisNode;
    var admnbuts=launcher.admnbuts;
    thisElement.onclick=function(){
      admnbuts.style.display="block";
      launcher.refreshView(thisElement.parentElement, document.getElementById("butclosetp"));
      return false;
    }
  </script>
</template>