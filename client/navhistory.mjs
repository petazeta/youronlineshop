import {observableMixin, observerMixin} from './observermixin.mjs';

export default class NavHistory {
  constructor(initalNavSearch) {
    this.navigationObservable = new (observableMixin(Object)) // Object == Class {}
    this.initalNavSearch = window.location.search || initalNavSearch
    window.onpopstate = (event) => {
      const url = event.state ? event.state.url : window.location.search
      this.navigationObservable.notifyObservers("history event", new URL(url, 'http://localhost'))
    }
  }
  async setNav(myNode, paramskey, paramsKeys, butAction) {
    const url = extractSearchParamsUrl(myNode, paramskey, paramsKeys)
    if (!myNode.setReaction) {
      // add observer prototype
      const MyNodeClass = observerMixin(myNode.constructor)
      Object.setPrototypeOf(myNode, MyNodeClass.prototype) // adding observers characteristics
      observerMixin(Object).prototype.initObserver.call(myNode)
    }
    this.navigationObservable.attachObserver("history event", myNode)
    myNode.setReactionOnce("history event", (stateUrlObject)=>{
      // Falta ignorar lo de pagination
      const myUrlSearchParams = new URL(url, 'http://localhost').searchParams
      const myUrlMatch = Array.from(myUrlSearchParams).every(([key, value])=>stateUrlObject.searchParams.get(key)===value)
      const stateUrlMatch = Array.from(stateUrlObject.searchParams).every(([key, value])=>myUrlSearchParams.get(key)===value)
      // only total match will produce the action
      if (myUrlMatch && stateUrlMatch)
        butAction(myNode)
    })
  }
  pushNav(myNode, paramskey, paramsKeys){
    const url = extractSearchParamsUrl(myNode, paramskey, paramsKeys)
    this.initalNavSearch = null // Ending the initial search procedure when clicking any state element.
    if (!(window.history.state?.url===url))
      history.pushState({url:url}, null, url) //it doesn't record state when: go back (dont state twice the same url)
  }
  async initialNavSearch(myNode, paramskey, paramsKeys, butAction){
    const url = extractSearchParamsUrl(myNode, paramskey, paramsKeys)
    console.log("initialNavUrlProcedure", myNode)
    if (!this.initalNavSearch)
      return
    const initUrlParams = new URL(this.initalNavSearch, 'http://localhost').searchParams
    const myUrlParams = new URL(url, 'http://localhost').searchParams
    const myMatch = Array.from(myUrlParams).every(([key, value])=>initUrlParams.get(key)===value)
    // Partial match would produce the action
    if (myMatch) {
      if (Array.from(initUrlParams).every(([key, value])=>myUrlParams.get(key)===value))
        this.initalNavSearch = null // A total match will end the initial nav url procedure
      console.log("initialNavUrlProcedure", myNode.props)
      await butAction(myNode)
    }
  }
  // this is rarely used, maybe check for removing
  dispatchPopStateEvent(url, grab=true){
    dispatchEvent(new PopStateEvent('popstate', {state: {url: url},  url: url }))
    if (grab)
      this.pushHistoryState(url)
  }
  
  // It sets a default initial search params in case no other searchs or config search has been defined
  setDefaultInitNavSearch(altNavSearch) {
    if (!this.initalNavSearch)
      this.initalNavSearch = altNavSearch
  }
}

// Helpers

// It calculates the SearchParams url
function extractSearchParamsUrl(myNode, searchParamKey, searchParamsKeys){
  let currentNode = myNode
  const level = searchParamsKeys.indexOf(searchParamKey)
  const searchParams = []
  for (let i=level; i>=0; i--) {
    if (currentNode.props.id)
      searchParams.unshift(`${searchParamsKeys[i]}=${currentNode.props.id}`)
    else
      searchParams.unshift(`${searchParamsKeys[i]}=true`)
    if (Array.isArray(currentNode.parent))
      currentNode = currentNode.parent[0]?.partner
    else
      currentNode = currentNode.parent?.partner
  }
  return "?" + searchParams.join('&')
}