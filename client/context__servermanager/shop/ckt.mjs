import {getRoot as getSiteText} from "../sitecontent.mjs"
import {selectorFromAttr, visibleOnMouseOver} from "../../frontutils.mjs" // (elm, attName, attValue)
import {config} from "../cfg.mjs"
import {webuser} from '../webuser/webuser.mjs'
import {Node, Linker} from '../nodes.mjs'
import makeReport from '../reports.mjs'
import {setActiveInSite} from '../activeingroup.mjs'
import {getTemplate} from '../layouts.mjs'
import {myCart, hideCartBox, sumTotal} from "./cart.mjs"
import {getLangBranch, getLangParent, getCurrentLanguage} from '../languages/languages.mjs'
import {userDataView, saveUserData} from "../webuser/userdata.mjs"
import {setActive} from "../../activelauncher.mjs"
import {intToMoney, moneyToInt} from '../money.mjs'

export async function cartToOrder(myCart){
  webuser.getRelationship("orders").children = []
  webuser.getRelationship("orders").addChild(new Node())
  await webuser.getRelationship("orders").getChild().loadRequest("get my relationships")
  for (const cartItem of myCart.getRelationship().children) {
    webuser.getRelationship("orders").getChild().getRelationship("orderitems").addChild(new Node({quantity: cartItem.props.quantity, name: getLangBranch(cartItem.item).getChild().props.name, price: getLangBranch(cartItem.item).getChild().props.price}))
  }
}

export async function toCheckOut(cartBoxContainer = document.getElementById("cartbox")){
  hideCartBox(cartBoxContainer)
  await cartToOrder(myCart)
  document.getElementById("centralcontent").innerHTML = ""
  document.getElementById("centralcontent").appendChild(await cktView())
}

export async function cktView(){
  setActiveInSite(getSiteText().getNextChild("checkout"))
  const cktTp = await getTemplate("chktmain")
  const cktContainer = selectorFromAttr(cktTp, "data-container")
  getSiteText().getNextChild("checkout").getNextChild("checkoutTit").setContentView(selectorFromAttr(cktContainer, "data-ckt-tit"))
  getSiteText().getNextChild("checkout").getNextChild("orderTit").setContentView(selectorFromAttr(cktContainer, "data-order-tit"))

  // setting order

  const chktOrderContainer = selectorFromAttr(cktContainer, "data-chkt-order-container")
  // First we create a clone of mycart to not include modifications made at mycart.
  // We add the order to the user so it will be accesible later on

  chktOrderContainer.innerHTML = ""
  chktOrderContainer.appendChild(await orderCartView(webuser.getRelationship("orders").getChild()))
  
  if (config.get("cktuserdata-on")) {
    const userDataTp = await getTemplate("chktuserdata")
    const userDataContainer = selectorFromAttr(userDataTp, "data-container")
    getSiteText().getNextChild("checkout").getNextChild("addressTit").setContentView(selectorFromAttr(userDataContainer, "data-address-tit"))
    selectorFromAttr(userDataContainer, "data-useraddress").appendChild(await userDataView(true))
    selectorFromAttr(cktContainer, "data-user-data-container").appendChild(userDataContainer)
  }

  if (config.get("cktshipping-on")) {
    await displayShippings(selectorFromAttr(cktContainer, "data-shipping-and-payment-container"))
  }
  if (config.get("cktpayment-on")) {
    await displayPayments(selectorFromAttr(cktContainer, "data-shipping-and-payment-container"))
  }
  const confirmBut = selectorFromAttr(cktContainer, "data-confirm") 
  getSiteText().getNextChild("checkout").getNextChild("confirmButLabel").setContentView(confirmBut)
  confirmBut.addEventListener("click", async ev=>{
    ev.preventDefault()
    if (config.get("cktuserdata-on")) {
      await saveUserData(selectorFromAttr(selectorFromAttr(cktContainer, "data-user-data-container"), "data-form"), true)
    }
    // Save order
    const myOrder = webuser.getRelationship("orders").getChild()
    myOrder.props.status = 0 // status 0 is "new"
    // *** it should be better to set the date at server
    myOrder.props.creationDate = new Date(await myOrder.constructor.makeRequest("get time")).toISOString() // Date-time is Universal Time
    myOrder.props.modificationDate = myOrder.props.creationDate
    await myOrder.loadRequest("add my tree") // it saves and loads all the data again and ids

  })
  getSiteText().getNextChild("checkout").getNextChild("discardButLabel").setContentView(selectorFromAttr(cktContainer, "data-discard"))
  // ** falta checkout end

  makeReport("checkout")
  /*

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

async function cktEndView() {
  const myTp = await getTemplate("chktend")
  const myContainer = selectorFromAttr(myTp, "data-container")
  getSiteText().getNextChild("checkout").getNextChild("successTit").setContentView(selectorFromAttr(myContainer, "data-tit"))
  //await orderView(order)
  return myTp

}

async function orderCartView(order) {
  const orderTp = await getTemplate("ordercart")
  const orderContainer = selectorFromAttr(orderTp, "data-container")
  const itemsTableTp = await getTemplate("ordertable")
  const itemsTable = selectorFromAttr(itemsTableTp, "data-table").cloneNode()
  order.firstElement = itemsTable
  const itemsTableRowSample = selectorFromAttr(itemsTableTp, "data-row")
  const itemsTableCellSample = selectorFromAttr(itemsTableTp, "data-cell")
  for (const item of order.getRelationship("orderitems").children) {
    itemsTable.appendChild(await itemCartView(item, itemsTableRowSample.cloneNode(), itemsTableCellSample))
    item.addEventListener("changeProperty", function(propKey) {
      if (propKey=="quantity" || propKey=="price") {
        selectorFromAttr(orderContainer, "data-subtotal-value").textContent = subTotal(order)
      }
    }, "reCaluculate")
  }
  selectorFromAttr(orderContainer, "data-items").appendChild(itemsTable)
  
  getSiteText().getNextChild("checkout").getNextChild("order").getNextChild("subtotal").setContentView(selectorFromAttr(orderTp, "data-subtotal-label"))
  selectorFromAttr(orderContainer, "data-subtotal-value").textContent = subTotal(order)

  return orderTp
}

async function itemCartView(orderItem, fieldsContainer, fieldElementSample) {
  orderItem.firstElement = fieldsContainer
  for (const propKey in orderItem.props) {
    let myField = fieldElementSample.cloneNode(true)
    let fieldElm = selectorFromAttr(myField, "data-value")
    let myValue = orderItem.props[propKey]
    if (propKey == "price")
      myValue = intToMoney(myValue)
    fieldElm.textContent = myValue
    // *** iria bien poner la cantidad con un dropdown y hacer que se pueda cambiar
    fieldsContainer.appendChild(myField)
  }
  return fieldsContainer
}

async function displayShippings(myContainer){
  const thisTp = await getTemplate("chktshipping")
  const thisContainer = selectorFromAttr(thisTp, "data-container")
  getSiteText().getNextChild("checkout").getNextChild("shippingTit").setContentView(selectorFromAttr(thisContainer, "data-tit"))

  const thisTableTp = await getTemplate("shippingstable")
  const thisTable = selectorFromAttr(thisTableTp, "data-table").cloneNode()
  const thisTableRowSample = selectorFromAttr(thisTableTp, "data-row")
  const {Content} = await import("../../contentbase.mjs")
  const thisText = new Content("TABLE_SHIPPINGTYPES", -1, "TABLE_SHIPPINGTYPESDATA")
  await thisText.initData(Linker, getLangParent, webuser, getCurrentLanguage)
  const hasWritePermission = ()=>webuser.isSystemAdmin() || webuser.isOrdersAdmin()
  if (hasWritePermission() && !thisText.treeRoot._collectionReactions) {
    await setShippingsCollectionReactions(thisText.treeRoot)
    thisText.treeRoot._collectionReactions = true
  }
  thisText.treeRoot.getMainBranch().childContainer = thisTable
  thisTable.innerHTML = ""
  for (const myNode of thisText.treeRoot.getMainBranch().children) {
    // it is important to await View for the syncrhony of performance: the Tp to not be empty when append in DOM, dispatch displayChildren after append
    thisTable.appendChild(await shippingView(myNode, thisTableRowSample))
    // selecting first one by default
    if (myNode == thisText.treeRoot.getMainBranch().getChild()) {
      const selectElement = selectorFromAttr(myNode.firstElement, "data-select")
      selectElement.checked = true
      setOrderShipping(myNode)
      setActive(myNode)
    }
  }
  thisText.treeRoot.getMainBranch().dispatchEvent("displayChildren") // event for addition and no children

  selectorFromAttr(thisContainer, "data-list").appendChild(thisTable)
  myContainer.appendChild(thisContainer)
}

function subTotal(order){
  return intToMoney(sumTotal(order.getRelationship("orderitems").children))
}

async function shippingView(myNode, rowElementSample) {
  const myContainer = rowElementSample.cloneNode(true)
  myNode.firstElement = myContainer // it is used by setActive
  const selectElm = selectorFromAttr(myContainer, "data-select")
  myContainer.addEventListener("click", function(ev) {
    selectElm.click()
  })
  selectElm.addEventListener("change", function(ev) {
    if (!selectElm.checked)
      return
    setOrderShipping(myNode)
    setActive(myNode)
  })
  const hasWritePermissionText = ()=>webuser.isWebAdmin() || webuser.isSystemAdmin() || webuser.isOrdersAdmin()
  const {setEdition} = await import("../admin/edition.mjs")
  const nameContainer = selectorFromAttr(myContainer, "data-name")
  getLangBranch(myNode).getChild().writeProp(selectorFromAttr(nameContainer, "data-value"), "name")
  if (hasWritePermissionText()) {
    await setEdition(getLangBranch(myNode).getChild(), nameContainer)
    visibleOnMouseOver(selectorFromAttr(nameContainer, "data-butedit"), nameContainer) // on mouse over edition button visibility
  }
  const descriptionContainer = selectorFromAttr(myContainer, "data-description")
  getLangBranch(myNode).getChild().writeProp(selectorFromAttr(descriptionContainer, "data-value"), "description")
  if (hasWritePermissionText()) {
    await setEdition(getLangBranch(myNode).getChild(), descriptionContainer)
    visibleOnMouseOver(selectorFromAttr(descriptionContainer, "data-butedit"), descriptionContainer) // on mouse over edition button visibility
  }
  const hasWritePermissionPaymentType = ()=>webuser.isSystemAdmin() || webuser.isOrdersAdmin()
  const delayHoursContainer = selectorFromAttr(myContainer, "data-delay-hours")
  myNode.writeProp(selectorFromAttr(delayHoursContainer, "data-value"), "delay_hours")
  if (hasWritePermissionPaymentType()) {
    await setEdition(myNode, delayHoursContainer, undefined, "delay_hours")
    visibleOnMouseOver(selectorFromAttr(delayHoursContainer, "data-butedit"), delayHoursContainer) // on mouse over edition button visibility
  }
  // *** aqui damos precio en mainbranch y en item se da en langbranch. Estudiar esto, si tiene sentido en item poner un precio por cada language y ver el tema de la moneda, ver como se está haciendo.
  getSiteText().getNextChild("hours").setContentView(selectorFromAttr(myContainer, "data-hours"))
  const priceContainer = selectorFromAttr(myContainer, "data-price")
  selectorFromAttr(priceContainer, "data-value").textContent = intToMoney(myNode.props.price)
  if (hasWritePermissionPaymentType()) {
     // ** no va bien, fijarse en setPriceEdition de categories.mjs
    await setEdition(myNode, priceContainer, undefined, "price", undefined, undefined, undefined, moneyToInt)
    visibleOnMouseOver(selectorFromAttr(priceContainer, "data-butedit"), priceContainer) // on mouse over edition button visibility
  }

  if (hasWritePermissionPaymentType()) {
    visibleOnMouseOver(selectorFromAttr(myContainer, "data-admnbuts"), myContainer) // on mouse over edition button visibility
    const {setAdditionButton} = await import("../admin/addition.mjs")
    const {setChangePosButton} = await import("../admin/changepos.mjs")
    const {setDeletionButton} = await import("../admin/deletion.mjs")
    await setChangePosButton(myNode, myContainer, "butchposvert")
    await setAdditionButton(myNode.parent, myNode, 1, myContainer, async (newNode)=>{
      return await shippingView(newNode, rowElementSample)
    })
    await setDeletionButton(myNode, myContainer)
  }
  return myContainer
}

function setOrderShipping(myShipping) {
  const shippingTypesRel = webuser.getRelationship("orders").getChild().getRelationship("ordershippingtypes")
  shippingTypesRel.children = []
  const orderShippingType = shippingTypesRel.addChild(new Node({name: getLangBranch(myShipping).getChild().props.name, ...myShipping.props}))
}

async function displayPayments(myContainer){
  const thisTp = await getTemplate("chktpayment")
  const thisContainer = selectorFromAttr(thisTp, "data-container")
  getSiteText().getNextChild("checkout").getNextChild("paymentTit").setContentView(selectorFromAttr(thisContainer, "data-tit"))

  const thisTableTp = await getTemplate("paymentstable")
  const thisTable = selectorFromAttr(thisTableTp, "data-table").cloneNode()
  const thisTableRowSample = selectorFromAttr(thisTableTp, "data-row")
  const {Content} = await import("../../contentbase.mjs")
  const thisText = new Content("TABLE_PAYMENTTYPES", -1, "TABLE_PAYMENTTYPESDATA")
  await thisText.initData(Linker, getLangParent, webuser, getCurrentLanguage)
  const hasWritePermission = ()=>webuser.isSystemAdmin() || webuser.isOrdersAdmin()
  if (hasWritePermission() && !thisText.treeRoot._collectionReactions) {
    await setPaymentsCollectionReactions(thisText.treeRoot)
    thisText.treeRoot._collectionReactions = true
  }
  thisText.treeRoot.getMainBranch().childContainer = thisTable
  thisTable.innerHTML = ""
  await thisText.treeRoot.getMainBranch().loadRequest("get my tree")
  for (const myNode of thisText.treeRoot.getMainBranch().children) {
    // it is important to await View for the syncrhony of performance: the Tp to not be empty when append in DOM, dispatch displayChildren after append
    thisTable.appendChild(await paymentView(myNode, thisTableRowSample))
    // selecting first one by default
    if (myNode == thisText.treeRoot.getMainBranch().getChild()) {
      const selectElement = selectorFromAttr(myNode.firstElement, "data-select")
      selectElement.checked = true
      setOrderPayment(myNode)
      setActive(myNode)
    }
  }
  selectorFromAttr(thisContainer, "data-list").appendChild(thisTable)
  myContainer.appendChild(thisContainer)
  // *** falta añadir la edición de los elementos no visibles en caso de admin
  // esta implementado en paymenttype_old.html
}

async function paymentView(myNode, rowElementSample) {
  const myContainer = rowElementSample.cloneNode(true)
  myNode.firstElement = myContainer // it is used by setActive
  const selectElm = selectorFromAttr(myContainer, "data-select")
  myContainer.addEventListener("click", function(ev) {
    selectElm.click()
  })
  selectElm.addEventListener("change", function(ev) {
    if (!this.checked)
      return
    setOrderPayment(myNode)
    setActive(myNode)
  })
  const hasWritePermissionText = ()=>webuser.isWebAdmin() || webuser.isSystemAdmin() || webuser.isOrdersAdmin()
  const {setEdition} = await import("../admin/edition.mjs")
  const nameContainer = selectorFromAttr(myContainer, "data-name")
  getLangBranch(myNode).getChild().writeProp(selectorFromAttr(nameContainer, "data-value"), "name")
  if (hasWritePermissionText()) {
    await setEdition(getLangBranch(myNode).getChild(), nameContainer)
    visibleOnMouseOver(selectorFromAttr(nameContainer, "data-butedit"), nameContainer) // on mouse over edition button visibility
  }
  const descriptionContainer = selectorFromAttr(myContainer, "data-description")
  getLangBranch(myNode).getChild().writeProp(selectorFromAttr(descriptionContainer, "data-value"), "description")
  if (hasWritePermissionText()) {
    await setEdition(getLangBranch(myNode).getChild(), descriptionContainer)
    visibleOnMouseOver(selectorFromAttr(descriptionContainer, "data-butedit"), descriptionContainer) // on mouse over edition button visibility
  }
  const hasWritePermissionPaymentType = ()=>webuser.isSystemAdmin() || webuser.isOrdersAdmin()

  if (hasWritePermissionPaymentType()) {
  // falta crear unos campos para que se pueda editar los valores de payment que no aparecen

    visibleOnMouseOver(selectorFromAttr(myContainer, "data-admnbuts"), myContainer) // on mouse over edition button visibility
    const {setAdditionButton} = await import("../admin/addition.mjs")
    const {setChangePosButton} = await import("../admin/changepos.mjs")
    const {setDeletionButton} = await import("../admin/deletion.mjs")
    await setChangePosButton(myNode, myContainer, "butchposvert")
    await setAdditionButton(myNode.parent, myNode, 1, myContainer, async (newNode)=>{
      return await shippingView(newNode, rowElementSample)
    })
    await setDeletionButton(myNode, myContainer)
  }
  return myContainer
}

function setOrderPayment(myPayment) {
  const thisRel = webuser.getRelationship("orders").getChild().getRelationship("orderpaymenttypes")
  thisRel.children = []
  const orderShippingType = thisRel.addChild(new Node({name: getLangBranch(myPayment).getChild().props.name, ...myPayment.props}))
}

async function orderView(order) {
  const orderTp = await getTemplate("order")
  const orderContainer = selectorFromAttr(orderTp, "data-container")
  const itemsTableTp = await getTemplate("ordertable")
  const itemsTable = selectorFromAttr(itemsTableTp, "data-table").cloneNode()
  order.firstElement = itemsTable
  const itemsTableRowSample = selectorFromAttr(itemsTableTp, "data-row")
  const itemsTableCellSample = selectorFromAttr(itemsTableTp, "data-cell")
  for (const item of order.getRelationship("orderitems").children) {
    itemsTable.appendChild(await itemView(item, itemsTableRowSample.cloneNode(), itemsTableCellSample))
    // we still havent developed a way to change the order in this stage
  }
  selectorFromAttr(orderContainer, "data-items").appendChild(itemsTable)
  
  getSiteText().getNextChild("checkout").getNextChild("order").getNextChild("total").setContentView(selectorFromAttr(totView, "data-total-label"))
  const myorderpay = order.getRelationship("orderpaymenttypes").getChild()
  // *** aqui falta ponerle edicion
  if (myorderpay)
    selectorFromAttr(orderContainer, "data-pyment-type").textContent = `(${myorderpay.props.name})`

  selectorFromAttr(orderContainer, "data-total-value").textContent = total(order)
  // *** falta payment button mirar template
  /*
  el tema ahora cambia porque habra un modulo y un template, hay que implementar el modulo y ponerlo en un campo en los datos del payment client/context__main/shop/payments/paypal.mjs
  */

  return orderTp
}

async function itemView(orderItem, fieldsContainer, fieldElementSample) {
  orderItem.firstElement = fieldsContainer
  for (const propKey in orderItem.props) {
    let myField = fieldElementSample.cloneNode(true)
    let fieldElm = selectorFromAttr(myField, "data-value")
    let myValue = orderItem.props[propKey]
    if (propKey == "price")
      myValue = intToMoney(myValue)
    fieldElm.textContent = myValue
    // *** iria bien poner la cantidad con un dropdown y hacer que se pueda cambiar
    fieldsContainer.appendChild(myField)
  }
  return fieldsContainer
}

function total(order){
  return intToMoney(sumTotal(order.getRelationship("orderitems").children) + + sumTotal(order.getRelationship("ordershippingtypes").children))
}

// Helpers

async function setShippingsCollectionReactions(myNode) {
  const {onDelSelectedChild} = await import("../admin/deletion.mjs")
  const {onNewNodeMakeClick} = await import("../admin/addition.mjs")
  onNewNodeMakeClick(myNode.getMainBranch(), (myNode)=>{
    selectorFromAttr(myNode.firstElement, "data-select").checked = true
  })
  onDelSelectedChild(myNode.getMainBranch(), (myNode)=>{
    if (!myNode.getMainBranch().getChild())
      return
    selectorFromAttr(myNode.getMainBranch().getChild().firstElement, "data-select").checked = true
  })
}

async function setPaymentsCollectionReactions(myNode) {
  const {onDelSelectedChild} = await import("../admin/deletion.mjs")
  const {onNewNodeMakeClick} = await import("../admin/addition.mjs")
  onNewNodeMakeClick(myNode.getMainBranch(), (myNode)=>{
    selectorFromAttr(myNode.firstElement, "data-select").checked = true
  })
  onDelSelectedChild(myNode.getMainBranch(), (myNode)=>{
    if (!myNode.getMainBranch().getChild())
      return
    selectorFromAttr(myNode.getMainBranch().getChild().firstElement, "data-select").checked = true
  })
}