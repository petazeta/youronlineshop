export const activeGroups=new Map();

// Basic operative functions:
function unsetActiveChild(myNode) {
  myNode.selected=false;
  unHighLight(myNode);
}
function setActiveChild(myNode) {
  myNode.selected=true;
  highLight(myNode);
}

export function highLight(myNode){
  if (!myNode.highLightElement) return;
  myNode.highLightElement.classList.add("selected");
}

export function unHighLight(myNode){
  if (!myNode.highLightElement) return;
  myNode.highLightElement.classList.remove("selected");
}

// Main function
export function setActive(myNode) {
  // We first unselect the entire tree
  unselectEntireTree(myNode);
  // Now we select the node and upwards
  innerActivate(myNode);
  // We propagate the selection up to parents
  function innerActivate(myNode) {
    setActiveChild(myNode);
    if (myNode.parent?.partner) innerActivate(myNode.parent.partner)
  }
}
// Unselects nodes from up and down
function unselectEntireTree(myNode) {
  const myRoot=myNode.getRoot();
  if (!myRoot) return;
  if (!myRoot.detectLinker()) {
    unsetActiveChild(myRoot);
    myRoot.relationships.forEach(rel=>innerUnselect(rel));
  }
  else innerUnselect(myRoot);
  function innerUnselect(parent) {
    const mySelected=parent.children.find(child=>child.selected);
    if (!mySelected) return;
    unsetActiveChild(mySelected);
    mySelected.relationships.forEach(rel=>innerUnselect(rel));
  }
}

// when there are active groups
export function setActiveInGroup(groupName, newActive) {
  const lastActive=activeGroups.get(groupName);
  if (lastActive===newActive) {
    setActive(newActive);
    return;
  }
  if (lastActive?.selected) unselectEntireTree(lastActive);
  activeGroups.set(groupName, newActive);
  setActive(newActive);
}

export function getActiveInGroup(groupName) {
  return activeGroups.get(groupName);
}
