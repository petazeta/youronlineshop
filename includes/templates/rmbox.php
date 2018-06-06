<template id="rmboxtp">
  <div class="rmbox">
    <div class="btrighttop">
      <a href="" class="btn" style="font-size:1.4em;">&times;</a>
      <script>
	//normalize
	var launcher=thisNode;
	var thisNode=launcher.myNode;
	thisElement.onclick=function(){
	  launcher.myContainer.innerHTML="";
	  launcher.dispatchEvent("closewindow");
	  return false;
	}
      </script>
    </div>
    <div></div>
    <script>
      //normalize
      var launcher=thisNode;
      var thisNode=launcher.myNode;
      thisNode.refreshView(thisElement, thisNode.myTp);
    </script>
  </div>
</template>