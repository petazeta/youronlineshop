import {cartMixin} from '../../shop/cartmixin.mjs'
import {Node} from '../nodes.mjs'
import {webuser} from '../webuser/webuser.mjs'
import {getRoot as getSiteText} from "../sitecontent.mjs"
import {selectorFromAttr} from "../../frontutils.mjs" // (elm, attName, attValue)
import {getLangBranch} from '../languages/languages.mjs'
import {getTemplate} from '../layouts.mjs'
import makeReport from '../reports.mjs'
import {rmBoxView} from "../../rmbox.mjs"
import {loginFormView} from '../webuser/login.mjs'

const Cart = cartMixin(Node)
const myCart = new Cart()

export function addItem(item, quantity) {
  myCart.addItem(item, quantity)
  refreshCartBox()
  let alertMsg = `${quantity} ${getLangBranch(item).getChild().props.name}`
  if (quantity > 0)
    alertMsg = "+ " + alertMsg
  document.createElement("alert-element").showMsg(alertMsg, 3000)
  makeReport("cart item operation")
}
//<<<<<<<<<<
function refreshCartBox(){
  displayItemList(document.getElementById("cartbox"))
  document.getElementById("cartbox").classList.add("appear")
}
function resetCartBox(){
  myCart.getRelationship().children = []
  displayItemList(document.getElementById("cartbox"))
}
async function toCheckOut(){
  if (myCart.getRelationship().children.length==0) {
    document.createElement("alert-element").showMsg(getLangBranch(getSiteText().getNextChild("cartbox").getNextChild("emptyCart")).getChild().props.value, 3000)
    return
  }
  if (false && !webuser.props.id) { // ***temporal
    const loginFrame = await getTemplate("loginframe")
    selectorFromAttr(loginFrame, "data-card-body").appendChild(await rmBoxView(getTemplate, await loginFormView(), selectorFromAttr(loginFrame, "data-container")))
    document.body.appendChild(loginFrame)
    return
  }
  //<<<<<<<
  const {cktView} = await import("../shop/ckt.mjs")
  document.getElementById("centralcontent").innerHTML=""
  document.getElementById("centralcontent").appendChild(await cktView())
  //getSiteText().getNextChild("checkout").setView(document.getElementById("centralcontent"), "chktmain")
}
// Helper
function setCkOutBtn(ckOutContainer){
  getSiteText().getNextChild("cartbox").getNextChild("ckouttt").setContentView(ckOutContainer, false)
  ckOutContainer.querySelector("button").onclick = toCheckOut
}
function setCkOutDiscardBtn(ckOutDiscardContainer){
  getSiteText().getNextChild("cartbox").getNextChild("discardtt").setContentView(ckOutDiscardContainer, false)
  ckOutDiscardContainer.querySelector("button").onclick = function(){  
    myCart.getRelationship().children = []
    refreshCartBox()
  }
}

export function setCartIcon(iconContainer,  cartBoxContainer) {
  getSiteText().getNextChild("cartbox").getNextChild("crtbxtt").write(iconContainer)
  selectorFromAttr(iconContainer, "data-cart-icon-button").addEventListener("click", (event)=>{
    event.preventDefault()
    cartBoxContainer.classList.toggle("appear")
  })
}
export async function cartBoxView( cartBoxContainer) {
  const cbTp = await getTemplate("cartbox")
  selectorFromAttr(cbTp, "data-close").addEventListener("click",  (ev)=>{
    ev.preventDefault()
    cartBoxContainer.classList.remove("appear")
  })
  const cartTitView = selectorFromAttr(cbTp, "data-tit")
  getSiteText().getNextChild("cartbox").getNextChild("crtbxtt").setContentView(cartTitView)
  selectorFromAttr(cartTitView, "data-value").addEventListener("click",  (event)=>{
    event.preventDefault()
    cartBoxContainer.style.visibility = "hidden"
  })
  await displayItemList(cbTp)
  setCkOutBtn(selectorFromAttr(cbTp, "data-checkoutcontainer"))
  setCkOutDiscardBtn(selectorFromAttr(cbTp, "data-discardcontainer"))
  return cbTp
}

// -- Helpers functions

function write(myNode, viewContainer, propKey, dataId="value", attrKey) {
  getLangBranch(myNode).getChild().writeProp(selectorFromAttr(viewContainer, "data-" + dataId), propKey, attrKey)
}
async function displayItemList(viewContainer) {
  const itemListContainer = selectorFromAttr(viewContainer, "data-itemlistcontainer")
  myCart.getRelationship().childContainer = itemListContainer
  itemListContainer.innerHTML = ""
  for (const itemList of myCart.getRelationship().children) {
    itemListContainer.appendChild(await itemListView(itemList))
  }
}
async function itemListView(itemList) {
  const itemListTp = await getTemplate("itemlist") // everytime a new tp is created
  const itemListContainer = selectorFromAttr(itemListTp, "data-container")
  itemList.firstElement = itemListContainer
  const qttyContainer = selectorFromAttr(itemListContainer, "data-quantity")
  itemList.writeProp(qttyContainer, "quantity")
  qttyContainer.addEventListener("click", (ev)=>{
    ev.preventDefault()
    myCart.addItem(itemList.item, -itemList.props.quantity)
    refreshCartBox()
  })
  qttyContainer.onmouseover = function(){
    this.textContent = "x"
    this.classList.add("mouseover")
  }
  qttyContainer.onmouseout = function(){
    itemList.writeProp(this, "quantity")
    this.classList.remove("mouseover")
  }
  write(itemList.item, itemListContainer, "name")
  return itemListTp
}