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
      var myresult=new NodeMale();
      myresult.parentNode=new NodeFemale();
      myresult.parentNode.loadasc(thisNode.parentNode,0);
      myresult.properties.id=thisNode.properties.id;
      myresult.properties.status=launcher.newStatus;
      var thisParent=thisNode.parentNode;
      myresult.loadfromhttp({action:"edit my properties", user_id: webuser.properties.id}, function(){
	thisNode.properties.status=launcher.newStatus;
	thisParent.removeChild(thisNode);
	//for no children add a eventlistener to refreshChildrenView event
	if (thisParent.childContainer) thisParent.refreshChildrenView();
	thisParent.dispatchEvent("change order status", [thisNode]);
	thisNode.dispatchEvent("change order status")
      });
      return false;
    }
  </script>
</template>