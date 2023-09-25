import SitePages, {PagesView} from '../../pages.mjs'
import {observerMixin, observerMixinConstructorCallable} from '../../observermixin.mjs'
import {selectorFromAttr} from '../../frontutils.mjs'
import {Linker} from './nodes.mjs'
import {webuser} from './webuser.mjs'
import {getCurrentLanguage, getLangParent, getLangBranch} from './languages.mjs'
import {getActiveInGroup, setActiveInGroup} from './activeingroup.mjs'
import {pushNavUrl, setNavUrl, setAltInitNavSearch} from './navhistory.mjs'

const mySitePages = new SitePages()

function getRoot() {
  return mySitePages.treeRoot
}
export async function initData(){
  await mySitePages.initData(Linker, getLangParent, webuser, getCurrentLanguage, getLangBranch, setAltInitNavSearch)
  return getRoot()
}

const myPagesView = new PagesView()

function writeLangData(myNode) {
  return myPagesView.writeLangData(getLangBranch, myNode)
}
function setMenusChangeEvents(){
  myPagesView.setChangeEvents(getActiveInGroup, getRoot().getMainBranch(), expandMenus, ()=>webuser.isWebAdmin())
}
function expandMenus(){
  myPagesView.expand(getRoot(), document.querySelector('[data-id=page-menus-container]'), 'menu')
}
export function setOnClickNavToggle(){
  return myPagesView.setOnClickNavToggle()
}
function setNavUrlMenu(menuNode){
  return myPagesView.setNavUrlMenu(setNavUrl, menuNode, setViewDoc)
}
export async function setMenus(){
  await initData()
  getRoot().getMainBranch().children.forEach(child=>setNavUrlMenu(child))
  expandMenus()
  setMenusChangeEvents()
  myPagesView.setTreeEventsReactions(getRoot())
}
function setViewDoc(myNode){
  new myNode.constructor.nodeConstructor().setView(document.getElementById("centralcontent"), 'doc', {menuNode: myNode})
}
function clickMenu(myNode) {
  setViewDoc(myNode)
  myPagesView.pushNavUrlMenu(pushNavUrl, myNode)
}
function setMenuChgButs(myNode){
  myPagesView.setMenuChgButs(webuser, myNode, getLangBranch(myNode).getChild())
}
// Set menu first time or refresh its view
export async function setMenu(myNode){
  writeLangData(myNode)
  setMenuChgButs(myNode)
  if (myNode.selected) clickMenu(myNode) // Selection can be happened before: refreshing
  selectorFromAttr(myNode.firstElement, "data-id", "value").addEventListener('click', function(event){
    event.preventDefault()
    if (this.isContentEditable==true) return false // The event should not be executed at contentiditable state
    clickMenu(myNode)
  })
}
function setParagraphChangeEvents(myMenu){
  myPagesView.setChangeEvents(getActiveInGroup, myMenu.getMainBranch(), clickMenu, ()=>webuser.isWebAdmin())
}
function expandParagraphs(myMenu){
  myPagesView.expand(myMenu, document.getElementById("centralcontent").querySelector('[data-id=doc-view]'), 'paragraph')
  setParagraphChangeEvents(myMenu)
}
export async function docView(menuNode){
  if (!menuNode.loaded) {
    await mySitePages.loadDoc(getLangParent, menuNode)
    menuNode.loaded=true
  }
  expandParagraphs(menuNode)
  myPagesView.setActiveInSite(setActiveInGroup, menuNode)
}
function setPargChgButs(myNode){
  myPagesView.setPargChgButs(webuser, myNode, getLangBranch(myNode).getChild())
}
export async function setParagraph(myNode){
  writeLangData(myNode)
  myPagesView.writeLangData(getLangBranch, myNode, undefined, undefined, "edit-text")
  setPargChgButs(myNode)
}