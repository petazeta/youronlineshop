import {NodeFemale, NodeMale} from './nodesfront.js'
import {AlertMessage} from './alert.js';
import {getSiteText} from './sitecontent.js';

class Cart extends NodeMale {
  constructor() {
    super();
    const myCartJSON=`{"props":{},"parentNode":null,"relationships":[{"props":{"name":"cartitem"}, "partnerNode":null,"children":[]},{"props":{"childtablename":"TABLE_ORDERITEMS","parenttablename":"TABLE_ORDERS","name":"cartboxitem"},"partnerNode":null,"children":[]}]}`;
    this.load(JSON.parse(myCartJSON));
    // next load is delayed
    this.getRelationship("cartboxitem").loadRequest("get my childtablekeys");
  }
  
  addItem(item, quantity) {
    if (quantity==null) quantity=1;
    const myCartItem=new CartItem();
    myCartItem.props.id=item.props.id;
    myCartItem.props.quantity=parseInt(quantity);
    myCartItem.getRelationship("item").children[0]=item; // if we make addChild then parent change so item will have no categories parent??
    const cartItemRel=this.getRelationship("cartitem");
    let match=false;
    let i= cartItemRel.children.length;
    while(i--) {
      if (cartItemRel.children[i].props.id==myCartItem.props.id) {
        cartItemRel.children[i].props.quantity+=myCartItem.props.quantity;
        if (cartItemRel.children[i].props.quantity==0) {
          cartItemRel.children.splice(i,1);
        }
        match=true;
      }
    }
    if (!match) {
      cartItemRel.addChild(myCartItem);
    }
    this.refreshCartBox();
    let myalert=new AlertMessage("+" + quantity + " " + item.props.name, 2000);
    if (quantity<0) myalert.props.alertmsg=quantity + " " + item.props.name;
    myalert.showAlert();
    this.dispatchEvent("cart item", item);
  }

  refreshCartBox() {
    const cartBoxItems=this.getRelationship("cartboxitem");
    cartBoxItems.children=[];
    for (const child of this.getRelationship("cartitem").children) {
      cartBoxItems.addChild(new CartBoxItem().loadCartItem(child));
    }
    document.getElementById("cartbox").style.visibility="visible";
    document.getElementById("cartbox").style.transform="scale(1.2)";
    cartBoxItems.setChildrenView();
  }
  
  resetCartBox() {
    this.getRelationship("cartitem").children=[];
    this.getRelationship("cartboxitem").children=[];
    this.getRelationship("cartboxitem").setChildrenView();
  }

  toCheckOut() {
    if (this.getRelationship("cartitem").children.length==0) {
      new AlertMessage(getSiteText().getNextChild("cartbox").getNextChild("emptyCart").getRelationship("siteelementsdata").getChild().props.value, 3000).showAlert();
    }
    else if (!webuser.props.id) {
      getSiteText().getNextChild("logform").setView(document.getElementById("centralcontent"), "loginform");
    }
    else {
      getSiteText().getNextChild("checkout").setView(document.getElementById("centralcontent"), "chktmain");
    }
  }

  sumTotal() {
    let total=0;
    for (const child of this.getRelationship("cartboxitem").children) {
      total=total + child.props.quantity * child.props.price;
    }
    return total;
  }
}

class CartItem extends NodeMale {
  constructor() {
    super();
    this.addRelationship(new NodeFemale().load({props:{name: "item"}}));
    this.props.quantity=1;
  }
}

class CartBoxItem extends NodeMale{
  loadCartItem(cartItem) {
    this.props.id=cartItem.props.id;
    this.props.quantity=cartItem.props.quantity;
    this.props.name=cartItem.getRelationship("item").getChild().props.name;
    this.props.price=cartItem.getRelationship("item").getChild().props.price;
    return this;
  }
}

const myCart=new Cart();

export {myCart};