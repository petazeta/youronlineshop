<template>
  <a title="Archive" href="" class="butsucs">
    <img src="css/images/success.png">
    <script>
      if (thisNode.newStatus==0) {
	thisElement.src="css/images/undo.png";
      }
    </script>
  </a>
  <script type="text/javascript">
    //normalize
    var launcher=thisNode;
    var thisNode=launcher.thisNode;
    if (launcher.newStatus==0) thisElement.setAttribute("title","Unset Archive");
    thisElement.onclick=function() {
      thisNode.loadfromhttp({action:"edit my properties", user_id: webuser.properties.id, properties:{status: launcher.newStatus}}).then(function(myNode){
	myNode.parentNode.removeChild(myNode);
	//for no children add a eventlistener to refreshChildrenView event
	if (myNode.parentNode.childContainer) myNode.parentNode.refreshChildrenView();
	myNode.parentNode.dispatchEvent("change order status", [myNode]);
	myNode.dispatchEvent("change order status")
      });
      return false;
    }
  </script>
</template>