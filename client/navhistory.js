import {observableMixin, observerMixin, observerMixinConstructorCallable} from './observermixin.js';

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

export function dispatchPopStateEvent(url, grab=false){
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