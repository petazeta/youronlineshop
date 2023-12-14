import {Node, Linker} from "./nodes.mjs"
import {getTemplate} from './layouts.mjs'
import {selectorFromAttr, visibleOnMouseOver} from '../frontutils.mjs'
import {setEdition} from "./admin/edition.mjs"
import {setAdditionButton, onNewNodeMakeClick} from "./admin/addition.mjs"
import {setChangePosButton} from "./admin/changepos.mjs"
import {setDeletionButton} from "./admin/deletion.mjs"
import {getLangParent, isLangBranch, getLangBranch, getCurrentLanguage} from "./languages/languages.mjs"
import {BaseContent} from "./contentbase.mjs"
import {webuser} from './webuser/webuser.mjs'
import {setActive} from "../activelauncher.mjs"



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
    const myContent = new BaseContent(collectionName)
    await myContent.initData(Linker, getLangParent, webuser, getCurrentLanguage)
    const container = selectorFromAttr(document.querySelector("main"), "data-children")
    container.innerHTML = ""
    if (myContent.treeRoot.relationships.length==1)
      await displayChildren(container, myContent.treeRoot.getRelationship())
    else
      await displayChildren(container, myContent.treeRoot.parent)
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

async function displayChildren(container, parent){

  await setChildrenCollectionEventsReactions(container, parent)

  parent.childContainer =  selectorFromAttr(container, "data-children")
  parent.childContainer.innerHTML = ""
  for (const myNode of parent.children) {
   parent.childContainer.appendChild(await nodeView(myNode))
  }
  if (parent.children.length == 0  && hasWritePermission()) {
      setAdditionButton(parent, null, 1, container, async (newNode)=>{
      return await nodeView(newNode)
    })
  }
}

async function linkerView(myNode){
  const myTp = await getTemplate("node")
  const container = selectorFromAttr(myTp, "data-container")
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
  return myTp

}

async function nodeView(myNode) {
  console.log(myNode)
  const myTp = await getTemplate("node")
  const container = selectorFromAttr(myTp, "data-container")
  myNode.firstElement = container
  selectorFromAttr(container, "data-value").innerHTML = ""
  selectorFromAttr(container, "data-value").appendChild(await fieldsView(myNode))
  visibleOnMouseOver(selectorFromAttr(container, "data-admnbuts"), container) // on mouse over edition button visibility
  await setChangePosButton(myNode, container, "butchposvert")
  await setAdditionButton(myNode.parent, myNode, 1, container, async (newNode)=>{
    return await nodeView(newNode)
  })
  await setDeletionButton(myNode, container)
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
  return myTp
}

async function fieldsView(myNode) {
  const fieldsTableTp = await getTemplate("datatable")
  const fieldsTable = selectorFromAttr(fieldsTableTp, "data-table").cloneNode()
  const fieldsTableRow = selectorFromAttr(fieldsTableTp, "data-row").cloneNode()
  const fieldsTableCell = selectorFromAttr(fieldsTableTp, "data-cell").cloneNode(true)
  const modTableCell = selectorFromAttr(fieldsTableTp, "data-adm-cell").cloneNode(true)
  for (const propKey of myNode.parent.childTableKeys) {
    let propCell = fieldsTableCell.cloneNode(true)
    myNode.writeProp(selectorFromAttr(propCell, "data-value"), propKey)
    visibleOnMouseOver(selectorFromAttr(propCell, "data-butedit"), propCell) // on mouse over edition button visibility
    await setEdition(myNode, propCell, undefined, undefined, propKey)
    fieldsTableRow.appendChild(propCell)
  }
  fieldsTableRow.appendChild(modTableCell)
  fieldsTable.appendChild(fieldsTableRow)
  return fieldsTable
}

async function setChildrenCollectionEventsReactions(viewContainer, myParent){
  if (!hasWritePermission() || myParent._collectionReactions)
  onNewNodeMakeClick(myParent, async (newNode)=>{
    setActive(newNode)
    await newNode.loadRequest("get my relationships")
    await displayRels(selectorFromAttr(newNode.firstElement, "data-children"), newNode)
  })
  myParent._collectionReactions = true
}

function hasWritePermission(){
  return webuser.isAdmin()
}