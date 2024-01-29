// *** error on payment name edition and if added payment is not suitable if selected for next view (checkend)
// payment is not full implemented, it should be checked, success payment not implemented yet 

import {getRoot as getSiteText} from "../sitecontent.mjs"
import {selectorFromAttr, visibleOnMouseOver} from "../../frontutils.mjs" // (elm, attName, attValue)
import {config} from "../cfg.mjs"
import {webuser} from '../webuser/webuser.mjs'
import {Node, Linker} from '../nodes.mjs'
import {makeReport} from '../reports.mjs'
import {setActiveInSite} from '../activeingroup.mjs'
import {getTemplate} from '../layouts.mjs'
import {myCart, hideCartBox, sumTotal} from "./cart.mjs"
import {getLangBranch, getLangParent, getCurrentLanguage} from '../languages/languages.mjs'
import {userDataView, saveUserData} from "../webuser/userdata.mjs"
import {setActive} from "../../activelauncher.mjs"
import {intToMoney, moneyToInt, getCurrencyCode} from '../money.mjs'

export async function cartToOrder(myCart){
  webuser.getRelationship("orders").children = []
  webuser.getRelationship("orders").addChild(new Node())
  await webuser.getRelationship("orders").getChild().loadRequest("get my relationships")
  for (const cartItem of myCart.getRelationship().children) {
    const orderItem = webuser.getRelationship("orders").getChild().getRelationship("orderitems").addChild(new Node({quantity: cartItem.props.quantity, name: getLangBranch(cartItem.item).getChild().props.name, price: cartItem.item.props.price}))
    orderItem.addParent(cartItem.item.getRelationship("orderitems")) // extraParent
  }
}

export async function toCheckOut(cartBoxContainer = document.getElementById("cartbox")){
  hideCartBox(cartBoxContainer)
  await cartToOrder(myCart)
  document.getElementById("centralcontent").innerHTML = ""
  document.getElementById("centralcontent").appendChild(await cktView())
}

async function cktView(){
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
    if (hasNodeWritePermission())
      selectorFromAttr(cktContainer, "data-shipping-and-payment-container").classList.remove("flexjoin")
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
      if (await saveUserData(selectorFromAttr(selectorFromAttr(cktContainer, "data-user-data-container"), "data-form"), true) instanceof Error)
        return
    }
    // Create order
    const myOrder = webuser.getRelationship("orders").getChild()
    const myPayment = myOrder.getRelationship("orderpayment").getChild().parent[1].partner
    await myOrder.loadRequest("add my tree", { extraParents: true }) // To insert extra-parents link when there are multiple parents
    // after loading data, it has now ids but it has lost the extra parents
    document.getElementById("centralcontent").innerHTML = ""
    document.getElementById("centralcontent").appendChild(await cktEndView(myOrder))
    // esto se implementa aqui porque paypal script tiene que estar en el documento
    // *** aqui falta ponerle edicion
    const myorderpay = myOrder.getRelationship("orderpayment").getChild()
    if (myorderpay && !myorderpay.props.succeed) {
      const {renderPayment} = await import(`../../shop/payments/${myPayment.props.template}.mjs`)
      await renderPayment(getTemplate, selectorFromAttr(selectorFromAttr(document.getElementById("centralcontent"), "data-order"), "data-payment"), myOrder, myPayment)
      // *** falta payment button mirar template
      // actuar con myorderpay.props.template 
      // el tema ahora cambia porque habra un modulo y un template, hay que implementar el modulo y ponerlo en un campo en los datos del payment client/shop/payments/paypal.mjs
    }
    //myCart.resetCartBox()
    //document.getElementById("cartbox").style.visibility="hidden"
    //resetCartBox()
  })
  getSiteText().getNextChild("checkout").getNextChild("discardButLabel").setContentView(selectorFromAttr(cktContainer, "data-discard"))

  makeReport("checkout")
  /*

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

async function cktEndView(order) {
  const myTp = await getTemplate("chktend")
  const myContainer = selectorFromAttr(myTp, "data-container")
  getSiteText().getNextChild("checkout").getNextChild("successTit").setContentView(selectorFromAttr(myContainer, "data-tit"))
  selectorFromAttr(myContainer, "data-order").appendChild(await orderView(order))
  return myTp
}

async function orderCartView(order) {
  const orderTp = await getTemplate("ordercart")
  const orderContainer = selectorFromAttr(orderTp, "data-container")
  displayOrderCartItems(order, orderContainer)
  
  getSiteText().getNextChild("checkout").getNextChild("order").getNextChild("subtotal").setContentView(selectorFromAttr(orderContainer, "data-subtotal-label"))
  selectorFromAttr(orderContainer, "data-subtotal-value").textContent = subTotal(order)

  return orderTp
}

async function displayOrderCartItems(order, orderContainer){
  const tableTp = await getTemplate("ordertable")
  const thisTable = selectorFromAttr(tableTp, "data-table").cloneNode()
  order.firstElement = thisTable
  const rowSample = selectorFromAttr(tableTp, "data-row")
  const cellSample = selectorFromAttr(tableTp, "data-cell")
  for (const item of order.getRelationship("orderitems").children) {
    thisTable.appendChild(await itemCartView(item, rowSample, cellSample))
    item.addEventListener("changeProperty", function(propKey) {
      if (propKey=="quantity" || propKey=="price") {
        selectorFromAttr(orderContainer, "data-subtotal-value").textContent = subTotal(order)
      }
    }, "reCaluculate")
  }
  selectorFromAttr(orderContainer, "data-items").appendChild(thisTable)
}

async function itemCartView(orderItem, rowSample, fieldElementSample) {
  const fieldsContainer = rowSample.cloneNode()
  orderItem.firstElement = fieldsContainer
  for (const propKey of orderItem.parent[0].childTableKeys) {
    if (propKey == "currencyCode") continue
    let myField = fieldElementSample.cloneNode(true)
    if (propKey != "price")
      orderItem.writeProp(selectorFromAttr(myField, "data-value"), propKey)
    else if (propKey == "price")
      selectorFromAttr(myField, "data-value").textContent = intToMoney(orderItem.props["price"]) // *** faltaria implementar diferentes monedas para cada producto
    // *** iria bien poner la cantidad con un dropdown y hacer que se pueda cambiar
    fieldsContainer.appendChild(myField)
  }
  return fieldsContainer
}

async function displayShippings(myContainer){
  const thisTp = await getTemplate("chktshipping")
  const thisContainer = selectorFromAttr(thisTp, "data-container")
  getSiteText().getNextChild("checkout").getNextChild("shippingTit").setContentView(selectorFromAttr(thisContainer, "data-tit"))

  const tableTp = await getTemplate("shippingstable")
  const thisTable = selectorFromAttr(tableTp, "data-table").cloneNode()
  const rowSample = selectorFromAttr(tableTp, "data-row")
  const {Content} = await import("../../contentbase.mjs")
  const thisText = new Content("TABLE_SHIPPINGTYPES")
  await thisText.initData(Linker, getLangParent, webuser, getCurrentLanguage)
  if (hasNodeWritePermission() && !thisText.treeRoot._collectionReactions) {
    await setShippingsCollectionReactions(thisText.treeRoot, rowSample)
    thisText.treeRoot._collectionReactions = true
  }
  thisText.treeRoot.getMainBranch().childContainer = thisTable
  thisTable.innerHTML = ""
  for (const myNode of thisText.treeRoot.getMainBranch().children) {
    // it is important to await View for the syncrhony of performance: the Tp to not be empty when append in DOM, dispatch displayChildren after append
    thisTable.appendChild(await shippingView(myNode, rowSample))
    // selecting first one by default
    if (myNode == thisText.treeRoot.getMainBranch().getChild()) {
      const selectElement = selectorFromAttr(myNode.firstElement, "data-select")
      selectElement.checked = true
      setOrderShipping(myNode)
      setActive(myNode)
    }
  }
  thisText.treeRoot.getMainBranch().dispatchEvent("displayChildren") // event for set addition when no children
  selectorFromAttr(thisContainer, "data-list").appendChild(thisTable)
  myContainer.appendChild(thisContainer)
  if (thisText.treeRoot.getMainBranch().children.length == 0  && hasNodeWritePermission()) {
    const {setAdditionButton} = await import("../admin/addition.mjs")
    setAdditionButton(thisText.treeRoot.getMainBranch(), null, 1 , null, async (newNode)=>{ // 1 : position
      const newView = await shippingView(newNode, rowSample)
      const selectElement = selectorFromAttr(newView, "data-select")
      selectElement.checked = true
      setOrderShipping(newNode)
      setActive(newNode)
      return newView
    })
  }
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
  const nameContainer = selectorFromAttr(myContainer, "data-name")
  getLangBranch(myNode).getChild().writeProp(selectorFromAttr(nameContainer, "data-value"), "name")
  if (hasTextWritePermission()) {
    selectorFromAttr(nameContainer, "data-value").setAttribute("title", "name")
    const {setEdition} = await import("../admin/edition.mjs")
    await setEdition(getLangBranch(myNode).getChild(), nameContainer, "name")
    visibleOnMouseOver(selectorFromAttr(nameContainer, "data-butedit"), nameContainer) // on mouse over edition button visibility
  }
  const descriptionContainer = selectorFromAttr(myContainer, "data-description")
  getLangBranch(myNode).getChild().writeProp(selectorFromAttr(descriptionContainer, "data-value"), "description")
  if (hasTextWritePermission()) {
    selectorFromAttr(descriptionContainer, "data-value").setAttribute("title", "description")
    const {setEdition} = await import("../admin/edition.mjs")
    await setEdition(getLangBranch(myNode).getChild(), descriptionContainer, "description")
    visibleOnMouseOver(selectorFromAttr(descriptionContainer, "data-butedit"), descriptionContainer) // on mouse over edition button visibility
  }
  const delayHoursContainer = selectorFromAttr(myContainer, "data-delay-hours")
  myNode.writeProp(selectorFromAttr(delayHoursContainer, "data-value"), "delay_hours")
  if (hasNodeWritePermission()) {
    selectorFromAttr(delayHoursContainer, "data-value").setAttribute("title", "delay_hours")
    const {setEdition} = await import("../admin/edition.mjs")
    await setEdition(myNode, delayHoursContainer, "delay_hours")
    visibleOnMouseOver(selectorFromAttr(delayHoursContainer, "data-butedit"), delayHoursContainer) // on mouse over edition button visibility
  }
  // *** aqui damos precio en mainbranch y en item se da en langbranch. Estudiar esto, si tiene sentido en item poner un precio por cada language y ver el tema de la moneda, ver como se está haciendo.
  getSiteText().getNextChild("hours").setContentView(selectorFromAttr(myContainer, "data-hours"))
  const priceContainer = selectorFromAttr(myContainer, "data-price")
  selectorFromAttr(priceContainer, "data-value").textContent = intToMoney(myNode.props.price)
  if (hasNodeWritePermission()) {
    selectorFromAttr(priceContainer, "data-value").setAttribute("title", "price")
    const {setEdition} = await import("../admin/edition.mjs")
    await setEdition(myNode, priceContainer, "price", undefined, undefined, undefined, undefined, moneyToInt)
    visibleOnMouseOver(selectorFromAttr(priceContainer, "data-butedit"), priceContainer) // on mouse over edition button visibility
    if (!selectorFromAttr(priceContainer, "data-value")._intoMoneyReaction) {
      selectorFromAttr(priceContainer, "data-value").addEventListener("blur"
        , function (ev) {
        this.textContent = intToMoney(moneyToInt(this.textContent))
        this._intoMoneyReaction = true
      })
    }
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
  const shippingTypesRel = webuser.getRelationship("orders").getChild().getRelationship("ordershipping")
  shippingTypesRel.children = []
  shippingTypesRel.addChild(new Node({name: getLangBranch(myShipping).getChild().props.name, ...myShipping.props}))
  // experimental ***
  shippingTypesRel.getChild().addParent(myShipping.getRelationship("ordershipping"))
}

async function displayPayments(myContainer){
  const thisTp = await getTemplate("chktpayment")
  const thisContainer = selectorFromAttr(thisTp, "data-container")
  getSiteText().getNextChild("checkout").getNextChild("paymentTit").setContentView(selectorFromAttr(thisContainer, "data-tit"))

  const tableTp = await getTemplate("paymentstable")
  const thisTable = selectorFromAttr(tableTp, "data-table").cloneNode()
  const rowSample = selectorFromAttr(tableTp, "data-row")
  const {Content} = await import("../../contentbase.mjs")
  const thisText = new Content("TABLE_PAYMENTTYPES")
  await thisText.initData(Linker, getLangParent, webuser, getCurrentLanguage)
  if (hasNodeWritePermission() && !thisText.treeRoot._collectionReactions) {
    await setPaymentsCollectionReactions(thisText.treeRoot, rowSample)
    thisText.treeRoot._collectionReactions = true
  }
  thisText.treeRoot.getMainBranch().childContainer = thisTable
  thisTable.innerHTML = ""
  await thisText.treeRoot.getMainBranch().loadRequest("get my tree")
  for (const myNode of thisText.treeRoot.getMainBranch().children) {
    // it is important to await View for the syncrhony of performance: the Tp to not be empty when append in DOM, dispatch displayChildren after append
    thisTable.appendChild(await paymentView(myNode, rowSample))
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
  if (thisText.treeRoot.getMainBranch().children.length == 0  && hasNodeWritePermission()) {
    const {setAdditionButton} = await import("../admin/addition.mjs")
    setAdditionButton(thisText.treeRoot.getMainBranch(), null, 1 , null, async (newNode)=>{ // 1 : position
      const newPaymentView = await paymentView(newNode, rowSample)
      const selectElement = selectorFromAttr(newPaymentView, "data-select")
      selectElement.checked = true
      setOrderPayment(newNode)
      setActive(newNode)
      return newPaymentView
    })
  }
}

async function paymentView(myNode, rowElementSample) {
  const myContainer = rowElementSample.cloneNode(true)
  const extraCell = selectorFromAttr(myContainer, "data-extra") // extra cell for hidden data edition
  myContainer.removeChild(extraCell)
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
  const nameContainer = selectorFromAttr(myContainer, "data-name")
  getLangBranch(myNode).getChild().writeProp(selectorFromAttr(nameContainer, "data-value"), "name")
  if (hasTextWritePermission()) {
    selectorFromAttr(nameContainer, "data-value").setAttribute("title", "name")
    const {setEdition} = await import("../admin/edition.mjs")
    await setEdition(getLangBranch(myNode).getChild(), nameContainer, "name")
    visibleOnMouseOver(selectorFromAttr(nameContainer, "data-butedit"), nameContainer) // on mouse over edition button visibility
  }
  const descriptionContainer = selectorFromAttr(myContainer, "data-description")
  getLangBranch(myNode).getChild().writeProp(selectorFromAttr(descriptionContainer, "data-value"), "description")
  if (hasTextWritePermission()) {
    const {setEdition} = await import("../admin/edition.mjs")
    await setEdition(getLangBranch(myNode).getChild(), descriptionContainer, "description")
    visibleOnMouseOver(selectorFromAttr(descriptionContainer, "data-butedit"), descriptionContainer) // on mouse over edition button visibility
  }

  if (hasNodeWritePermission()) {
    const {setEdition} = await import("../admin/edition.mjs")
    const templateDataCell = extraCell.cloneNode(true)
    myNode.writeProp(selectorFromAttr(templateDataCell, "data-value"), "template")
    selectorFromAttr(templateDataCell, "data-value").setAttribute("title", "template name")
    await setEdition(myNode, templateDataCell, "template")
    visibleOnMouseOver(selectorFromAttr(templateDataCell, "data-butedit"), templateDataCell) // on mouse over edition button visibility
    myContainer.insertBefore(templateDataCell, myContainer.cells[myContainer.cells.length-1])
    const varsDataCell = extraCell.cloneNode(true)
    myNode.writeProp(selectorFromAttr(varsDataCell, "data-value"), "vars")
    selectorFromAttr(varsDataCell, "data-value").setAttribute("title", "vars {}")
    await setEdition(myNode, varsDataCell, "vars")
    visibleOnMouseOver(selectorFromAttr(varsDataCell, "data-butedit"), varsDataCell) // on mouse over edition button visibility
    myContainer.insertBefore(varsDataCell, myContainer.cells[myContainer.cells.length-1])

    // we load payment account data as well
    await myNode.getRelationship("paymenttypesaccount").loadRequest("get my children")
    // if there is no child we should insert it
    if (myNode.getRelationship("paymenttypesaccount").children.length==0) {
      myNode.getRelationship("paymenttypesaccount").addChild(new Node())
      myNode.getRelationship("paymenttypesaccount").getChild().loadRequest("add myself")
    }
    const accountNode = myNode.getRelationship("paymenttypesaccount").getChild()
    const privateVarsDataCell = extraCell.cloneNode(true)
    accountNode.writeProp(selectorFromAttr(privateVarsDataCell, "data-value"), "vars")
    selectorFromAttr(privateVarsDataCell, "data-value").setAttribute("title", "vars: {}")
    await setEdition(accountNode, privateVarsDataCell, "vars")
    visibleOnMouseOver(selectorFromAttr(privateVarsDataCell, "data-butedit"), privateVarsDataCell) // on mouse over edition button visibility
    myContainer.insertBefore(privateVarsDataCell, myContainer.cells[myContainer.cells.length-1])

    visibleOnMouseOver(selectorFromAttr(myContainer, "data-admnbuts"), myContainer) // on mouse over edition button visibility
    const {setAdditionButton} = await import("../admin/addition.mjs")
    const {setChangePosButton} = await import("../admin/changepos.mjs")
    const {setDeletionButton} = await import("../admin/deletion.mjs")
    await setChangePosButton(myNode, myContainer, "butchposvert")
    await setAdditionButton(myNode.parent, myNode, 1, myContainer, async (newNode)=>{
      return await paymentView(newNode, rowElementSample)
    })
    await setDeletionButton(myNode, myContainer)
  }
  return myContainer
}

function setOrderPayment(myPayment) {
  const thisRel = webuser.getRelationship("orders").getChild().getRelationship("orderpayment")
  thisRel.children = []
  thisRel.addChild(new Node({name: getLangBranch(myPayment).getChild().props.name, details: new URLSearchParams({currencyCode: getCurrencyCode()}).toString()}))
  thisRel.getChild().addParent(myPayment.getRelationship("orderpayment"))
}

async function orderView(order) {
  const orderTp = await getTemplate("order")
  const orderContainer = selectorFromAttr(orderTp, "data-container")
  await displayOrderItems(order, orderContainer)
  getSiteText().getNextChild("checkout").getNextChild("order").getNextChild("total").setContentView(selectorFromAttr(orderContainer, "data-total-label"))
  selectorFromAttr(orderContainer, "data-total-value").textContent = total(order)
  // falta shipping y payment

  return orderTp
}

async function displayOrderItems(order, orderContainer){
  const tableTp = await getTemplate("ordertable")
  const thisTable = selectorFromAttr(tableTp, "data-table").cloneNode()
  order.firstElement = thisTable
  const rowSample = selectorFromAttr(tableTp, "data-row")
  const cellSample = selectorFromAttr(tableTp, "data-cell")
  const thisTableAdmnCellSample = selectorFromAttr(tableTp, "data-admn")
  order.getRelationship("orderitems").childContainer = thisTable
  for (const item of order.getRelationship("orderitems").children) {
    thisTable.appendChild(await itemView(item, rowSample, cellSample, thisTableAdmnCellSample))
    // we still havent developed a way to change the order in this stage
    item.addEventListener("changeProperty", function(propKey) {
      if (propKey=="quantity" || propKey=="price") {
        selectorFromAttr(orderContainer, "data-total-value").textContent = total(order)
      }
    }, "reCaluculate")
  }
  if (order.getRelationship("orderitems").children.length == 0  && hasNodeWritePermission()) {
    const {setAdditionButton} = await import("../admin/addition.mjs")
    setAdditionButton(order.getRelationship("orderitems"), null, 1 , null, async (newNode)=>{
      return await itemView(newNode, rowSample, cellSample, thisTableAdmnCellSample)
    })
  }
  if (hasNodeWritePermission()) {
    const {onDelOnlyChild} = await import("../admin/deletion.mjs")
    onDelOnlyChild(order.getRelationship("orderitems"), async (delNode)=>{
      const {setAdditionButton} = await import("../admin/addition.mjs")
      setAdditionButton(order.getRelationship("orderitems"), null, 1 , null, async (newNode)=>{
        return await itemView(newNode, rowSample, cellSample, thisTableAdmnCellSample)
      })
    })
  }
  selectorFromAttr(orderContainer, "data-items").appendChild(thisTable)
}

async function itemView(orderItem, containerSample, fieldElementSample, fieldAdmnElementSample) {
  console.log("orderitem", orderItem)
  const fieldsContainer = containerSample.cloneNode()
  orderItem.firstElement = fieldsContainer
  const orderItemParent = Array.isArray(orderItem)? orderItem.parent[0] : orderItem.parent // *** parece que a veces no es multiparent??
  for (const propKey of orderItemParent.childTableKeys) {
    let myField = fieldElementSample.cloneNode(true)
    myField.setAttribute(`data-${propKey}`, "")
    if (propKey != "price" && propKey != "currencyCode") {
      orderItem.writeProp(selectorFromAttr(myField, "data-value"), propKey)
      if (hasNodeWritePermission()) {
        const {setEdition} = await import("../admin/edition.mjs")
        await setEdition(orderItem, myField, propKey)
        visibleOnMouseOver(selectorFromAttr(myField, "data-butedit"), myField) // on mouse over edition button visibility
      }
    }
    else if (propKey == "price") {
      selectorFromAttr(myField, "data-value").textContent = intToMoney(orderItem.props["price"])
      if (hasNodeWritePermission()) {
        const {setEdition} = await import("../admin/edition.mjs")
        await setEdition(orderItem, myField, "price", undefined, undefined, undefined, undefined, moneyToInt)
        visibleOnMouseOver(selectorFromAttr(myField, "data-butedit"), myField) // on mouse over edition button visibility
        if (!selectorFromAttr(myField, "data-value")._intoMoneyReaction) {
          selectorFromAttr(myField, "data-value").addEventListener("blur"
            , function (ev) {
            this.textContent = intToMoney(moneyToInt(this.textContent), orderItem["currencyCode"])
            this._intoMoneyReaction = true
          })
        }
      }
    }
    else if (propKey == "currencyCode" && hasNodeWritePermission()) { // currencyCode
      selectorFromAttr(myField, "data-value").setAttribute("title", "Currency Code")
      orderItem.writeProp(selectorFromAttr(myField, "data-value"), propKey)
      const {setEdition} = await import("../admin/edition.mjs")
      await setEdition(orderItem, myField, propKey)
      visibleOnMouseOver(selectorFromAttr(myField, "data-butedit"), myField) // on mouse over edition button visibility

    }
    // *** iria bien poner la cantidad con un dropdown y hacer que se pueda cambiar
    fieldsContainer.appendChild(myField) // last element is reserved for the collection edition
  }
  if (hasNodeWritePermission()) {
    const admnElm = fieldsContainer.appendChild(fieldAdmnElementSample.cloneNode(true))
    visibleOnMouseOver(selectorFromAttr(fieldsContainer, "data-admnbuts"), fieldsContainer)
    const {setAdditionButton} = await import("../admin/addition.mjs")
    const {setDeletionButton} = await import("../admin/deletion.mjs")
    await setAdditionButton(orderItem.parent[0], orderItem, 1, admnElm, async (newNode)=>{
      return await itemView(newNode, containerSample, fieldElementSample, fieldAdmnElementSample)
    })
    await setDeletionButton(orderItem, admnElm)
  }
  return fieldsContainer
}

function total(order){
  return intToMoney(sumTotal(order.getRelationship("orderitems").children) + + sumTotal(order.getRelationship("ordershipping").children))
}

// Helpers

async function setShippingsCollectionReactions(myNode, rowSample) {
  const {onDelSelectedChild} = await import("../admin/deletion.mjs")
  const {onNewNodeMakeClick} = await import("../admin/addition.mjs")
  onNewNodeMakeClick(myNode.getMainBranch(), (newNode)=>{
    selectorFromAttr(newNode.firstElement, "data-select").checked = true
    setOrderShipping(newNode)
    setActive(newNode)
  })
  onDelSelectedChild(myNode.getMainBranch(), async (nextNode)=>{
    if (!myNode.getMainBranch().getChild()) {
      const {setAdditionButton} = await import("../admin/addition.mjs")
      setAdditionButton(myNode.getMainBranch(), null, 1 , null, async (newNode)=>{ // 1 : position
        const newView = await shippingView(newNode, rowSample)
        const selectElement = selectorFromAttr(newView, "data-select")
        selectElement.checked = true
        setOrderShipping(newNode)
        setActive(newNode)
        return newView
      })
    }
    else
      selectorFromAttr(myNode.getMainBranch().getChild().firstElement, "data-select").checked = true
  })
}

async function setPaymentsCollectionReactions(myNode, rowSample) {
  const {onDelSelectedChild} = await import("../admin/deletion.mjs")
  const {onNewNodeMakeClick} = await import("../admin/addition.mjs")
  onNewNodeMakeClick(myNode.getMainBranch(), (newNode)=>{
    selectorFromAttr(newNode.firstElement, "data-select").checked = true
    setOrderPayment(newNode)
    setActive(newNode)
  })
  onDelSelectedChild(myNode.getMainBranch(), async (nextNode)=>{
    if (!myNode.getMainBranch().getChild()) {
      const {setAdditionButton} = await import("../admin/addition.mjs")
      setAdditionButton(myNode.getMainBranch(), null, 1 , null, async (newNode)=>{ // 1 : position
        const newView = await paymentView(newNode, rowSample)
        const selectElement = selectorFromAttr(newView, "data-select")
        selectElement.checked = true
        setOrderPayment(newNode)
        setActive(newNode)
        return newView
      })
    }
    else
      selectorFromAttr(myNode.getMainBranch().getChild().firstElement, "data-select").checked = true
  })
}

function hasNodeWritePermission() {
  return webuser.isSystemAdmin() || webuser.isOrdersAdmin()
}
function hasTextWritePermission() {
  return webuser.isWebAdmin() || webuser.isSystemAdmin() || webuser.isOrdersAdmin()
}