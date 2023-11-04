import {getRoot as getSiteText} from "../sitecontent.mjs"
import {selectorFromAttr} from "../../frontutils.mjs" // (elm, attName, attValue)
//import {myCart} from './cart.mjs'
import configValues from '../cfg/main.mjs'
import {webuser} from '../webuser/webuser.mjs'
import {Node} from '../nodes.mjs'
import makeReport from '../reports.mjs'
import {setActiveInSite} from '../activeingroup.mjs'
import {getTemplate} from '../layouts.mjs'

export async function cartToOrder(myCart){
  webuser.getRelationship("orders").children = []
  webuser.getRelationship("orders").addChild(new Node())
  await webuser.getRelationship("orders").getChild().loadRequest("get my relationships")
  for (const cartItem of myCart.getRelationship().children) {
    webuser.getRelationship("orders").getChild().getRelationship("orderitems").addChild(new Node({quantity: cartItem.props.quantity, name: cartItem.item.props.name, price: cartItem.item.props.price}))
  }
}

export async function toCheckOut(myCart, hideCartBox){
  hideCartBox()
  await cartToOrder(myCart)
  document.getElementById("centralcontent").innerHTML=""
  document.getElementById("centralcontent").appendChild(await cktView())
}

export async function cktView(){
  setActiveInSite(getSiteText().getNextChild("checkout"))
  const cktTp = await getTemplate("chktmain")

  const cktTitView = selectorFromAttr(cktTp, "data-ckt-tit")
  getSiteText().getNextChild("checkout").getNextChild("checkoutTit").setContentView(cktTitView)
  const orderTitView = selectorFromAttr(cktTp, "data-order-tit")
  getSiteText().getNextChild("checkout").getNextChild("orderTit").setContentView(orderTitView)

  // setting order

  const chktOrderContainer = selectorFromAttr(cktTp, "data-chkt-order-container")
  // First we create a clone of mycart to not include modifications made at mycart.
  // We add the order to the user so it will be accesible later on
  debugger
  chktOrderContainer.innerHTML = ""
  chktOrderContainer.appendChild(await orderCartView(webuser.getRelationship("orders").getChild()))

  makeReport("checkout")
  /*
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
    //We remove the items from the cart and hide

    //myCart.resetCartBox()
    //document.getElementById("cartbox").style.visibility="hidden"
    resetCartBox()
	}

	// setting discard button
	
	const discardBut=selectorFromAttr(selectorFromAttr(viewContainer, "data-but-discard-container"), "data-id", "value")
  discardBut.onclick=function(){
    //myCart.resetCartBox();
    //document.getElementById("cartbox").style.visibility="hidden"
    resetCartBox()
    new Node().setView(document.getElementById("centralcontent"), "showuserinfo")
  }
  */

  return cktTp
}

// Helpers

async function orderCartView(order){
  // esto se puede reformar para que lo haga mediante una <table> que sería mas apropiado
  const orderTp = await getTemplate("ordercart")
  const itemsTable = document.createElement("template").content

  order.getRelationship("orderitems").children.forEach(async item=>{
    const itemsRow = document.createElement("template").content
    itemsRow.appendChild(await itemView(item))
    itemsTable.appendChild(itemsRow)
    item.addEventListener("changeProperty", function(propKey) {
      if (propKey=="quantity" || propKey=="price") {
        // orderItemNode.parent.partner.setView()
        // orderView again
      }
    }, "reCaluculate")
  })
  selectorFromAttr(orderTp, "data-items").appendChild(itemsTable)
  
  //setTotal(order, selectorFromAttr(orderTp, "data-total"))
}

async function itemView(orderItem){
  async function setFields(myNode, fieldTpName){
    const fieldsContainer = document.createElement("template").content
    for (const propKey in myNode.props) {
      let fieldTp = await getTemplate(fieldTpName)

      let fieldElm = selectorFromAttr(fieldTp, "data-value")
      let myValue = myNode.props[propKey]
      if (propKey == "price")
        myValue = intToMoney(myValue)
      fieldElm.textContent = myValue

      myNode.writeProp(fieldElm, propKey)
      inputElm.value = myNode.props[propKey]
      inputElm.attributes.name.value=propKey
      inputElm.attributes.placeholder.value=propKey
      if (webadmin.isOrdersAdmin()) {
        if (propKey == "price") {
          setEdition("butedit", myNode, fieldTp, undefined, propKey, undefined, undefined, undefined, intToMoney)
        }
        else setEdition("butedit", myNode, fieldTp, undefined, propKey)
      }
      // si cambia el precio hay que cambiar el total
      fieldsContainer.appendChild(inputTp)
    }
    return fieldsContainer
  }
  return setFields(orderItem, "orderitemcolumn")
}

function setTotal(order, totView){
  const myorderpay=order.getRelationship("orderpaymenttypes").getChild()
  if (myorderpay) selectorFromAttr(totView, "data-pyment-type").textContent=`(${myorderpay.props.name})`
  const totalLabel = getSiteText().getNextChild("checkout").getNextChild("order").getNextChild("total")
  totalLabel.setContentView(selectorFromAttr(totView, "data-total-label"))
  selectorFromAttr(totView, "data-total-value").textContent = intToMoney(sumTotal(order.getRelationship("orderitems").children) + sumTotal(order.getRelationship("ordershippingtypes").children))
}