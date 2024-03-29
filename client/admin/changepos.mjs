import {swapElement} from '../frontutils.mjs'
// it assumes node instance var firstElement is settled as the view node element
export async function performChangePos(currentNode, increment) {
  const skey = currentNode.parent.getSysKey('sort_order')
  if (!skey)
    return
  const currentSortOrder = currentNode.props[skey]
  const nextSortOrder=currentSortOrder + increment
  let total = currentNode.parent.props.total
  if (currentNode.parent.pagination)
    total = currentNode.parent.pagination.totalParent.total
  if (nextSortOrder <= 0 || nextSortOrder > total) {
    return // extremes positions
  }
  
  await currentNode.request("edit my sort_order", {newSortOrder: nextSortOrder}) // server operation includes the swapped element position change
  
  const nextNode = currentNode.parent.children.find(child=>child.props[skey]==nextSortOrder)
  if (!nextNode) {
    currentNode.parent.dispatchEvent("moveNode", increment, currentNode, nextSortOrder) // for pagination cases
    return
  }
  currentNode.props[skey] = nextSortOrder
  nextNode.props[skey] = currentSortOrder
  swapElement(currentNode.firstElement, nextNode.firstElement)
  currentNode.parent.dispatchEvent("moveNode", increment, currentNode, nextSortOrder)
  return [increment, currentNode, nextSortOrder]
}
