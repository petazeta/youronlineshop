// It asumes that parent node children, that is, newNode sibling nodes has the instance variable firstElement that is the view node element
export async function performAddition(newNode, extraParent, newView) {
  await newNode.loadRequest("add my tree", {extraParents: extraParent})
  const skey=newNode.parent.getSysKey('sort_order')
  let nextSibling
  // update siblings sort_order when inserted in between
  if (skey && !(newNode.props[skey] > newNode.parent.children.length)) {
    // sort modifies the original
    newNode.parent.children.sort((a,b)=>a.props[skey]-b.props[skey])
    .filter(child=>child.props[skey] >= newNode.props[skey])
    .forEach(child=>child.props[skey]++)
    // to be inserted just before the next sibling
    nextSibling = newNode.parent.children.find(child=>child.props[skey]==newNode.props[skey]+1)?.firstElement
  }
  // setting the view
  if (newNode.parent.children.length==0)
    newNode.parent.childContainer.innerHTML="" // If we add after being empty we must remove the single addition button first
  if (!newNode.parent.props.total)
    newNode.parent.props.total = 0
  const container = newNode.parent.childContainer
  if (newView)
    nextSibling ? container.insertBefore(newView, nextSibling) : container.appendChild(newView)
  newNode.parent.addChild(newNode)
  newNode.parent.dispatchEvent("addNewNode", newNode)
}