<template>
  <table class="list">
    <thead>
      <tr>
	<th style="padding:5px;">Date</th>
	<th style="padding:5px;">Name</th>
	<th style="padding:5px;">Order</th>
	<template>
	  <th style="padding:5px;">Actions</th>
	</template>
      </tr>
      <script>
	//first we load orders from database
	if (webuser.getUserType()=="orders administrator") {
	  //create virtual ordersmother
	  var actionsHead=getTpContent(thisElement.querySelector("template")).cloneNode(true);
	  thisElement.appendChild(actionsHead);
	}
      </script>
    </thead>
    <tbody></tbody>
    <script>
      //first we load orders from database
      var myaction="load my children";
      if (webuser.getUserType()=="orders administrator") {
	//create virtual ordersmother
	var ordersRel=new NodeFemale();
	ordersRel.properties.childtablename="TABLE_ORDERS";
	myaction="load all";
      }
      else {
	var ordersRel=webuser.getRelationship({"name":"orders"});
	ordersRel.children=[];
      }
      var myFilter="t.status = 0";
      if (thisNode.filterorders=="archived") myFilter="t.status = 1"
      ordersRel.loadfromhttp({action: myaction, filter: myFilter, user_id: webuser.properties.id}, function(){
	if (this.children.length == 0) {
	  thisElement.innerHTML="";
	  return false;
	}
	if (webuser.getUserType()=="orders administrator") {
	  for (var i=0; i<this.children.length; i++) {
	    this.children[i].addEventListener("deleteNode", function(){
	      ordersRel.removeChild(this);
	      ordersRel.refreshChildrenView();
	    });
	    this.children[i].addEventListener("change order status", function(){
	      ordersRel.removeChild(this);
	      ordersRel.refreshChildrenView();
	    });
	  }
	  this.addEventListener("loadedUser", function(){
	    var finished=true;
	    for (var i=0; i<this.children.length; i++) {
	      if (!this.children[i].parentNode.partnerNode) finished=false;
	    }
	    if (finished) {
	      this.refreshChildrenView(thisElement, "templates/userordersline.php");
	    }
	  });
	  for (var i=0; i<this.children.length; i++) {
	    this.children[i].parentNode=new NodeFemale();
	    this.children[i].parentNode.properties.cloneFromArray(ordersRel.properties);
	    this.children[i].loadfromhttp({action: "load my tree up", user_id: webuser.properties.id}, function(){
	      this.parentNode.partnerNode.parentNode=new NodeFemale();
	      this.parentNode.partnerNode.parentNode.properties.childtablename=this.parentNode.properties.parenttablename;
	      ordersRel.dispatchEvent("loadedUser");
	    });
	  }
	}
	else ordersRel.refreshChildrenView(thisElement, "templates/userordersline.php");
      });
    </script>
  </table>
</template>