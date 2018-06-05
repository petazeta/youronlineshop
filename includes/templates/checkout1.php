<template id="checkout1tp">
  <template>
  <div class="msgbox">
    Check if your order is ok and then click on Continue to get to the next step.
  </div>
  <script>
    thisElement.textContent=thisNode.getNextChild({"name":"chkt1add"}).getRelationship({name:"domelementsdata"}).getChild().properties.value;
  </script>
  <div class="btrightedit"></div>
  <script>
    var addadminbutts=function(){
      var admnlauncher=new NodeMale();
      admnlauncher.myNode=thisNode.getNextChild({"name":"chkt1add"}).getRelationship({name:"domelementsdata"}).getChild();
      admnlauncher.buttons=[{
	template: document.getElementById("butedittp"),
	args: {editpropertyname:"value", allowedHTML:false, editelement:thisElement.parentElement.firstElementChild}
      }];
      admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
    }
    if (webuser.isWebAdmin()) {
      addadminbutts();
    }
    webuser.addEventListener("log", function() {
      if (!this.isWebAdmin()) {
	thisElement.innerHTML="";
      }
      else {
	addadminbutts();
      }
    });
  </script>
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
    <a class="btn" href="javascript:void(0)">Continue &raquo;</a>
    <script>
      thisElement.textContent=thisNode.getNextChild({"name":"chkt1next"}).getRelationship({name:"domelementsdata"}).getChild().properties.value;
      //First we create a clone of mycart to not include modifications made at mycart.
      var ordercart=new NodeMale();
      ordercart.loadasc(mycart);
      ordercart.load(mycart);
      thisElement.onclick=function(){
	var insertuser=new NodeMale();
	insertuser.loadasc(webuser);
	insertuser.load(webuser);
	//Now we start to load rels so webuser clon: insertuser will be empty of any data
	insertuser.loadfromhttp({action: "load my relationships", user_id: webuser.properties.id}, function(){
	  insertuser.properties.id=webuser.properties.id;
	  insertuser.getRelationship({name:"orders"}).addChild(new NodeMale());
	  var myorder=insertuser.getRelationship({name:"orders"}).children[0];
	  myorder.loadfromhttp({action: "load my relationships", user_id: webuser.properties.id}, function(){
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
	    myorder.loadfromhttp({action: "add my tree", user_id: webuser.properties.id}, function(){
	      if (this.extra && this.extra.error) {
		myalert.properties.alertmsg=this.extra.errormsg;
		myalert.properties.timeout=4000;
		myalert.showalert();
		return false;
	      }
	      myalert.load({properties:{alertmsg: "Order items saved.", timeout:2000}});
	      myalert.showalert();
	      this.refreshView(document.getElementById("centralcontent"),"includes/templates/checkout2.php");
	      //We remove the items from the cart
	      mycart.getRelationship({name:"cartitem"}).children=[];
	      mycart.refreshcartbox();
	    });
	  });
	});
	return false;
      };
    </script>
    <div class="btrightedit"></div>
    <script>
      var addadminbutts=function(){
	var admnlauncher=new NodeMale();
	admnlauncher.myNode=thisNode.getNextChild({"name":"chkt1next"}).getRelationship({name:"domelementsdata"}).getChild();
	admnlauncher.buttons=[{
	  template: document.getElementById("butedittp"),
	  args: {editpropertyname:"value", allowedHTML:false, editelement:thisElement.parentElement.firstElementChild}
	}];
	admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
      }
      if (webuser.isWebAdmin()) {
	addadminbutts();
      }
      webuser.addEventListener("log", function() {
	if (!this.isWebAdmin()) {
	  thisElement.innerHTML="";
	}
	else {
	  addadminbutts();
	}
      });
    </script>
  </div>
  </template>
  <div></div>
  <script>
      domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"checkout"}).refreshView(thisElement,thisElement.prviousElementSibling);
  </script>
</template>