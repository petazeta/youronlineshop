<template id="butsuccessordertp">
  <template>
    <form action="dbrequest.php"  style="display:none">
      <input type="hidden" name="json"/>
      <script>
	var mydata=new NodeMale();
	mydata.properties.id=thisNode.properties.id;
	mydata.parentNode=new NodeFemale();
	mydata.parentNode.loadasc(thisNode.parentNode,1);
	thisElement.value=JSON.stringify(mydata);
      </script>
      <input type="hidden" name="status">
      <input type="hidden" name="parameters" value="" data-js='thisElement.value=JSON.stringify({action:"edit my properties", user_id: webuser.properties.id});'/>
    </form>
  </template>
  <a title="Archive" href="" class="butsucs">
    <img src="includes/css/images/success.png" data-js='if (thisNode.newStatus==0) thisElement.src="includes/css/images/undo.png";'/>
  </a>
  <script type="text/javascript">
    //normalize
    var launcher=thisNode;
    var thisNode=launcher.myNode;
    if (launcher.newStatus==0) thisElement.setAttribute("title","Unset Archive");
    var myForm=thisElement.parentElement.querySelector("template").content.querySelector("form").cloneNode(true);
    myForm.elements.status.value=launcher.newStatus;
    thisNode.setView(myForm);
    thisElement.parentElement.appendChild(myForm);
    thisElement.onclick=function() {
      var myresult=new NodeMale();
      var thisParent=thisNode.parentNode;
      myresult.loadfromhttp(myForm, function(){
	thisNode.properties.status=thisNode.newStatus;
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