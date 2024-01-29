/*
This function sets some node element and its representation in edition (modification) mode. Its common use is as an onclick event handler.

When enter the edition mode some actions will be performed:
- The Dom element attribute contenteditable is set to true, this way the element content can be modified through the GUI.
- The css class content-editable-active is added to the element for styling it properly.
- The element to be edited will be focused. On onblur event the changes made will be committed.
- Editing HTML code is posible this way:
  - The edit element will be a textarea or a input.
  - We would mark this element with the attribute data-has-target (other optional marks are available, see code)
  - We would mark it as well with data-toggle, this way the element will just appear when start editing.

Parameters:
- inlineEdition: When true it doesn't allow to enter new lines.
- butsContainer: The container of the edition buttons. We need it to swith off their visibility when entering edition mode.
- dataProcesor: function to modify data previous comitting changes.
*/
export function startEdition(myNode, editElement, butsContainer, thisProperty, thisAttribute, inlineEdition, dataProcessor, containerValueElm) {
  if (!thisProperty) {
    thisProperty = myNode.parent?.getChildKeys()[0] || Object.values(myNode.props)[0]// first property
  }
  activeEdition(editElement, butsContainer)
  const setProp=()=>{
    // Emements attributes used can be: src, href, value, textContent, innerHTML.
    // In case attribute is a custom attribute we need to use getAttribute, and it would be differences between property and attribute for href attribute
    const getElmValue = (myElement, thisAttribute) => myElement[thisAttribute] === undefined ? myElement.getAttribute(thisAttribute) : myElement[thisAttribute]
    let myValue = getElmValue(editElement, thisAttribute)
    if (dataProcessor)
      myValue = dataProcessor(myValue)
    if (myValue==='')
      myValue = null
    if (myNode.props[thisProperty] != myValue) {
      changeProperty(myNode, thisProperty, myValue)
      .then(newValue=>{
        if (editElement.hasAttribute("data-has-target")) {
          const dataIdTargetValue = editElement.getAttribute("data-target-id") || "value" // for recognizing the value element when is marked differently
          const targetElm = containerValueElm.querySelector(`[data-${dataIdTargetValue}]`) || containerValueElm.parentElement.querySelector(`[data-${dataIdTargetValue}]`) || document.querySelector(`[data-${dataIdTargetValue}]`)
          const targetAttr = editElement.getAttribute("data-target-attr") || "textContent"
          targetElm[targetAttr] = editElement[thisAttribute] // if it is a custom attribute it will not work like this
        }
      })
      .catch(myE=>{
        editElement[thisAttribute] = myNode.props[thisProperty] // reset editElement changes
        throw(myE)
      })
    }
  }
  const listenerIntroKey=(e)=>{
    if (e.keyCode == 13) { // intro key
      e.preventDefault(); // For the form not to submit but I think it doesn't work
      editElement.removeEventListener("blur", listenerBlur) // disable on blur commit
      setProp()
      unActiveEdition(editElement, butsContainer)
      editElement.removeEventListener('keydown', listenerIntroKey)
    }
  }
  const listenerBlur=()=>{
    setProp()
    unActiveEdition(editElement, butsContainer)
    editElement.removeEventListener("blur", listenerBlur)
  }
  // Activating editElement finish edition procedure
  if (inlineEdition) {
    // disable Intro keyCode for new Line and enable it for submit
    editElement.addEventListener('keydown', listenerIntroKey)
  }
  editElement.addEventListener("blur", listenerBlur)
}

async function changeProperty(myNode, thisProperty, myValue){
  console.log("change in content", myNode.props[thisProperty], myValue)
  await myNode.request("edit my props", {values:{[thisProperty]: myValue}})
  myNode.props[thisProperty] = myValue
  myNode.dispatchEvent("changeProperty", thisProperty)
  return myValue
}
function setButVisibility(butsContainer, vis){
  if (!butsContainer.length) {
    butsContainer=[butsContainer]
  }
  butsContainer.forEach(myBut=>myBut.style.visibility=vis)
}
function activeEdition(editElement, butsContainer){
  // Active edition
  editElement.setAttribute("contenteditable","true");
  editElement.classList.add("content-editable-active");
  if ((editElement.tagName=="INPUT" || editElement.tagName=="TEXTAREA") && editElement.disabled==true)
    editElement.disabled = false
  // Hide admin buttons when write
  setButVisibility(butsContainer, "hidden")
  /* aqui pone el valor de placeholder pero no queremos */
  /*
  const shadowValue=editElement.getAttribute('data-placeholder');
  if (shadowValue !== null && myNode.props[thisProperty]===undefined) {
    if (editElement.hasAttribute(thisAttribute)) editElement.setAttribute(thisAttribute, shadowValue);
    else editElement[thisAttribute] = shadowValue;
  }
  */
  if (editElement.hasAttribute("data-toggle"))
    editElement.style.display="unset"

  editElement.focus()
}
function unActiveEdition(editElement, butsContainer) {
  editElement.setAttribute("contenteditable","false");
  editElement.classList.remove("content-editable-active")
  if ((editElement.tagName=="INPUT" || editElement.tagName=="TEXTAREA") && editElement.disabled===false) {
    editElement.disabled = true
  }
  if (editElement.hasAttribute("data-toggle"))
    editElement.style.display="none"
  //Set visible edit and admin buttons
  setButVisibility(butsContainer, "visible")
}