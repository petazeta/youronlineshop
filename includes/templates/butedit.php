<template  id="butedittp">
  <template>
    <form action="dbrequest.php"  style="display:none">
      <input type="hidden" name="json">
      <script>
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
  </template>
  <a style="" href="" class="singleadminedit butedit">
    <img src="includes/css/images/pen.png"/>
  </a>
  <script>
    //thisNode,myNode, thisNode,editelement and thisNode.editpropertyname must have been initiated before. optional thisNode.allowedHTML
    //normalize
    var launcher=thisNode;
    var thisNode=launcher.myNode;
    var editpropertyname="value";
    if (launcher.editpropertyname) editpropertyname=launcher.editpropertyname;
    thisElement.editelement=launcher.editelement;
    if (launcher.allowedHTML) thisElement.editelement.allowedHTML=true;
    var myForm=thisElement.parentElement.querySelector("template").content.querySelector("form").cloneNode(true);
    thisNode.render(myForm);
    thisElement.parentElement.appendChild(myForm);
    var editfield=document.createElement("input");
    editfield.name=editpropertyname;
    editfield.type="hidden";
    myForm.appendChild(editfield);
    thisElement.onclick=function() {
      activeedition.call(this.editelement, thisNode, editfield);
      return false;
    };
  </script>
</template>