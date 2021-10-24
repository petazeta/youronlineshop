
export default function edition(buttonElement, editElement, thisNode, thisProperty, thisAttribute, inlineEdition) {
  function setVisibilityButtons(vis){
    function changeVisibility(buts, vis){
      for (const but of buts) {
        but.style.visibility=vis;
      }
    }
    changeVisibility(editElement.parentElement.querySelectorAll("[data-id=butedit]"), vis);
    changeVisibility(editElement.parentElement.querySelectorAll("[data-id=admnbuts]"), vis);
  }
  const activeEdition=function(){
    editElement.setAttribute("contenteditable","true");
    editElement.classList.remove("contenteditableactive");
    if ((editElement.tagName=="INPUT" || editElement.tagName=="TEXTAREA") && editElement.disabled==true) editElement.disabled=false;
    if ((editElement.tagName=="INPUT" || editElement.tagName=="TEXTAREA") && editElement.type=='hidden') editElement.type='text';
    // Hide admin buttons when write
    setVisibilityButtons("hidden");
    editElement.focus();
  };
  const unActiveEdition=function() {
    editElement.setAttribute("contenteditable","false");
    editElement.classList.remove("contenteditableactive");
    if ((editElement.tagName=="INPUT" || editElement.tagName=="TEXTAREA") && editElement.disabled===false) editElement.disabled=true;
    //Set visible edit and admin buttons
    setVisibilityButtons("visible");
  };
  const listenerIntroKey=function(e) {
    if (e.keyCode == 13) {
      e.preventDefault(); //Not to submit but I think it doesn't work
      editElement.removeEventListener("blur", listenerBlur); //AFter keydown then blur happens
      //finishEdition
      changeProperty()
      .then(()=>{
        unActiveEdition();
        editElement.removeEventListener('keydown', listenerIntroKey);
      });
    }
  };
  const listenerBlur=function(e) {
    //finishEdition
    changeProperty()
    .then(()=>{
      unActiveEdition();
      editElement.removeEventListener("blur", listenerBlur);
    });
  };
  async function changeProperty(){
    let elementValue=null;
    if (editElement.getAttribute(thisAttribute)!==null && thisAttribute!="value") elementValue=editElement.getAttribute(thisAttribute);
    // src, href we want the relative address (attribute rather than property) but for value we want the actual value (proerty rather than attribute
    else elementValue=editElement[thisAttribute];
    if (thisNode.props[thisProperty] != elementValue) { //just when content change and not void
      const response = await thisNode.request("edit my props", {props:{[thisProperty]: elementValue}})
      if (response!=1) return false;
      thisNode.props[thisProperty]=elementValue;
    }
    thisNode.dispatchEvent("changeProperty", thisProperty);
  };
  buttonElement.addEventListener('click', (event) => {
    event.preventDefault();
    activeEdition();
    if (!(inlineEdition===false)) {
      //disable Intro keyCode for new Line and enable it for submith
      editElement.addEventListener('keydown', listenerIntroKey);
    }
    editElement.addEventListener("blur", listenerBlur);
  });
}