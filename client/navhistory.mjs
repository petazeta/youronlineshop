import {observableMixin, observerMixin} from './observermixin.mjs';

function extractSearchParamsUrl(myNode, searchParamKey, searchParamsKeys){
  let currentNode=myNode
  const level=searchParamsKeys.indexOf(searchParamKey)
  const searchParams=[]
  for (let i=level; i>=0; i--) {
    searchParams.unshift(`${searchParamsKeys[i]}=${currentNode.props.id}`)
    currentNode=currentNode.getParent().getPartner()
  }
  return "?" + searchParams.join('&')
}

export default class NavHistory{
  constructor(initalNavSearch){
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
      const myUrlSearchParams=new URL(url, 'http://localhost').searchParams
      const myUrlMatch=Array.from(myUrlSearchParams).every(([key, value])=>stateUrlObject.searchParams.get(key)===value)
      const stateUrlMatch=Array.from(stateUrlObject.searchParams).every(([key, value])=>myUrlSearchParams.get(key)===value)
      // only total match will produce the action
      if (myUrlMatch && stateUrlMatch) butAction(myNode)
    })
    //cuidado!! hacer initialNavUrlProcedure siempre que hacemos setNavUrl no es adecuado!! separarlo
    //await this.initialNavUrlProcedure(myNode, url, butAction)
  }
  pushNav(myNode, paramskey, paramsKeys){
    const url = extractSearchParamsUrl(myNode, paramskey, paramsKeys)
    this.initalNavSearch=null // Ending the initial search procedure when clicking any state element.
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
    if (grab) this.pushHistoryState(url)
  }
  
  // It sets a default initial search params in case no other searchs or config search has been defined
  setDefaultInitNavSearch(altNavSearch) {
    if (!this.initalNavSearch)
      this.initalNavSearch = altNavSearch
  }
}

/*
// Falta ignorar lo de pagination

const navigationObservable=new (observableMixin(Object)); // Object == Class {}

window.onpopstate = (event) => {
  let url;
  if (event.state) url = event.state.url;
  else url=window.location.search; // The url for the initial search is not setled
  navigationObservable.notifyObservers("history event", new URL(url, 'http://localhost'));
};

let initalNavSearch;

export function setHistoryState(myNode, url, butAction) {
  if (!myNode.setReaction) {
    // add observer prototype
    const MyNodeClass = observerMixin(myNode.constructor);
    Object.setPrototypeOf(myNode, MyNodeClass.prototype); // adding observers characteristics
    observerMixinConstructorCallable(myNode);
  }

  navigationObservable.attachObserver("history event", myNode);

  myNode.setReaction("history event", (stateUrlObject)=>{
    // Falta ignorar lo de pagination
    const myUrlSearchParams=new URL(url, 'http://localhost').searchParams;
    const myUrlMatch=Array.from(myUrlSearchParams).every(([key, value])=>stateUrlObject.searchParams.get(key)===value);
    const stateUrlMatch=Array.from(stateUrlObject.searchParams).every(([key, value])=>myUrlSearchParams.get(key)===value);
    // only total match will produce the action
    if (myUrlMatch && stateUrlMatch) butAction();
  });

  initialNavUrlProcedure(url, butAction);
}

export function pushHistoryState(url){
  initalNavSearch=null; // Ending the initial search procedure when clicking any state element.
  if (!(window.history.state?.url===url)) history.pushState({url:url}, null, url); //it doesn't record state when: go back (dont state twice the same url)
}

function initialNavUrlProcedure(url, butAction){
  if (initalNavSearch) {
    const initUrlParams=new URL(initalNavSearch, 'http://localhost').searchParams;
    const myUrlParams=new URL(url, 'http://localhost').searchParams;
    const myMatch=Array.from(myUrlParams).every(([key, value])=>initUrlParams.get(key)===value);
    // Partial match would produce the action
    if (myMatch) {
      if (Array.from(initUrlParams).every(([key, value])=>myUrlParams.get(key)===value)) initalNavSearch=null; // A total match will end the initial nav url procedure
      butAction();
    }
  }
}

export function dispatchPopStateEvent(url, grab=true){
  dispatchEvent(new PopStateEvent('popstate', {state: {url: url},  url: url }));
  if (grab) pushHistoryState(url);
}

export function setInitialNavSearch(initUrlSearch) {
  if (window.location.search) {
    initalNavSearch=window.location.search;
    return;
  }
  if (!initUrlSearch) return;
  initalNavSearch=initUrlSearch;
}
*/