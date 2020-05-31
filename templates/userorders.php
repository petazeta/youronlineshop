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
      if (thisNode.filterorders=="archived") myFilter="t.status = 1";
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
          var myparams=[];
          var mydatanodes=[];
	  for (var i=0; i<this.children.length; i++) {
	    this.children[i].parentNode=new NodeFemale();
	    this.children[i].parentNode.properties.cloneFromArray(ordersRel.properties);
            myparams.push({action:"load my tree up"});
            mydatanodes.push(this.children[i].toRequestData({action:"load my tree up"}));
	  }
          var nodeRequest=new Node();
          nodeRequest.loadfromhttp({"parameters":myparams, "nodes":mydatanodes}, function(){
            for (var i=0; i<this.nodelist.length; i++) {
              ordersRel.children[i].parentNode=this.nodelist[i].parentNode;
              ordersRel.children[i].parentNode.partnerNode.parentNode=new NodeFemale();
              ordersRel.children[i].parentNode.partnerNode.parentNode.properties.childtablename=ordersRel.children[i].parentNode.properties.parenttablename;
            }
            ordersRel.refreshChildrenView(thisElement, "templates/userordersline.php");
          });
	}
	else ordersRel.refreshChildrenView(thisElement, "templates/userordersline.php");
      });
    </script>
  </table>
</template>