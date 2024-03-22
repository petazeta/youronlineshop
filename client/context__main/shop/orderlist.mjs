import {getRoot as getSiteText} from "../sitecontent.mjs"
import {selectorFromAttr, visibleOnMouseOver, fadeIn, fadeOut, fadeInTmOut} from "../../frontutils.mjs" // (elm, attName, attValue)
import {webuser} from '../webuser/webuser.mjs'
import {Node} from '../nodes.mjs'
import {makeReport} from '../reports.mjs'
import {setActiveInSite} from '../activeingroup.mjs'
import {getTemplate} from '../layouts.mjs'
import {intToMoney} from '../money.mjs'
import {myCart, hideCartBox, sumTotal} from "./cart.mjs"
import {getLangBranch} from '../languages/languages.mjs'
import {Pagination} from "../../pagination.mjs"
import {orderView} from "./orders.mjs"
import {rmBoxView} from "../../rmbox.mjs"
import {dataView} from "../../displaydata.mjs"

// starting element
export async function ordersView(){
  const myTp = await getTemplate("showorders")
  const myContainer = myTp.querySelector("[data-container]")
  const ordersSelectTxt = getSiteText().getNextChild("dashboard").getNextChild("showOrd")
  ordersSelectTxt.getNextChild("new").writeProp(selectorFromAttr(myContainer, "data-new-status"))
  ordersSelectTxt.getNextChild("archived").writeProp(selectorFromAttr(myContainer, "data-archived-status"))
  // this is for content edition purpouses
  ordersSelectTxt.getNextChild("new").setContentView(selectorFromAttr(myContainer, "data-new"))
  ordersSelectTxt.getNextChild("archived").setContentView(selectorFromAttr(myContainer, "data-archived"))
  const statusSelect = selectorFromAttr(myContainer, "data-status")
  let ordersParents = webuser.isOrdersAdmin()?
    [new webuser.constructor.linkerConstructor("TABLE_ORDERS"), new webuser.constructor.linkerConstructor("TABLE_ORDERS")]
    : [webuser.getRelationship("orders").clone(), webuser.getRelationship("orders").clone()]
  statusSelect.onchange = async function(){
    selectorFromAttr(myContainer, "data-orders").innerHTML = ""
    const status = statusSelect.options[statusSelect.selectedIndex].value == "new"? 1 : 2
    await displayOrders(selectorFromAttr(myContainer, "data-orders"), ordersParents, status)
  }
  const status = statusSelect.options[statusSelect.selectedIndex].value == "new"? 1 : 2
  await displayOrders(selectorFromAttr(myContainer, "data-orders"), ordersParents, status)
/*

  //.getNextChild("btShowOrd")
  await setUserData(selectorFromAttr(userviewTp, "data-user-data"))
  getSiteText().getNextChild("not located").getNextChild("save").setContentView(selectorFromAttr(userviewTp, "data-saver"))
  getSiteText().getNextChild("userdataform").getNextChild("fieldCharError").setContentLangView(selectorFromAttr(userviewTp, "data-fieldcharerror"))
  getSiteText().getNextChild("userdataform").getNextChild("emailCharError").setContentLangView(selectorFromAttr(userviewTp, "data-fieldemailerror"))
  await setUserDataSaver(userviewTp)
  */
  return myContainer
}

async function displayOrders(containerView, ordersParents, status, pageNum){
  const ordersParent = status == 1? ordersParents[0] : ordersParents[1]
  if (!containerView)
    containerView = ordersParent.childContainer
  const tableTp = await getTemplate("userorderstable")
  const headFieldsContainer = selectorFromAttr(tableTp, "data-head").cloneNode()
  const headField = selectorFromAttr(selectorFromAttr(tableTp, "data-head"), "data-cell")
  const thisTable = selectorFromAttr(tableTp, "data-table").cloneNode()
  ordersParent.childContainer = thisTable
  const ordersTxt = getSiteText().getNextChild("dashboard").getNextChild("showOrd")
  headFieldsContainer.appendChild(await ordersTxt.getNextChild("date").setContentView(headField.cloneNode(true)))
  headFieldsContainer.appendChild(await ordersTxt.getNextChild("name").setContentView(headField.cloneNode(true)))
  headFieldsContainer.appendChild(await ordersTxt.getNextChild("order").setContentView(headField.cloneNode(true)))
  if (hasTextWritePermission() || hasNodeWritePermission()) {
    headFieldsContainer.appendChild(await ordersTxt.getNextChild("actions").setContentView(headField.cloneNode(true)))
  }
  thisTable.appendChild(headFieldsContainer)
  const pageSize = 20
  if (!ordersParent.pagination) {
    ordersParent.pagination = new Pagination(ordersParent, async (index)=>{
      await displayOrders(containerView, ordersParent, status, index)
    }, pageSize)
    // **** parece que hay un error aqui, quizas si se crea un pagination con el mismo ordersParent, na va bien??
    await ordersParent.pagination.init({filterProps: {status: status}})
  }
  const pagination = ordersParent.pagination
  if (pagination.totalParent.props.total>0 && !pagination.loaded || (pageNum !== undefined && pagination.pageNum!=pageNum)) {
    const loadAction = ordersParent.props.parentTableName == "TABLE_USERS" ? "get my children" : "get all my children"
    await pagination.loadPageItems(loadAction, {filterProps: {status: status}}, pageNum)
    pagination.loaded = true
  }
  for (const order of ordersParent.children) {
    thisTable.appendChild(await rowOrderView(order, selectorFromAttr(tableTp, "data-row")))
  }
  const pageView = await pagination.pageView(getTemplate)
  selectorFromAttr(pageView, "data-content").appendChild(thisTable)
  // There is a jump in the content layout view. We need this transition effect
  fadeOut(containerView)
  containerView.innerHTML = ""
  // give time the fade out to happend
  containerView.appendChild(pageView)
  fadeInTmOut(containerView)
  //ordersParent.dispatchEvent("displayChildren")
}


  /*

  const listBody= selectorFromAttr(ordersviewTp, "data-body")
  const statusValue = filterorders == "archived"? 1 : 0
  let ordersList = webuser.getRelationship("orders").children
  // me interesaria resulver para que requestMulti y copyprops los tome de otro lado
// -----
  if (webuser.isOrdersAdmin()) {
    const {Node, Linker}=await import('./' + CLIENT_MODULES_PATH + 'nodes.mjs');
    const {unpacking}=await import('./' + SHARED_MODULES_PATH + 'utils.mjs');
    // create virtual ordersParent for showing everyone, esto era antes, ahora es orderList
    const ordersParent=await new Linker("TABLE_ORDERS").loadRequest("get all my children", {filterProps: {status: statusValue}})
    // We create a parent for each order
    for (const order of ordersParent.children) {
      order.parent=Node.copyProps(new Linker(), ordersParent)
    }
    const ordersUserParents=await Node.requestMulti("get my tree up", ordersParent.children);
    ordersUserParents.forEach((ordersUserParent, i)=>{
      ordersParent.children[i].parent.load(unpacking(ordersUserParent))
    })
    ordersList = ordersParent.children
  }
  else {
    await webuser.getRelationship("orders").loadRequest("get my children", {filterProps: {status: statusValue}})
    // Ver aqui si esto lo carga siempre o que
    if (!webuser.getRelationship("usersdata").getChild()) await webuser.getRelationship("usersdata").loadRequest("get my children") // to show the user name
    
  }
  ordersList.forEach(async order => listBody.appendChild(await orderLineView(order, ordersList)))

  //------
  */


async function rowOrderView(order, rowSample) {
  const thisContainer = rowSample.cloneNode()
  order.firstElement = thisContainer
  thisContainer.appendChild(selectorFromAttr(rowSample, "data-cell").cloneNode(true)).textContent = new Date(order.props.creationDate).toLocaleString()
  const userNameBut = selectorFromAttr(thisContainer.appendChild(selectorFromAttr(rowSample, "data-username").cloneNode(true)), "data-value")
  webuser.getRelationship("usersdata").getChild().writeProp(userNameBut, "fullname")
  userNameBut.addEventListener('click', async function(event){
    event.preventDefault()
    await order.loadRequest("get my tree")
    const nextRowIndex = userNameBut.closest("TR").rowIndex + 1
    const addressRowIndex = userNameBut.closest("TABLE").rows[nextRowIndex]?._orderRow? nextRowIndex +1 : nextRowIndex
    if (userNameBut.closest("TABLE").rows[addressRowIndex]?._addressRow) // already clicked
      return
    const newRow = userNameBut.closest("TABLE").insertRow(nextRowIndex)
    newRow._addressRow = true
    const newCell = newRow.insertCell(0)
    newCell.colSpan = userNameBut.closest("TABLE").rows[0].cells.length
    const container = selectorFromAttr(await getTemplate("orderaddress"), "data-container")

    // **** order.getParent().partner == null => is orders admin => we can edit
    //selectorFromAttr(container, "data-addressdata").appendChild(await userDataView(order.getRelationship("orderaddress").getChild(), "textnode"))
    
    await dataView(await getTemplate("singlefield"), order.getRelationship("orderaddress").getChild(), selectorFromAttr(container, "data-addressdata"))

    newCell.appendChild(await rmBoxView(getTemplate, container, newRow))
  })
  const showOrderBut = selectorFromAttr(thisContainer.appendChild(selectorFromAttr(rowSample, "data-showorder").cloneNode(true)), "data-button")
  showOrderBut.addEventListener('click', async function(event){
    event.preventDefault()
    await order.loadRequest("get my tree")
    const nextRowIndex = userNameBut.closest("TR").rowIndex + 1
    const orderRowIndex = userNameBut.closest("TABLE").rows[nextRowIndex]?._addressRow? nextRowIndex +1 : nextRowIndex
    if (userNameBut.closest("TABLE").rows[orderRowIndex]?._orderRow) // already clicked
      return
    const newRow = userNameBut.closest("TABLE").insertRow(nextRowIndex)
    newRow._orderRow = true
    const newCell = newRow.insertCell(0)
    newCell.colSpan = userNameBut.closest("TABLE").rows[0].cells.length
    newCell.appendChild(await rmBoxView(getTemplate, await orderView(order), newRow))
  })
  if (hasNodeWritePermission()) {
    const adminRow = thisContainer.appendChild(selectorFromAttr(rowSample, "data-admin").cloneNode(true))
    await setSuccessButton(selectorFromAttr(adminRow, "data-success"))
    const {setDeletionButton} = await import("../admin/deletion.mjs")
    await setDeletionButton(order, selectorFromAttr(adminRow, "data-remove"), async (delNode)=>{
      const nodeParent = order.getParent()
      const pagination = nodeParent.pagination[order.props.status]
      const total = --pagination.totalParent.props.total // standard deletion substract from parent, not from totalParent

      // Is it not last page?
      if (pagination.pageNum < pagination.indexes.length)  // Hay paginas posteriores
        pagination.loaded = false // reload items in window
      else
        return // we could let the default behaveour to work
      // Is there a change in indexes because of the substraction?
      // We have two options 
      if (total > 0 && total % pagination.pageSize == 0) {
        pagination.createIndexes()
        pagination.createItemsWindow()
        pagination.displayButtons(getTemplate)
        await displayOrders(userNameBut.closest("TABLE"), nodeParent, order.props.status, pagination.pageNum - 1)
        return
      }
      // No change in indexes
      await displayOrders(userNameBut.closest("TABLE"), nodeParent, order.props.status, pagination.pageNum)
    })
  }
  // falta action
  // falta linea de edicion
  return thisContainer
  // Helps
  async function setSuccessButton(butContainer){
    const successStatus = 1, notSuccessStatus = 0
    const mySuccessTp = await getTemplate("butsuccessorder")
    const myUndoSuccessTp = await getTemplate("butundosuccessorder")
    const myButton = mySuccessTp.querySelector("[data-button]")
    const myUndoButton = myUndoSuccessTp.querySelector("[data-button]")
    myButton.addEventListener("click", async (ev)=>{
      ev.preventDefault()
      await order.loadRequest("edit my props", {values:{status: successStatus}})
      butContainer.removeChild(myButton)
      butContainer.appendChild(myUndoButton)
    })
    myUndoButton.addEventListener("click", async (ev)=>{
      ev.preventDefault()
      await order.loadRequest("edit my props", {values:{status: notSuccessStatus}})
      butContainer.removeChild(myUndoButton)
      butContainer.appendChild(myButton)
    })
    butContainer.appendChild(myButton)
  }
}


function setTotal(order, totView){
  const myorderpay = order.getRelationship("orderpayment").getChild()
  if (myorderpay)
    selectorFromAttr(totView, "data-pyment-type").textContent = `(${myorderpay.props.name})`
  getSiteText().getNextChild("checkout").getNextChild("order").getNextChild("total").setContentView(selectorFromAttr(totView, "data-total-label"))
  selectorFromAttr(totView, "data-total-value").textContent = intToMoney(sumTotal(order.getRelationship("orderitems").children) + sumTotal(order.getRelationship("ordershipping").children))
}


function hasNodeWritePermission() {
  return webuser.isSystemAdmin() || webuser.isOrdersAdmin()
}
function hasTextWritePermission() {
  return webuser.isWebAdmin() || webuser.isSystemAdmin()
}


// ----
async function orderView_old(order){
  // esto se puede reformar para que lo haga mediante una <table> que sería mas apropiado
  const orderTp = await getTemplate("order")
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
  selectorFromAttr(orderTp, "data-shipping").appendChild(await shippingView(order.getRelationship("ordershipping")))
  setTotal(order, selectorFromAttr(orderTp, "data-total"))
  // Show Order payment button.
  // This is valid for chktend and userordersline
  const myorderpay = order.getRelationship("orderpayment").getChild()
  if (myorderpay && !myorderpay.props.succeed && myorderpay.props.details) {
    const template = JSON.parse(myorderpay.props.details).template
    // aqui lo mejor quizas sería que tuviera ademas de template el nombre del script, y de ese script se importe una funcion: payemtView
    if (template) {
      //myorderpay.setView(thisElement, template)
    }
  }
}

async function shippingView(shipping){
  const shipTp = await getTemplate("ordershipping")
  selectorFromAttr(shipTp, "data-name").textContent=shipping.props.name
  selectorFromAttr(shipTp, "data-price").textContent=intToMoney(shipping.props.price)
  return shipTp
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
    if (webuser.isOrdersAdmin()) {
      const {setEdition} = await import('../admin/edition.mjs')
      if (propKey == "price") {
        await setEdition(orderItem, myField, propKey, undefined, undefined, undefined, undefined, intToMoney)
      }
      else {
        await setEdition(orderItem, myField, propKey)
      }
      visibleOnMouseOver(selectorFromAttr(myField, "data-butedit"), myField) // on mouse over edition button visibility
    }
    // si cambia el precio hay que cambiar el total
    fieldsContainer.appendChild(myField)
  }
  return fieldsContainer

  // helper
  function setQttySelect(viewContainer){
    const mySelect=viewContainer.querySelector('select')
    const firstOption=mySelect.options[0]
    for (let i=1; i<25; i++){
      let myOption = firstOption.cloneNode()
      myOption.textContent=i+1
      myOption.value=i+1
      mySelect.add(myOption)
    }
  }
}