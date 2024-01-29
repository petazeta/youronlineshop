// import {walkThrough} from '../shared/utils.mjs'
import {selectorFromAttr} from './frontutils.mjs'

// Basic operative functions:
function unsetActiveChild(myNode) {
  myNode.selected=false
  unHighLight(myNode)
}
function setActiveChild(myNode) {
  myNode.selected=true
  highLight(myNode)
}

export function highLight(myNode){
  const myContainer = myNode.firstElement
  if (!myContainer)
    return
  const highLightElement = selectorFromAttr(myContainer, "data-highlight") || selectorFromAttr(myContainer, "data-value")
  if (!highLightElement)
    return
  highLightElement.classList.add("selected")
}

export function unHighLight(myNode){
  console.log("unHighLight", myNode)
  const myContainer=myNode.firstElement
  if (!myContainer)
    return
  const highLightElement = selectorFromAttr(myContainer, "data-highlight") || selectorFromAttr(myContainer, "data-value")
  if (!highLightElement)
    return
  highLightElement.classList.remove("selected")
}

// Main function
export function setActive(myNode) {
  // We first unselect the entire tree
  unselectEntireMainTree(myNode)
  // Now we select the node and upwards if relationship is the same
  console.log("set Active", myNode)
  setActiveChild(myNode)
  // !myPointer.parent.partner.parent.props.name for case when parent data is not complet because we make a short cut not loading it from database
  for (
    let myPointer = myNode.parent?.partner;
    myPointer?.parent && (!myPointer.parent.props.name || myPointer.parent.props.name == myNode.parent.props.name);
    myPointer = myPointer.parent.partner
  ) {
      //ascendentsList.push(myPointer)
      setActiveChild(myPointer)
      console.log("set active", myPointer)
  }
  /*
  for (const elm of ascendentsList.reverse()) {
    setActiveChild(elm)
    console.log("set active", elm)
  }*/
}
// Unselects nodes from up and down
function unselectEntireMainTree(myNode) {
  unsetActiveChild(myNode)
  for (
    let myPointer = myNode.parent?.partner;
    myPointer?.parent && (!myPointer.parent.props.name || myPointer.parent.props.name == myNode.parent.props.name);
    myPointer = myPointer.parent.partner
  ) {
    let selectedChild = myPointer.parent.children.find(child=>child.selected) // for more than one selected use filter instead of find
    if (selectedChild) {
      unsetActiveChild(selectedChild)
      console.log("unset active", selectedChild)
    }
  }
}

// when there are active groups
export class ActiveGroups{
  constructor(){
    this.activeGroups=new Map()
  }
  getActiveInGroup(groupName) {
    return this.activeGroups.get(groupName);
  }
  setActiveInGroup(newActive, groupName) {
    const lastActive=this.activeGroups.get(groupName)
    if (lastActive===newActive) {
      setActive(newActive)
      return
    }
    if (lastActive?.selected)
      unselectEntireMainTree(lastActive)
    this.activeGroups.set(groupName, newActive)
    setActive(newActive)
  }
}
