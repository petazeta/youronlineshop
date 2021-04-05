class cartitem extends NodeMale {
  constructor() {
    super();
    this.relationships[0]=new NodeFemale();
    this.relationships[0].partnerNode=this;
    this.relationships[0].properties.name="item";
    this.properties.quantity=1;
  }
}
class cartboxitem extends NodeMale{
  constructor() {
    super();
  }
  loadcartitem(cartitem) {
    this.properties.id=cartitem.properties.id;
    this.properties.quantity=cartitem.properties.quantity;
    this.properties.name=cartitem.getRelationship("item").children[0].properties.name;
    this.properties.price=cartitem.getRelationship("item").children[0].properties.price;
  }
}

class cart extends NodeMale{
  constructor() {
    super();
  }

  initCart() {
    var cartitemrel=new NodeFemale();
    cartitemrel.properties.name="cartitem";
    this.addRelationship(cartitemrel);
    var cartboxrel=new NodeFemale();
    cartboxrel.properties.name="cartbox";
    this.addRelationship(cartboxrel);
    var cartboxchild=new NodeMale();
    cartboxrel.addChild(cartboxchild);
    var cartboxchildrel=new NodeFemale();
    cartboxchild.addRelationship(cartboxchildrel);
    cartboxchildrel.properties.name="cartboxitem";
    cartboxchildrel.properties.parenttablename="TABLE_ORDERS";
    cartboxchildrel.properties.childtablename="TABLE_ORDERITEMS";
    return new Promise((solve, reject)=>{
      cartboxchildrel.loadRequest("load my childtablekeys").then(myNode=>solve(myNode));
    });
    //cartboxchildrel.childtablekeys=["id", "quantity", "name", "price"];
    //cartboxchildrel.childtablekeysinfo=[{"Type":"int"}, {"Type":"int"}, {"Type":"varchar"}, {"Type":"decimal"}];
    

    this.checkout=function(){
      // If cart is empty checkout do nothing else make the call to next step
    }
  }

  additem(item, quantity) {
    if (quantity==null) quantity=1;
    var mycartitem=new cartitem();
    mycartitem.properties.id=item.properties.id;
    mycartitem.properties.quantity=parseInt(quantity);
    var myitemrel=mycartitem.getRelationship("item");
    myitemrel.children[0]=item;
    var cartitemrel=this.getRelationship("cartitem");
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
    this.dispatchEvent("cartItem", item);
  }

  refreshcartbox() {
    var cartboxitems=this.getRelationship("cartbox").children[0].getRelationship("cartboxitem");
    var cartitemrel=this.getRelationship("cartitem");
    cartboxitems.children=[];
    var i=cartitemrel.children.length;
    while (i--) {
      var mycartboxitem=new cartboxitem();
      mycartboxitem.loadcartitem(cartitemrel.children[i]);
      cartboxitems.children.push(mycartboxitem);
      mycartboxitem.parentNode=cartboxitems;
    }
    var cartboxelement=document.getElementById("cartbox");
    cartboxelement.style.visibility="visible";
    cartboxitems.setChildrenView();
  }
  tocheckout() {
    if (this.getRelationship("cartitem").children.length==0) {
      var cartbox=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"cartbox"});
      myalert.properties.alertmsg=cartbox.getNextChild({name:"emptyCart"}).getRelationship("domelementsdata").getChild().properties.value;
      myalert.properties.timeout=3000;
      myalert.showalert();
    }
    else if (!webuser.properties.id) {
      Node.setViewNew(document.getElementById("centralcontent"), "loginform");
    }
    else {
      Node.setViewNew(document.getElementById("centralcontent"), "checkout1");
    }
    this.dispatchEvent("checkout");
  }
}