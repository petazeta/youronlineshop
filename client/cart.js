import {LinkerNode, DataNode} from './nodes.js'
import {AlertMessage} from './alert.js';
import {getSiteText} from './sitecontent.js';
import {observableMixin} from './observermixin.js';

const BaseCart=observableMixin(DataNode);

class Cart extends BaseCart {
  constructor(...args) {
    super(...args);
    this.addRelationship(new LinkerNode()); // items container
  }
  
  addItem(item, quantity) {
    if (!quantity) quantity=1;
    quantity=window.parseInt(quantity);
    const cartItemMatch=this.getRelationship().getChild({id: item.props.id});
    if (cartItemMatch) {
      cartItemMatch.props.quantity+=quantity;
      if (cartItemMatch.props.quantity==0) {
        this.getRelationship().removeChild(cartItemMatch);
      }
      cartItemMatch.item=item; // Update item (if lang item data changes this item lang data changes)
    }
    else {
      const cartItem=new DataNode({id: item.props.id, quantity: quantity});
      cartItem.item=item;
      this.getRelationship().addChild(cartItem);
    }

    this.refreshCartBox();
    const myalert=new AlertMessage(`+ ${quantity} ${item.props.name}`, 2000);
    if (quantity<0) myalert.props.alertmsg=myalert.props.alertmsg.substring(2);
    myalert.showAlert();
    this.dispatchEvent("cart item", item);
    this.notifyObservers("cart item", item);
  }

  refreshCartBox() {
    document.getElementById("cartbox").style.visibility="visible";
    document.getElementById("cartbox").style.transform="scale(1.2)";
    this.getRelationship().setChildrenView();
  }
  
  resetCartBox() {
    this.getRelationship().children=[];
    this.getRelationship().setChildrenView();
  }

  toCheckOut() {
    if (this.getRelationship().children.length==0) {
      new AlertMessage(getSiteText().getNextChild("cartbox").getNextChild("emptyCart").getRelationship("siteelementsdata").getChild().props.value, 3000).showAlert();
      return;
    }
    if (!webuser.props.id) {
      if (document.getElementById("login-card")) getSiteText().getNextChild("logform").setView(document.querySelector(".login-frame .rmbox .body"), "loginform");
      else getSiteText().getNextChild("logform").appendView(document.body, "loginframe");
      return;
    }
    getSiteText().getNextChild("checkout").setView(document.getElementById("centralcontent"), "chktmain");
  }
}

export const myCart=new Cart();
export const sumTotal=children=>children.reduce((tot, child)=>{
  const quantity = ('quantity' in child.props) ? child.props.quantity : 1;
  const price = ('price' in child.props) ? child.props.price : 0;
  return tot + quantity * price;
}, 0);