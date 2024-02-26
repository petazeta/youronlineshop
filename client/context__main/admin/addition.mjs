import {performAddition} from '../../admin/addition.mjs'
import {getLangParent, createInstanceChildText} from '../languages/languages.mjs'
import {selectorFromAttr} from '../../frontutils.mjs'
import {getTemplate} from '../layouts.mjs'
import {observerMixin} from '../../observermixin.mjs'

/* This method is for enabling adition capabilities in a button layout.

It gets adition button layout (template) name and some parent of the destination button container. The opeartion result would be the insertion of an addition button with adition funcionalities in the correspondent container element marked as data-admnbuts (or as settled in parameter).
 - Addition button layout will have these labeled elements:
   - data-add-button: The deletion button container

  Parameters meaning:
  - sortOrder: position to be inserted
  - elmView: The element to be edited tp or view
  - makeView: function that returns a new vew (tp or view). it takes the new node as argument.

  Notes:
  - for upper methods:  if (!hasWritePermission()) return
  - It asumes that parent node children, that is, newNode sibling nodes has the instance variable firstElement that is the view node element
  - and parent has instance variable childContainer -> elements container
-->
*/
export async function setAdditionButton(nodeParent, position, butContainer, makeView, callBack, extraParams={}){
  const addTpName = extraParams.addTpName || "butaddnewnode"
  const addTp = await getTemplate(addTpName)
  const addButton = addTp.querySelector("[data-add-button]")
  addButton.addEventListener("click", async (ev)=>{
    ev.preventDefault()
    const hasLangContent = getLangParent(nodeParent.partner) ? true : false
    const newNode = hasLangContent ? await createInstanceChildText(nodeParent, position) : nodeParent.createInstanceChild(position)
    const extraParent = hasLangContent && getLangParent(newNode)
    await performAddition(newNode, extraParent, makeView)
    if (callBack)
      await callBack(newNode)
  })
  butContainer.appendChild(addTp)
}
// *** this could be not needed, so we can do it inside setAdditionButton makeview function
export function onNewNodeMakeClick(nodeParent, clickOn){
  //when a new subnode is created we select it
  nodeParent.addEventListener("addNewNode", (newNode)=>{
    // quizas mejor un this.clickbutton()
    clickOn(newNode)
  }, "expandANodeOnaddANewNode")
}
// *** This is deprecated
export function showFirstAdditionOnLog_old(nodeParent, rootNode, hasWritePermission, makeView, elmContainer, addTpName="butaddnewnode"){
  if (!elmContainer)
    elmContainer = nodeParent.childContainer
  const logChangeReaction=async ()=>{
    if (nodeParent.children.length == 0) {
      if (hasWritePermission()) {
        // hay que calcular step que es en realidad pos
        setAdditionButton(nodeParent, 1, selectorFromAttr(elmContainer, "data-admnbuts"), makeView, undefined)
      }
      else if (selectorFromAttr(elmContainer, "data-add-button")){
        elmContainer.removeChild(selectorFromAttr(elmContainer, "data-add-button"))
      }
    }
  }
  if (!nodeParent.setReaction) {
    Object.setPrototypeOf(nodeParent, observerMixin(nodeParent.constructor).prototype) // adding methods 
    observerMixin(Object).prototype.initObserver.call(nodeParent) // adding properties : calling constructor
  }
  rootNode.attachObserver("usertype change", nodeParent)
  nodeParent.setReaction("usertype change", ()=>{
    console.log(`node =${nodeParent.props} said "webuser log change" `)
    logChangeReaction()
  })
}
// we can also avoid using this, just using the script at the post addition callback
export function onAddInPageChild(nodeParent, refreshView){
  // adjust the page view after adding an element to fit the pagination
  nodeParent.addEventListener("addNewNode", (newNode)=>{
    const pagination = nodeParent.pagination
    ++pagination.totalParent.props.total // perform addition adds one to normal parent total but not to pagination.totalParent
    // is it change in indexes number because of the addition?
    if (nodeParent.props.total > 1 && nodeParent.props.total % pagination.pageSize == 1) {
      pagination.createIndexes() // refresh indexes to include the new one
      pagination.createItemsWindow()
      pagination.displayButtons(getTemplate)
      alert("refresh indexes")
    }
    // is it page overflow?
    if (nodeParent.children.length > pagination.pageSize) {
      // we have to options: newNode is in the current page or it is in the next page
      if (nodeParent.children[nodeParent.children.length - 1] == newNode) {
        // next page situtation
        for (let i = 0; i<pagination.pageSize; i++)
          nodeParent.removeChild(nodeParent.firstElementChild)
        refreshView(nodeParent.partner, pagination.pageNum + 1)
      }
      // Is it not last page?
      else {
        nodeParent.childContainer.removeChild(nodeParent.childContainer.lastElementChild)
      }
    }
  }, "addinpage")
}