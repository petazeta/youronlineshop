// --- dbmanager custom file ---
/*
It shows the database collections and its contents
To do so we are using the content base class manager. This content base class allows an easier management of events like login, to spread the reaction to every node.
As well we are using the pagination class that allows a pagination view of the database rows.

The events reaction to login and lang change are not implemented yet

*/
import {Node, Linker} from "./nodes.mjs"
import {getTemplate} from './layouts.mjs'
import {selectorFromAttr, visibleOnMouseOver} from '../frontutils.mjs'
import {setEdition} from "./admin/edition.mjs"
//import {setAdditionButton, onNewNodeMakeClick} from "./admin/addition.mjs"
import {setChangePosButton} from "./admin/changepos.mjs"
//import {setDeletionButton, onDelOnlyChild} from "./admin/deletion.mjs"
import {getLangParent, isLangBranch, getLangBranch, getCurrentLanguage} from "./languages/languages.mjs"
import {DBContent} from "./dbcontent.mjs"
import {webuser} from './webuser/webuser.mjs'
import {setActive} from "../activelauncher.mjs"
import {dataView} from "../displaydata.mjs"
import {Pagination} from "../pagination.mjs"

const pageSize = 10

export async function setCollectionButtons(container){
  for (const col of await Node.makeRequest("get collections")) {
    container.appendChild(await collectionButtonView(col))
  }
}

async function collectionButtonView(collectionName){
  const butTp = await getTemplate("collection")
  const but = selectorFromAttr(butTp, "data-value")
  but.textContent = collectionName
  but.addEventListener("click", async function(ev) {
    ev.preventDefault()
    const myContent = new DBContent(collectionName)
    
    const container = selectorFromAttr(document.querySelector("main"), "data-children")
    container.innerHTML = ""
    // Display a list of elements
    async function listView(parent, pageNum) {
      const pagination = parent.pagination
      if (pagination.totalParent.props.total>0 && !pagination._loaded || (pageNum !== undefined && pagination.pageNum!=pageNum)) {
        await pagination.loadPageItems("get all my children", {}, pageNum)
        pagination._loaded = true
      }
      const pageView = await parent.pagination.pageView(getTemplate)
      parent.childContainer = selectorFromAttr(pageView, "data-content")
      for (const myNode of parent.children) {
       parent.childContainer.appendChild(await nodeView(myNode))
      }
      const childContainer = selectorFromAttr(container, "data-children")
      childContainer.innerHTML = ""
      childContainer.appendChild(pageView)
    }
    await myContent.initData(Linker, getLangParent, webuser, getCurrentLanguage, listView, pageSize)
    // All children list
    if (myContent.treeRoot.relationships.length==1) {
      await listView(myContent.treeRoot.getRelationship())
    }
    // Display the root element
    else {
      const parent = myContent.treeRoot.parent
      parent.childContainer =  selectorFromAttr(container, "data-children")
      parent.childContainer.innerHTML = ""
      for (const myNode of parent.children) {
       parent.childContainer.appendChild(await nodeView(myNode))
      }
      //await displayChildren(container, myContent.treeRoot.parent)
    }
  })
  return butTp
}

async function displayRels(container, myNode){
  myNode.childContainer = selectorFromAttr(container, "data-children")
  myNode.childContainer.innerHTML = ""
  for (const myRel of myNode.relationships) {
    myNode.childContainer.appendChild(await linkerView(myRel))
  }
}

async function displayChildren(container, parent, pageNum){
  if (!parent.pagination) {
    parent.pagination = new Pagination(parent, async (index)=>{
      await displayChildren(container, parent, index)
    }, pageSize)
    await parent.pagination.init()
  }
  const pagination = parent.pagination
  const params = {}
  if (isLangBranch(parent))
    params.extraParents = getLangParent(parent)
  if (pagination.totalParent.props.total>0 && !pagination._loaded || (pageNum !== undefined && pagination.pageNum!=pageNum)) {
    // This doesnt work for the pagination of first elements, it then should be "get all my children"
    await pagination.loadPageItems("get my children", params, pageNum)
    pagination._loaded = true
  }
  const pageView = await parent.pagination.pageView(getTemplate)
  const pageChildContainer = selectorFromAttr(pageView, "data-content") // <ul> element
  for (const myNode of parent.children) {
   pageChildContainer.appendChild(await nodeView(myNode))
  }
  const childContainer = selectorFromAttr(container, "data-children")
  parent.childContainer = pageChildContainer
  childContainer.innerHTML = ""
  childContainer.appendChild(pageView)
  //await setChildrenCollectionEventsReactions(container, parent)

  if (parent.children.length == 0  && hasWritePermission()) {
      /*setAdditionButton(parent, null, 1, container, async (newNode)=>{
      return await nodeView(newNode)
    })*/
  }
  // we are not dipaching displayChildren, so there is no use for it
}

async function linkerView(myNode){
  const container = selectorFromAttr(await getTemplate("node"), "data-container")
  myNode.firstElement = container
  selectorFromAttr(container, "data-value").textContent = myNode.props.name
  selectorFromAttr(container, "data-expander").addEventListener("click", async function(ev) {
    ev.preventDefault()
    const params = {}
    if (isLangBranch(myNode))
      params.extraParents = getLangParent(myNode)
    await myNode.loadRequest("get my children", params)
    await displayChildren(container, myNode)
  })
  selectorFromAttr(container, "data-reducer").addEventListener("click", async function(ev) {
    ev.preventDefault()
    selectorFromAttr(container, "data-children").innerHTML = ""
  })
  return container
}

async function nodeView(myNode) {
  const container = selectorFromAttr(await getTemplate("node"), "data-container")
  myNode.firstElement = container
  selectorFromAttr(container, "data-value").innerHTML = ""
  selectorFromAttr(container, "data-value").appendChild(await fieldsView(myNode))
  //visibleOnMouseOver(selectorFromAttr(container, "data-admnbuts"), container) // on mouse over edition button visibility
  //await setChangePosButton(myNode, container, "butchposvert")
  /*await setAdditionButton(myNode.parent, myNode, 1, container, async (newNode)=>{
    return await nodeView(newNode)
  })*/
  //await setDeletionButton(myNode, container)
  await setNodeCollectionEdition(myNode, container)
  selectorFromAttr(container, "data-expander").addEventListener("click", async function(ev) {
    ev.preventDefault()
    setActive(myNode)
    await myNode.loadRequest("get my relationships")
    await displayRels(container, myNode)
  })
  selectorFromAttr(container, "data-reducer").addEventListener("click", async function(ev) {
    ev.preventDefault()
    selectorFromAttr(container, "data-children").innerHTML = ""
  })
  return container
}

async function fieldsView(myNode) {
  const fieldsTableTp = await getTemplate("datatable")
  const fieldsTable = selectorFromAttr(fieldsTableTp, "data-table").cloneNode()
  const fieldsTableRow = selectorFromAttr(fieldsTableTp, "data-row").cloneNode()
  const fieldsTableCell = selectorFromAttr(fieldsTableTp, "data-cell").cloneNode(true)
  const modTableCell = selectorFromAttr(fieldsTableTp, "data-adm-cell").cloneNode(true)
  if (hasWritePermission())
    await dataView(fieldsTableCell, myNode, fieldsTableRow, undefined, undefined, setEdition)
  else
    await dataView(fieldsTableCell, myNode, fieldsTableRow)
  fieldsTableRow.appendChild(modTableCell)
  fieldsTable.appendChild(fieldsTableRow)
  return fieldsTable
}

async function setChildrenCollectionEventsReactions(viewContainer, myParent){
  if (!hasWritePermission() || myParent._collectionReactions)
  /*onNewNodeMakeClick(myParent, async (newNode)=>{
    setActive(newNode)
    await newNode.loadRequest("get my relationships")
    await displayRels(selectorFromAttr(newNode.firstElement, "data-children"), newNode)
  })*/
  /*onDelOnlyChild(myParent, async (delNode)=>{
    setAdditionButton(myParent, null, 1, viewContainer, async (newNode)=>await nodeView(newNode))
  })*/
  myParent._collectionReactions = true
}

function hasWritePermission(){
  return webuser.isAdmin()
}

async function setNodeCollectionEdition(myNode, myContainer){
  if (!hasWritePermission()) return
  visibleOnMouseOver(selectorFromAttr(myContainer, "data-admnbuts"), myContainer) // on mouse over edition button visibility
  const {setAdditionButton} = await import("./admin/addition.mjs")
  const {setChangePosButton} = await import("./admin/changepos.mjs")
  const {setDeletionButton} = await import("./admin/deletion.mjs")
  await setChangePosButton(myNode, selectorFromAttr(myContainer, "data-admnbuts"), async (increment)=>{
    const nodeParent = myNode.parent
    const skey = myNode.parent.getSysKey('sort_order')
    if (!skey)
      return
    const nextSortOrder = myNode.props[skey] + increment
    const pagination = nodeParent.pagination
    if (nextSortOrder > pagination.itemsWindow[1]) {
      await displayChildren(myContainer, nodeParent, pagination.pageNum + 1)
    }
    if (nextSortOrder < pagination.itemsWindow[0]) {
      await displayChildren(myContainer, nodeParent, pagination.pageNum - 1)
    }
  }, {chTpName: "butchposvert"})
  const position = myNode.props[myNode.parent.getSysKey('sort_order')] + 1
  await setAdditionButton(myNode.parent, position, selectorFromAttr(myContainer, "data-admnbuts"), null, async (newNode)=>await onPageAddition(myContainer, myNode.parent, newNode))
  await setDeletionButton(myNode, selectorFromAttr(myContainer, "data-admnbuts"), async (delNode)=>{
    const nodeParent = myNode.parent
    const pagination = nodeParent.pagination
    const total = --pagination.totalParent.props.total // standard deletion substract from parent, not from totalParent
    if (nodeParent.children.length==0) {
      const {setAdditionButton} = await import("../admin/addition.mjs")
      await setAdditionButton(nodeParent, 1, myContainer, null, async (newNode) => await onPageAddition(myContainer, myNode.getRelationship("items"), newNode))
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
      await displayChildren(myContainer, nodeParent, pagination.pageNum - 1)
      return
    }
    // No change in indexes
    await displayChildren(myContainer, nodeParent, pagination.pageNum)
  })
}

async function onPageAddition(myContainer, nodeParent, newNode) {
  console.log("onPageAddition")
  //await setNavStateItem(newNode) // declaring navigation url
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
      await displayChildren(myContainer, nodeParent, pagination.pageNum + 1)
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
  const newView = await nodeView(newNode)
  nextSibling ? container.insertBefore(newView, nextSibling) : container.appendChild(newView)
}