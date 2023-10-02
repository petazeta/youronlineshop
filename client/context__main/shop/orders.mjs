// setEdition, webadmin, intToMoney, getSiteText, sumTotal (cart), Linker

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
function setTotal(order, totView){
  const myorderpay=order.getRelationship("orderpaymenttypes").getChild()
  if (myorderpay) selectorFromAttr(totView, "data-pyment-type").textContent=`(${myorderpay.props.name})`
  const totalLabel = getSiteText().getNextChild("checkout").getNextChild("order").getNextChild("total")
  totalLabel.setContentView(selectorFromAttr(totView, "data-total-label"))
  selectorFromAttr(totView, "data-total-value").textContent = intToMoney(sumTotal(order.getRelationship("orderitems").children) + sumTotal(order.getRelationship("ordershippingtypes").children))
}
async function shippingView(shipping){
  const shipTp = await getTemplate("ordershipping")
  selectorFromAttr(shipTp, "data-name").textContent=shipping.props.name
  selectorFromAttr(shipTp, "data-price").textContent=intToMoney(shipping.props.price)
  return shipTp
}

async function itemView(orderItem){
  async function setFields(myNode, fieldTpName){
    const fieldsContainer = document.createElement("template").content
    for (const propKey in myNode.props) {
      let fieldTp = await getTemplate(fieldTpName)

      let fieldElm = selectorFromAttr(fieldTp, "data-value")
      let myValue = myNode.props[propKey]
      if (propkey == "price")
        myValue = intToMoney(myValue)
      fieldElm.textContent =myVaule

      myNode.writeProp(fieldElm, propKey)
      inputElm.value = myNode.props[propKey]
      inputElm.attributes.name.value=propKey
      inputElm.attributes.placeholder.value=propKey
      if (webadmin.isOrdersAdmin()) {
        if (propkey == "price") {
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
// fildterOrders: "archived"
async function ordersList(filterorders="none"){
  const ordersviewTp = await getTemplate("userorders")
  const ordersPath = getSiteText().getNextChild("dashboard").getNextChild("showOrd")
  ordersPath.getNextChild("date").setContentView(selectorFromAttr(ordersviewTp, "data-date"))
  ordersPath.getNextChild("name").setContentView(selectorFromAttr(ordersviewTp, "data-name"))
  ordersPath.getNextChild("order").setContentView(selectorFromAttr(ordersviewTp, "data-order"))
  if (webuser.isOrdersAdmin() || webuser.isWebAdmin()) {
    const actionsTp = selectorFromAttr(ordersviewTp, "data-actions-head-tp").content
    ordersPath.getNextChild("actions").setContentView(selectorFromAttr(actionsTp, "data-actions"))
    selectorFromAttr(ordersviewTp, "data-head").appendChild(actionsTp)
  }
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
    if (!webuser.getRelationship("usersdata").getChild()) await webuser.getRelationship("usersdata").loadRequest("get my children") // to show the user name
    
  }
  ordersList.forEach(order => listBody.appendChild(await orderLineView(order, ordersList))

  //------
  
}
// we need ordersList for administration purposes
async function orderLineView(order, ordersList){
  const lineTp = await getTemplate("userordersline")
  selectorFromAttr(lineTp, "data-date").textContent = new Date(order.props.creationDate)
  const userButton = selectorFromAttr(selectorFromAttr(lineTp, "data-user"), "data-button")
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
}

// starting element
async function ordersView(){
  const ordersviewTp = await getTemplate("showorders")
  const ordersPath = getSiteText().getNextChild("dashboard").getNextChild("btShowOrd")

  ordersPath.getNextChild("new").setContentView(selectorFromAttr(ordersviewTp, "data-new"))
  ordersPath.getNextChild("archived").setContentView(selectorFromAttr(ordersviewTp, "data-archived"))

  ordersPath.getNextChild("new").writeProp(selectorFromAttr(ordersviewTp, "data-new-status"))
  ordersPath.getNextChild("archived").writeProp(selectorFromAttr(ordersviewTp, "data-archived-status"))
  selectorFromAttr(ordersviewTp, "data-status").onchange=function(){
    // "userorders" {filterorders: thisElement.options[thisElement.selectedIndex].value});
  }

        const textContent=thisNode;
        thisElement.onchange=function(){
          textContent.setView(document.getElementById("ordersContainer"), "userorders", {filterorders: thisElement.options[thisElement.selectedIndex].value});
        }
        thisElement.form.elements.ordersStatus[1].innerHTML=thisElement.value;

  .getNextChild("btShowOrd")
  await setUserData(selectorFromAttr(userviewTp, "data-user-data"))
  getSiteText().getNextChild("not located").getNextChild("save").setContentView(selectorFromAttr(userviewTp, "data-saver"))
  getSiteText().getNextChild("userdataform").getNextChild("fieldCharError").setContentLangView(selectorFromAttr(userviewTp, "data-fieldcharerror"))
  getSiteText().getNextChild("userdataform").getNextChild("emailCharError").setContentLangView(selectorFromAttr(userviewTp, "data-fieldemailerror"))
  await setUserDataSaver(userviewTp)
  return userviewTp
}