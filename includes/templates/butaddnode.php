<template id="butaddnodetp">
  <template>
    <form action="dbrequest.php"  style="display:none">
      <input type="hidden" name="json"/>
      <script>
	var mydata=new NodeMale();
	mydata.parentNode=new NodeFemale();
	mydata.parentNode.loadasc(thisNode.parentNode, 1);
	if (thisNode.sort_order) mydata.sort_order=thisNode.sort_order+1;
	thisElement.value=JSON.stringify(mydata);
      </script>
      <input type="hidden" name="parameters" data-js='thisElement.value=JSON.stringify({action:"add myself", user_id: webuser.properties.id});'/>
    </form>
  </template>
  <a href="" class="butadd">
    <img src="includes/css/images/plus.png"/>
  </a>
  <script>
    //normalize
    var launcher=thisNode;
    var thisNode=thisNode.myNode;
    var myForm=thisElement.parentElement.querySelector("template").content.querySelector("form").cloneNode(true);
    thisNode.setView(myForm);
    thisElement.parentElement.appendChild(myForm);
    thisElement.onclick=function() {
      var myresult=new NodeMale();
      myresult.loadfromhttp(myForm, function(){
	var thisParent=thisNode.parentNode;
	if (!thisNode.properties.id) thisParent.children=[]; //Adding first child
	thisParent.addChild(myresult);
	thisParent.refreshChildrenView();
	thisParent.dispatchEvent("addNewNode", [myresult]);
      });
      return false;
    }
  </script>
</template>