import {getDomElementFromChild} from './frontutils.js';

export function unsetActiveChild(myNode) {
  const setUnselected= function(element) {
    element.classList.remove("selected");
  }
  myNode.selected=false;
  const mydom=getDomElementFromChild(myNode);
  let hbutton=null;
  if (mydom) {
    if (mydom.getAttribute("data-hbutton")) hbutton=mydom;
    else hbutton=mydom.querySelector("[data-hbutton]");
    if (hbutton) {
      setUnselected(hbutton);
    }
  }
}

export function unsetActive(myNode) {
  if (!myNode) return false;
  myNode.activeChildren=null;
  //unselect brothers
  let i= myNode.children.length;
  while(i--) {
    if (myNode.children[i].selected) {
      unsetActiveChild(myNode.children[i]);
      unsetActive(myNode.children[i].getRelationship(myNode.props.name));
    }
  }
}

export function setActiveChild(myNode) {
  const setSelected = function(element) {
    element.classList.add("selected");
  }
  //unselect brothers
  if (myNode.parentNode) {
    let i= myNode.parentNode.children.length;
    while(i--) {
      if (myNode.parentNode.children[i].selected) {
        if (myNode.parentNode.children[i]!=myNode) {
          unsetActiveChild(myNode.parentNode.children[i]);
          unsetActive(myNode.parentNode.children[i].getRelationship(myNode.props.name));
        }
      }
    }
    myNode.parentNode.activeChildren=myNode;
  }
  //selection of the node
  myNode.selected=true;
  const mydom=getDomElementFromChild(myNode);
  let hbutton=null;
  if (mydom) {
    if (mydom.getAttribute("data-hbutton")) hbutton=mydom;
    else hbutton=mydom.querySelector("[data-hbutton]");
    if (hbutton) {
      setSelected(hbutton);
    }
  }
}

export function setActive(myNode) {
  //we select the node as selected and unselect the brothers:
  setActiveChild(myNode);
  //Now we must unselect all the up nodes except its parental branch
  const myRoot=myNode.getrootnode();
  if (myRoot.detectMyGender()=="female") myRoot=myRoot.children[0];
  let myPointer=myNode;
  while (myPointer && myPointer!=myRoot) {
    const myParent=myPointer.parentNode;
    const mySelf=myPointer;
    if (myParent) myPointer=myParent.partnerNode;
    if (myPointer && !myPointer.selected) {
      //uselect selecteds children
      //find the selected
      let mySelected=false;
      let i= myParent.children.length;
      while(i--) {
        if (myParent.children[i].selected==true) {
          mySelected=myParent.children[i];
        }
      }
      if (mySelected!=mySelf) {
        unsetActive(mySelected.getRelationship(myParent.props.name));
      }
      setActiveChild(myPointer);
    }
  }
}