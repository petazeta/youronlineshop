import config from './cfg/main.mjs'
import SiteLayout from '../layouts.mjs'

// const {skinId, subSkinId, styleId, layoutsUrlPath, requestUrlPath} = config // old requestUrlPath -> very old
const {layoutsUrlPath} = config

// const myLayout = new SiteLayout(skinId, subSkinId, styleId, requestUrlPath)
const myLayout = new SiteLayout()

const layoutsUrlPathName = new URL(layoutsUrlPath, "http://localhost").pathname
const searchParams = new URL(layoutsUrlPath, "http://localhost").searchParams


// Esta función toma todos los templates del skin del servidor. Se ejectua en la inicialización del cliente
export function getTemplates(){
  const mySp = new URLSearchParams()
  searchParams.get("skin") && mySp.append("skin", searchParams.get("skin"))
  searchParams.get("subskin") && mySp.append("subskin", searchParams.get("subskin"))
  return myLayout.getTemplates(layoutsUrlPathName + "?" + mySp.toString())
}

// it returns tpelement.content
export function getTemplate(tpId){
  if (!tpId)
    throw new Error("no tpId")
  const mySp = new URLSearchParams()
  searchParams.get("skin") && mySp.append("skin", searchParams.get("skin"))
  searchParams.get("subskin") && mySp.append("subskin", searchParams.get("subskin"))
  mySp.append("tp", tpId)
  return myLayout.getTemplate(layoutsUrlPathName + "?" + mySp.toString())
}

export function getStyles(){
  const mySp = new URLSearchParams()
  searchParams.get("skin") && mySp.append("skin", searchParams.get("skin"))
  searchParams.get("subskin") && mySp.append("subskin", searchParams.get("subskin"))
  mySp.append("style",searchParams.get("style") || "main") // ** Default Style **. It needs to be sent to indicate we are getting styles
  return myLayout.getStyles(layoutsUrlPathName + "?" + mySp.toString())
}