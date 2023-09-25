import {pathJoin} from './urlutils.mjs'
// This function serves to add "scope" and prepare an html template or a dom element.
// In case is a dom element it will actually render scripts but if it is a template untill it is actually inserted int the dom the scrips are not executed
// node.render(domelement), node.render(scriptelement)
// Note: when the tp content is inserter at dom, tp content becomes a void element, I think
export default function prepareTpScripts(tp /*document fragment or template element*/, params={}, thisAppFolder) {
  if (tp.nodeType==1 && tp.tagName=="TEMPLATE") tp=tp.content // It accepts templates and document fragments
  //tp=tp.cloneNode(true) // we copy tp to not modify the original template, this is for the setchildrenview but I think it is deprecated
  if (tp.nodeType!=11) throw new Error('The element to render is not a template content')
  Array.from(tp.querySelectorAll("SCRIPT")).forEach(scriptElement => {
    //To avoid script execution limitation for the request we make a copy of the script to a "brand new" script node
    //Also to execute script <script> for an already loaded element when we use render
    const myScript=document.createElement("SCRIPT")
    for (const at of scriptElement.attributes) {
      myScript.setAttribute(at.name, at.value);
    }
    //adding scope (encapsulation) so this variables are local and can't be modified from another scripts.
    //Also async type allows awiat in scripts
    myScript.textContent=`(async (firstElement, thisElement, thisParams, thisAppFolder, pathJoin, ${Object.keys(params).toString()})=>{${scriptElement.textContent}})(document.currentScript._firstElement, document.currentScript.previousElementSibling, document.currentScript._thisParams, document.currentScript._thisAppFolder, document.currentScript._pathJoin, ${Object.keys(params).map(pKey=>`document.currentScript._thisParams.${pKey}`).toString()})`
    myScript._thisParams=params
    myScript._thisAppFolder=thisAppFolder
    myScript._pathJoin = pathJoin
    myScript._firstElement = tp.firstElementChild
    const container=scriptElement.parentNode  // !!Document Fragment is not an Element => *parentNode*
    container.insertBefore(myScript, scriptElement)
    container.removeChild(scriptElement)
  })
  return tp
}
// ** This is experimental way, there are still problems because it introduces the view-element node in between and sometimes we require a direct child: <select> <option>
// because it introduces an extra Dom node (view-elemnent) and the template scripts are not aware of it
// Use: document.createElement('view-element').render(tp, thisNode, params)
// El uso de shadow dom está por ahora imposibilitado ya que no acepta el uso de document.currentScript, necesitaríamos una manera de acceder al script desde el script
// El shadow también tiene cierto interes porque permite añadir independencia: estilos independientes de la hoja de estilos principal y quizás también crea automaticamente encapsulation a los scripts
// https://developer.mozilla.org/en-US/docs/Web/Web_Components
/*
customElements.define(
  "view-element",
  class extends HTMLElement {
    constructor(){
      super()
      //const shadowRoot = this.attachShadow({mode: "open"})
      //shadowRoot.id=new Date().getTime().toString(32).substring(3);
      //shadowRoot.scripts=[]
    }
    // tp document fragment or template element
    prepareTpScripts(tp , thisNode, params={}, thisAppFolder, getDataBranch) {
      this._thisNode=thisNode
      this._thisParams=params
      this._thisAppFolder=thisAppFolder
      this._getDataBranch=getDataBranch // ** deprecated
      this._pathJoin=pathJoin
      
      if (tp.nodeType==1 && tp.tagName=="TEMPLATE") tp=tp.content // we work with template content
      if (tp.nodeType!=11) throw new Error('The element to render is not a template')
      
      Array.from(tp.querySelectorAll("SCRIPT")).forEach(scriptElement => {
        //To avoid script execution limitation for the request we make a copy of the script to a "brand new" script node
        //Also to execute script <script> for an already loaded element when we use render
        const myScript=document.createElement("SCRIPT");
        for (const at of scriptElement.attributes) {
          myScript.setAttribute(at.name, at.value);
        }
        //const currentScriptNum = this.shadowRoot.scripts.push(myScript) - 1;
        //adding scope (encapsulation) so this variables are local and can't be modified from another scripts.
        //Also async type allows awiat in scripts
        // *** No funciona document.currentScript, debe ser pr encontrarse en el shadow
        // Quiza se pueda crear un id para cada script
        myScript.textContent=`(async (thisElement, thisNode, thisParams, thisAppFolder, getDataBranch, pathJoin)=>{${scriptElement.textContent}})(document.currentScript.previousElementSibling, document.currentScript.closest('view-element')._thisNode, document.currentScript.closest('view-element')._thisParams, document.currentScript.closest('view-element')._thisAppFolder, document.currentScript.closest('view-element')._getDataBranch, document.currentScript.closest('view-element')._pathJoin)`;

        //myScript.textContent=`(async (thisElement, thisNode, thisParams)=>{${scriptElement.textContent}})(document.getElementById('${this.shadowRoot.id}').scripts[${currentScriptNum}].previousElementSibling, document.getElementById('${this.shadowRoot.id}').thisNode, document.getElementById('${this.shadowRoot.id}').thisParams);`;
        //this.shadowRoot.thisNode=thisNode;
        //this.shadowRoot.thisParams=params;

        const container=scriptElement.parentNode;  // !!Document Fragment is not an Element => *parentNode*
        container.insertBefore(myScript, scriptElement);
        container.removeChild(scriptElement);
      });
      //this.shadowRoot.appendChild(tp)
      this.appendChild(tp)
      return this
    }
  }
)
*/