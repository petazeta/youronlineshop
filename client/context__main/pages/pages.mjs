/****
  This module contains all the functionallity regarding to menus and its content: paragraphs. The total paragraphs in a menu is also called doc for document or page.
  First code lines are for some generic elements and then I recommend to start reading the code from the bottom untill the top. At the botton is the more generic elements that is going to more specific ones untill the top.

falta hacer mas pruebas
****/

import {PagesContent} from '../../pages/pages.mjs'
import {visibleOnMouseOver, removeVisibleOnMouseOver, selectorFromAttr, fadeIn, fadeInTmOut, fadeOut} from '../../frontutils.mjs'
import {Linker} from '../nodes.mjs'
import {webuser} from '../webuser/webuser.mjs'
import {getCurrentLanguage, getLangParent, getLangBranch} from '../languages/languages.mjs'
import {setActiveInSite, getActiveInSite} from '../activeingroup.mjs'
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
  getRoot().attachObserver("usertype change", getRoot())
  getRoot().setReaction("usertype change", async ()=>{
    console.log(`node id=${getRoot().props.id} said "webuser log change" `)
    if (getRoot().getMainBranch().children.length == 0) {
      if (hasWritePermission()) {
        const {setAdditionButton} = await import("../admin/addition.mjs")
        await setAdditionButton(getRoot().getMainBranch(), 1, getRoot().getMainBranch().childContainer, menuView, setNavStateMenu)
      }
      else {
        const additionButton = selectorFromAttr(viewContainer, "data-add-button")
        if (additionButton)
          additionButton.parentElement.removeChild(additionButton)
      }
    }
    // refresh central content view (remove/add edition)
    if (getActiveInSite()?.parent?.props.childTableName==getRoot().parent.props.childTableName)
        await displayParagraphs(getActiveInSite()) // refresh view
  })
}

// *** 2 of 2 Entrance point for menus ***
// It displays menus and sets them
export async function displayMenus(viewContainer){
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
    setAdditionButton(getRoot().getMainBranch(), 1 , menusContainer, displayParagraphs, setNavStateMenu)
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
  await setMenuEditCollection(menu, menuContainer)
  // no se si hace falta la siguiente linea porque en teoria no hay refreshing aqui
  //if (menu.selected) clickMenu(menu) // Selection can be happened before: refreshing
  // ** doc entrance method **
  menuContainer.querySelector("[data-value]").addEventListener('click', async function(event){
    event.preventDefault()
    if (this.isContentEditable==true)
      return // The click event should not be executed at contenteditable state
    displayParagraphs(menu)
  })
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
  fadeInTmOut(centralContentContainer)
  if (menu.getMainBranch().children.length == 0  && hasWritePermission()) {
    const {setAdditionButton} = await import("../admin/addition.mjs")
    setAdditionButton(menu.getMainBranch(), 1, paragraphsContainer, pgphView)
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
  await setPgphEditCollection(prgph, prContainer)
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
    getRoot().attachObserver("usertype change", myNode)
    myNode.setReaction("usertype change", async ()=>{
      console.log(`node id=${myNode.props.id} said "webuser log change" `)
      if (hasWritePermission()) {
        await setMenuEdition(myNode, myNode.firstElement)
      }
      else {
        remvMenuEdition(myNode.firstElement)
      }
    })
    myNode._logEditReaction = true
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
// sets menu modification buttons
async function setMenuEditCollection(myNode, myContainer){
  if (hasWritePermission()) {
    visibleOnMouseOver(selectorFromAttr(myContainer, "data-admnbuts"), myContainer) // on mouse over edition button visibility
    const {setAdditionButton} = await import("../admin/addition.mjs")
    const {setChangePosButton} = await import("../admin/changepos.mjs")
    const {setDeletionButton} = await import("../admin/deletion.mjs")
    await setChangePosButton(myNode, selectorFromAttr(myContainer, "data-admnbuts"), null, {chTpName: "butch"})
    const position = myNode.props[myNode.parent.getSysKey('sort_order')] + 1
    await setAdditionButton(myNode.parent, position, selectorFromAttr(myContainer, "data-admnbuts"), menuView, async (newNode)=>{
      setNavStateMenu(newNode) // declaring navigation url
      await displayParagraphs(newNode)
    })
    await setDeletionButton(myNode, selectorFromAttr(myContainer, "data-admnbuts"), async (delNode)=>{
      if (getRoot().getMainBranch().children.length==0) {
        const {setAdditionButton} = await import("../admin/addition.mjs")
        setAdditionButton(getRoot().getMainBranch(), 1, getRoot().getMainBranch().childContainer, menuView, async (newNode)=>{
          setNavStateMenu(newNode)
          await displayParagraphs(newNode)
        })
      }
      if (!delNode.selected)
        return
      const skey = getRoot().getMainBranch().getSysKey("sort_order")
      let nextSelected
      if (getRoot().getMainBranch().children.length > 1) {
        const nextPosition = delNode.props[skey] > 1 ? delNode.props[skey] - 1 : 1
        nextSelected = getRoot().getMainBranch().children.find(child=>child.props[skey]==nextPosition) || getRoot().getMainBranch().getChild()
      }
      if (nextSelected) {
        await displayParagraphs(nextSelected)
      }
      // Not any menu left
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
        await setMenuEditCollection(myNode, myContainer)
      }
      else {
        remvModification(myContainer)
      }
    })
    myNode._logModReaction = true
  }
}

// -- Pages (paragraphs)

// for setting the edition button
async function setPgphEdition(myNode, prContainer){
  if (hasWritePermission()) {
    const {setEdition} = await import("../admin/edition.mjs")
    setEdition(getLangBranch(myNode).getChild(), prContainer, undefined, "innerHTML", false)
    visibleOnMouseOver(selectorFromAttr(prContainer, "data-butedit"), prContainer) // on mouse over edition button visibility
    setEdition(getLangBranch(myNode).getChild(), prContainer, undefined, "value", false, "edit-text", "buteditcode", undefined, "buteditcode")
    visibleOnMouseOver(selectorFromAttr(prContainer, "data-buteditcode"), prContainer) // on mouse over edition button visibility
  }
}
async function setPgphEditCollection(myNode, prContainer){
  if (hasWritePermission()) {
    visibleOnMouseOver(selectorFromAttr(prContainer, "data-admnbuts"), prContainer) // on mouse over edition button visibility
    const {setAdditionButton} = await import("../admin/addition.mjs")
    const {setChangePosButton} = await import("../admin/changepos.mjs")
    const {setDeletionButton} = await import("../admin/deletion.mjs")
    const position = myNode.props[myNode.parent.getSysKey('sort_order')] + 1
    await setChangePosButton(myNode, selectorFromAttr(prContainer, "data-admnbuts"))
    await setAdditionButton(myNode.parent, position, selectorFromAttr(prContainer, "data-admnbuts"), pgphView)
    await setDeletionButton(myNode, selectorFromAttr(prContainer, "data-admnbuts"), async(delNode)=>{
      if (myNode.parent.children.length==0) {
        const {setAdditionButton} = await import("../admin/addition.mjs")
        await setAdditionButton(myNode.parent, 1, myNode.parent.childContainer, pgphView)
      }
    })
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