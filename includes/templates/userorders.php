<template>
  <table class="list">
    <thead>
      <tr>
	<th style="padding:5px;">Date</th>
	<th style="padding:5px;">Name</th>
	<th style="padding:5px;">Order</th>
	<th style="padding:5px;">Actions</th>
      </tr>
    </thead>
    <tbody></tbody>
    <script>
      //first we load orders from database
      var myform=document.getElementById("formgeneric").cloneNode(true);
      if (webuser.getUserType()=="orders administrator") {
	var ordersrel=new NodeFemale();
	myform.action="sqlrequest.php";
	myform.elements.parameters.value=JSON.stringify({action: "load orders"});
      }
      else {
	var ordersrel=webuser.getRelationship({"name":"orders"});
	myform.elements.parameters.value=JSON.stringify({action: "load my children", user_id: webuser.properties.id});
      }
      ordersrel.setView(myform);
      ordersrel.loadfromhttp(myform, function(){
	//filter orders to new or archived
	  for(var i=0; i<ordersrel.children.length; i++) {
	    if (thisNode.filterorders=="archived") ordersrel.children[i].newstatus=0;
	    else ordersrel.children[i].newstatus=1;
	    if (thisNode.filterorders=="new" && ordersrel.children[i].properties.status!=0 || thisNode.filterorders=="archived" && ordersrel.children[i].properties.status!=1) {
	      ordersrel.children.splice(i,1);
	      i--;
	    }
	  }
	    
	if (webuser.getUserType()=="orders administrator") {
	  //add structure to the result user_id;
	  for(var i=0;i<ordersrel.children.length; i++) {
	    var userrel=new NodeFemale();
	    userrel.properties.childtablename=webuser.parentNode.properties.childtablename;
	    userrel.properties.name="users";
	    var thisUser=new NodeMale();
	    thisUser.properties.id=ordersrel.children[i].properties.user_id;
	    userrel.addChild(thisUser);
	    ordersrel.children[i].relationships[0]=userrel;
	    userrel.partnerNode=ordersrel.children[i];
	    //Also we need to add the order to the user for when deleting it to delete also the user link
	    ordersrel.properties.cloneFromArray(webuser.getRelationship({"name":"orders"}).properties);
	    thisUser.relationships[0]=ordersrel;
	    ordersrel.partnerNode=thisUser;
	  }
	}
	ordersrel.refreshChildrenView(thisElement, "includes/templates/userordersline.php");
      });
    </script>
  </table>
</template>