import {NodeFemale, NodeMale} from './nodesfront.js'
import {AlertMessage} from './alert.js';
import {textContentRoot} from './textcontent.js';

class cartitem extends NodeMale {
  constructor() {
    super();
    const itemRel=new NodeFemale();
    itemRel.props.name="item";
    this.addRelationship(itemRel);
    this.props.quantity=1;
  }
}
class cartboxitem extends NodeMale{
  constructor() {
    super();
  }
  loadcartitem(cartitem) {
    this.props.id=cartitem.props.id;
    this.props.quantity=cartitem.props.quantity;
    this.props.name=cartitem.getRelationship("item").getChild().props.name;
    this.props.price=cartitem.getRelationship("item").getChild().props.price;
  }
}

class cart extends NodeMale{
  constructor() {
    super();
  }

  initCart() {
    const cartitemrel=new NodeFemale();
    cartitemrel.props.name="cartitem";
    this.addRelationship(cartitemrel);
    const cartboxrel=new NodeFemale();
    cartboxrel.props.name="cartbox";
    this.addRelationship(cartboxrel);
    const cartboxchild=new NodeMale();
    cartboxrel.addChild(cartboxchild);
    const cartboxchildrel=new NodeFemale("TABLE_ORDERITEMS", "TABLE_ORDERS");
    cartboxchildrel.props.name="cartboxitem";
    cartboxchild.addRelationship(cartboxchildrel);
    this.checkout=function(){
      // If cart is empty checkout do nothing else make the call to next step
    }
    return cartboxchildrel.loadRequest("get my childtablekeys");
  }

  additem(item, quantity) {
    if (quantity==null) quantity=1;
    const mycartitem=new cartitem();
    mycartitem.props.id=item.props.id;
    mycartitem.props.quantity=parseInt(quantity);
    const myitemrel=mycartitem.getRelationship("item");
    myitemrel.children[0]=item;
    const cartitemrel=this.getRelationship("cartitem");
    let match=false;
    let i= cartitemrel.children.length;
    while(i--) {
      if (cartitemrel.children[i].props.id==mycartitem.props.id) {
        cartitemrel.children[i].props.quantity+=mycartitem.props.quantity;
        if (cartitemrel.children[i].props.quantity==0) {
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
    let myalert=new AlertMessage("+" + quantity + " " + item.props.name, 2000);
    if (quantity<0) myalert.props.alertmsg=quantity + " " + item.props.name;
    myalert.showAlert();
    this.dispatchEvent("cartItem", item);
  }

  refreshcartbox() {
    const cartboxitems=this.getRelationship("cartbox").children[0].getRelationship("cartboxitem");
    const cartitemrel=this.getRelationship("cartitem");
    cartboxitems.children=[];
    let i=cartitemrel.children.length;
    while (i--) {
      let mycartboxitem=new cartboxitem();
      mycartboxitem.loadcartitem(cartitemrel.children[i]);
      cartboxitems.children.push(mycartboxitem);
      mycartboxitem.parentNode=cartboxitems;
    }
    const cartboxelement=document.getElementById("cartbox");
    cartboxelement.style.visibility="visible";
    document.getElementById("cartbox").style.transform="scale(1.2)";
    cartboxitems.setChildrenView();
  }
  tocheckout() {
    if (this.getRelationship("cartitem").children.length==0) {
      const cartbox=textContentRoot.getNextChild("labels").getNextChild("middle").getNextChild("cartbox");
      (new AlertMessage(cartbox.getNextChild("emptyCart").getRelationship("domelementsdata").getChild().props.value, 3000)).showAlert();
    }
    else if (!webuser.props.id) {
      const logformLauncher=textContentRoot.getNextChild("labels").getNextChild("middle").getNextChild("logform");
      logformLauncher.setView(document.getElementById("centralcontent"), "loginform");
    }
    else {
      textContentRoot.getNextChild("labels").getNextChild("middle").getNextChild("checkout").setView(document.getElementById("centralcontent"), "chktmain");
    }
    this.dispatchEvent("checkout");
  }
}
const myCart=new cart();
export {myCart};