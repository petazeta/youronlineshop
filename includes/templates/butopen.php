<template  id="butopentp">
  <a href="javascript:" class="minibtn">
    <img src="includes/css/images/open.png"/>
  </a>
  <script>
    //normalize
    var launcher=thisNode;
    var admnbuts=launcher.admnbuts;
    thisElement.onclick=function(){
      var admnbuts=thisElement.parentElement.parentElement.querySelectorAll(".adminedit");
      for (var i=0; i<admnbuts.length; i++) {
	admnbuts[i].style.display="block";
      }
      launcher.refreshView(thisElement.parentElement, document.getElementById("butclosetp"));
      return false;
    }
  </script>
</template>