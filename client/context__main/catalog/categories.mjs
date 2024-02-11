// Hay que ampliar esta clase, introducir lo de navhistory y opción pagination
// *** error, no desaparece el boton addition unico (no children) al hacer logout ni lo pone al login
import {addItem} from '../shop/cart.mjs'
import {Categories} from '../../catalog/categories.mjs'
import {selectorFromAttr, visibleOnMouseOver, removeVisibleOnMouseOver, fadeIn, fadeOut, fadeInTmOut, setQttySelect} from '../../frontutils.mjs'
import {pathJoin} from '../../urlutils.mjs'
import {Node, Linker} from '../nodes.mjs'
import {webuser} from '../webuser/webuser.mjs'
import {getCurrentLanguage, getLangParent, getLangBranch} from '../languages/languages.mjs'
import {setActiveInSite, getActiveInSite} from '../activeingroup.mjs'
import {pushNav, setNav, initialNavSearch} from '../navhistory.mjs'
import {config} from '../cfg.mjs'
import {intToMoney, moneyToInt} from '../money.mjs'
import {getRoot as getSiteText} from '../sitecontent.mjs'
import {getTemplate} from '../layouts.mjs'
import {Pagination} from '../../pagination.mjs'
import {observerMixin} from '../../observermixin.mjs'

// --- General elements ---

const mySiteCategories = new Categories()
const searchParamsKeys = ["category", "subcategory", "item"]

// -- helpers

function hasWritePermission(){
  //return true // hack
  return webuser.isProductAdmin()
}
export function getRoot() {
  return mySiteCategories.treeRoot
}
function write(myNode, viewContainer, propKey, dataId="value", attrKey) {
  getLangBranch(myNode).getChild().writeProp(selectorFromAttr(viewContainer, "data-" + dataId), propKey, attrKey)
}
async function setPropEdition(myNode, myContainer, propKey){
  if (!hasWritePermission()) return
  const {setEdition} = await import('../admin/edition.mjs')
  visibleOnMouseOver(selectorFromAttr(myContainer, "data-butedit"), myContainer) // on mouse over edition button visibility
  await setEdition(getLangBranch(myNode).getChild(), myContainer, propKey)
}
// write + setEdition
async function setPropView(myNode, myContainer, propKey){
  write(myNode, myContainer, propKey)
  await setPropEdition(myNode, myContainer, propKey)
}
function remvEdition(myContainer){
  selectorFromAttr(myContainer, "data-butedit").innerHTML = ""
  removeVisibleOnMouseOver(selectorFromAttr(myContainer, "data-butedit"), myContainer)
}
function remvModification(myContainer){
  selectorFromAttr(myContainer, "data-admnbuts").innerHTML = ""
  removeVisibleOnMouseOver(selectorFromAttr(myContainer, "data-admnbuts"), myContainer)
}
function remvAddition(myContainer){
  const but = selectorFromAttr(myContainer, "data-add-button")
  but.parentElement.removeChild(but)
}
let centralContentContainer
// --- General elements end ---

// -- categories
// *** 1 of 2 Entrance point for categories ***
export async function initCategories(centralContent){
  centralContentContainer = centralContent
  await mySiteCategories.initData(Linker, getLangParent, getLangBranch, webuser, getCurrentLanguage)
}

// *** 2 of 2 Entrance point for categories ***
// It displays categ and also make initial nav search for sub-cats, maybe change function name
export async function displayCategories(viewContainer){
  //await setCatsCollectionEventsReactions()
  getRoot().attachObserver("usertype change", getRoot())
  getRoot().setReaction("usertype change", async ()=>{
    console.log(`node id=${getRoot().props.id} said "webuser log change" `)
    if (getRoot().getMainBranch().children.length == 0  && hasWritePermission()) {
      const {setAdditionButton} = await import("../admin/addition.mjs")
      setAdditionButton(getRoot().getMainBranch(), null, 1 /* position */, null, async (newNode)=>{
        const myView = await catView(newNode)
        await displaySubCategories(newNode)
        return myView
      })
    }
    // falta el remove when is logout
  })

  const catsContainer = selectorFromAttr(viewContainer, "data-cats-container")
  getRoot().getMainBranch().childContainer = catsContainer
  for (const categ of getRoot().getMainBranch().children) {
    // await setCatUserEventsReactions(categ)
    catsContainer.appendChild(await catView(categ))
    for (const subCat of categ.getMainBranch().children) {
      await initialNavSearchSubCat(subCat) // nav search procedure in subcat.
    }
  }
  if (getRoot().getMainBranch().children.length == 0  && hasWritePermission()) {
    const {setAdditionButton} = await import("../admin/addition.mjs")
    setAdditionButton(getRoot().getMainBranch(), null, 1 /* position */, null, async (newNode)=>{
      const myView = await catView(newNode)
      await displaySubCategories(newNode)
      return myView
    })
  }
  getRoot().getMainBranch().dispatchEvent("displayChildren") // event for addition and no children
}

async function catView(categ){
  const catTp = await getTemplate("category")
  const catContainer = selectorFromAttr(catTp, "data-container")
  categ.firstElement = catContainer
  writeCatNode(categ, catContainer)
  await setCatNodeEdition(categ, catContainer)
  await setCatCollectionEdition(categ, catContainer)
  // no se si hace falta la siguiente linea porque en teoria no hay refreshing aqui
  //if (categ.selected) clickCategory(categ) // Selection can be happened before: refreshing

  // showing subcategories
  const subCatsContainer = selectorFromAttr(catContainer, "data-subcat-container")
  await displaySubCategories(categ)
  return catTp
}

async function displaySubCategories(categ){
  await setSubCatsCollectionEventsReactions(categ)
  if (!categ._logCollectionReaction) {
    if (!categ.setReaction) {
      Object.setPrototypeOf(categ, observerMixin(categ.constructor).prototype) // adding methods 
      observerMixin(Object).prototype.initObserver.call(categ) // adding properties : calling constructor
    }
    getRoot().attachObserver("usertype change", categ)
    getRoot().setReaction("usertype change", async ()=>{
      console.log(`node id=${getRoot().props.id} said "webuser log change" `)
      await setSubCatsCollectionEventsReactions(categ)
    })
    categ._logCollectionReaction = true
  }
  const subCatsContainer = selectorFromAttr(categ.firstElement, "data-subcat-container")
  categ.getMainBranch().childContainer = subCatsContainer
  subCatsContainer.innerHTML = ""
  for (const subCat of categ.getMainBranch().children) {
    // await setSubCatUserEventsReactions(subCat)
    // it is important to await View for the syncrhony of performance: the Tp to not be empty when append in DOM, dispatch displayChildren after append
    subCatsContainer.appendChild(await subCatView(subCat))
    await setNavStateSubCat(subCat) // should be at the end because subCat.firstElement is referenced
  }
  if (categ.getMainBranch().children.length == 0  && hasWritePermission()) {
    const {setAdditionButton} = await import("../admin/addition.mjs")
    setAdditionButton(categ.getMainBranch(), null, 1 /* position */, null, async (newNode)=>{
      await setNavStateSubCat(newNode)
      return await subCatView(newNode)
    })
  }
  categ.getMainBranch().dispatchEvent("displayChildren") // event for addition and no children
}

// aqui si que hay que añadir los listeners para change log and change lang
async function subCatView(subCat){
  const subCatTp = await getTemplate("subcategory") // everytime a new tp is created
  const subCatContainer = selectorFromAttr(subCatTp, "data-container")
  subCat.firstElement = subCatContainer
  writeSubCatNode(subCat, subCatContainer)
  await setSubCatNodeEdition(subCat, subCatContainer)
  await setSubCatCollectionEdition(subCat, subCatContainer)
  // no se si hace falta la siguiente linea porque en teoria no hay refreshing aqui
  //if (subCat.selected) click(subCat) // Selection can be happened before: refreshing
  selectorFromAttr(subCatContainer, "data-value")
  .addEventListener('click', async function(event){
    event.preventDefault()
    if (this.isContentEditable == true)
      return // The event should not be executed at contenteditable state
    await displayItems(subCat)
    pushNavHisSubCat(subCat)
  })
  return subCatTp
}

// -- Items
async function displayItems(subCat, pageNum) { // default pageNum: current pagination.pageNum
  console.log("displayItems", subCat)
  setActiveInSite(subCat)
  if (!subCat.getRelationship("items").pagination) {
    subCat.getRelationship("items")
    .pagination = new Pagination(subCat.getRelationship("items"), async (index)=>{
      await displayItems(subCat, index)
    })
    await subCat.getRelationship("items").pagination.init()
  }
  const pagination = subCat.getRelationship("items").pagination
  if (pagination.totalParent.props.total>0 && !pagination.loaded || (pageNum !== undefined && pagination.pageNum!=pageNum)) {
    await pagination.loadPageItems("get my tree", {extraParents: getLangParent(subCat)}, pageNum)
    pagination.loaded = true
  }
  await setItemsCollectionEventsReactions(subCat)
  if (!subCat._logCollectionReaction) {
    if (!subCat.setReaction) {
      Object.setPrototypeOf(subCat, observerMixin(subCat.constructor).prototype) // adding methods 
      observerMixin(Object).prototype.initObserver.call(subCat) // adding properties : calling constructor
    }
    getRoot().attachObserver("usertype change", subCat)
    getRoot().setReaction("usertype change", async ()=>{
      console.log(`node id=${getRoot().props.id} said "webuser log change" `)
      await setItemsCollectionEventsReactions(subCat)
    })
    subCat._logCollectionReaction = true
  }
  const catalogTp = await getTemplate("catalog")
  const itemsContainer = selectorFromAttr(catalogTp, "data-container")
  subCat.getRelationship("items").childContainer = itemsContainer
  for (const item of subCat.getRelationship("items").children) {
    itemsContainer.appendChild(await itemView(item))
  }
  const pageView = await pagination.pageView(getTemplate)
  selectorFromAttr(pageView, "data-content").appendChild(catalogTp)
  // There is a jump in the content layout view. We need this transition effect
  fadeOut(centralContentContainer)
  centralContentContainer.innerHTML = ""
  // give time the fade out to happend
  centralContentContainer.appendChild(pageView)
  fadeInTmOut(centralContentContainer)
  
  for (const item of pagination.totalParent.children) {
    // navigation state needs to be stablished for every item (not just the ones in page) for an item entrance search
    // initial nav procedure due url search is performed as well
    await setNavStateItem(item)
    //await initialNavSearchItem(item)
  }
  if (subCat.getRelationship("items").children.length == 0  && hasWritePermission()) {
    const {setAdditionButton} = await import("../admin/addition.mjs")
    setAdditionButton(subCat.getRelationship("items"), null, 1, null, async (newNode)=>{
      await setNavStateItem(newNode)
      return await itemView(newNode)
    })
  }
  subCat.getRelationship("items").dispatchEvent("displayChildren")
}
async function itemView(myItem){
  const itemTp = await getTemplate("item")
  const itemContainer = selectorFromAttr(itemTp, "data-container")
  myItem.firstElement = itemContainer
  await setPropView(myItem, selectorFromAttr(itemContainer, "data-name"), "name")
  await setPropView(myItem, selectorFromAttr(itemContainer, "data-description"), "descriptionshort")
  await setShortImageView(myItem, selectorFromAttr(itemContainer, "data-image-container"))
  setPriceView(myItem, selectorFromAttr(itemContainer, "data-price"))
  setQttySelect(selectorFromAttr(itemContainer, "data-qtty"))
  await setCartBut(myItem, selectorFromAttr(itemContainer, "data-add-cart"))
  await setItemCollectionEdition(myItem, itemContainer)
  return itemTp
}
async function displayItemLarge(item /* totalParent child*/) {
  setActiveInSite(item)
  pushNavHisItem(item)
  await item.loadRequest("get my tree")
  const pageView = await itemLargeView(item)
  fadeOut(centralContentContainer)
  centralContentContainer.innerHTML = ""
  // give time the fade out to happend
  centralContentContainer.appendChild(pageView)
  fadeInTmOut(centralContentContainer)
}
async function itemLargeView(myItem /* totalParent child*/){
  const itemTp = await getTemplate("itemlarge")
  const itemContainer = selectorFromAttr(itemTp, "data-container")
  myItem.firstElement = itemContainer
  setCloseBtn(selectorFromAttr(itemContainer, "data-close-btn"), myItem)
  await setImageView(myItem, selectorFromAttr(itemContainer, "data-image-container"), "big")
  await setPropView(myItem, selectorFromAttr(itemContainer, "data-name"), "name")
  await setPropView(myItem, selectorFromAttr(itemContainer, "data-description"), "descriptionshort")
  setPriceView(myItem, selectorFromAttr(itemContainer, "data-price"))
  setQttySelect(selectorFromAttr(itemContainer, "data-qtty"))
  await setCartBut(myItem, selectorFromAttr(itemContainer, "data-add-cart"))
  return itemTp
}

// --- helpers ---

// -- Categories
function writeCatNode(myNode, viewContainer, propKey) {
  write(myNode, viewContainer, propKey)
  if (!myNode._langReaction) {
    if (!myNode.setReaction) {
      Object.setPrototypeOf(myNode, observerMixin(myNode.constructor).prototype) // adding methods 
      observerMixin(Object).prototype.initObserver.call(myNode) // adding properties : calling constructor
    }
    const langChangeReaction = () => {
      write(myNode, viewContainer, propKey)
    }
    getRoot().attachObserver("language change", myNode)
    myNode.setReaction("language change", ()=>{
      console.log(`node id=${myNode.props.id} said "change language" `)
      langChangeReaction()
    })
    myNode._langReaction = true
  }
}
function writeSubCatNode(myNode, viewContainer, propKey) {
  write(myNode, viewContainer, propKey)
  if (myNode._langReaction) return
  if (!myNode.setReaction) {
    Object.setPrototypeOf(myNode, observerMixin(myNode.constructor).prototype) // adding methods 
    observerMixin(Object).prototype.initObserver.call(myNode) // adding properties : calling constructor
  }
  const langChangeReaction = async () => {
    write(myNode, viewContainer, propKey)
    if (myNode.selected) {
      if (getActiveInSite()==myNode) {
        for (const item of myNode.getRelationship("items").children){
          await write(item, selectorFromAttr(item.firstElement, "data-name"), "name")
          await write(item, selectorFromAttr(item.firstElement, "data-description"), "descriptionshort")
        }
      }
    }
  }
  getRoot().attachObserver("language change", myNode)
  myNode.setReaction("language change", ()=>{
    console.log(`node id=${myNode.props.id} said "change language" `)
    langChangeReaction()
  })
  myNode._langReaction = true
}

async function setCatNodeEdition(myNode, myContainer, propKey){
  await setPropEdition(myNode, myContainer, propKey)
  if (!myNode._logEditReaction) {
    if (!myNode.setReaction) {
      Object.setPrototypeOf(myNode, observerMixin(myNode.constructor).prototype) // adding methods 
      observerMixin(Object).prototype.initObserver.call(myNode) // adding properties : calling constructor
    }
    const logChangeReaction = async ()=>{
      if (hasWritePermission()) {
        await setCatNodeEdition(myNode, myContainer, propKey)
      }
      else {
        remvEdition(myContainer)
      }
    }
    getRoot().attachObserver("usertype change", myNode)
    myNode.setReaction("usertype change", ()=>{
      console.log(`node id=${myNode.props.id} said "webuser log change" `)
      logChangeReaction()
    })
    myNode._logEditReaction = true
  }
}
async function setSubCatNodeEdition(myNode, myContainer, propKey){
  await setPropEdition(myNode, myContainer, propKey)
  if (!myNode._logEditReaction) {
    if (!myNode.setReaction) {
      Object.setPrototypeOf(myNode, observerMixin(myNode.constructor).prototype) // adding methods 
      observerMixin(Object).prototype.initObserver.call(myNode) // adding properties : calling constructor
    }
    const logChangeReaction = async ()=>{
      if (hasWritePermission()) {
        await setSubCatNodeEdition(myNode, myContainer, propKey)
      }
      else {
        remvEdition(myContainer)
      }
      // item group view
      if (myNode.selected) {
        for (const item of myNode.getRelationship("items").children){
          if (hasWritePermission()) {
            await setPropEdition(item, selectorFromAttr(item.firstElement, "data-name"), "name")
            await setPropEdition(item, selectorFromAttr(item.firstElement, "data-description"), "descriptionshort")
            await setPriceEdition(item, selectorFromAttr(item.firstElement, "data-price"))
          }
          else {
            remvEdition(selectorFromAttr(item.firstElement, "data-name"))
            remvEdition(selectorFromAttr(item.firstElement, "data-description"))
            remvEdition(selectorFromAttr(item.firstElement, "data-price"))
          }
        }
      }
      // single item view
      else {
        const activeNode = getActiveInSite()
        if (activeNode?.parent && myNode.getRelationship("items")?.pagination
          && activeNode.parent == myNode.getRelationship("items").pagination.totalParent) {
          const item = myNode.getRelationship("items").pagination.totalParent.children.find(item=>item.props.id==activeNode.props.id)
          if (item) {
            if (hasWritePermission()) {
              await setPropEdition(item, selectorFromAttr(item.firstElement, "data-name"), "name")
              await setPropEdition(item, selectorFromAttr(item.firstElement, "data-description"), "descriptionshort")
              await setPriceEdition(item, selectorFromAttr(item.firstElement, "data-price"))
            }
            else {
              remvEdition(selectorFromAttr(item.firstElement, "data-name"))
              remvEdition(selectorFromAttr(item.firstElement, "data-description"))
              remvEdition(selectorFromAttr(item.firstElement, "data-price"))
            }
          }
        }
      }
    }
    getRoot().attachObserver("usertype change", myNode)
    myNode.setReaction("usertype change", ()=>{
      console.log(`node id=${myNode.props.id} said "webuser log change" `)
      logChangeReaction()
    })
    myNode._logEditReaction = true
  }
}

async function setCatsCollectionEventsReactions(){
  /* old, se hace diredctamente al edition
  if (!hasWritePermission() || getRoot()._collectionReactions)
    return
  const {onDelSelectedChild} = await import("../admin/deletion.mjs")
  
  const {onNewNodeMakeClick} = await import("../admin/addition.mjs")
  onNewNodeMakeClick(getRoot().getMainBranch(), displaySubCategories)
  onDelSelectedChild(getRoot().getMainBranch(), async (categ)=>{
    if (!categ) {
      const {setAdditionButton} = await import("../admin/addition.mjs")
      setAdditionButton(getRoot().getMainBranch(), null, 1 , null, async (newNode)=>{
        return await catView(newNode)
      })
    }
    else
      displaySubCategories(categ)
  })
  getRoot()._collectionReactions = true
  */
}

async function setCatCollectionEdition(myNode, myContainer){
  if (hasWritePermission()) {
    visibleOnMouseOver(selectorFromAttr(myContainer, "data-admnbuts"), myContainer) // on mouse over edition button visibility
    const {setAdditionButton} = await import("../admin/addition.mjs")
    const {setChangePosButton} = await import("../admin/changepos.mjs")
    const {setDeletionButton} = await import("../admin/deletion.mjs")
    await setChangePosButton(myNode, myContainer, "butchposvert")
    await setAdditionButton(myNode.parent, myNode, 1, myContainer, async (newNode)=>{
      // no need to set nav history for partial url in new cat
      // await setCatUserEventsReactions(newNode)
      const myView = await catView(newNode)
      displaySubCategories(newNode)
      return myView
    })
    await setDeletionButton(myNode, myContainer, async (delNode)=>{
      if (getRoot().getMainBranch().children.length==0) {
        const {setAdditionButton} = await import("../admin/addition.mjs")
        setAdditionButton(getRoot().getMainBranch(), null, 1 , null, async (newNode)=>{
          const myView = await catView(newNode)
          await displaySubCategories(newNode)
          return myView
        })
        return
      }
      const skey = getRoot().getMainBranch().getSysKey("sort_order")
      if (!delNode.selected)
        return
      let nextSelected = getRoot().getMainBranch().getChild()
      if (getRoot().getMainBranch().children.length > 1) {
        const nextPosition = delNode.props[skey] > 1 ? delNode.props[skey] - 1 : 1
        nextSelected = getRoot().getMainBranch().children.find(child=>child.props[skey]==nextPosition) || getRoot().getMainBranch().getChild()
      }
      displaySubCategories(nextSelected)
    })
  }
  if (!myNode._logModReaction) {
    if (!myNode.setReaction) {
      Object.setPrototypeOf(myNode, observerMixin(myNode.constructor).prototype) // adding methods 
      observerMixin(Object).prototype.initObserver.call(myNode) // adding properties : calling constructor
    }
    const logChangeReaction=async ()=>{
      if (hasWritePermission()) {
        await setCatCollectionEdition(myNode, myContainer)
      }
      else {
        remvModification(myContainer)
      }
    }
    getRoot().attachObserver("usertype change", myNode)
    myNode.setReaction("usertype change", ()=>{
      console.log(`node id=${myNode.props.id} said "webuser log change" `)
      logChangeReaction()
    })
    myNode._logModReaction = true
  }
}
// -- Subcats

async function setSubCatCollectionEdition(myNode, myContainer){
  if (hasWritePermission()) {
    visibleOnMouseOver(selectorFromAttr(myContainer, "data-admnbuts"), myContainer) // on mouse over edition button visibility
    const {setAdditionButton} = await import("../admin/addition.mjs")
    const {setChangePosButton} = await import("../admin/changepos.mjs")
    const {setDeletionButton} = await import("../admin/deletion.mjs")
    await setChangePosButton(myNode, myContainer, "butchposvert")
    await setAdditionButton(myNode.parent, myNode, 1, myContainer, async (newNode)=>{
      await setNavStateSubCat(newNode) // declaring navigation url
      // await setSubCatUserEventsReactions(newNode)
      return await subCatView(newNode)
    })
    await setDeletionButton(myNode, myContainer)
  }
  if (!myNode._logModReaction) {
    if (!myNode.setReaction) {
      Object.setPrototypeOf(myNode, observerMixin(myNode.constructor).prototype) // adding methods 
      observerMixin(Object).prototype.initObserver.call(myNode) // adding properties : calling constructor
    }
    const logChangeReaction=async ()=>{
      if (hasWritePermission()) {
        await setSubCatCollectionEdition(myNode, myContainer)
      }
      else {
        remvModification(myContainer)
      }
      // item group view
      if (myNode.selected) {
        for (const item of myNode.getRelationship("items").children){
          if (hasWritePermission()) {
            await setItemCollectionEdition(item, item.firstElement)
          }
          else {
            remvModification(item.firstElement)
          }
        }
      }
    }
    getRoot().attachObserver("usertype change", myNode)
    myNode.setReaction("usertype change", ()=>{
      console.log(`node id=${myNode.props.id} said "webuser log change" `)
      logChangeReaction()
    })
    myNode._logModReaction = true
  }
}


async function setNavStateSubCat(subCat){
  // despite click subcat would set the same nav state again, nav state system prevent double setting the same state
  await setNav(subCat, "subcategory", searchParamsKeys, displayItems)
}
function pushNavHisSubCat(subCat){
  pushNav(subCat, "subcategory", searchParamsKeys)
}
function initialNavSearchSubCat(subCat){
  initialNavSearch(subCat, "subcategory", searchParamsKeys, displayItems)
}
async function setSubCatsCollectionEventsReactions(categ){
  if (!hasWritePermission() || categ._collectionReactions)
    return
  const {onDelSelectedChild} = await import("../admin/deletion.mjs")
  const {onNewNodeMakeClick} = await import("../admin/addition.mjs")
  onNewNodeMakeClick(categ.getMainBranch(), (subCat)=>{
    subCat.getRelationship("items").props.total = 0 // to not have to load total
    displayItems(subCat)
    pushNavHisSubCat(subCat)
  } /* on subcat click reaction */)
  onDelSelectedChild(categ.getMainBranch(), async (subCat)=>{
    if (!subCat) { // no more subCats
      const {setAdditionButton} = await import("../admin/addition.mjs")
      setAdditionButton(categ.getMainBranch(), null, 1 /* position */, null, async (newNode)=>{
        await setNavStateSubCat(newNode)
        return await subCatView(newNode)
      })
    }
    else {
      displayItems(subCat)
      pushNavHisSubCat(subCat)
    }

  } /* on subcat click reaction */)
  categ._collectionReactions = true
}

// -- Items

function pushNavHisItem(item){
  pushNav(item, "item", searchParamsKeys)
}
function initialNavSearchItem(item){
  initialNavSearch(item, "item", searchParamsKeys, displayItemLarge)
}
async function setItemsCollectionEventsReactions(subCat){
  if (!hasWritePermission() || subCat._collectionReactions)
    return
  const {onAddInPageChild} = await import("../admin/addition.mjs")
  const {onDelInPageChild} = await import("../admin/deletion.mjs")
  const {onChangePosInPageChild} = await import("../admin/changepos.mjs")
  onDelInPageChild(subCat.getRelationship("items"), displayItems)
  onAddInPageChild(subCat.getRelationship("items"), displayItems)
  onChangePosInPageChild(subCat.getRelationship("items"), displayItems)
  subCat._collectionReactions = true
}
async function setNavStateItem(myNode){
  await setNav(myNode, "item", searchParamsKeys, displayItemLarge)
}
async function remvItemEdition(subCatContainer){
  selectorFromAttr(subCatContainer, "data-butedit").innerHTML=""
  selectorFromAttr(subCatContainer, "data-buteditcode").innerHTML=""
  removeVisibleOnMouseOver(selectorFromAttr(subCatContainer, "data-butedit"), subCatContainer)
}
async function setItemCollectionEdition(myNode, myContainer){
  if (!hasWritePermission()) return
  visibleOnMouseOver(selectorFromAttr(myContainer, "data-admnbuts"), myContainer) // on mouse over edition button visibility
  const {setAdditionButton} = await import("../admin/addition.mjs")
  const {setChangePosButton} = await import("../admin/changepos.mjs")
  const {setDeletionButton} = await import("../admin/deletion.mjs")
  await setChangePosButton(myNode, myContainer, "butchposhor")
  await setAdditionButton(myNode.parent, myNode, 1, myContainer, async (newNode)=>{
    await setNavStateItem(newNode) // declaring navigation url
    return await itemView(newNode) // *** revisar maybe better itemLargView y quitar onnewnodesetclick
  })
  await setDeletionButton(myNode, myContainer)
}
function writePrice(myNode, viewContainer){
  selectorFromAttr(viewContainer, "data-value").textContent = intToMoney(myNode.props.price)
}
async function setPriceEdition(myNode, viewContainer){
  if (!hasWritePermission()) return
  const {setEdition} = await import('../admin/edition.mjs')
  await setEdition(myNode, viewContainer, "price", undefined, undefined, undefined, undefined, moneyToInt)
  visibleOnMouseOver(selectorFromAttr(viewContainer, "data-butedit"), viewContainer) // on mouse over edition button visibility
  if (selectorFromAttr(viewContainer, "data-value")._intoMoneyReaction)
    return
  selectorFromAttr(viewContainer, "data-value").addEventListener("blur"
    , function (ev) {
    this.textContent = intToMoney(moneyToInt(this.textContent))
    this._intoMoneyReaction = true
  })
}
async function setPriceView(myNode, viewContainer){
  writePrice(myNode, viewContainer)
  await setPriceEdition(myNode, viewContainer)
}
async function setShortImageView(myItem, viewContainer){
  setImageView(myItem, viewContainer, "small")
  const enlargeButton = selectorFromAttr(viewContainer, "data-enlarge-item-button")
  visibleOnMouseOver(enlargeButton, viewContainer)
  enlargeButton.addEventListener("click",(event)=> {
    event.preventDefault()
    // we search the item in the total parent
    displayItemLarge(myItem.parent.pagination.totalParent.children.find(item=>item.props.id==myItem.props.id))
  })
}
function setQttySelect_old(viewContainer){
  const mySelect=viewContainer.querySelector('select')
  const firstOption=mySelect.options[0]
  for (let i=1; i<25; i++){
    let myOption = firstOption.cloneNode()
    myOption.textContent=i+1
    myOption.value=i+1
    mySelect.add(myOption)
  }
}
async function setCartBut(myItem, viewContainer){
  const cartButton = selectorFromAttr(viewContainer, "data-button")
  cartButton.addEventListener("click", ev=>{
    ev.preventDefault()
    if (isNaN(cartButton.form.elements["pquantity"].value))
      return
    const quantity = Number.parseInt(cartButton.form.elements["pquantity"].value)
    if (quantity) addItem(myItem, quantity)
  })
  const cartButtonLabel = getSiteText().getNextChild("addcarttt")
  await cartButtonLabel.setContentView(viewContainer)
}
async function setLargeImageView(myItem, viewContainer){
  setImageView(myItem, viewContainer, "big")
}
async function setImageView(myNode, viewContainer, size){
  const imageNode = myNode.getRelationship("itemsimages").getChild()
  const imageView = selectorFromAttr(viewContainer, "data-value")
  const imageName = imageNode?.props.imagename || config.get("default-img")
  imageView.src = config.get("catalog-imgs-url-path") + `?size=${size}&image=${imageName}`
  await setImageEdition(myNode, viewContainer)
}
function setCloseBtn(btn, item){
  btn.addEventListener("click", async (ev)=>{
    const paginationParentPartner = item.parent.pagination.parent.partner
    await displayItems(paginationParentPartner)
    pushNavHisSubCat(paginationParentPartner)
  })
}
// *** falta
async function setImageEdition(myItem, viewContainer){
  if (!hasWritePermission())
    return
  const butEditView = selectorFromAttr(viewContainer, "data-butedit")
  visibleOnMouseOver(butEditView, viewContainer)
  //new this.constructor.nodeConstructor().appendView(butEditView, "buteditimage", {setView: viewElement=>setImageEditButton(this, viewElement)})
  // falta lo de actualizar cuando termine la edicion ????
}

/*
const ItemLargeMixin=Sup => class extends Sup {
  setLargeImageView(viewContainer){
    super.setImageView(viewContainer, "big")
    const largeImageView=selectorFromAttr(viewContainer, "data-id", "value")
    this.largeImageView=largeImageView // it will be useful to have a reference to the large item layout
    // esto no lo entiendo, parace haber una prop image en item ????
    this.addEventListener("changeProperty", (property) => {
      if (property=="image") {
        largeImageView.src==pathJoin(configValues.catalogImagesUrlPath, 'big', this.props.image)
      }
    }, "img")
    this.setEditImage(viewContainer)
  }
  setDescriptionLarge(viewContainer){
    this.setPropView("descpriptionlarge", viewContainer)
    writeLangData(this, viewContainer, "descpriptionlarge", "edit-text")
    myCategoriesView.setEditionButton(getLangBranch(this).getChild(), ()=>webuser.isWebAdmin(), viewContainer, "innerHTML", "descpriptionlarge", "buteditcode", undefined, "edit-text", undefined, false, undefined, "code")
  }
  setThumbnails(viewContainer){
    const myContainer=selectorFromAttr(viewContainer, "data-id", "thumbnails-container")
    if (this.getRelationship("itemsimages").children.length<2) myContainer.style.display="none"
    else this.getRelationship("itemsimages").setChildrenView(myContainer, "itemthumbnail")
  }
  setCloseItemLarge(viewElement){
    const myButton=selectorFromAttr(viewElement, "data-id", "value")
    myButton.addEventListener("click", (event)=>{
      event.preventDefault()
      clickSubCategory(this.parent.partner)
    })
  }
}
*/

// It uses imageNode.parent.partner.largeImageView
export function setThumbnail(imageNode){
  const viewElement=myTumb.firstElement
  const myButton=selectorFromAttr(viewElement, "data-id", "to-large-image-button")
  const myButtonContainer=selectorFromAttr(viewElement, "data-id", "thumbnail-container")
  const thumbnailImage=selectorFromAttr(viewElement, "data-id", "value")

  const myImageName = imageNode.props.imagename || config.get("default-img")
  thumbnailImage.src = pathJoin(config.get("catalog-imgs-url-path"), 'small', myImageName)

  visibleOnMouseOver(myButton, myButtonContainer)

  myButton.addEventListener("click", event => {
    event.preventDefault()
    // we have saved in the item a reference to the DOM large image when setLargeImageView method was called
    imageNode.parent.partner.largeImageView.src=thumbnailImage.src.replace("small", "big")
  })
}

/*
export async function reloadInitLangData() {
  return await mySiteCategories.reloadInitLangData(getCurrentLanguage, getLangParent, getLangBranch, Linker.getNodeConstructor())
}
*/