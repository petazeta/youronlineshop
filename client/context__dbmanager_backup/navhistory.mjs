import NavHistory from '../navhistory.mjs'
import {config} from './cfg.mjs'

const myNavHistory = new NavHistory(config.get("init-url-search"))

export function setNav(myNode, paramskey, paramsKeys, butAction){
  return myNavHistory.setNav(myNode, paramskey, paramsKeys, butAction)
}
export function initialNavSearch(myNode, paramskey, paramsKeys, butAction){
  return myNavHistory.initialNavSearch(myNode, paramskey, paramsKeys, butAction)
}
export function pushNav(myNode, paramskey, paramsKeys){
  return myNavHistory.pushNav(myNode, paramskey, paramsKeys)
}
export function dispatchPopStateEvent(url, grab=true){
  return myNavHistory.dispatchPopStateEvent(url, grab)
}
export function setDefaultInitNavSearch(altNavSearch){
  return myNavHistory.setDefaultInitNavSearch(altNavSearch)
}
