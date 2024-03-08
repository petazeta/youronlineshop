import {getChildViewElmts} from "../frontutils.mjs"

export async function performDeletion(delNode){
  await delNode.request("delete my tree")
  // we must update the siblings sort_order because we can delete the child at any position
  const nodeParent = Array.isArray(delNode.parent)? delNode.parent[0] : delNode.parent
  const extraParents = Array.isArray(delNode.parent)? delNode.parent.slice(1) : []

  const skey = nodeParent.getSysKey('sort_order')
  if (skey && delNode.props[skey]<nodeParent.children.length) {
    // sort modifies the original
    nodeParent.children.sort((a,b)=>a.props[skey]-b.props[skey])
    .filter(child=>child.props[skey] > delNode.props[skey])
    .forEach(child=>child.props[skey]--)
  }
  nodeParent.childContainer.removeChild(delNode.firstElement)
  nodeParent.removeChild(delNode)
  for (const extraParent of extraParents)
    extraParent.removeChild(delNode)
  nodeParent.dispatchEvent("deleteChild", delNode)
  delNode.dispatchEvent("delete")
}