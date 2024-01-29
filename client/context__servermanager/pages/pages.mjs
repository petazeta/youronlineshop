/****
  This module contains all the functionallity regarding to menus and its content: paragraphs. The total paragraphs in a menu is also called doc for document or page.
  First code lines are for some generic elements and then I recommend to start reading the code from the bottom untill the top. At the botton is the more generic elements that is going to more specific ones untill the top.

falta hacer mas pruebas
****/

import {PagesContent} from '../../pages/pages.mjs'
import {visibleOnMouseOver, removeVisibleOnMouseOver, selectorFromAttr} from '../../frontutils.mjs'
import {Linker} from '../nodes.mjs'
import {webuser} from '../webuser/webuser.mjs'
import {getCurrentLanguage, getLangParent, getLangBranch} from '../languages/languages.mjs'
import {setActiveInSite} from '../activeingroup.mjs'
import {pushNav, setNav, initialNavSearch, setDefaultInitNavSearch} from '../navhistory.mjs'
import {getTemplate} from '../layouts.mjs'
import {observerMixin} from '../../observermixin.mjs'

// -- General elements --

const mySitePages = new PagesContent()

// -- helpers
function write(myNode, viewContainer, propKey, dataId="value", attrKey) {
  getLangBranch(myNode).getChild().writeProp(selectorFromAttr(viewContainer, "data-" + dataId), propKey, attrKey)
}
export function getRoot() {
  return mySitePages.treeRoot
}
function hasWritePermission(){
  //return true // uncomment this line for client dev tests
  return webuser.isWebAdmin()
}
async function remvModification(myContainer){
  selectorFromAttr(myContainer, "data-admnbuts").innerHTML=""
  removeVisibleOnMouseOver(selectorFromAttr(myContainer, "data-admnbuts"), myContainer)
}
let centralContentContainer
// -- General elements end --

// -- menus

// *** 1 of 2 Entrance point for menus ***
// The procedure previous displaying
export async function initMenus(centralContent){
  centralContentContainer = centralContent
  await mySitePages.initData(Linker, getLangParent, webuser, getCurrentLanguage, getLangBranch) // It loads the initial content
  // Starting search params point first menu
  // It sets a the menus view default initial search params in case no other searchs or config search has been defined
  if (getRoot().getMainBranch().children.length>0)
    setDefaultInitNavSearch('?menu=' + getRoot().getMainBranch().getChild().props.id)
}

// *** 2 of 2 Entrance point for menus ***
// It displays menus and sets them
export async function displayMenus(viewContainer){
  await setMenusCollectionEventsReactions()
  if (!getRoot()._logCollectioinReaction) {
    getRoot().attachObserver("usertype change", getRoot())
    getRoot().setReaction("usertype change", async ()=>{
      console.log(`node id=${getRoot().props.id} said "webuser log change" `)
      await setMenusCollectionEventsReactions()
    })
    getRoot()._logCollectionReaction = true
  }
  const menusContainer = selectorFromAttr(viewContainer, "data-container")
  getRoot().getMainBranch().childContainer = menusContainer
  // displaying and setting menus
  for (const menu of getRoot().getMainBranch().children){
    //await setMenuUserEventsReactions(menu) // ** already externalized
    menusContainer.appendChild(await menuView(menu))
    setNavStateMenu(menu) // declaring navigation url. it should come after menuView for firstElement reference
    initNavSearchMenu(menu) // performing the initial url search procedure in menus
  }
  if (getRoot().getMainBranch().children.length == 0  && hasWritePermission()) {
    const {setAdditionButton} = await import("../admin/addition.mjs")
    setAdditionButton(getRoot().getMainBranch(), null, 1 /* position */, null, async (newNode)=>{
      setNavStateMenu(newNode) // declaring navigation url
      return await menuView(newNode)
    })
  }
  getRoot().getMainBranch().dispatchEvent("displayChildren") // event for addition and no children
}

// It shows the menu. It does just the procedures related to view. Other needed menu procedures are spread in functions below and should be executed in conjuntion with menuView regarding of the subject.
async function menuView(menu){
  const menuTp = await getTemplate("menu")
  const menuContainer = selectorFromAttr(menuTp, "data-container")
  menu.firstElement = menuContainer // firstElement is used for other modules
  writeMenu(menu, menuContainer)
  await setMenuEdition(menu, menuContainer)
  await setMenuModification(menu, menuContainer)
  // no se si hace falta la siguiente linea porque en teoria no hay refreshing aqui
  //if (menu.selected) clickMenu(menu) // Selection can be happened before: refreshing
  // ** doc entrance method **
  menuContainer.querySelector("[data-value]").addEventListener('click', async function(event){
    event.preventDefault()
    if (this.isContentEditable==true)
      return // The click event should not be executed at contenteditable state
    displayParagraphs(menu)
  })
  await setPrphsCollectionEventsReactions(menu)
  return menuTp
}

// -- pages (paragraphs)

async function displayParagraphs(menu){
  setActiveInSite(menu) // The content is showed at main site element centralcontent and then we set it as the active at this time
  pushNavHisMenu(menu) // recording browser history state
  if (!menu._loadedPgphs) {
    await mySitePages.loadDoc(menu, getLangParent(menu))
    menu._loadedPgphs = true
  }
  const docTp = await getTemplate("doc")
  const paragraphsContainer = selectorFromAttr(docTp, "data-container")
  menu.getMainBranch().childContainer = paragraphsContainer
  for (const prgph of menu.getMainBranch().children) {
    paragraphsContainer.appendChild(await pgphView(prgph))
  }
  centralContentContainer.innerHTML = ""
  centralContentContainer.appendChild(docTp)
  if (menu.getMainBranch().children.length == 0  && hasWritePermission()) {
    const {setAdditionButton} = await import("../admin/addition.mjs")
    // hay que calcular step que es en realidad pos
    setAdditionButton(menu.getMainBranch(), null, 1 /* position */, null, pgphView)
  }
  menu.getMainBranch().dispatchEvent("displayChildren") // event for addition and no children
  return docTp
}

// It shows the doc pragraph
async function pgphView(prgph){
  const pgphTp = await getTemplate("paragraph")
  const prContainer = selectorFromAttr(pgphTp, "data-container")
  prgph.firstElement = prContainer
  write(prgph, prContainer)
  write(prgph, prContainer, undefined, "edit-text") // for html code edition
  await setPgphEdition(prgph, prContainer)
  await setPgphModification(prgph, prContainer)
  return pgphTp
}

// --- helpers ---

// -- Menus

function writeMenu(myNode, viewContainer) {
  write(myNode, viewContainer)
  if (!myNode._langReaction) {
    if (!myNode.setReaction) {
      Object.setPrototypeOf(myNode, observerMixin(myNode.constructor).prototype) // adding methods 
      observerMixin(Object).prototype.initObserver.call(myNode) // adding properties : calling constructor
    }
    const langChangeReaction = () => {
      write(myNode, viewContainer)
      if (myNode.selected) {// refreshing doc content. volatile content.
        for (const parph of myNode.getMainBranch().children){
          write(parph, parph.firstElement)
          write(parph, parph.firstElement, undefined, "edit-text") // for html code edition
        }
      }
    }
    getRoot().attachObserver("language change", myNode)
    myNode.setReaction("language change", ()=>{
      console.log(`node id=${myNode.props.id} said "change language" `)
      langChangeReaction(myNode)
    })
    myNode._langReaction = true
  }
}
// For setting the edition button
async function setMenuEdition(myNode, myContainer){
  if (hasWritePermission()) {
    const {setEdition} = await import("../admin/edition.mjs")
    await setEdition(getLangBranch(myNode).getChild(), myContainer)
    visibleOnMouseOver(selectorFromAttr(myContainer, "data-butedit"), myContainer) // on mouse over edition button visibility
  }
  if (!myNode._logEditReaction) {
    if (!myNode.setReaction) {
      Object.setPrototypeOf(myNode, observerMixin(myNode.constructor).prototype) // adding methods 
      observerMixin(Object).prototype.initObserver.call(myNode) // adding properties : calling constructor
    }
    const logChangeReaction=async (menu)=>{
      if (hasWritePermission()) {
        await setMenuEdition(menu, menu.firstElement)
        if (menu.selected) { // refreshing pagrphs edition & modification. Pagrphs is volatile content.
          for (const prgph of menu.getMainBranch().children) {
            await setPgphEdition(prgph, prgph.firstElement)
          }
        }
      }
      else {
        remvMenuEdition(menu.firstElement)
        if (menu.selected) { // refreshing pagrphs edition & modification. Pagrphs is volatile content.
          for (const prgph of menu.getMainBranch().children) {
            await remvPgphEdition(prgph.firstElement)
          }
        }
      }
    }
    getRoot().attachObserver("usertype change", myNode)
    myNode.setReaction("usertype change", ()=>{
      console.log(`node id=${myNode.props.id} said "webuser log change" `)
      logChangeReaction(myNode)
    })
    myNode._logEditReaction = true
  }
}

// setting listeners for menus modification events
async function setMenusCollectionEventsReactions(){
  if (hasWritePermission() && !getRoot()._collectionReactions) {
    const {onDelSelectedChild} = await import("../admin/deletion.mjs")
    const {onNewNodeMakeClick, onNoChildrenShowAdd} = await import("../admin/addition.mjs")
    //const {setAdditionButton} = await import("../admin/addition.mjs")
    const {showFirstAdditionOnLog} = await import("../admin/addition.mjs")
    onNewNodeMakeClick(getRoot().getMainBranch(), displayParagraphs)
    /* old
    onNoChildrenShowAdd(getRoot().getMainBranch(), hasWritePermission, async (newMenuNode)=>{
      // Same routine as declared for menu setAdditionButton
      setNavStateMenu(newMenuNode) // declaring navigation url
      //await setMenuUserEventsReactions(newMenuNode) // ** already externalized
      return await menuView(newMenuNode)
    })
    */
    onDelSelectedChild(getRoot().getMainBranch(), displayParagraphs)
    // this is kind of different reaction, it is not related to edition events but with loggin events
    /*
    const logChangeReaction=async ()=>{
      if (getRoot().getMainBranch().children.length == 0) {
        if (hasWritePermission()) {
          // hay que calcular step que es en realidad pos
          setAdditionButton(getRoot().getMainBranch(), null, 1 , null, async (newNode)=>{
            setNavStateMenu(newNode) // declaring navigation url
            return await menuView(newNode)
          })
        }
        else {
          getRoot().getMainBranch().childContainer.removeChild(selectorFromAttr(getRoot().getMainBranch().childContainer, "data-add-button"))
        }
      }
    }
    if (!getRoot().getMainBranch().setReaction) {
      Object.setPrototypeOf(getRoot().getMainBranch(), observerMixin(getRoot().getMainBranch().constructor).prototype) // adding methods 
      observerMixin(Object).prototype.initObserver.call(getRoot().getMainBranch()) // adding properties : calling constructor
    }
    getRoot().attachObserver("usertype change", getRoot().getMainBranch())
    getRoot().getMainBranch().setReaction("usertype change", ()=>{
      console.log(`node =${getRoot().getMainBranch().props} said "webuser log change" `)
      logChangeReaction()
    })
    */
    showFirstAdditionOnLog(getRoot().getMainBranch(), getRoot(), hasWritePermission, async (newNode)=>{
      setNavStateMenu(newNode) // declaring navigation url
      return await menuView(newNode)
    })
    getRoot()._collectionReactions=true
  }
}
// For declaring the menu navigation url
function setNavStateMenu(menu){
  // despite click menu would set the same nav state again, nav state system prevent double setting the same state
  setNav(menu, "menu", ["menu"], displayParagraphs)
}
function initNavSearchMenu(menu){
  // despite click menu would set the same nav state again, nav state system prevent double setting the same state
  initialNavSearch(menu, "menu", ["menu"], displayParagraphs)
}
function pushNavHisMenu(menu){
  pushNav(menu, "menu", ["menu"])
}
async function remvMenuEdition(menuContainer){
  selectorFromAttr(menuContainer, "data-butedit").innerHTML=""
  removeVisibleOnMouseOver(selectorFromAttr(menuContainer, "data-butedit"), menuContainer)
}
// Menus reaction to site events like login and language change
async function setMenuUserEventsReactions_old(menu){
  // Could be other ways. It also would be even preferible to not clickMenu but set the paragraphs content or refresh its view...
  // *** pasado a otro lao
  const langChangeReaction=async (menu)=>{
    write(menu, menu.firstElement)
    if (menu.selected) {// refreshing doc content. volatile content.
      for (const parph of menu.getMainBranch().children){
        write(parph, parph.firstElement)
        write(parph, parph.firstElement, undefined, "edit-text") // for html code edition
      }
    }
  }
  // add or remove edition buttons
  const logChangeReaction=async (menu)=>{
    if (hasWritePermission()) {
      await setMenuEdition(menu, menu.firstElement)
      await setMenuModification(menu, menu.firstElement)
      await setPrphsCollectionEventsReactions(menu)
      if (menu.selected) { // refreshing pagrphs edition & modification. Pagrphs is volatile content.
        for (const prgph of menu.getMainBranch().children) {
          await setPgphEdition(prgph, prgph.firstElement)
          await setPgphModification(prgph, prgph.firstElement)
        }
      }
    }
    else {
      remvMenuEdition(menu.firstElement)
      remvModification(menu.firstElement)
      if (menu.selected) { // refreshing pagrphs edition & modification. Pagrphs is volatile content.
        for (const prgph of menu.getMainBranch().children) {
          await remvPgphEdition(prgph.firstElement)
          await remvModification(prgph.firstElement)
        }
      }
    }
  }
  //myPagesView.setUserEventsReactions(menu, langChangeReaction, logChangeReaction)
}
// sets menu modification buttons
async function setMenuModification(myNode, myContainer){
  if (hasWritePermission()) {
    visibleOnMouseOver(selectorFromAttr(myContainer, "data-admnbuts"), myContainer) // on mouse over edition button visibility
    const {setAdditionButton} = await import("../admin/addition.mjs")
    const {setChangePosButton} = await import("../admin/changepos.mjs")
    const {setDeletionButton} = await import("../admin/deletion.mjs")
    await setChangePosButton(myNode, myContainer, "butchposhor")
    await setAdditionButton(myNode.parent, myNode, 1, myContainer, async (newNode)=>{
      setNavStateMenu(newNode) // declaring navigation url
      // await setMenuUserEventsReactions(newNode) // already externalized
      return await menuView(newNode)
    })
    await setDeletionButton(myNode, myContainer)
  }
  if (!myNode._logModReaction) {
    if (!myNode.setReaction) {
      Object.setPrototypeOf(myNode, observerMixin(myNode.constructor).prototype) // adding methods 
      observerMixin(Object).prototype.initObserver.call(myNode) // adding properties : calling constructor
    }
    const logChangeReaction=async (menu)=>{
      if (hasWritePermission()) {
        await setMenuModification(menu, menu.firstElement)
        if (menu.selected) { // refreshing pagrphs edition & modification. Pagrphs is volatile content.
          await setPrphsCollectionEventsReactions(menu)
          if (menu.getMainBranch().children.length == 0) {
            const {setAdditionButton} = await import("../admin/addition.mjs")
            setAdditionButton(menu.getMainBranch(), null, 1 /* position */, undefined /* view container */, pgphView)
          }
          for (const prgph of menu.getMainBranch().children) {
            await setPgphModification(prgph, prgph.firstElement)
          }
        }
      }
      else {
        remvModification(menu.firstElement)
        if (menu.selected) { // refreshing pagrphs edition & modification. Pagrphs is volatile content.
          if (menu.getMainBranch().children.length == 0) {
            menu.getMainBranch().removeChild(selectorFromAttr(menu.getMainBranch().childContainer, "data-add-button"))
          }
          for (const prgph of menu.getMainBranch().children) {
            await remvModification(prgph.firstElement)
          }
        }
      }
    }
    getRoot().attachObserver("usertype change", myNode)
    myNode.setReaction("usertype change", ()=>{
      console.log(`node id=${myNode.props.id} said "webuser log change" `)
      logChangeReaction(myNode)
    })
    myNode._logModReaction = true
  }
}

// -- Pages (paragraphs)

async function setPrphsCollectionEventsReactions(menu){
  /* old
  if (!menu._collectionReactions && hasWritePermission()) {
    const {onNoChildrenShowAdd} = await import("../admin/addition.mjs")
    onNoChildrenShowAdd(menu.getMainBranch(), hasWritePermission, pgphView) // pgphView => Same routine as declared for prgph setAdditionButton
    menu._collectionReactions = true
  }*/
  // this is kind of different reaction, it is not related to edition events but with loggin events
  if (menu._collectionReactions)
    return
  const {setAdditionButton} = await import("../admin/addition.mjs") //*** no se usa
  const {showFirstAdditionOnLog} = await import("../admin/addition.mjs")
  /*
  const logChangeReaction=async ()=>{
    if (menu.getMainBranch().children.length == 0) {
      if (hasWritePermission()) {
        // hay que calcular step que es en realidad pos
        setAdditionButton(menu.getMainBranch(), null, 1 , null, pgphView)
      }
      else {
        menu.getMainBranch().childContainer.removeChild(selectorFromAttr(menu.getMainBranch().childContainer, "data-add-button"))
      }
    }
  }
  if (!menu.getMainBranch().setReaction) {
    Object.setPrototypeOf(menu.getMainBranch(), observerMixin(menu.getMainBranch().constructor).prototype) // adding methods 
    observerMixin(Object).prototype.initObserver.call(menu.getMainBranch()) // adding properties : calling constructor
  }
  getRoot().attachObserver("usertype change", menu.getMainBranch())
  menu.getMainBranch().setReaction("usertype change", ()=>{
    console.log(`node =${menu.getMainBranch().props} said "webuser log change" `)
    logChangeReaction()
  })
  */
  //showFirstAdditionOnLog(menu.getMainBranch(), getRoot(), hasWritePermission, pgphView) //volatile, se hace en padre
  menu._collectionReactions = true
}
// for setting the edition button
async function setPgphEdition(prNode, prContainer){
  if (hasWritePermission()) {
    const {setEdition} = await import("../admin/edition.mjs")
    setEdition(getLangBranch(prNode).getChild(), prContainer, undefined, "innerHTML", undefined, undefined, undefined, false)
    visibleOnMouseOver(selectorFromAttr(prContainer, "data-butedit"), prContainer) // on mouse over edition button visibility
    setEdition(getLangBranch(prNode).getChild(), prContainer, "buteditcode", "value", undefined, "edit-text", "buteditcode", false, null)
    visibleOnMouseOver(selectorFromAttr(prContainer, "data-buteditcode"), prContainer) // on mouse over edition button visibility
  }
}
async function setPgphModification(prNode, prContainer){
  if (hasWritePermission()) {
    visibleOnMouseOver(selectorFromAttr(prContainer, "data-admnbuts"), prContainer) // on mouse over edition button visibility
    const {setAdditionButton} = await import("../admin/addition.mjs")
    const {setChangePosButton} = await import("../admin/changepos.mjs")
    const {setDeletionButton} = await import("../admin/deletion.mjs")
    await setChangePosButton(prNode, prContainer, "butchposvert")
    await setAdditionButton(prNode.parent, prNode, 1, prContainer, pgphView)
    await setDeletionButton(prNode, prContainer)
  }
}
async function remvPgphEdition(prContainer){
  selectorFromAttr(prContainer, "data-butedit").innerHTML=""
  selectorFromAttr(prContainer, "data-buteditcode").innerHTML=""
  removeVisibleOnMouseOver(selectorFromAttr(prContainer, "data-butedit"), prContainer)
}
// --- helpers end ---

// An extra function for expanding the pages menu on small screens
export function setOnClickNavToggle(navContainer){
  // Set the toggle button [=] to produce the menus expansion on click.
  // Navigation menu is reduced to a toggle [=] on phone screens and set to extended version in pc screens by a css directive at common.css file.
  // display toggle menu switch
  selectorFromAttr(navContainer, "data-navtoggle").addEventListener("click", (event)=>{
    event.preventDefault()
    const menusContainer = selectorFromAttr(window.document.body, "data-menus")
    menusContainer.classList.toggle("nav-open")
    /*
    if (menusContainer.style.transform=="scale(1, 1)") {
      menusContainer.style.transform="scale(1, 0)" // Another option is style.display="none"/"block"
      return
    }
    menusContainer.style.transform="scale(1, 1)"
    */
  })
}