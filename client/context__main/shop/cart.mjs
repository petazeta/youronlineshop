import cartMixin from '../../shop/cartmixin.mjs'
import {observableMixin} from '../../observermixin.mjs'
import {Node} from '../nodes.mjs'
import {webuser} from '../webuser/webuser.mjs'
import {setActiveInSite} from '../activeingroup.mjs'
import {getRoot as getSiteText} from "../sitecontent.mjs"
import {selectorFromAttr} from "../../frontutils.mjs" // (elm, attName, attValue)
import {getLangBranch} from '../languages/languages.mjs'
import {getTemplate} from '../layouts.mjs'

const Cart = observableMixin(cartMixin(Node))
export const myCart = new Cart()

export function addItem(item, quantity) {
  myCart.addItem(getLangBranch, item, quantity)
  refreshCartBox()
  let alertMsg = `${quantity} ${getLangBranch(item).getChild().props.name}`
  if (quantity > 0)
    alertMsg = "+ " + alertMsg
  document.createElement("alert-element").showMsg(alertMsg, 3000)
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
function toCheckOut(){
  if (myCart.getRelationship().children.length==0) {
    document.createElement("alert-element").showMsg(getLangBranch(getSiteText().getNextChild("cartbox").getNextChild("emptyCart")).getChild().props.value, 3000)
    return
  }
  if (!webuser.props.id) {
    if (document.getElementById("login-card")) getSiteText().getNextChild("logform").setView(document.querySelector(".login-frame .rmbox .body"), "loginform")
    else getSiteText().getNextChild("logform").appendView(document.body, "loginframe")
    return
  }
  setActiveInSite(getSiteText().getNextChild("checkout"))
  getSiteText().getNextChild("checkout").setView(document.getElementById("centralcontent"), "chktmain")
}
export function setCkOutBtn(ckOutContainer){
  getSiteText().getNextChild("cartbox").getNextChild("ckouttt").setContentView(ckOutContainer, false)
  ckOutContainer.querySelector("button").onclick = toCheckOut
}
export function setCkOutDiscardBtn(ckOutDiscardContainer){
  getSiteText().getNextChild("cartbox").getNextChild("discardtt").setContentView(ckOutDiscardContainer, false)
  ckOutDiscardContainer.querySelector("button").onclick = function(){  
    myCart.getRelationship().children=[]
    myCart.refreshCartBox()
  }
}
export function setCartIcon(iconContainer,  cartBoxContainer) {
  getSiteText().getNextChild("cartbox").getNextChild("crtbxtt").write(iconContainer)
  selectorFromAttr(iconContainer, "data-cart-icon-button").addEventListener("click", function(event){
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
    cartBoxContainer.style.visibility="hidden"
  })
  await displayItemList(cbTp)
  // <<<<<<<<<faltan cosas
  return cbTp
}

// new

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
  qttyContainer.addEventListener("click", function(ev){
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
  const nameContainer = selectorFromAttr(itemListContainer, "data-value")
  // tenemos que usar itemList.item y el branch con el data lang para el name, fijarse en catalog
  //itemList.item.writeProp(nameContainer, "name")
  return itemListTp
}