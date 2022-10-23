
export function getDomElementFromChild(myNode) {
  if (!myNode.parent || !myNode.parent.childContainer) return false;
  // This method only works well in wrapped templates
  // We have a child and the container is at the parent.
  const skey=myNode.parent.getSysKey('sort_order');
  // if no skey order it will not change
  const children=myNode.parent.children.sort((a,b)=>a.props[skey]-b.props[skey]);
  return Array.from(myNode.parent.childContainer.children).filter((child)=>!['SCRIPT', 'TEMPLATE'].includes(child.tagName))[children.indexOf(myNode)];
}

// NOT REVISED:

export function visibleOnMouseOver(myElement, parentElement, method='opacity'){
  let valueOn=1;
  let valueOff=0;
  if (method=='visibility') {
    valueOn='visible';
    valueOff='hidden';
  }
  myElement.style[method]=valueOff;
  const setVisible=()=>myElement.style[method]=valueOn;
  const setHidden=()=>myElement.style[method]=valueOff;

  myElement.addEventListener("mouseover", setVisible);
  myElement.addEventListener("mouseout", setHidden);
  parentElement.addEventListener("mouseover", setVisible);
  parentElement.addEventListener("mouseout", setHidden);
}

export function setSizeFromStyle(myElement) {
  const image = new Image();
  image.onload = function(){
    if (image.width && image.height) {
      myElement.style.width=image.width + 'px';
      myElement.style.height=image.height + 'px';
      return true;
    }
  };
  image.src = window.getComputedStyle(myElement).backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2').split(',')[0];
}

export function switchVisibility(velement) {
  velement.style.visibility=="hidden" ? velement.style.visibility="visible" : velement.style.visibility="hidden";
}
  
export function createQuantitySelect(limit){
  if (!limit) limit=25;
  const myselect=document.createElement("select");
  new Array(limit).fill(undefined).map((value, i)=>{
    const myoption=document.createElement("option");
    myoption.innerHTML=i+1;
    myoption.value=i+1;
    return myoption;
  }).forEach(opt=>myselect.add(opt));
  return myselect;
}