import {setActiveInGroup} from '../activeingroup.mjs'
import {getRoot as getSiteText} from "../sitecontent.mjs"
import {selectorFromAttr} from "../../frontutils.mjs" // (elm, attName, attValue)
import {myCart} from './cart.mjs'
import configValues from '../cfg/main.mjs'
import {webuser} from '../webuser/webuser.mjs'
import {Node} from '../nodes.mjs'
/*
import cartMixin from '../../shop/cartmixin.mjs'
import {observableMixin} from '../../observermixin.mjs'


import {AlertMessage} from '../alert.mjs'


import {switchVisibility, selectorFromAttr} from "../../frontutils.mjs" // (elm, attName, attValue)
import {getLangBranch} from '../languages/languages.mjs'
*/
export function setChktmainView(viewContainer){
  const chkoutTxt=getSiteText().getNextChild("checkout")
  setActiveInGroup('centralcontent', chkoutTxt)

  // setting order

  const chktOrderContainer=selectorFromAttr(viewContainer, "data-chkt-order-container")
  //First we create a clone of mycart to not include modifications made at mycart.
  //We add the order to the user so it will be accesible later on
  webuser.getRelationship("orders").children=[]
  webuser.getRelationship("orders").addChild(new Node())
  webuser.getRelationship("orders").getChild().loadRequest("get my relationships")
  .then(myOrder=>{
    myCart.getRelationship().children.forEach(cartItem=>{
      myOrder.getRelationship("orderitems").addChild(new Node({quantity: cartItem.props.quantity, name: cartItem.item.props.name, price: cartItem.item.props.price}))
    })
    new Node().setView(chktOrderContainer, "ordercart")
    webuser.dispatchEvent("checkout", myOrder)
    webuser.notifyObservers("checkout", myOrder)
  })
  document.getElementById("cartbox").style.visibility="hidden"
  //After loading myOrder now we go forward and set the container with the address, shipping and payment data
  if (configValues.chktuserdata_On) new Node().setView(selectorFromAttr(viewContainer, "data-user-data-container"), "chktuserdata")
  if (configValues.chktshipping_On) new Node().appendView(selectorFromAttr(viewContainer, "data-shipping-and-payment-container"), "chktshipping")
  if (configValues.chktpayment_On) new Node().appendView(selectorFromAttr(viewContainer, "data-shipping-and-payment-container"), "chktpayment")

  // setting confirm button

  const confmBut=selectorFromAttr(selectorFromAttr(viewContainer, "data-but-confirm-container"), "data-id", "value")
	confmBut.onclick=async function(event){
	  if (configValues.chktuserdata_On) {
	    await webuser.saveUserAddress()
	  }
		// lets save order
    const myOrder=webuser.getRelationship("orders").getChild()
    myOrder.props.status=0 // status 0 is "new"
    // esto del Date mejor hacerlo en servidor
    myOrder.props.creationDate=new Date(await myOrder.constructor.makeRequest("get time")).toISOString() // Date-time is Universal Time
    myOrder.props.modificationDate=myOrder.props.creationDate
    console.log(myOrder)
    await myOrder.loadRequest("add my tree") // it saves and loads all the data again and ids
    new Node().setView(document.getElementById("centralcontent"), "chktend")
    //We remove the items from the cart
    myCart.resetCartBox()
    document.getElementById("cartbox").style.visibility="hidden"
	}

	// setting discard button
	
	const discardBut=selectorFromAttr(selectorFromAttr(viewContainer, "data-but-discard-container"), "data-id", "value")
  discardBut.onclick=function(){
    myCart.resetCartBox();
    document.getElementById("cartbox").style.visibility="hidden"
    new Node().setView(document.getElementById("centralcontent"), "showuserinfo")
  }
}