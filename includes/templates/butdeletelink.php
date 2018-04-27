<template id="butdeletelinktp">
  <a href="" style="margin:2px" data-js='
    var thisParent=thisNode.parentNode;
    var myForm=thisElement.getElementsByTagName("form")[0];
    thisElement.onclick=function() {
      var myresult=new NodeMale();
      var myForm=this.getElementsByTagName("form")[0];
      myresult.loadfromhttp(myForm, function(){
	thisParent.removeChild(thisNode);
	if (thisParent.children.length==0) {
	  var element=thisParent.addChild(new NodeMale());
	  element.myTp=thisParent.getrootnode().addnewnodeTp.cloneNode(true);
	  element.myContainer=thisParent.childContainer;
	  element.refreshView();
	}
	else thisParent.refreshChildrenView();
      });
      return false;
    }
  '>
    <form action="dbrequest.php" style="display:none">
      <input type="hidden" name="json" data-js='
	var mydata=new NodeMale();
	mydata.properties.id=thisNode.properties.id;
	mydata.sort_order=thisNode.sort_order;
	mydata.parentNode=new NodeFemale();
	mydata.parentNode.loadasc(thisNode.parentNode, 1);
	thisElement.value=JSON.stringify(mydata);
      '/>
      <input type="hidden" name="parameters" value='{"action":"delete my link"}'/>
    </form>
    <img src="includes/css/images/trashrel.png"/>
  </a>
</template>