<template id="butaddnewnodetp">
  <a href="" class="butadd">
    <img src="includes/css/images/plus.png"/>
  </a>
  <script>
    //normalize
    var launcher=thisNode;
    var thisNode=thisNode.myNode;
    thisElement.addEventListener("click", function(event) {
      event.preventDefault();
      var myresult=new NodeMale();
      myresult.parentNode=new NodeFemale();
      myresult.parentNode.loadasc(thisNode.parentNode,1);
      if (launcher.sort_order) myresult.sort_order=launcher.sort_order;
      if (launcher.dataRelationship) {
	var myrel=myresult.addRelationship(new NodeFemale());
	myrel.load(launcher.dataRelationship,0);
	var mychild=myrel.addChild(new NodeMale());
      }
      myresult.loadfromhttp({action:"add my tree", language:webuser.extra.language, user_id: webuser.properties.id}, function(){
	var thisParent=thisNode.parentNode;
	if (!thisNode.properties.id) thisParent.children=[]; //Adding first child
	thisParent.addChild(myresult);
	thisParent.refreshChildrenView();
	thisParent.dispatchEvent("addNewNode", [myresult]);
      });
      return false;
    });
  </script>
</template>