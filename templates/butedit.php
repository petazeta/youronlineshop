<!--

  var thisProperty
  var editElement
  var inlineEdition
  var thisAttribute
  var autoeditFunc
  image=normal / code
  
  it uses data-id=butedit y data-id=admnbuts at containers for buttons to hidde buttons meanwhile editing
-->
<div>
  <button type="button" class="butedit" style="display:none" data-id="normbut">
    <div class="editimage"></div>
    <script>
      if (window.getComputedStyle(thisElement).backgroundImage) {
        DomMethods.setSizeFromStyle(thisElement);
      }
    </script>
  </button>
  <button type="button" class="buteditcode" style="display:none" data-id="codebut">
    <div class="editcodeimage"></div>
    <script>
      if (window.getComputedStyle(thisElement).backgroundImage) {
        DomMethods.setSizeFromStyle(thisElement);
      }
    </script>
  </button>
</div>
<script>
  //normalize
  var thisProperty=thisParams.thisProperty;
  var editElement=thisParams.editElement;
  var thisAttribute=thisParams.thisAttribute;
  var inlineEdition=thisParams.inlineEdition;

  var buttonElement=thisElement.querySelector('button[data-id=normbut]');
  if (thisParams.image=='code') {
    buttonElement=thisElement.querySelector('button[data-id=codebut]');
  }
  buttonElement.style.display='block';

  if (!thisProperty) {
    // git first property different from id
    var keys=Object.keys(thisNode.properties);
    if (thisNode.parentNode && thisNode.parentNode.childtablekeys && thisNode.parentNode.childtablekeys.length>0) {
      keys=thisNode.parentNode.childtablekeys;
    }
    thisProperty = keys.find(key => key!='id');
  }
  if (!thisAttribute) {
    if (editElement.tagName=='INPUT' || editElement.tagName=='TEXTAREA') thisAttribute="value";
    else thisAttribute="textContent";
  }
  if (typeof thisParams.autoeditFunc=="function") buttonElement.onclick=function() {
    thisNode.addEventListener("finishAutoEdit", changeProperty, "autoedit");
    thisParams.autoeditFunc.call(thisNode, thisParams);
  }
  else {
    function setVisibilityButtons(vis){
      function changeVisibility(buts, vis){
        for (var i=0; i<buts.length; i++) {
          buts[i].style.visibility=vis;
        }
      }
      var editbuts=editElement.parentElement.querySelectorAll("[data-id=butedit]");
      changeVisibility(editbuts, vis);
      var admnbuts=editElement.parentElement.querySelectorAll("[data-id=admnbuts]");
      changeVisibility(admnbuts, vis);
    }
    var activeEdition=function(){
      //removing Config.onEmptyValueText => property is null
      if (editElement[thisAttribute]==Config.onEmptyValueText && thisNode.properties[thisProperty]!=Config.onEmptyValueText) {
        editElement[thisAttribute]="";
      }
      editElement.setAttribute("contenteditable","true");
      editElement.classList.remove("contenteditableactive");
      if (editElement.disabled==true) editElement.disabled=false;
      if (editElement.type=='hidden') editElement.type='text';
      // Hide admin buttons when write
      setVisibilityButtons("hidden");
      editElement.focus();
    };
    var unActiveEdition=function() {
      //For empty values lets put some content in the element
      if (editElement[thisAttribute]=="") {
        editElement[thisAttribute]= Config.onEmptyValueText;
      }
      editElement.setAttribute("contenteditable","false");
      editElement.classList.remove("contenteditableactive");
      if (editElement.disabled===false) editElement.disabled=true;
      //Set visible edit and admin buttons
      setVisibilityButtons("visible");
    };
    var listenerIntroKey=function(e) {
        introKey(e, finishEdition);
    };
    var finishEdition=function(){
      changeProperty();
      unActiveEdition();
      if (!(inlineEdition===false)) {
        //disable Intro keyCode for new Line and enable it for submith
        editElement.removeEventListener('keydown', listenerIntroKey);
      }
      editElement.removeEventListener("blur", finishEdition);
    };
    
    buttonElement.addEventListener('click', (event) => {
      event.preventDefault();
      activeEdition();
      if (!(inlineEdition===false)) {
        //disable Intro keyCode for new Line and enable it for submith
        editElement.addEventListener('keydown', listenerIntroKey);
      }
      editElement.addEventListener("blur", finishEdition);
    });
  }
  function introKey(e, callBack) {
    var key = e.which || e.keyCode;
    if (key == 13) {
      e.preventDefault(); //Not to submit but I think it doesn't work
      callBack();
    }
  };
  function changeProperty(){
    return new Promise((resolve, reject)=>{
      var elementValue=null;
      if (editElement.getAttribute(thisAttribute)!==null && thisAttribute!="value") elementValue=editElement.getAttribute(thisAttribute);
      // src, href we want the relative address (attribute rather than property) but for value we want the actual value (proerty rather than attribute
      else elementValue=editElement[thisAttribute];
      if (thisNode.properties[thisProperty] != elementValue) { //just when content change and not void
        thisNode.loadfromhttp({action:"edit my properties", properties:{[thisProperty]: elementValue}}).then(function(myNode){
          myNode.properties[thisProperty]=elementValue;
          myNode.dispatchEvent("changeProperty", [thisProperty]);
          resolve(myNode);
        });
      }
      else {
        thisNode.dispatchEvent("changeProperty", [thisProperty]);
        resolve(thisNode);
      }
    });
  };
</script>