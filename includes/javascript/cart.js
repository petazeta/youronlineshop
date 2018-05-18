function cartitem() {
	NodeMale.call(this);
	this.relationships[0]=new NodeFemale();
	this.relationships[0].partnerNode=this;
	this.relationships[0].properties.name="item";
	this.properties.quantity=1;
}
cartitem.prototype=Object.create(NodeMale.prototype);
cartitem.prototype.constructor=cartitem;

function cartboxitem() {
	NodeMale.call(this);
}
cartboxitem.prototype=Object.create(NodeMale.prototype);
cartboxitem.prototype.constructor=cartboxitem;

cartboxitem.prototype.loadcartitem=function(cartitem) {
	this.properties.id=cartitem.properties.id;
	this.properties.quantity=cartitem.properties.quantity;
	this.properties.name=cartitem.getRelationship({name:"item"}).children[0].properties.name;
	this.properties.price=cartitem.getRelationship({name:"item"}).children[0].properties.price;
}

function cart() {
	NodeMale.call(this);
	//this.load({relationships:[{properties: {name:"cartitem"}}, {properties:{name:"cartbox"}, children: [{relationships:[{properties: {name:"cartboxitem"}}]}]}]});
	var cartitemrel=new NodeFemale();
	cartitemrel.properties.name="cartitem";
	this.addRelationship(cartitemrel);
	var cartboxrel=new NodeFemale();
	cartboxrel.properties.name="cartbox";
	this.addRelationship(cartboxrel);
	var cartboxchild=new NodeMale();
	cartboxrel.addChild(cartboxchild);
	var cartboxchildrel=new NodeFemale();
	cartboxchildrel.properties.name="cartboxitem";
	cartboxchild.addRelationship(cartboxchildrel);
	
	this.properties.subTotal=0;

	this.checkout=function(){
		// If cart is empty checkout do nothing else make the call to next step
	}
}
cart.prototype=Object.create(NodeMale.prototype);
cart.prototype.constructor=cart;

cart.prototype.additem=function(item, quantity) {
	if (quantity==null) quantity=1;
	var mycartitem=new cartitem();
	mycartitem.properties.id=item.properties.id;
	mycartitem.properties.quantity=quantity;
	var myitemrel=mycartitem.getRelationship({name:"item"});
	myitemrel.children[0]=item;
	var cartitemrel=this.getRelationship({name:"cartitem"});
	var match=false;
	var i= cartitemrel.children.length;
	while(i--) {
		if (cartitemrel.children[i].properties.id==mycartitem.properties.id) {
			cartitemrel.children[i].properties.quantity+=mycartitem.properties.quantity;
			if (cartitemrel.children[i].properties.quantity==0) {
				cartitemrel.children.splice(i,1);
			}
			match=true;
		}
	}
	if (!match) {
		cartitemrel.children.push(mycartitem);
		mycartitem.parentNode=cartitemrel;
	}
	this.refreshcartbox();
	myalert.properties.timeout=2000;
	myalert.properties.alertmsg="+" + quantity + " " + item.properties.name;
	if (quantity<0) myalert.properties.alertmsg=quantity + " " + item.properties.name;
	myalert.showalert();
};

cart.prototype.refreshcartbox=function() {
	var cartboxitems=this.getRelationship({name:"cartbox"}).children[0].getRelationship({name:"cartboxitem"});
	var cartitemrel=this.getRelationship({name:"cartitem"});
	cartboxitems.children=[];
	var i=cartitemrel.children.length;
	while (i--) {
		var mycartboxitem=new cartboxitem();
		mycartboxitem.loadcartitem(cartitemrel.children[i]);
		cartboxitems.children.push(mycartboxitem);
		mycartboxitem.parentNode=cartboxitems;
	}
	cartboxitems.refreshChildrenView();
}
cart.prototype.tocheckout=function() {
  if (this.getRelationship({name:"cartitem"}).children.length==0) {
    myalert.load({properties:{alertmsg: "Cart is empty", timeout:2000}});
    myalert.showalert();
  }
  else if (!webuser.properties.id) {
    webuser.loginbutton="checkout"; //So it will get to checkout after login
    webuser.refreshView(document.getElementById("centralcontent"), "includes/templates/loginform.php");
  }
  else {
    webuser.refreshView(document.getElementById("centralcontent"), "includes/templates/checkout1.php");
  }
}