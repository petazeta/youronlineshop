// Este patron podría ser obsoleto. Revisar patron transmitter.

// Observer pattern implementation mixin

// SE TIENE EN CUENTA AL ELIMINAR UN NODO OBSERVER QUE EN EL OBSERVABLE SE ELIMINE TAMBIEN????
// Esto además causaría que ese elemento permaneciera en memoria, quizas automatizarlo?????? como añadir una version del metodo delete children, etc...???

// Total observers list, it mantains a data register with this format: [{observer, observable, notice}, ...]
// let observers=[] // ATENCIÓN, ESTA VARIABLE CREA UN ESTADO, POR TANTO YA PASARÍA A SER CONTEXT


// observer would be an object that could change depending on observable state
// deprecated -> observerMixin(Object).prototype.initObserver.call(myObject)
export const observerMixinConstructorCallable = (myObject)=>{
  myObject._noticeReactions=new Map()
  return myObject
}
// It is importat to do any constructor task at init() and not directly at constructor
export const observerMixin = Sup => class extends Sup {
  constructor(...args) {
    super(...args)
    this.initObserver()
  }
  initObserver(){
    this._observables = new Set()
    this._noticeReactions = new Map()
    // removing observer from observable
    if (typeof this.addEventListener=="function")
      this.addEventListener("delete", ()=>this.dettachMe())
  }
  reactNotice(notice, ...params){
    const myReacts = this._noticeReactions.get(notice)
    if (!Array.isArray(myReacts))
      return
    for (const myReact of myReacts)
      myReact(...params)
  }
  setReaction(notice, noticeReaction){
    if (this._noticeReactions.get(notice)) {
      this._noticeReactions.get(notice).push(noticeReaction)
      return
    }
    this._noticeReactions.set(notice, [noticeReaction])
  }
  setReactionOnce(notice, noticeReaction){
    if (this._noticeReactions.get(notice)) {
      return
    }
    this._noticeReactions.set(notice, [noticeReaction])
  }
  deleteReaction(notice){
    this._noticeReactions.delete(notice)
  }
  // We shoud use dettachMe method before deleting observer to remove the observer link form observable and allowing freeing memory
  // Observables instead will not be dettached form observers._observables when deleted for simplicity, we are suposing observables are fixed elements
  dettachMe(){
    this._observables.forEach(observable=>observable.dettachObserver(null, this))
  }
}
// observable would be an object whose change would affect others behaviour
// deprecated -> observableMixin(Object).prototype.initObservable.call(myObject)
export const observableMixinConstructorCallable = (myObject)=>{
  myObject._observers=new Map()
  return myObject
}
export const observableMixin=Sup => class extends Sup {
  constructor(...args) {
    super(...args)
    this.initObservable()
  }
  initObservable(){
    this._observers=new Map()
  }
  attachObserver(notice, observer) {
    if (!this._observers.get(notice)) {
      this._observers.set(notice, [])
    }
    // avoid repetition. 
    if (this._observers.get(notice).includes(observer)) return

    // we update the module observers list
    // observers.push({observer: observer, observable: this, notice: notice})
    observer._observables.add(this) // observer observables list
    
    return this._observers.get(notice).push(observer)
  }
  // remove observer from some notice
  dettachObserver(notice, observer) {
    console.log("detaching", notice, observer)
    if (!notice) {
      this._observers.forEach((observersList, notice)=>observersList.includes(observer) && this.dettachObserver(notice, observer))
      return
    }
    if (!this._observers.get(notice)) return
    this._observers.set(notice, this._observers.get(notice).filter(myObserver=>myObserver!=observer))
    // observers=observers.filter(myObserver=>!(myObserver.observer===observer && myObserver.observable===this && myObserver.notice===notice))
  }
  replaceObserver(notice, observer, newObserver) {
    if (!this._observers.get(notice)) return
    this._observers.set(notice, this._observers.get(notice).map(myObserver=>myObserver===observer ? newObserver : myObserver))
    // observers=observers.map(myObserver=>myObserver.observer===observer && myObserver.observable===this && myObserver.notice===notice ? newObserver : myObserver)
  }
  notifyObservers(notice, ...params) {
    console.log("notify", this, notice)
    if (!this._observers.get(notice)) return
    for (const observer of this._observers.get(notice)) {
      observer.reactNotice(notice, ...params)
    }
  }
  getNoticeList(observer) {
    return Array.from(this._observers).filter(([thisNotice, thisObserver])=>thisObserver===observer).map(([thisNotice, thisObserver])=>thisNotice)
  }
}

/*
// when removing a node then we could remove its observer dependences
export function removeObserver(remObserver) {
  observers.filter(myOb=>myOb.observer===remObserver).forEach(myOb=>{
    for (const notice of myOb.observable.getNoticeList(remObserver)) {
      myOb.observable.dettachObserver(notice, remObserver)
    }
  })
}

// when replace a node then we could replace also oserver dependences
export function replaceObserver(oldObserver, newObserver) {
  observers.filter(myOb=>myOb.observer===newObserver).forEach(myOb=>{
    for (const notice of myOb.observable.getNoticeList(oldObserver)) {
      myOb.observable.replaceObserver(notice, oldObserver, newObserver)
    }
  })
}
*/
// Cambios:
// _noticeReactions recibe los parametros directamente en modo spread