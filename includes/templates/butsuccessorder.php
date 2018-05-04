<template id="butsuccessordertp">
  <template>
    <form action="dbrequest.php"  style="display:none">
      <input type="hidden" name="json"/>
      <script>
	var mydata=new NodeMale();
	mydata.properties.id=thisNode.properties.id;
	mydata.properties.status=thisNode.newstatus;
	mydata.parentNode=new NodeFemale();
	mydata.parentNode.loadasc(thisNode.parentNode,1);
	thisElement.value=JSON.stringify(mydata);
      </script>
      <input type="hidden" name="parameters" value="" data-js='thisElement.value=JSON.stringify({action:"edit my properties", user_id: webuser.properties.id});'/>
    </form>
  </template>
  <a title="Archive" href="" class="butsucs">
    <img src="includes/css/images/success.png" data-js='if (thisNode.myNode.newstatus==0) thisElement.src="includes/css/images/undo.png";'/>
  </a>
  <script type="text/javascript">
    //normalize
    var launcher=thisNode;
    var thisNode=launcher.myNode;
    if (thisNode.newstatus==0) thisElement.setAttribute("title","Unset Archive");
    var myForm=thisElement.parentElement.querySelector("template").content.querySelector("form").cloneNode(true);
    thisNode.setView(myForm);
    thisElement.parentElement.appendChild(myForm);
    thisElement.onclick=function() {
      var myresult=new NodeMale();
      var thisParent=thisNode.parentNode;
      myresult.loadfromhttp(myForm, function(){
	thisNode.properties.status=thisNode.newstatus;
	thisParent.removeChild(thisNode);
	//for no children add a eventlistener to refreshChildrenView event
	thisParent.refreshChildrenView();
      });
      return false;
    }
  </script>
</template>