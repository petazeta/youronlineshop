<template id="checkout1tp">
  <div class="msgbox">
    Check if your order is ok and then click on Continue to get to the next step.
  </div>
  <p style="text-align:center;"><b>Your order:</b></p>
  
  <div></div>
  <script>
    //First we must create a clone of mycart to not modify mycart.
    var ordercart=new NodeMale();
    ordercart.loadasc(mycart);
    ordercart.load(mycart);
    var cartboxitems=ordercart.getRelationship({name:"cartbox"}).children[0].getRelationship({name:"cartboxitem"});
    cartboxitems.refreshView(thisElement, "includes/templates/order.php");
  </script>
  <div style="width:100%; text-align:center;">
    <a class="btn" href="">OK!! Continue</a>
    <script>
      //First we create a clone of mycart to not include modifications made at mycart.
      var ordercart=new NodeMale();
      ordercart.loadasc(mycart);
      ordercart.load(mycart);
      thisElement.onclick=function(){
	var insertuser=new NodeMale();
	insertuser.loadasc(webuser);
	insertuser.load(webuser);
	//Now we start to load rels so webuser clon: insertuser will be empty of any data
	var myform=document.getElementById("formgeneric").cloneNode(true);
	myform.elements.namedItem("parameters").value=JSON.stringify({action: "load my relationships", user_id: webuser.properties.id});
	insertuser.setView(myform); 
	insertuser.loadfromhttp(myform, function(){
	  insertuser.properties.id=webuser.properties.id;
	  insertuser.getRelationship({name:"orders"}).addChild(new NodeMale());
	  var myorder=insertuser.getRelationship({name:"orders"}).children[0];
	  var myform=document.getElementById("formgeneric").cloneNode(true);
	  myform.elements.namedItem("parameters").value=JSON.stringify({action: "load my relationships", user_id: webuser.properties.id});
	  myorder.setView(myform);
	  myorder.loadfromhttp(myform, function(){
	    var myordercartitems=ordercart.getRelationship({name:"cartbox"}).children[0].getRelationship({name:"cartboxitem"}).children;
	    for (var i=0; i<myordercartitems.length; i++) {
	      var myorderitemdata=new NodeMale();
	      myorderitemdata.load(myordercartitems[i]);
	      var itemid=myorderitemdata.properties.id; //orderitem id is not from orderitem but from item
	      delete myorderitemdata.properties.id;
	      myorder.getRelationship({name:"orderitems"}).addChild(myorderitemdata);
	    }
	    //lets try to insert the order
	    //This request adds descendents
	    var myresult=new NodeMale();
	    var myform=document.getElementById("formgenerictree").cloneNode(true);
	    myorder.setView(myform);
	    myform.elements.namedItem("parameters").value=JSON.stringify({action: "add my tree", user_id: webuser.properties.id});
	    myresult.loadfromhttp(myform, function(){
	      myalert.load({properties:{alertmsg: "Order items saved.", timeout:2000}});
	      myalert.showalert();
	      myresult.refreshView(document.getElementById("centralcontent"),"includes/templates/checkout2.php");
	      //We remove the items from the cart
	      mycart.getRelationship({name:"cartitem"}).children=[];
	      mycart.refreshcartbox();
	    });
	  });
	});
	return false;
      };
    </script>
  </div>
</template>