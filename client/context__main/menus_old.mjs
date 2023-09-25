// Esto debería hacerse con pages!!

import {setMenus as funcSetMenus, docView as funcDocView} from '../../menus.mjs'

let myGetSiteText, myWebUser, myGetActiveInGroup, myCreateInstanceChildText, myPushHistoryState

export function settings(getSiteText, webuser, getActiveInGroup, createInstanceChildText, pushHistoryState){
  myGetSiteText=getSiteText, myWebUser=webuser, myGetActiveInGroup=getActiveInGroup, myCreateInstanceChildText=createInstanceChildText, myPushHistoryState=pushHistoryState
}

export function docView(menuNode){
  funcDocView(menuNode, myPushHistoryState)
}

export function setMenus(){
  return funcSetMenus(myGetSiteText, myWebUser, myGetActiveInGroup, myCreateInstanceChildText)
}