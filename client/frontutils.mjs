export function getChildViewElmts(myNode) {
  const myParent = myNode.parent
  if (!myParent || !myParent.childContainer) return false
  const numElmts=myParent.children.length && myParent.childContainer.childElementCount / myParent.children.length
  const viewElements=[myNode.firstElement]
  for (let i=1; i<numElmts; i++) {
    console.log(viewElements[i-1], i)
    viewElements.push(viewElements[i-1].nextElementSibling)
  }
  return viewElements
}

// DOM utilities

// Switching visibility on visibleElement when there is an on mouse over event on it or on onOverElement
// Setting myElement status on some event on it and on another element, usually the parent.
export function visibleOnMouseOver(visibleElement, onOverElement){
  function setVisOn(){
    visibleElement.style["opacity"] = 1
  }
  function setVisOff(){
    visibleElement.style["opacity"] = 0
  }
  setVisOff()
  visibleElement._setVisOn = setVisOn
  visibleElement._setVisOff = setVisOff
  visibleElement.addEventListener("mouseover", setVisOn)
  visibleElement.addEventListener("mouseout", setVisOff)
  onOverElement.addEventListener("mouseover", setVisOn)
  onOverElement.addEventListener("mouseout", setVisOff)
}
export function removeVisibleOnMouseOver(visibleElement, onOverElement){
  if (visibleElement._setVisOn) {
    visibleElement._setVisOn() // letting the element as in the begining
    visibleElement.removeEventListener("mouseover", visibleElement._setVisOn)
    onOverElement.removeEventListener("mouseover", visibleElement._setVisOn)
  }
  if (visibleElement._setVisOff) {
    visibleElement.removeEventListener("mouseout", visibleElement._setVisOff)
    onOverElement.removeEventListener("mouseout", visibleElement._setVisOff)
  }
}

// NOT REVISED:

export function switchVisibility_old(velement) { // use classList.toggle instead
  velement.style.visibility=="hidden" ? velement.style.visibility="visible" : velement.style.visibility="hidden";
}

// it includes elm and its children nodes in the query. attValue is optional
export function selectorFromAttr(elm, attName, attValue){
  const separator = " " // accepting multi queries like "data-admin data-value"
  if (attName.includes(separator)) {
    for (const myAttName of attName.split(" ")) {
      elm = innerSelect(elm, myAttName)
    }
    return elm
  }
  return  innerSelect(elm, attName, attValue)
  function innerSelect(elm, attName, attValue) {
    if (attValue===undefined) {
      // nodeType==11 => template content, hasAttribute not applied
      if (elm.nodeType!=11 && elm.hasAttribute(attName))
        return elm
      return elm.querySelector(`[${attName}]`)
    }
    if (elm.nodeType!=11 && elm.hasAttribute(attName) && elm.getAttribute(attName)===attValue)
      return elm
    return elm.querySelector(`[${attName}=${attValue}]`)
  }
}

// Deprecated. Can be used to set the size of an element based in the backround svg image. But we dont need it anymore, style width is setled at server css service.
export function setSizeFromStyle(myElement) {
  const image = new Image();
  image.onload = function(){
    if (image.width && image.height) {
      myElement.style.width=image.width + 'px';
      myElement.style.height=image.height + 'px';
      return true;
    }
  }
  // image.src = window.getComputedStyle(myElement).backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2'); // base64
  image.src = window.getComputedStyle(myElement).backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2').split(',')[0]; // no base64
}
// it swaps two Elements positions
export function swapElement (aElement, bElement) {
  const parentElement=aElement.parentElement
  const tempElement=aElement.cloneNode()
  parentElement.insertBefore(tempElement, aElement) // inserting a mark in the a element swaped position
  parentElement.insertBefore(aElement, bElement) // inserting a element at b element position
  parentElement.insertBefore(bElement, tempElement) // inserting b element at a element position
  parentElement.removeChild(tempElement)
}

export function onEventSetStatus(myElement, parentElement, myStatus='opacity=1:0', myEvent='mouseover/mouseout'){
  const [[method], [valueOn, valueOff]] = myStatus.split('=').map(s=>s.split(':'))
  const [eventOn, eventOff] = myEvent.split('/')
  myElement.style[method] = valueOff
  function setOn(){
    myElement.style[method]=valueOn
  }
  function setOff(){
    myElement.style[method]=valueOff
  }
  function switchStatus(){
    myElement.style[method]==valueOn ? setOff() : setOn()
  }
  if (myEvent.indexOf('/')==-1) { // myEvent => single status (switch status on event)
    myElement.addEventListener(eventOn, switchStatus)
    parentElement.addEventListener(eventOn, switchStatus)

    return // end 
  }
  myElement.addEventListener(eventOn, setOn)
  myElement.addEventListener(eventOff, setOff)
  parentElement.addEventListener(eventOn, setOn)
  parentElement.addEventListener(eventOff, setOff)
}

export function fadeIn(elm){
  elm.style.transition=`opacity 200ms`
  elm.style.opacity = 1
}
export function fadeOut(elm){
  elm.style.transition = `opacity 0ms`
  elm.style.opacity = 0
}
export function fadeInTmOut(container) {
  return new Promise((res,rej)=>{
    setTimeout(()=>{
      fadeIn(container)
      res()
    }, 50)
  })
}
export function setQttySelect(viewContainer, rangeWindowLength = 25, showRemoveOption){
  const mySelect = viewContainer.querySelector('select')
  if (rangeWindowLength == -1)
    return replaceSelect
  const sampleOption = mySelect.options[0]
  mySelect.remove(0)
  if (showRemoveOption) {
    const removeOption = sampleOption.cloneNode()
    removeOption.textContent = " 0"
    removeOption.value = "-"
    mySelect.add(removeOption)
  }
  for (let qtty=1; qtty<=rangeWindowLength; qtty++){
    let myOption = sampleOption.cloneNode()
    myOption.textContent = qtty
    myOption.value = qtty
    mySelect.add(myOption)
  }
  const plusOption = sampleOption.cloneNode()
  plusOption.textContent = " + "
  plusOption.value = "+"
  mySelect.add(plusOption)
  mySelect.addEventListener("change", ()=>{
    if (mySelect.options[mySelect.selectedIndex].value=="+") {
      replaceSelect()
    }
  })
  function replaceSelect(){
    const myField = viewContainer.querySelector('input')
    const parentElement = mySelect.parentElement
    parentElement.removeChild(mySelect)
    myField.style.visibility = "visible"
    myField.name = mySelect.name
  }
  const myField = viewContainer.querySelector('input')
  myField.addEventListener("focusout", ()=>{
    if (isNaN(myField.value)) {
      myField.value = 0
      myField.focus()
    }
    myField.value = Number.parseInt(myField.value)
  })
}