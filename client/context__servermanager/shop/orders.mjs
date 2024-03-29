import {getRoot as getSiteText} from "../sitecontent.mjs"
import {selectorFromAttr, visibleOnMouseOver} from "../../frontutils.mjs" // (elm, attName, attValue)
import {webuser} from '../webuser/webuser.mjs'
import {Node} from '../nodes.mjs'
import makeReport from '../reports.mjs'
import {setActiveInSite} from '../activeingroup.mjs'
import {getTemplate} from '../layouts.mjs'
import {intToMoney} from '../money.mjs'
import {myCart, hideCartBox, sumTotal} from "./cart.mjs"
import {getLangBranch} from '../languages/languages.mjs'
//import {userView} from "../webuser/userdata.mjs"

async function orderView(order){
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
  selectorFromAttr(orderTp, "data-shipping").appendChild(await shippingView(order.getRelationship("ordershippingtypes")))
  setTotal(order, selectorFromAttr(orderTp, "data-total"))
  // Show Order payment button.
  // This is valid for chktend and userordersline
  const myorderpay=order.getRelationship("orderpaymenttypes").getChild()
  if (myorderpay && !myorderpay.props.succeed && myorderpay.props.details) {
    const template=JSON.parse(myorderpay.props.details).template
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
        // ** no va bien, fijarse en setPriceEdition de categories.mjs
        await setEdition(orderItem, myField, undefined, propKey, undefined, undefined, undefined, intToMoney)
      }
      else {
        await setEdition(orderItem, myField, undefined, propKey)
      }
      visibleOnMouseOver(selectorFromAttr(myField, "data-butedit"), myField) // on mouse over edition button visibility
    }
    // si cambia el precio hay que cambiar el total
    fieldsContainer.appendChild(myField)
  }
  return fieldsContainer
}

// starting element
export async function ordersView(){
  const ordersviewTp = await getTemplate("showorders")
  const ordersview = selectorFromAttr(ordersviewTp, "data-container")
  const ordersSelectTxt = getSiteText().getNextChild("dashboard").getNextChild("showOrd")
  ordersSelectTxt.getNextChild("new").writeProp(selectorFromAttr(ordersview, "data-new-status"))
  ordersSelectTxt.getNextChild("archived").writeProp(selectorFromAttr(ordersview, "data-archived-status"))
  // this is for content edition purpouses
  ordersSelectTxt.getNextChild("new").setContentView(selectorFromAttr(ordersview, "data-new"))
  ordersSelectTxt.getNextChild("archived").setContentView(selectorFromAttr(ordersview, "data-archived"))
  const statusSelect = selectorFromAttr(ordersview, "data-status")
  statusSelect.onchange = async function(){
    selectorFromAttr(ordersview, "data-orders").innerHTML = ""
    selectorFromAttr(ordersview, "data-orders").appendChild(await ordersListView(this.options[this.selectedIndex].value))
  }
  selectorFromAttr(ordersview, "data-orders").appendChild(await ordersListView(statusSelect.options[statusSelect.selectedIndex].value))
/*
  selectorFromAttr(ordersviewTp, "data-status").onchange=function(){
    // "userorders.html" {filterorders: thisElement.options[thisElement.selectedIndex].value});
  }

        const textContent=thisNode;
        thisElement.onchange=function(){
          textContent.setView(document.getElementById("ordersContainer"), "userorders", {filterorders: thisElement.options[thisElement.selectedIndex].value});
        }
        thisElement.form.elements.ordersStatus[1].innerHTML=thisElement.value;

  //.getNextChild("btShowOrd")
  await setUserData(selectorFromAttr(userviewTp, "data-user-data"))
  getSiteText().getNextChild("not located").getNextChild("save").setContentView(selectorFromAttr(userviewTp, "data-saver"))
  getSiteText().getNextChild("userdataform").getNextChild("fieldCharError").setContentLangView(selectorFromAttr(userviewTp, "data-fieldcharerror"))
  getSiteText().getNextChild("userdataform").getNextChild("emailCharError").setContentLangView(selectorFromAttr(userviewTp, "data-fieldemailerror"))
  await setUserDataSaver(userviewTp)
  */
  return ordersviewTp
}

// fildterOrders: "archived"
async function ordersListView(filterorders){
  const ordersviewTp = await getTemplate("userorders")
  const ordersview = selectorFromAttr(ordersviewTp, "data-container")
  const ordersTxt = getSiteText().getNextChild("dashboard").getNextChild("showOrd")
  ordersTxt.getNextChild("date").setContentView(selectorFromAttr(ordersview, "data-date"))
  ordersTxt.getNextChild("name").setContentView(selectorFromAttr(ordersview, "data-name"))
  ordersTxt.getNextChild("order").setContentView(selectorFromAttr(ordersview, "data-order"))
  if (webuser.isOrdersAdmin() || webuser.isWebAdmin()) {
    const actionsTh = selectorFromAttr(selectorFromAttr(ordersviewTp, "data-actions-th-tp").content, "data-actions")
    ordersTxt.getNextChild("actions").setContentView(actionsTh)
    selectorFromAttr(ordersview, "data-head").appendChild(actionsTh)
  }
  const statusValue = filterorders == "archived"? 1 : 0
  await webuser.getRelationship("orders").loadRequest("get my children", {filterProps: {status: statusValue}})
  // *** here we would have a problem if the orders list is too long, we should make a pagination from results
  for (const order of webuser.getRelationship("orders").children) {
    selectorFromAttr(ordersview, "data-body").appendChild(await orderLineView(order))
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
  return ordersview
  
}

// we need ordersList for administration purposes
async function orderLineView(order){
  const lineTp = await getTemplate("userordersline")
  const line = selectorFromAttr(lineTp, "data-container")
  // *** here we are not taking in account the local date format
  selectorFromAttr(line, "data-date").textContent = new Date(order.props.creationDate)
  const userButton = selectorFromAttr(line, "data-username")
  // from loggedIn function at login.mjs we got already the userdata
  userButton.textContent = webuser.getRelationship("usersdata").getChild().props.fullname
  /*

      let orderUser=webuser, fieldtype='textnode', showAddress=false
      if (webuser.isOrdersAdmin()) {
        // Load user information
        orderUser=order.parent.partner
        await orderUser.loadRequest("get my relationships")
        await orderUser.getRelationship("usersdata").loadRequest("get my children")
        fieldtype='input'
      }
      userButton.textContent = orderUser.getRelationship("usersdata").getChild().props.fullname
      const {default: config} = await import('./' + CLIENT_CONFIG_PATH + 'main.mjs');
      if (config.chktaddress_On) showAddress=true;
      userButton.clickOn=false;
      userButton.addEventListener('click', async function(event){
        event.preventDefault();
        if (!userButton.clickOn) {
          const myrow=userButton.closest("TABLE").insertRow(userButton.closest("TR").rowIndex+1);
          const mycell=myrow.insertCell(0);
          mycell.colSpan=userButton.closest("TABLE").tHead.rows[0].cells.length;
          orderUser.setView(mycell, "rmbox", {myTp: "userview", removeContainer: myrow, myParams: {fieldtype: fieldtype, showAddress: showAddress}});
          userButton.clickOn=true;
          const myCloseFunc= ()=> {if (userButton.clickOn) userButton.clickOn=false};
          orderUser.addEventListener('closewindow', myCloseFunc, null, null, true);
        }
      });

  const orderButton = selectorFromAttr(selectorFromAttr(ordersviewTp, "data-order"), "data-button")
      thisElement.clickOn=false;
      orderButton.addEventListener('click', async (event)=>{
        event.preventDefault();
        if (!thisElement.clickOn) {
          await order.loadRequest("get my tree");
          const myrow=thisElement.closest("TABLE").insertRow(thisElement.closest("TR").rowIndex+1);
          const mycell=myrow.insertCell(0);
          mycell.colSpan=thisElement.closest("TABLE").tHead.rows[0].cells.length;
          thisNode.setView(mycell, "rmbox", {myTp: "order", removeContainer: myrow});
          thisElement.clickOn=true;
          thisNode.addEventListener('closewindow', ()=> {if (thisElement.clickOn) thisElement.clickOn=false}, null, null, true);
        }
        else thisElement.clickOn=false;
      });
      */
  return lineTp
}


function setTotal(order, totView){
  const myorderpay = order.getRelationship("orderpaymenttypes").getChild()
  if (myorderpay)
    selectorFromAttr(totView, "data-pyment-type").textContent = `(${myorderpay.props.name})`
  getSiteText().getNextChild("checkout").getNextChild("order").getNextChild("total").setContentView(selectorFromAttr(totView, "data-total-label"))
  selectorFromAttr(totView, "data-total-value").textContent = intToMoney(sumTotal(order.getRelationship("orderitems").children) + sumTotal(order.getRelationship("ordershippingtypes").children))
}