import NavHistory from '../navhistory.mjs'
import configValues from './cfg/main.mjs'

const myNavHistory = new NavHistory(configValues.initUrlSearch)

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
