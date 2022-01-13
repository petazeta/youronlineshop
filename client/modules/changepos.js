import {getDomElementFromChild} from './frontutils.js';

export default function changePos(currentNode, increment, onChgOrder) {
  let skey=currentNode.parentNode.getMySysKey('sort_order');
  const currentSortOrder=currentNode.props[skey];
  const nextSortOrder=currentSortOrder + increment;
  if (nextSortOrder > currentNode.parentNode.children.length || nextSortOrder <= 0) return false;
  
  const currentElement=getDomElementFromChild(currentNode);
  let nextNode, nextElement;
  for (const child of currentNode.parentNode.children) {
    if (child.props[skey]==nextSortOrder) {
      nextNode=child;
      break;
    }
  }
  if (nextNode) nextElement=getDomElementFromChild(nextNode);
  
  currentNode.props[skey]=nextSortOrder;
  nextNode.props[skey]=currentSortOrder;
  
  if (onChgOrder) onChgOrder(currentNode, increment);
  else if (nextElement && currentElement){
    swapElement(currentElement, nextElement);
  }
  else currentNode.parentNode.setChildrenView();
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