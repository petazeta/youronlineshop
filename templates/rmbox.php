<template id="rmboxtp">
  <div class="rmbox">
    <div class="bttopinsiderightinside">
      <button class="minibtn transp" style="font-size:1.4em; font-weight: bold">&times;</button>
      <script>
	//normalize
	var launcher=thisNode;
	var thisNode=launcher.myNode;
	thisElement.onclick=function(){
	  launcher.myContainer.innerHTML="";
	  launcher.dispatchEvent("closewindow");
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