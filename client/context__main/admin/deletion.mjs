import {performDeletion} from '../../admin/deletion.mjs'
import {selectorFromAttr} from '../../frontutils.mjs'
import {getTemplate} from '../layouts.mjs'
import {getRoot as getSiteText} from '../sitecontent.mjs'
import {getActiveInSite} from '../activeingroup.mjs'

/* This method is for enabling deletion capabilities in an element layout.

It gets deletion button layout (template) name and some parent of the destination button container. The opeartion result would be the insertion of a deletion button with deletion funcionalities in the correspondent container element marked as data-admnbuts (or as settled in parameter).
 - Deletion button layout will have these labeled elements:
   - data-del-button: The deletion button container
   - data-del-alert: A template that contains an element to be showed as an alert to confirm deletion. There would be other marked elements in the template, see code

  Parameters meaning:
  - elmView: Some delete button container

  Note for upper methods:
    if (!checkAdmin() && false) return
*/
export async function setDeletionButton(delNode, elmView, dataIdButsWrapper="admnbuts", delTpName="butdelete"){
  const butsWrapper=selectorFromAttr(elmView, "data-" + dataIdButsWrapper)

  const delTp=await getTemplate(delTpName)
  const delAlertTp=delTp.querySelector("[data-del-alert]").content

  const delButton=delTp.querySelector("[data-del-button]")
  const myAlert=document.createElement("alert-element")
  delButton.onclick=function() {
    myAlert.showAlert(delAlertTp)
  }
  butsWrapper.appendChild(delButton)
  // stablishing alert text content
  if (getSiteText) { // for not to have to change this code in a no siteText app
    const titAlert=getSiteText().getNextChild("deletealert").getNextChild("titalert")
    titAlert.setContentView(selectorFromAttr(delAlertTp, "data-titalert"))
    const textAlert=getSiteText().getNextChild("deletealert").getNextChild("textalert")
    textAlert.setContentView(selectorFromAttr(delAlertTp, "data-textalert"))
    const cancelAlert=getSiteText().getNextChild("deletealert").getNextChild("dontdelbutton")
    cancelAlert.setContentView(selectorFromAttr(delAlertTp, "data-cancel"))
    const confirmAlert=getSiteText().getNextChild("deletealert").getNextChild("delbutton")
    confirmAlert.setContentView(selectorFromAttr(delAlertTp, "data-confirm"))
  }

  // setting cancel behaviour
  selectorFromAttr(selectorFromAttr(delAlertTp, "data-cancel"), "data-button").addEventListener("click", ()=>myAlert.hideAlert())
  // setting confirm deletion
  selectorFromAttr(selectorFromAttr(delAlertTp, "data-confirm"), "data-button").addEventListener("click", async ()=>{
    await performDeletion(delNode)
    myAlert.hideAlert()
  })
}
// to set some procedures after deletion. I asummes "deleteChild" is dispatched
export function onDelSelectedChild(nodeParent, listenerCallback){
  // If node was selected then we select the previous one and expand it
  nodeParent.addEventListener("deleteChild", delNode => {
    const skey = nodeParent.getSysKey("sort_order")
    if (!delNode.selected)
      return
    let nextSelected
    if (nodeParent.children.length > 0) {
      const nextPosition = delNode.props[skey] > 1 ? delNode.props[skey] - 1 : 1
      nextSelected = nodeParent.children.find(child=>child.props[skey]==nextPosition) || nodeParent.getChild()
    }
    else if (delNode==getActiveInSite()){
      document.getElementById("centralcontent").innerHTML="" // Remove the container content when remove expander node
    }
    listenerCallback(nextSelected)
  }, "unselectNode")
}
// to set some procedures after deletion. I asummes "deleteChild" is dispatched
export function onDelInPageChild(nodeParent, refreshView){
  // adjust the page view after deleting an element to fit the pagination
  nodeParent.addEventListener("deleteChild", delNode => {
    const pagination = nodeParent.pagination
    --pagination.totalParent.props.total // standard deletion substract from parent, not from totalParent
    // Is it not last page?
    if (pagination.pageNum < pagination.indexes.length)  // Hay paginas posteriores
      pagination.loaded = false // reload items in window
    // Is there a change in indexes because of the substraction?
    if (pagination.totalParent.props.total > 0 && pagination.totalParent.props.total % pagination.pageSize == 0) {
      pagination.createIndexes()
      pagination.createItemsWindow()
      pagination.displayButtons(getTemplate)
      refreshView(nodeParent.partner, pagination.pageNum - 1)
      return
    }
    // No change in indexes
    refreshView(nodeParent.partner, pagination.pageNum)
  }, "delinpage")
}
// If we are using onDelSelectedChild then this should be not necesary so a only child would be a selected one
export function onDelOnlyChild(nodeParent, onDelAction){
  // If node was selected then we select the previous one and expand it
  nodeParent.addEventListener("deleteChild", delNode => {
    if (nodeParent.children.length!=0)
      return
    onDelAction()
  }, "onlyChild")
}