
export function getDomElementFromChild(myNode) {
  if (!myNode.parentNode || !myNode.parentNode.childContainer) return false;
  // This method only works well in wrapped templates
  // We have a child and the container is at the parent.
  const skey=myNode.parentNode.getMySysKey('sort_order');
  // if no skey order it will not change
  const children=myNode.parentNode.children.sort((a,b)=>a.props[skey]-b.props[skey]);
  let elementChildren=[];
  const invalidTags=['SCRIPT', 'TEMPLATE'];
  for (const elementChild of myNode.parentNode.childContainer.children) {
    if (invalidTags.includes(elementChild.tagName)) continue;
    elementChildren.push(elementChild);
  }
  for (const i in children) {
    if (children[i]==myNode) {
      return elementChildren[i];
    }
  }
}

export function getDomElementFromProp(myNode, prop) {
  if (!myNode.parentNode || !myNode.parentNode.propsContainer) return false;
  // This method only works well in wrapped templates
  // We have a child and the container is at the parent.

  // if no skey order it will not change
  const porpsKeys= myNode.parentNode.childtablekeys;
  let elementProps=[];
  const invalidTags=['SCRIPT', 'TEMPLATE'];
  for (const elementProp of myNode.parentNode.porpsContainer.children) {
    if (invalidTags.includes(elementProp.tagName)) continue;
    elementProps.push(elementProp);
  }
  for (const i in porpsKeys) {
    if (porpsKeys[i]==prop) {
      return elementProps[i];
    }
  }
}

export function visibleOnMouseOver(arg){
  var valueOn=1;
  var valueOff=0;
  if (arg.method=='visibility') {
    valueOn='visible';
    valueOff='hidden';
  }
  else arg.method='opacity';
  var parentElement=arg.parent;
  var myElement=arg.element;
  myElement.style[arg.method]=valueOff;
  const setVisible=function(ev){
    myElement.style[arg.method]=valueOn;
  }
  const setHidden=function(ev){
    myElement.style[arg.method]=valueOff;
  }
  myElement.addEventListener("mouseover", setVisible);
  myElement.addEventListener("mouseout", setHidden);
  parentElement.addEventListener("mouseover", setVisible);
  parentElement.addEventListener("mouseout", setHidden);
}

export function setSizeFromStyle(myElement) {
  var imageSrc=window.getComputedStyle(myElement).backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2').split(',')[0];
  var image = new Image();
  image.onload = function(){
    var width =image.width;
    var height = image.height;
    if (width && height) {
      myElement.style.width=width + 'px';
      myElement.style.height=height + 'px';
      return true;
    }
  };
  image.src = imageSrc;
}

export function switchVisibility(velement) {
  if (velement.style.visibility=="hidden") {
    velement.style.visibility="visible";
  }
  else {
    velement.style.visibility="hidden";
  }
}
  
export function createQuantitySelect(limit){
  if (!limit) limit=25;
  var myselect=document.createElement("select");
  for (var i=0; i<limit; i++) {
    var myoption=document.createElement("option");
    myoption.innerHTML=i+1;
    myoption.value=i+1;
    myselect.add(myoption);
  }
  return myselect;
}