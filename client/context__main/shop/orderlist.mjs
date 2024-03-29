import {getRoot as getSiteText} from "../sitecontent.mjs"
import {selectorFromAttr, visibleOnMouseOver, fadeIn, fadeOut, fadeInTmOut} from "../../frontutils.mjs" // (elm, attName, attValue)
import {webuser} from '../webuser/webuser.mjs'
import {makeReport} from '../reports.mjs'
//import {setActiveInSite} from '../activeingroup.mjs'
import {getTemplate} from '../layouts.mjs'
import {intToMoney} from '../money.mjs'
import {sumTotal} from "./cart.mjs"
import {Pagination} from "../../pagination.mjs"
import {orderView} from "./orders.mjs"
import {rmBoxView} from "../../rmbox.mjs"
import {dataView} from "../../displaydata.mjs"

const pageSize = 4, statusPending = 1, statusArchived = 2

// starting element
export async function orderListView(){
  const myContainer = (await getTemplate("showorders")).querySelector("[data-container]")
  const ordersSelectTxt = getSiteText().getNextChild("dashboard").getNextChild("showOrd")
  ordersSelectTxt.getNextChild("pending").writeProp(selectorFromAttr(myContainer, "data-pending-status"))
  ordersSelectTxt.getNextChild("archived").writeProp(selectorFromAttr(myContainer, "data-archived-status"))
  // this is for content edition purpouses
  ordersSelectTxt.getNextChild("pending").setContentView(selectorFromAttr(myContainer, "data-pending"))
  ordersSelectTxt.getNextChild("archived").setContentView(selectorFromAttr(myContainer, "data-archived"))
  const statusSelect = selectorFromAttr(myContainer, "data-status")
  const ordersParentPending = webuser.isOrdersAdmin()?
    new webuser.constructor.linkerConstructor("TABLE_ORDERS")
    : webuser.getRelationship("orders").clone()
  ordersParentPending._status = statusPending
  const ordersParentArchived = ordersParentPending.clone()
  ordersParentArchived._status = statusArchived
  statusSelect.onchange = async function(){
    selectorFromAttr(myContainer, "data-orders").innerHTML = ""
    const ordersParent = statusSelect.options[statusSelect.selectedIndex].value == "pending"? ordersParentPending : ordersParentArchived
    if (!ordersParent.pagination || hasNodeWritePermission()) // updates when admin in case there has been any change
      await setPagination(ordersParent, selectorFromAttr(myContainer, "data-orders"))
    await displayOrders(ordersParent, selectorFromAttr(myContainer, "data-orders"))
  }
  const ordersParent = statusSelect.options[statusSelect.selectedIndex].value == "pending"? ordersParentPending : ordersParentArchived
  await setPagination(ordersParent, selectorFromAttr(myContainer, "data-orders"))
  await displayOrders(ordersParent, selectorFromAttr(myContainer, "data-orders"))
  return myContainer
}

async function displayOrders(ordersParent, containerView, pageNum){
  if (!containerView)
    containerView = ordersParent.pageContainer
  else
    ordersParent.pageContainer = containerView
  const tableTp = await getTemplate("userorderstable")
  const headFieldsContainer = selectorFromAttr(tableTp, "data-head").cloneNode()
  const headField = selectorFromAttr(tableTp, "data-head data-cell")
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
  const pagination = ordersParent.pagination
  if (pagination.totalParent.props.total>0 && !pagination._loaded || (pageNum !== undefined && pagination.pageNum!=pageNum)) {
    const loadAction = ordersParent.props.parentTableName == "TABLE_USERS" ? "get my children" : "get all my children"
    await pagination.loadPageItems(loadAction, {filterProps: {status: ordersParent._status}}, pageNum)
    pagination._loaded = true
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
    const myorderpay = order.getRelationship("orderpayment").getChild()
    if (myorderpay && !myorderpay.props.succeed) {
      const myPayment = (await myorderpay.loadRequest("get my tree up")).parent[1].partner
      const {renderPayment} = await import(`../../shop/payments/${myPayment.props.moduleName}.mjs`)
      // Render payment comes after the view is appended because pay provider script uses elements from the DOM
      await renderPayment(getTemplate, selectorFromAttr(newCell, "data-payment"), order, myPayment)
    }
  })
  if (hasNodeWritePermission()) {
    const adminRow = thisContainer.appendChild(selectorFromAttr(rowSample, "data-admin").cloneNode(true))
    await setSuccessButton(selectorFromAttr(adminRow, "data-success"))
    const {setDeletionButton} = await import("../admin/deletion.mjs")
    await setDeletionButton(order, selectorFromAttr(adminRow, "data-remove"), async (delNode)=>{
      const nodeParent = order.getParent()
      const pagination = nodeParent.pagination
      const total = --pagination.totalParent.props.total // standard deletion substract from parent, not from totalParent

      // Is it not last page?
      if (pagination.pageNum < pagination.indexes.length)  // Hay paginas posteriores
        pagination._loaded = false // reload items in window
      else
        return // we could let the default behaveour to work
      // Is there a change in indexes because of the substraction?
      // We have two options 
      if (total > 0 && total % pagination.pageSize == 0) {
        pagination.createIndexes()
        pagination.createItemsWindow()
        pagination.displayButtons(getTemplate)
        await displayOrders(nodeParent, userNameBut.closest("TABLE"), pagination.pageNum - 1)
        return
      }
      // No change in indexes
      await displayOrders(nodeParent, userNameBut.closest("TABLE"), pagination.pageNum)
    })
  }
  return thisContainer
  // Helpers
  async function setSuccessButton(butContainer){
    const butToSuccess = (await getTemplate("butsuccessorder")).querySelector("[data-button]")
    const butToUnsuccess = (await getTemplate("butundosuccessorder")).querySelector("[data-button]")
    const [thisButton, newStatus] = order.props.status == statusPending ? [butToSuccess, statusArchived] : [butToUnsuccess, statusPending]
    thisButton.addEventListener("click", async (ev)=>{
      ev.preventDefault()
      await order.loadRequest("edit my props", {values:{status: newStatus}})
      const nodeParent = order.getParent()
      await setPagination(nodeParent)
      await displayOrders(nodeParent)
    })
    butContainer.appendChild(thisButton)
  }
}

async function setPagination(ordersParent, containerView){
  ordersParent.pagination = new Pagination(ordersParent, async (index)=>{
    await displayOrders(ordersParent, containerView, index)
  }, pageSize)
  await ordersParent.pagination.init({filterProps: {status: ordersParent._status}})
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