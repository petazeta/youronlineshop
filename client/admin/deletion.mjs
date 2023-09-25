import {getChildViewElmts} from "../frontutils.mjs"

export async function performDeletion(delNode){
  await delNode.request("delete my tree")
  // we must update the siblings sort_order because we can delete the child at any position
  const skey=delNode.parent.getSysKey('sort_order')
  if (skey && delNode.props[skey]<delNode.parent.children.length) {
    // sort modifies the original
    delNode.parent.children.sort((a,b)=>a.props[skey]-b.props[skey])
    .filter(child=>child.props[skey] > delNode.props[skey])
    .forEach(child=>child.props[skey]--)
  }
  delNode.parent.childContainer.removeChild(delNode.firstElement)
  delNode.parent.removeChild(delNode)
  delNode.parent.dispatchEvent("deleteChild", delNode)
  delNode.dispatchEvent("delete")
}