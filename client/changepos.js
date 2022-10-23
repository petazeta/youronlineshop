import {getDomElementFromChild} from './frontutils.js';

export default function changePos(currentNode, increment) {
  const skey=currentNode.parent.getSysKey('sort_order');
  const currentSortOrder=currentNode.props[skey];
  const nextSortOrder=currentSortOrder + increment;
  if (nextSortOrder <= 0) return false;
  if (nextSortOrder > currentNode.parent.props.total) return false;
  const currentElement=getDomElementFromChild(currentNode);
  const nextNode = currentNode.parent.children.find(child=>child.props[skey]==nextSortOrder);
  currentNode.props[skey]=nextSortOrder;
  let nextElement;
  if (nextNode) {
    nextElement=getDomElementFromChild(nextNode);
    nextNode.props[skey]=currentSortOrder;
  }
  if (nextElement && currentElement){
    swapElement(currentElement, nextElement);
  }
  else currentNode.parent.setChildrenView();
  return nextSortOrder;
}

function swapElement (aElement, bElement) {
  const parentElement=aElement.parentElement;
  const tempElement=aElement.cloneNode();
  parentElement.insertBefore(tempElement, aElement);
  parentElement.insertBefore(aElement, bElement);
  parentElement.insertBefore(bElement, tempElement);
  parentElement.removeChild(tempElement);
}