import {cartMixin, sumTotal} from '../../shop/cartmixin.mjs'
import {Node} from '../nodes.mjs'
import {webuser} from '../webuser/webuser.mjs'
import {getRoot as getSiteText} from "../sitecontent.mjs"
import {selectorFromAttr} from "../../frontutils.mjs" // (elm, attName, attValue)
import {getLangBranch} from '../languages/languages.mjs'
import {getTemplate} from '../layouts.mjs'
import {makeReport} from '../reports.mjs'

export {sumTotal}
const Cart = cartMixin(Node)
export const myCart = new Cart()

export function setCartIcon(iconContainer,  cartBoxContainer) {
  getSiteText().getNextChild("cartbox").getNextChild("crtbxtt").write(iconContainer)
  selectorFromAttr(iconContainer, "data-cart-icon-button").addEventListener("click", (event)=>{
    event.preventDefault()
    toggleCartBox(cartBoxContainer)
  })
}
export async function cartBoxView(cartBoxContainer) {
  const myContainer = selectorFromAttr(await getTemplate("cartbox"), "data-container")
  selectorFromAttr(myContainer, "data-close").addEventListener("click",  (ev)=>{
    ev.preventDefault()
    hideCartBox(cartBoxContainer)
  })
  const cartTitView = selectorFromAttr(myContainer, "data-tit")
  getSiteText().getNextChild("cartbox").getNextChild("crtbxtt").setContentView(cartTitView)
  selectorFromAttr(cartTitView, "data-value").addEventListener("click",  (event)=>{
    event.preventDefault()
    hideCartBox(cartBoxContainer)
  })
  await displayItemList(myContainer)
  setCkOutBtn(selectorFromAttr(myContainer, "data-checkoutcontainer"), cartBoxContainer)
  setCkOutDiscardBtn(selectorFromAttr(myContainer, "data-discardcontainer"), cartBoxContainer)
  return myContainer
}
export function addItem(item, quantity) {
  myCart.addItem(item, quantity)
  refreshCartBox(document.getElementById("cartbox"))
  let alertMsg = `${quantity} ${getLangBranch(item).getChild().props.name}`
  if (quantity > 0)
    alertMsg = "+ " + alertMsg
  document.createElement("alert-element").showMsg(alertMsg, 3000)
  makeReport("cart item operation")
}
// Helpers

function setCkOutBtn(ckOutContainer, cartBoxContainer){
  getSiteText().getNextChild("cartbox").getNextChild("ckouttt").setContentView(ckOutContainer, false)
  ckOutContainer.querySelector("button").addEventListener("click", async ev=>{
    ev.preventDefault()
    if (myCart.getRelationship().children.length==0) {
      document.createElement("alert-element").showMsg(getLangBranch(getSiteText().getNextChild("cartbox").getNextChild("emptyCart")).getChild().props.value, 3000)
      return
    }
    hideCartBox(document.getElementById("cartbox"))
    if (!webuser.props.id) {
      const {loginFormView} = await import("../webuser/login.mjs")
      const {rmBoxView} = await import("../../rmbox.mjs")
      const loginFrame = await getTemplate("loginframe")
      selectorFromAttr(loginFrame, "data-card-body").appendChild(await rmBoxView(getTemplate, await loginFormView("checkout"), selectorFromAttr(loginFrame, "data-container")))
      document.body.appendChild(loginFrame)
      return
    }
    const {toCheckOut} = await import("./ckt.mjs")
    await toCheckOut(cartBoxContainer)
  })
}
function setCkOutDiscardBtn(cktDiscardContainer, cartBoxContainer){
  getSiteText().getNextChild("cartbox").getNextChild("discardtt").setContentView(cktDiscardContainer, false)
  cktDiscardContainer.querySelector("button").onclick = ()=>resetCartBox(cartBoxContainer)
}
function write(myNode, viewContainer, propKey, dataId="value", attrKey) {
  getLangBranch(myNode).getChild().writeProp(selectorFromAttr(viewContainer, "data-" + dataId), propKey, attrKey)
}
async function displayItemList(cartBoxContainer) {
  const itemListContainer = selectorFromAttr(cartBoxContainer, "data-itemlistcontainer")
  myCart.getRelationship().childContainer = itemListContainer
  itemListContainer.innerHTML = ""
  for (const itemList of myCart.getRelationship().children) {
    itemListContainer.appendChild(await itemListView(itemList, cartBoxContainer))
  }
}
async function itemListView(itemList, cartBoxContainer) {
  const itemListTp = await getTemplate("itemlist") // everytime a new tp is created
  const itemListContainer = selectorFromAttr(itemListTp, "data-container")
  itemList.firstElement = itemListContainer
  const qttyContainer = selectorFromAttr(itemListContainer, "data-quantity")
  itemList.writeProp(qttyContainer, "quantity")
  qttyContainer.addEventListener("click", (ev)=>{
    ev.preventDefault()
    myCart.addItem(itemList.item, -itemList.props.quantity)
    refreshCartBox(cartBoxContainer)
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
function refreshCartBox(cartBoxContainer){
  displayItemList(cartBoxContainer)
  showCartBox(cartBoxContainer)
}
export function resetCartBox(cartBoxContainer){
  myCart.getRelationship().children = []
  displayItemList(cartBoxContainer)
}
export function hideCartBox(cartBoxContainer){
  cartBoxContainer.classList.remove("appear")
}
function showCartBox(cartBoxContainer){
  cartBoxContainer.classList.add("appear")
}
function toggleCartBox(cartBoxContainer){
  cartBoxContainer.classList.toggle("appear")
}
