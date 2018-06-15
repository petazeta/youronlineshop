<template id="butsuccessordertp">
  <a title="Archive" href="" class="butsucs">
    <img src="includes/css/images/success.png" data-js='if (thisNode.newStatus==0) thisElement.src="includes/css/images/undo.png";'/>
  </a>
  <script type="text/javascript">
    //normalize
    var launcher=thisNode;
    var thisNode=launcher.myNode;
    if (launcher.newStatus==0) thisElement.setAttribute("title","Unset Archive");
    thisElement.onclick=function() {
      thisNode.loadfromhttp({action:"edit my properties", user_id: webuser.properties.id, properties:{status: launcher.newStatus}}, function(){
	this.parentNode.removeChild(this);
	//for no children add a eventlistener to refreshChildrenView event
	if (this.parentNode.childContainer) this.parentNode.refreshChildrenView();
	this.parentNode.dispatchEvent("change order status", [this]);
	this.dispatchEvent("change order status")
      });
      return false;
    }
  </script>
</template>