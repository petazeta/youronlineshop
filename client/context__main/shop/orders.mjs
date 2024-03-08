import {getRoot as getSiteText} from "../sitecontent.mjs"
import {selectorFromAttr, visibleOnMouseOver} from "../../frontutils.mjs" // (elm, attName, attValue)
import {webuser} from '../webuser/webuser.mjs'
import {getTemplate} from '../layouts.mjs'
import {sumTotal} from "./cart.mjs"
import {intToMoney, moneyToInt} from '../money.mjs'

export async function orderView(order) {
  const orderTp = await getTemplate("order")
  const orderContainer = selectorFromAttr(orderTp, "data-container")
  order.firstElement = orderContainer
  await displayOrderItems(order, orderContainer)
  const myShipping = order.getRelationship("ordershipping").getChild()
  if (myShipping)
    await displayOrderShipping(myShipping, orderContainer)
  getSiteText().getNextChild("checkout").getNextChild("order").getNextChild("total").setContentView(selectorFromAttr(orderContainer, "data-total-label"))
  selectorFromAttr(orderContainer, "data-total-value").textContent = total(order)
  const myorderpay = order.getRelationship("orderpayment").getChild()
  if (myorderpay && hasNodeWritePermission())
    selectorFromAttr(orderContainer, "data-paymentview").appendChild(await orderPaymentView(myorderpay))
  return orderContainer
}

async function displayOrderItems(order, orderContainer){
  const tableTp = await getTemplate("ordertable")
  const thisTable = selectorFromAttr(tableTp, "data-table").cloneNode()
  const rowSample = selectorFromAttr(tableTp, "data-row")
  const cellSample = selectorFromAttr(tableTp, "data-cell")
  const thisTableAdmnCellSample = selectorFromAttr(tableTp, "data-admn")
  order.getRelationship("orderitems").childContainer = thisTable
  for (const item of order.getRelationship("orderitems").children) {
    thisTable.appendChild(await itemView(item, rowSample, cellSample, thisTableAdmnCellSample))
    // we still havent developed a way to change the order in this stage
    item.addEventListener("changeProperty", function(propKey) {
      // currency code 
      if (propKey=="quantity" || propKey=="price") {
        selectorFromAttr(orderContainer, "data-total-value").textContent = total(order)
      }
    }, "reCaluculate")
  }
  if (hasNodeWritePermission()) {
    if (order.getRelationship("orderitems").children.length == 0) {
      const {setAdditionButton} = await import("../admin/addition.mjs")
      setAdditionButton(order.getRelationship("orderitems"), 1 , order.getRelationship("orderitems"), async (newNode)=>await itemView(newNode, rowSample, cellSample, thisTableAdmnCellSample), (newNode)=>{
        newNode.addEventListener("changeProperty", function(propKey) {
          // currency code 
          if (propKey=="quantity" || propKey=="price") {
            selectorFromAttr(orderContainer, "data-total-value").textContent = total(order)
          }
        }, "reCaluculate")
        selectorFromAttr(orderContainer, "data-total-value").textContent = total(order)
      })
    }
  }
  selectorFromAttr(orderContainer, "data-items").appendChild(thisTable)
}

async function displayOrderShipping(myNode, orderContainer){
  const myContainer = selectorFromAttr(orderContainer, "data-shipping")
  myNode.firstElement = myContainer
  myNode.writeProp(selectorFromAttr(selectorFromAttr(myContainer, "data-name"), "data-value"), "name")
  if (hasNodeWritePermission()) {
    const {setEdition} = await import("../admin/edition.mjs")
    await setEdition(myNode, selectorFromAttr(myContainer, "data-name"), "name")
    visibleOnMouseOver(selectorFromAttr(selectorFromAttr(myContainer, "data-name"), "data-butedit"), selectorFromAttr(myContainer, "data-name")) // on mouse over edition button visibility
  }
  myNode.writeProp(selectorFromAttr(selectorFromAttr(myContainer, "data-delay"), "data-value"), "delay_hours")
  if (hasNodeWritePermission()) {
    const {setEdition} = await import("../admin/edition.mjs")
    await setEdition(myNode, selectorFromAttr(myContainer, "data-delay"), "delay_hours")
    visibleOnMouseOver(selectorFromAttr(selectorFromAttr(myContainer, "data-delay"), "data-butedit"), selectorFromAttr(myContainer, "data-delay")) // on mouse over edition button visibility
  }
  selectorFromAttr(selectorFromAttr(myContainer, "data-delay"), "data-hours").textContent = getSiteText().getNextChild("hours").getLangData()
  // *** In case items currencyCode is different to general currencyCode the total amount would be wrong
  selectorFromAttr(selectorFromAttr(myContainer, "data-price"), "data-value").textContent = intToMoney(myNode.props["price"], myNode.props["currencyCode"])
  if (hasNodeWritePermission()) {
    const {setEdition} = await import("../admin/edition.mjs")
    await setEdition(myNode, selectorFromAttr(myContainer, "data-price"), "price", undefined, undefined, undefined, undefined, moneyToInt)
    visibleOnMouseOver(selectorFromAttr(selectorFromAttr(myContainer, "data-price"), "data-butedit"), selectorFromAttr(myContainer, "data-price")) // on mouse over edition button visibility
    selectorFromAttr(selectorFromAttr(myContainer, "data-price"), "data-value").addEventListener("blur", function (ev) {
      this.textContent = intToMoney(moneyToInt(this.textContent), myNode["currencyCode"])
    })
  }
  myNode.addEventListener("changeProperty", function(propKey) {
    // currency code 
    if (propKey=="price") {
      selectorFromAttr(orderContainer, "data-total-value").textContent = total(webuser.getRelationship("orders").getChild())
    }
  }, "reCaluculate")
}

async function orderPaymentView(myNode){
  const myTp = await getTemplate("orderpayment")
  const myContainer = selectorFromAttr(myTp, "data-container")
  const parentNode = Array.isArray(myNode.parent)? myNode.parent[0] : myNode.parent
  myNode.firstElement = myContainer
  for (const propKey of parentNode.childTableKeys) {
    if (!selectorFromAttr(myContainer, "data-" + propKey))
      continue
    myNode.writeProp(selectorFromAttr(selectorFromAttr(myContainer, "data-" + propKey), "data-value"), propKey)
    if (hasNodeWritePermission()) {
      const {setEdition} = await import("../admin/edition.mjs")
      await setEdition(myNode, selectorFromAttr(myContainer, "data-" + propKey), propKey)
      visibleOnMouseOver(selectorFromAttr(selectorFromAttr(myContainer, "data-" + propKey), "data-butedit"), selectorFromAttr(myContainer, "data-" + propKey)) // on mouse over edition button visibility
    }
    selectorFromAttr(selectorFromAttr(myContainer, "data-" + propKey), "data-value").setAttribute("title", propKey)
  }
  return myContainer
}

async function itemView(myNode, containerSample, fieldElementSample, fieldAdmnElementSample) {
  const fieldsContainer = containerSample.cloneNode()
  myNode.firstElement = fieldsContainer
  const parentNode = Array.isArray(myNode.parent)? myNode.parent[0] : myNode.parent // *** parece que a veces no es multiparent??
  for (const propKey of parentNode.childTableKeys) {
    // currency code field serves as a register for the currency code related with the price amount. This way we can follow any currency code change.
    // but this field is not useful for the selling process 
    if (propKey == "currencyCode")
      continue
    let myField = fieldElementSample.cloneNode(true)
    myField.setAttribute(`data-${propKey}`, "")
    if (propKey == "price") {
      selectorFromAttr(myField, "data-value").textContent = intToMoney(myNode.props["price"], myNode["currencyCode"])
      if (hasNodeWritePermission()) {
        const {setEdition} = await import("../admin/edition.mjs")
        await setEdition(myNode, myField, "price", undefined, undefined, undefined, undefined, moneyToInt)
        visibleOnMouseOver(selectorFromAttr(myField, "data-butedit"), myField) // on mouse over edition button visibility
        selectorFromAttr(myField, "data-value").addEventListener("blur", function (ev) {
          this.textContent = intToMoney(moneyToInt(this.textContent), myNode["currencyCode"])
        })
      }
    }
    else {
      myNode.writeProp(selectorFromAttr(myField, "data-value"), propKey)
      if (hasNodeWritePermission()) {
        const {setEdition} = await import("../admin/edition.mjs")
        await setEdition(myNode, myField, propKey)
        visibleOnMouseOver(selectorFromAttr(myField, "data-butedit"), myField) // on mouse over edition button visibility
      }
    }
    fieldsContainer.appendChild(myField) // last element is reserved for the collection edition
  }
  if (hasNodeWritePermission()) {
    const admnElm = fieldsContainer.appendChild(fieldAdmnElementSample.cloneNode(true))
    visibleOnMouseOver(selectorFromAttr(fieldsContainer, "data-admnbuts"), fieldsContainer)
    const {setAdditionButton} = await import("../admin/addition.mjs")
    const {setDeletionButton} = await import("../admin/deletion.mjs")
    const position = myNode.props[parentNode.getSysKey('sort_order')] + 1
    await setAdditionButton(parentNode, position, selectorFromAttr(admnElm, "data-admnbuts"), async (newNode)=>await itemView(newNode, containerSample, fieldElementSample, fieldAdmnElementSample), (newNode)=>{
      newNode.addEventListener("changeProperty", function(propKey) {
        // currency code 
        if (propKey=="quantity" || propKey=="price") {
          selectorFromAttr(parentNode.partner.firstElement, "data-total-value").textContent = total(webuser.getRelationship("orders").getChild())
        }
      }, "reCaluculate")
      selectorFromAttr(parentNode.partner.firstElement, "data-total-value").textContent = total(webuser.getRelationship("orders").getChild())
    })
    await setDeletionButton(myNode, selectorFromAttr(admnElm, "data-admnbuts"), async (delNode)=>{
      if (parentNode.children.length==0) {
        const {setAdditionButton} = await import("../admin/addition.mjs")
        setAdditionButton(parentNode, 1, parentNode.childContainer, async (newNode)=>await itemView(newNode, containerSample, fieldElementSample, fieldAdmnElementSample), (newNode)=>{ // 1 : position
          newNode.addEventListener("changeProperty", function(propKey) {
            // currency code 
            if (propKey=="quantity" || propKey=="price") {
              selectorFromAttr(parentNode.partner.firstElement, "data-total-value").textContent = total(webuser.getRelationship("orders").getChild())
            }
          }, "reCaluculate")
        })
      }
      selectorFromAttr(parentNode.partner.firstElement, "data-total-value").textContent = total(webuser.getRelationship("orders").getChild())
    })
  }
  return fieldsContainer
}
function total(order){
  // *** At the current implementation first item currency code is sample of order currencyCode
  const currencyCode = order.getRelationship("orderitems").getChild()?.props.currencyCode
  return intToMoney(sumTotal(order.getRelationship("orderitems").children) + sumTotal(order.getRelationship("ordershipping").children), currencyCode)
}
function hasNodeWritePermission() {
  return webuser.isSystemAdmin() || webuser.isOrdersAdmin()
}
function hasTextWritePermission() {
  return webuser.isWebAdmin() || webuser.isSystemAdmin() || webuser.isOrdersAdmin()
}