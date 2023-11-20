//import {makeRequest} from './request.mjs'
/*
Condvendria transformar la request the post a get para mejorar un poco la eficiencia, get is cacheable y post no
Por tanto los parámetros deberían ser searchkeys
*/

/* quiero quitar los valores de configuracion en la llamada del constructor, es mejor que estos valores se manden
directamente a cada uno de los metodos por la funcion de contexto
además ya no hacen falta skinId y subSkinId porque se mandan en el url*/

// This class serves as a continer of the templates
export default class SiteLayouts {
  constructor(){
    this.tpList=new Map() // It contains (tpId, tpElement)
    /*
    this.skinId=skinId // old
    this.subSkinId=subSkinId // old
    this.styleId=styleId // old
    this.requestUrlPath=requestUrlPath // old
    */
  }
  async getTemplates(layoutsUrlPath) {
    if (this.tpList.size==0) {
      await this.loadTemplates(layoutsUrlPath)
    }
    return this.tpList
  }
  async getTemplate(layoutsUrlPath) {
    const tpId = new URL(layoutsUrlPath, "http://localhost").searchParams.get("tp")
    if (!tpId)
      throw new Error("no tpId")
    if (!this.tpList.has('tp_' + tpId)) { // For dev purpose we could skip the if statement so it loads templates from file
      await this.loadTemplates(layoutsUrlPath)
    }
    const tpElement = this.tpList.get('tp_' + tpId); // templates have "tp" prefix
    const newElement = tpElement.cloneNode(true)
    newElement.id = null
    return newElement.content
  }
  async getStyles(layoutsUrlPath) {
    return this.loadStyles(layoutsUrlPath);
  }
  async loadTemplates(layoutsUrlPath) {
    // loading skin templates
    const myParent=document.createElement("div")
    myParent.innerHTML= await makeRequest(layoutsUrlPath)
    // This iteration gets just the direct child templates (templates could have another child templates)
    while (myParent.childNodes.length > 0) {
      if (myParent.childNodes[0].tagName=="TEMPLATE")
        this.tpList.set(myParent.childNodes[0].id, myParent.childNodes[0])
      myParent.removeChild(myParent.childNodes[0])
    }
    return this.tpList
  }
  /*
  async loadTemplate(layoutsUrlPath, subSkinId) { // ??
    return this.loadTemplates(layoutsUrlPath, tpId)
  }
  */
  async loadStyles(layoutsUrlPath) {
    const myParent=document.createElement("div");
    myParent.innerHTML = await makeRequest(layoutsUrlPath);
    for (const style of myParent.querySelectorAll("style")) {
      document.head.appendChild(style);
    }
  }
}
// Helper
function makeRequest(layoutsUrlPath) {
  return fetch(layoutsUrlPath)
  .then(res => {
    if (!res?.ok)
      throw new Error("Error server: layout")
    return res.text()
  })
}
// In the history version we can find another approach that is obsolete but contains methods to change the current style, It could be useful if we want to add this functionality in future: change style at the current site (without reloading)