import {performChangePos} from '../../admin/changepos.mjs'
import {selectorFromAttr} from '../../frontutils.mjs'
import {getTemplate} from '../layouts.mjs'

/* This method is for enabling changing one position capabilities in an element layout.

It gets edition button layout (template) name and some parent of the destination button container. The opeartion result would be the insertion of an postion changing button with their funcionalities in the correspondent container element marked as data-admnbuts (or as settled in parameter).
 - Position changing button layout will have these labeled elements:
   - data-chpos-container: The button container
   - data-minus and data plus: The correspondent action buttons to increment or decrement the element position

  Parameters meaning:
  - elmView: A container of the button container

  Note for upper methods:
    if (!hasWritePermission() && false) return
    const chTpName = position == "vertical" ? "butchposver" : "butchposhor"
*/

export async function setChangePosButton(chNode, elmView, chTpName="butchposvert", callBack, dataIdButsWrapper="admnbuts"){
  const butsWrapper = selectorFromAttr(elmView, "data-" + dataIdButsWrapper)
  
  const chPosTp = await getTemplate(chTpName)

  const chPosButtons = selectorFromAttr(chPosTp, "data-chpos-container") // data-minus data-plus
  butsWrapper.appendChild(chPosTp)
  // setting behaviour
  selectorFromAttr(chPosButtons, "data-minus").addEventListener('click', async (event) => {
    await performChangePos(chNode, -1)
    if (callBack)
      await callBack(-1)
  })
  selectorFromAttr(chPosButtons, "data-plus").addEventListener('click', async (event) => {
    await performChangePos(chNode, +1)
    if (callBack)
      await callBack(+1)
})
}
// to set some procedures, this can be replaced by callBack
export function onChangePosInPageChild(nodeParent, refreshView){
  nodeParent.addEventListener("moveNode", (increment, currentNode, nextSortOrder) => {
    const pagination = nodeParent.pagination
    if (nextSortOrder > pagination.itemsWindow[1]) {
      refreshView(nodeParent.partner, pagination.pageNum + 1)
    }
    if (nextSortOrder < pagination.itemsWindow[0]) {
      refreshView(nodeParent.partner, pagination.pageNum - 1)
    }
  }, "delinpage")
}