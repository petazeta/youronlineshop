import {SiteContent} from "../sitecontent.mjs"
import {Node, Linker} from "./nodes.mjs"
import {webuser} from "./webuser/webuser.mjs"
import {getCurrentLanguage, getLangParent, getLangBranch} from "./languages/languages.mjs"
import {selectorFromAttr, visibleOnMouseOver, removeVisibleOnMouseOver} from "../frontutils.mjs"
import {observerMixin} from '../observermixin.mjs'

// --- General elements ---

const mySiteText = new SiteContent()

export async function initData(){
  return await mySiteText.initData(SiteContentLinker, getLangParent, webuser, getCurrentLanguage)
}

// -- helpers

function hasWritePermission(){
  return webuser.isWebAdmin()
}
export function getRoot() {
  return mySiteText.treeRoot
}
// writing the text content at the correspondent view container
function write(myNode, viewContainer, propKey, dataId="value", attrKey, volatile) {
  getLangBranch(myNode).getChild().writeProp(selectorFromAttr(viewContainer, "data-" + dataId), propKey, attrKey) // selectorFromAttr allows viewContainer element to be in the attribute search while querySelector not
  if (!volatile && !myNode._langReaction) {
    if (!myNode.setReaction) {
      Object.setPrototypeOf(myNode, observerMixin(myNode.constructor).prototype) // adding methods 
      observerMixin(Object).prototype.initObserver.call(myNode) // adding properties : calling constructor
    }
    const langChangeReaction = () => write(myNode, viewContainer)
    const rootNode = myNode.getRoot().getChild()
    rootNode.attachObserver("language change", myNode)
    myNode.setReaction("language change", ()=>{
      console.log(`node id=${myNode.props.id} said "change language" `)
      langChangeReaction(myNode)
    })
    myNode._langReaction = true
  }
}
// setting the edition button
async function setElmEdition(myNode, viewContainer, volatile){
  const {setEdition} = await import("./admin/edition.mjs")
  if (hasWritePermission()) {
    await setEdition(getLangBranch(myNode).getChild(), viewContainer)
    visibleOnMouseOver(selectorFromAttr(viewContainer, "data-butedit"), viewContainer) // on mouse over edition button visibility
    if (selectorFromAttr(viewContainer, "data-hidden")) {
      selectorFromAttr(viewContainer, "data-hidden").type = "text"
    }
  }
  if (!volatile && !myNode._logEditReaction) {
    if (!myNode.setReaction) {
      Object.setPrototypeOf(myNode, observerMixin(myNode.constructor).prototype) // adding methods 
      observerMixin(Object).prototype.initObserver.call(myNode) // adding properties : calling constructor
    }
    const logChangeReaction = async () => {
      remvEdition(viewContainer)
      if (hasWritePermission())
        await setElmEdition(myNode, viewContainer)
    }
    const rootNode = myNode.getRoot().getChild()
    rootNode.attachObserver("usertype change", myNode)
    myNode.setReaction("usertype change", ()=>{
      console.log(`node id=${myNode.props.id} said "webuser log change" `)
      logChangeReaction(myNode)
    })
    myNode._logEditReaction = true
  }
}
// writting plus setting edition button
async function setNodeView(myNode, viewContainer, volatile, editable=true){
  write(myNode, viewContainer, undefined, undefined, undefined, volatile)
  if (editable)
    await setElmEdition(myNode, viewContainer, volatile)
}
async function remvEdition(myContainer){
  selectorFromAttr(myContainer, "data-butedit").innerHTML = ""
  removeVisibleOnMouseOver(selectorFromAttr(myContainer, "data-butedit"), myContainer)
  if (selectorFromAttr(myContainer, "data-hidden")) {
    selectorFromAttr(myContainer, "data-hidden").type = "hidden"
  }
}
// --- General elements end ---

// special case for stablishing the page header text and page title
export function setPageTitle(headTopText, viewContainer){
  write(headTopText, viewContainer)
  setTitle()
  if (!headTopText.setReaction) {
    Object.setPrototypeOf(headTopText, observerMixin(headTopText.constructor).prototype) // adding methods 
    observerMixin(Object).prototype.initObserver.call(headTopText) // adding properties : calling constructor
  }
  const rootNode = headTopText.getRoot().getChild()
  rootNode.attachObserver("language change", headTopText)
  // permite varias reacciones????
  headTopText.setReaction("language change", ()=>{
    console.log(`node id=${headTopText.props.id} said "change language" for page tit`)
    setTitle()
  })
  setElmEdition(headTopText, viewContainer)
  function setTitle(){
    const titFixed = getRoot().getNextChild("not located").getNextChild("pagTit")
    if (getLangBranch(titFixed).getChild().props.value) {
      document.title=getLangBranch(titFixed).getChild().props.value
      return
    }
    document.title=getLangBranch(headTopText).getChild().props.value
    // re-setting refreshing title on node modification
    // This is because on lang change, lang data nodes are renewed
    getLangBranch(headTopText).getChild().addEventListener("changeProperty", (property)=>{
      if (!getLangBranch(titFixed).getChild().props.value) {
        document.title=getLangBranch(headTopText).getChild().props.value
      }
    },
    "changePageTitle")
  }
}

// We are setting new elements constructor to promote the object class for descendents
const siteContentMixin=Sup => class extends Sup {
  static getLinkerConstructor() {
    return SiteContentLinker
  }
  static getNodeConstructor() {
    return SiteContentDataNode
  }
  static get nodeConstructor(){
    return SiteContentDataNode
  }
  static get linkerConstructor(){
    return SiteContentLinker
  }
}
// Attaching handy functions directly to nodes in site content tree
const SiteContentDataNodeMixin = Sup => class extends Sup {
  async setContentView(viewContainer, volatile=true, editable=true){
    await setNodeView(this, viewContainer, volatile, editable)
  }
  write(viewContainer, propKey, dataId, attrKey, volatile=true) {
    write(this, viewContainer, propKey, dataId, attrKey, volatile)
  }
  getLangData(value=true){
    const dataNode = getLangBranch(this).getChild()
    if (!value)
      return dataNode
    return dataNode.props.value
  }
}
const SiteContentDataNode = siteContentMixin(SiteContentDataNodeMixin(Node))
const SiteContentLinker = siteContentMixin(Linker)
