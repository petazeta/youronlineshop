<template>
  <a href="javascript:" class="minibtn" data-id="openclose">
    <img src="includes/css/images/dots.png"/>
  </a>
  <script>
    //normalize
    var launcher=thisNode;
    thisElement.onclick=function(){
      function changeVisibility(admnbuts){
	for (var i=0; i<admnbuts.length; i++) {
	  if (admnbuts[i].style.visibility=="hidden") admnbuts[i].style.visibility="visible";
	  else admnbuts[i].style.visibility="hidden";
	}
      }
      var editbuts=thisElement.parentElement.parentElement.querySelectorAll("[data-id=butedit]");
      changeVisibility(editbuts);
      var admnbuts=thisElement.parentElement.parentElement.querySelectorAll("[data-id=admnbuts]");
      changeVisibility(admnbuts);
      return false;
    }
  </script>
</template>