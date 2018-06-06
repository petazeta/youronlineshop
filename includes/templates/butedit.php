<template  id="butedittp">
  <a style="" href="" class="singleadminedit butedit">
    <img src="includes/css/images/pen.png"/>
    <form  style="display:none">
      <input type="hidden">
      <script>
	//normalize
	var launcher=thisNode;
	thisElement.name=launcher.editpropertyname;
      </script>
      <input type="hidden" name="json">
      <script>
	//normalize
	var launcher=thisNode;
	var thisNode=launcher.myNode;
	if (launcher.dataRelationship) thisNode=launcher.dataRelationship.getChild();
	var mydata=new NodeMale();
	mydata.properties.id=thisNode.properties.id;
	mydata.parentNode=new NodeFemale();
	mydata.parentNode.loadasc(thisNode.parentNode,1);
	thisElement.value=JSON.stringify(mydata);
      </script>
      <input type="hidden" name="parameters">
      <script>
	thisElement.value=JSON.stringify({action:"edit my properties", user_id: webuser.properties.id});
      </script>
    </form>
  </a>
  <script>
    //thisNode,myNode, thisNode,editelement and thisNode.editpropertyname must have been initiated before. optional thisNode.allowedHTML
    //normalize
    var launcher=thisNode;
    var thisNode=launcher.myNode;
    if (launcher.dataRelationship) thisNode=launcher.dataRelationship.getChild();
    thisElement.editelement=launcher.editelement;
    if (launcher.allowedHTML) thisElement.editelement.allowedHTML=true;
    thisElement.onclick=function() {
      activeedition.call(this.editelement, thisNode, thisElement.querySelector("input[name=" + launcher.editpropertyname + "]"));
      return false;
    };
  </script>
</template>