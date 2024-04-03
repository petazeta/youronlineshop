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
  getRoot().attachObserver("usertype change", getRoot())
  getRoot().setReaction("usertype change", async ()=>{
    console.log(`node id=${getRoot().props.id} said "webuser log change" `)
    if (getRoot().getMainBranch().children.length == 0) {
      if (hasWritePermission()) {
        const {setAdditionButton} = await import("../admin/addition.mjs")
        await setAdditionButton(getRoot().getMainBranch(), 1, getRoot().getMainBranch().childContainer, catView, displaySubCategories)
      }
      else {
        const additionButton = selectorFromAttr(viewContainer, "data-add-button")
        if (additionButton)
          additionButton.parentElement.removeChild(additionButton)
      }
    }
    // refresh central content view (remove addButton)
    if (getActiveInSite()?.parent?.props.childTableName==getRoot().parent.props.childTableName)
        displayItems(getActiveInSite()) // refresh view
  })

  const catsContainer = selectorFromAttr(viewContainer, "data-cats-container")
  getRoot().getMainBranch().childContainer = catsContainer
  for (const categ of getRoot().getMainBranch().children) {
    catsContainer.appendChild(await catView(categ))
    await displaySubCategories(categ) // subcategories are displayed at the same time
    // We proceed here in displayCategories and not in displaySubCategories because this is the page entrance point rather than displaySubCategories
    // that can be called once page is olready working
    for (const subCat of categ.getMainBranch().children) {
      await initialNavSearchSubCat(subCat) // nav search procedure in subcat
    }
  }
  // this is not clear that is used but it could be in case the user ins logged in automatically when stay logged is settled
  if (getRoot().getMainBranch().children.length == 0  && hasWritePermission()) {
    const {setAdditionButton} = await import("../admin/addition.mjs")
    await setAdditionButton(getRoot().getMainBranch(), 1, getRoot().getMainBranch().childContainer, catView, displaySubCategories)
  }
  getRoot().getMainBranch().dispatchEvent("displayChildren") // dispatch event in case needed
}

async function catView(myNode){
  const catTp = await getTemplate("category")
  const catContainer = selectorFromAttr(catTp, "data-container")
  myNode.firstElement = catContainer
  writeCatNode(myNode, catContainer)
  await setCatNodeEdition(myNode, catContainer)
  await setCatCollectionEdition(myNode, catContainer)
  return catTp
}

async function displaySubCategories(myNode){  // myNode = category
  if (!myNode._logCollectionReaction) {
    if (!myNode.setReaction) {
      Object.setPrototypeOf(myNode, observerMixin(myNode.constructor).prototype) // adding methods 
      observerMixin(Object).prototype.initObserver.call(myNode) // adding properties : calling constructor
    }
    getRoot().attachObserver("usertype change", myNode)
    myNode.setReaction("usertype change", async ()=>{
      console.log(`node id=${myNode.props.id} said "webuser log change" `)
      if (myNode.getMainBranch().children.length == 0) {
        if (hasWritePermission()) {
          const {setAdditionButton} = await import("../admin/addition.mjs")
          await setAdditionButton(myNode.getMainBranch(), 1, myNode.getMainBranch().childContainer, subCatView, async (newNode)=>{
            await setNavStateSubCat(newNode)
            newNode.getRelationship("items").props.total = 0 // to not have to load total
            await displayItems(newNode)
            pushNavHisSubCat(newNode)
          })
        }
        else {
          const additionButton = selectorFromAttr(myNode.getMainBranch().childContainer, "data-add-button")
          if (additionButton)
            additionButton.parentElement.removeChild(additionButton)
        }
      }
    })
    myNode._logCollectionReaction = true
  }
  const subCatsContainer = selectorFromAttr(myNode.firstElement, "data-subcat-container")
  myNode.getMainBranch().childContainer = subCatsContainer
  subCatsContainer.innerHTML = ""
  for (const child of myNode.getMainBranch().children) {
    // it is important to await View for the syncrhony of performance: the Tp to not be empty when append in DOM, dispatch displayChildren after append
    subCatsContainer.appendChild(await subCatView(child))
    await setNavStateSubCat(child) // should be at the end because child.firstElement is referenced
  }
  if (myNode.getMainBranch().children.length == 0 && hasWritePermission()) {
    const {setAdditionButton} = await import("../admin/addition.mjs")
    await setAdditionButton(myNode.getMainBranch(), 1, myNode.getMainBranch().childContainer, subCatView, async (newNode)=>{
      await setNavStateSubCat(newNode)
      newNode.getRelationship("items").props.total = 0 // to not have to load total
      await displayItems(newNode)
      pushNavHisSubCat(newNode)
    })
  }
  myNode.getMainBranch().dispatchEvent("displayChildren") // event for addition and no children
}

// aqui si que hay que añadir los listeners para change lang
async function subCatView(myNode){
  const myTp = await getTemplate("subcategory") // everytime a new tp is created
  const myContainer = selectorFromAttr(myTp, "data-container")
  myNode.firstElement = myContainer
  writeSubCatNode(myNode, myContainer)
  await setSubCatNodeEdition(myNode, myContainer)
  await setSubCatCollectionEdition(myNode, myContainer)
  selectorFromAttr(myContainer, "data-value")
  .addEventListener('click', async function(event){
    event.preventDefault()
    if (this.isContentEditable == true)
      return // The event should not be executed at contenteditable state
    await displayItems(myNode)
    pushNavHisSubCat(myNode)
  })
  return myTp
}

// -- Items
async function displayItems(myNode, pageNum) { // myNode: subCat, default pageNum: current pagination.pageNum
  setActiveInSite(myNode)
  if (!myNode.getRelationship("items").pagination) {
    myNode.getRelationship("items").pagination = new Pagination(myNode.getRelationship("items"), async (index)=>{
      await displayItems(myNode, index)
    })
    await myNode.getRelationship("items").pagination.init()
  }
  const pagination = myNode.getRelationship("items").pagination
  if (pagination.totalParent.props.total>0 && !pagination._loaded || (pageNum !== undefined && pagination.pageNum!=pageNum)) {
    await pagination.loadPageItems("get my tree", {extraParents: getLangParent(myNode)}, pageNum)
    // *** no comprendo totalmente las consecuecias del parametro extraParents, parece que toma los nodos del raiz que son autorelated y los que son del lenguage
    // pero no los otros de otras tablas
    for (const item of myNode.getRelationship("items").children) {
      await item.getRelationship("itemsimages").loadRequest("get my children")
    }
    pagination._loaded = true
  }
  const catalogTp = await getTemplate("catalog")
  const itemsContainer = selectorFromAttr(catalogTp, "data-container")
  myNode.getRelationship("items").childContainer = itemsContainer
  for (const item of myNode.getRelationship("items").children) {
    //await setNavStateItem(item)
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
  
  //for (const item of pagination.totalParent.children) {
  for (const item of myNode.getRelationship("items").children) { // *** esto habria que hacerlo con todos??
    // navigation state needs to be stablished for every item (not just the ones in page) for an item entrance search
    // initial nav procedure due url search is performed as well
    await setNavStateItem(item)
    await initialNavSearchItem(item) // esto quizas no va bien hacerlo dentro de displayItems porque esta funcion puede ser quizas llamada fuera del flujo normal de inicio, para que hacer navsearch en otros casos??
  }

  if (myNode.getRelationship("items").children.length == 0  && hasWritePermission()) {
    const {setAdditionButton} = await import("../admin/addition.mjs")
    await setAdditionButton(myNode.getRelationship("items"), 1, myNode.getRelationship("items").childContainer, null, async (newNode) => await onPageAddition(myNode.getRelationship("items"), newNode))
  }
  myNode.getRelationship("items").dispatchEvent("displayChildren")
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
  console.log("displayItemLarge")
  setActiveInSite(item)
  pushNavHisItem(item)
  // await item.loadRequest("get my tree") // item could come from url input
  fadeOut(centralContentContainer)
  centralContentContainer.innerHTML = ""
  // give time the fade out to happend
  centralContentContainer.appendChild(await itemLargeView(item))
  fadeInTmOut(centralContentContainer)
}
async function itemLargeView(myNode /* totalParent child*/){
  const container = selectorFromAttr(await getTemplate("itemlarge"), "data-container")
  myNode.firstElement = container
  setCloseBtn(selectorFromAttr(container, "data-close-btn"), myNode)
  await setImageView(myNode, selectorFromAttr(container, "data-image-container"), "big")
  await setPropView(myNode, selectorFromAttr(container, "data-name"), "name")
  await setPropView(myNode, selectorFromAttr(container, "data-description"), "descriptionshort")
  await setPropView(myNode, selectorFromAttr(container, "data-description-large"), "descriptionlarge")
  setPriceView(myNode, selectorFromAttr(container, "data-price"))
  setQttySelect(selectorFromAttr(container, "data-qtty"))
  await setCartBut(myNode, selectorFromAttr(container, "data-add-cart"))
  return container
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
    getRoot().attachObserver("usertype change", myNode)
    myNode.setReaction("usertype change", async ()=>{
      console.log(`node id=${myNode.props.id} said "webuser log change" `)
      if (hasWritePermission()) {
        await setCatNodeEdition(myNode, myContainer, propKey)
      }
      else {
        remvEdition(myContainer)
      }
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
    getRoot().attachObserver("usertype change", myNode)
    myNode.setReaction("usertype change", async ()=>{
      console.log(`node id=${myNode.props.id} said "webuser log change" `)
      if (hasWritePermission()) {
        await setSubCatNodeEdition(myNode, myContainer, propKey)
      }
      else {
        remvEdition(myContainer)
      }
    })
    myNode._logEditReaction = true
  }
}

async function setCatCollectionEdition(myNode, myContainer){
  if (hasWritePermission()) {
    visibleOnMouseOver(selectorFromAttr(myContainer, "data-admnbuts"), myContainer) // on mouse over edition button visibility
    const {setAdditionButton} = await import("../admin/addition.mjs")
    const {setChangePosButton} = await import("../admin/changepos.mjs")
    const {setDeletionButton} = await import("../admin/deletion.mjs")
    await setChangePosButton(myNode, selectorFromAttr(myContainer, "data-admnbuts"))
    const position = myNode.props[myNode.parent.getSysKey('sort_order')] + 1
    // getRoot().getMainBranch() == myNode.parent
    await setAdditionButton(myNode.parent, position, selectorFromAttr(myContainer, "data-admnbuts"), catView, displaySubCategories)
    //**** cuando se borra una subcategoria se borran tambien los items, por tanto hay que poner la pagina pricipal en blanco cuando
    // coincide que está activa la vista de los items
    await setDeletionButton(myNode, selectorFromAttr(myContainer, "data-admnbuts"), async (delNode)=>{
      if (myNode.parent.children.length==0) {
        const {setAdditionButton} = await import("../admin/addition.mjs")
        await setAdditionButton(myNode.parent, 1, myNode.parent.childContainer, catView, displaySubCategories)
      }
      if (!delNode.selected)
        return
      const skey = getRoot().getMainBranch().getSysKey("sort_order")
      let nextSelected = getRoot().getMainBranch().getChild()
      if (getRoot().getMainBranch().children.length > 1) {
        const nextPosition = delNode.props[skey] > 1 ? delNode.props[skey] - 1 : 1
        nextSelected = getRoot().getMainBranch().children.find(child=>child.props[skey]==nextPosition) || getRoot().getMainBranch().getChild()
      }
      if (nextSelected && nextSelected.getMainBranch().children.length > 0) {
        await displayItems(nextSelected.getMainBranch().getChild())
        pushNavHisSubCat(nextSelected.getMainBranch().getChild())
      }
      else {
        fadeOut(centralContentContainer)
        centralContentContainer.innerHTML = ""
      }
    })
  }
  if (!myNode._logModReaction) {
    if (!myNode.setReaction) {
      Object.setPrototypeOf(myNode, observerMixin(myNode.constructor).prototype) // adding methods 
      observerMixin(Object).prototype.initObserver.call(myNode) // adding properties : calling constructor
    }
    getRoot().attachObserver("usertype change", myNode)
    myNode.setReaction("usertype change", async()=>{
      console.log(`node id=${myNode.props.id} said "webuser log change" `)
      if (hasWritePermission()) {
        await setCatCollectionEdition(myNode, myContainer)
      }
      else {
        remvModification(myContainer)
      }
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
    await setChangePosButton(myNode, selectorFromAttr(myContainer, "data-admnbuts"))
    const position = myNode.props[myNode.parent.getSysKey('sort_order')] + 1
    // getRoot().getMainBranch() == myNode.parent
    await setAdditionButton(myNode.parent, position, selectorFromAttr(myContainer, "data-admnbuts"), subCatView, async (newNode)=>{
      await setNavStateSubCat(newNode) // declaring navigation url
      newNode.getRelationship("items").props.total = 0 // to not have to load total
      displayItems(newNode)
      pushNavHisSubCat(newNode)
    })
    await setDeletionButton(myNode, selectorFromAttr(myContainer, "data-admnbuts"), async (delNode)=>{
      if (myNode.parent.children.length==0) {
        const {setAdditionButton} = await import("../admin/addition.mjs")
        await setAdditionButton(myNode.parent, 1, myNode.parent.childContainer, subCatView, async (newNode)=>{
          await setNavStateSubCat(newNode)
          newNode.getRelationship("items").props.total = 0 // to not have to load total
          await displayItems(newNode)
          pushNavHisSubCat(newNode)
        })
      }
      if (!delNode.selected)
        return
      const skey = myNode.parent.getSysKey("sort_order")
      let nextSelected = myNode.parent.getChild()
      if (myNode.parent.children.length > 1) {
        const nextPosition = delNode.props[skey] > 1 ? delNode.props[skey] - 1 : 1
        nextSelected = myNode.parent.children.find(child=>child.props[skey]==nextPosition) || myNode.parent.getChild()
      }
      if (nextSelected) {
        displayItems(nextSelected)
        pushNavHisSubCat(nextSelected)
      }
      else {
        fadeOut(centralContentContainer)
        centralContentContainer.innerHTML = ""
      }
    })
  }
  if (!myNode._logModReaction) {
    if (!myNode.setReaction) {
      Object.setPrototypeOf(myNode, observerMixin(myNode.constructor).prototype) // adding methods 
      observerMixin(Object).prototype.initObserver.call(myNode) // adding properties : calling constructor
    }
    getRoot().attachObserver("usertype change", myNode)
    myNode.setReaction("usertype change", async ()=>{
      console.log(`node id=${myNode.props.id} said "webuser log change" `)
      if (hasWritePermission()) {
        await setSubCatCollectionEdition(myNode, myContainer)
      }
      else {
        remvModification(myContainer)
      }
    })
    myNode._logModReaction = true
  }
}
async function setNavStateSubCat(myNode){
  // despite click subcat would set the same nav state again, nav state system prevent double setting the same state
  await setNav(myNode, "subcategory", searchParamsKeys, displayItems)
}
function pushNavHisSubCat(myNode){
  pushNav(myNode, "subcategory", searchParamsKeys)
}
function initialNavSearchSubCat(myNode){
  // *** we should check here if there is search in item, and in this case then search for item and show the item, skeeping displayItems
  initialNavSearch(myNode, "subcategory", searchParamsKeys, displayItems)
}

// -- Items

async function setItemCollectionEdition(myNode, myContainer){
  if (!hasWritePermission()) return
  visibleOnMouseOver(selectorFromAttr(myContainer, "data-admnbuts"), myContainer) // on mouse over edition button visibility
  const {setAdditionButton} = await import("../admin/addition.mjs")
  const {setChangePosButton} = await import("../admin/changepos.mjs")
  const {setDeletionButton} = await import("../admin/deletion.mjs")
  await setChangePosButton(myNode, selectorFromAttr(myContainer, "data-admnbuts"), async (increment)=>{
    const nodeParent = myNode.parent
    const skey = myNode.parent.getSysKey('sort_order') 
    const nextSortOrder = myNode.props[skey] + increment
    const pagination = nodeParent.pagination
    if (nextSortOrder > pagination.itemsWindow[1]) {
      await displayItems(nodeParent.partner, pagination.pageNum + 1)
    }
    if (nextSortOrder < pagination.itemsWindow[0]) {
      await displayItems(nodeParent.partner, pagination.pageNum - 1)
    }
  }, {chTpName: "butchposhor"})
  const position = myNode.props[myNode.parent.getSysKey('sort_order')] + 1
  await setAdditionButton(myNode.parent, position, selectorFromAttr(myContainer, "data-admnbuts"), null, async (newNode)=>await onPageAddition(myNode.parent, newNode))
  await setDeletionButton(myNode, selectorFromAttr(myContainer, "data-admnbuts"), async (delNode)=>{
    const nodeParent = myNode.parent
    const pagination = nodeParent.pagination
    const total = --pagination.totalParent.props.total // standard deletion substract from parent, not from totalParent
    if (nodeParent.children.length==0) {
      const {setAdditionButton} = await import("../admin/addition.mjs")
      await setAdditionButton(nodeParent, 1, nodeParent.childContainer, null, async (newNode) => await onPageAddition(myNode.getRelationship("items"), newNode))
    }

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
      await displayItems(nodeParent.partner, pagination.pageNum - 1)
      return
    }
    // No change in indexes
    await displayItems(nodeParent.partner, pagination.pageNum)
  })
}
function pushNavHisItem(item){
  pushNav(item, "item", searchParamsKeys)
}
function initialNavSearchItem(item){
  // aqui habria que mirar el caso en el que el item buscado no estuviera entre los de la paginación
  initialNavSearch(item, "item", searchParamsKeys, displayItemLarge)
}
async function setNavStateItem(myNode){
  await setNav(myNode, "item", searchParamsKeys, displayItemLarge)
}
async function remvItemEdition(myContainer){
  selectorFromAttr(myContainer, "data-butedit").innerHTML=""
  selectorFromAttr(myContainer, "data-buteditcode").innerHTML=""
  removeVisibleOnMouseOver(selectorFromAttr(myContainer, "data-butedit"), myContainer)
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
  enlargeButton.addEventListener("click",async (event)=> {
    event.preventDefault()
    // we search the item in the total parent because the query could come directly from an url input
    // await displayItemLarge(myItem.parent.pagination.totalParent.children.find(item=>item.props.id==myItem.props.id))
    await displayItemLarge(myItem)
  })
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
  // *** revisar, creo que ahora para editar el title se puede hacer de otra manera
  await cartButtonLabel.setContentView(viewContainer)
}
async function setLargeImageView(myItem, viewContainer){
  setImageView(myItem, viewContainer, "big")
}
async function setImageView(myNode, viewContainer, size){
  const imageNode = myNode.getRelationship("itemsimages").getChild()
  const imageView = selectorFromAttr(viewContainer, "data-value")
  if (!imageNode?.props.imagename)
    imageView.src = config.get("catalog-imgs-url-path") + `?size=${size}&image=${config.get("default-img")}&source=sample`
  else 
    imageView.src = config.get("catalog-imgs-url-path") + `?size=${size}&image=${imageNode.props.imagename}`
  await setImgEditBut(myNode, viewContainer)
}
function setCloseBtn(btn, item){
  btn.addEventListener("click", async (ev)=>{
    const paginationParentPartner = item.parent.pagination.parent.partner
    await displayItems(paginationParentPartner)
    pushNavHisSubCat(paginationParentPartner)
  })
}
// *** falta
async function setImgEditBut(myItem, viewContainer){
  if (!hasWritePermission())
    return
  const {setImgEdition} = await import("./admin/loadimg.mjs")
  const butEditView = selectorFromAttr(viewContainer, "data-butedit")
  visibleOnMouseOver(butEditView, viewContainer)
  setImgEdition(myItem, viewContainer)
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

  if (!imageNode?.props.imagename)
    thumbnailImage.src = config.get("catalog-imgs-url-path") + `?size=small&image=${config.get("default-img")}&source=sample`
  else 
    thumbnailImage.src = config.get("catalog-imgs-url-path") + `?size=small&image=${imageNode.props.imagename}`

  visibleOnMouseOver(myButton, myButtonContainer)

  myButton.addEventListener("click", event => {
    event.preventDefault()
    // we have saved in the item a reference to the DOM large image when setLargeImageView method was called
    imageNode.parent.partner.largeImageView.src = thumbnailImage.src.replace("small", "big")
  })
}

/*
export async function reloadInitLangData() {
  return await mySiteCategories.reloadInitLangData(getCurrentLanguage, getLangParent, getLangBranch, Linker.getNodeConstructor())
}
*/
async function onPageAddition(nodeParent, newNode) {
  console.log("onPageAddition")
  await setNavStateItem(newNode) // declaring navigation url
  const pagination = nodeParent.pagination
  const total = ++pagination.totalParent.props.total // perform addition adds one to normal parent total but not to pagination.totalParent
  // is it change in indexes number because of the addition?
  if (total > 1 && total % pagination.pageSize == 1) {
    pagination.createIndexes() // refresh indexes to include the new one
    pagination.createItemsWindow()
    pagination.displayButtons(getTemplate)
  }
  const skey = newNode.parent.getSysKey('sort_order')
  // is it page overflow?
  if (nodeParent.children.length > pagination.pageSize) {
    // we have to options: newNode is in the current page or it is in the next page:
    
    // next page situtation
    if (newNode.props[skey] == nodeParent.children.reduce((cc, sibling)=>sibling.props[skey] > cc? sibling.props[skey] : cc, 0)) {
      while (nodeParent.firstElementChild) // also we could use the loop limit pagination.pageSize
        nodeParent.removeChild(nodeParent.firstElementChild)
      await displayItems(nodeParent.partner, pagination.pageNum + 1)
      return
    }
    // current page
    else {
      nodeParent.childContainer.removeChild(nodeParent.childContainer.lastElementChild)
      nodeParent.removeChild(nodeParent.children[nodeParent.children.length-1])
    }
  }
  const container = nodeParent.childContainer
  // to be inserted just before the next sibling
  const nextSibling = skey? nodeParent.children.find(child=>child.props[skey]==newNode.props[skey]+1)?.firstElement : undefined
  const newView = await itemView(newNode)
  nextSibling ? container.insertBefore(newView, nextSibling) : container.appendChild(newView)
}

// -- helpers

function hasWritePermission(){
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