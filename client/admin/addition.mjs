// It asumes that parent node children, that is, newNode sibling nodes has the instance variable firstElement that is the view node element
export async function performAddition(newNode, extraParent, makeView) {
  // We set updateSiblingsOrder as true. By default is false because many addition doesn't needed as the imoprt procedure
  await newNode.loadRequest("add my tree", {extraParents: extraParent, updateSiblingsOrder: true})
  const skey = newNode.parent.getSysKey('sort_order')
  // update siblings sort_order when inserted in between
  if (skey && !(newNode.props[skey] > newNode.parent.children.length)) {
    // sort modifies the original
    newNode.parent.children.sort((a,b)=>a.props[skey]-b.props[skey])
    .filter(child=>child.props[skey] >= newNode.props[skey])
    .forEach(child=>child.props[skey]++)
  }
  // setting the view
  if (newNode.parent.children.length==0)
    newNode.parent.childContainer.innerHTML="" // If we add after being empty we must remove the single addition button first
  if (!newNode.parent.props.total)
    newNode.parent.props.total = 0
  newNode.parent.addChild(newNode)
  if (makeView) {
    const container = newNode.parent.childContainer
    // to be inserted just before the next sibling
    const nextSibling = skey? newNode.parent.children.find(child=>child.props[skey]==newNode.props[skey]+1)?.firstElement : undefined
    const newView = await makeView(newNode)
    nextSibling ? container.insertBefore(newView, nextSibling) : container.appendChild(newView)
  }
  newNode.parent.dispatchEvent("addNewNode", newNode)
}