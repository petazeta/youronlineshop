// Observer pattern implementation mixin

// SE TIENE EN CUENTA AL ELIMINAR UN NODO OBSERVER QUE EN EL OBSERVABLE SE ELIMINE TAMBIEN????
// Esto además causaría que ese elemento permaneciera en memoria, quizas automatizarlo?????? como añadir una version del metodo delete children, etc...???

// Total observers list, it mantains a data register with this format: [{observer, observable, notice}, ...]
let observers=[];


// observer would be an object that could change depending on observable state
export const observerMixinConstructorCallable = (myObject)=>{
  myObject._noticeReactions=new Map();
}
export const observerMixin=Sup => class extends Sup {
  constructor(...args) {
    super(...args);
    observerMixinConstructorCallable(this);
  }
  reactNotice(notice, ...params){
    const myReact = this._noticeReactions.get(notice);
    if (typeof myReact != "function") return;
    return myReact(...params);
  }
  setReaction(notice, noticeReaction){
    this._noticeReactions.set(notice, noticeReaction);
  }
  deleteReaction(notice){
    this._noticeReactions.delete(notice);
  }
}
// observable would be an object whose change would affect others behaviour
export const observableMixinConstructorCallable = (myObject)=>{
  myObject._observers=new Map();
}
export const observableMixin=Sup => class extends Sup {
  constructor(...args) {
    super(...args);
    observableMixinConstructorCallable(this);
  }
  attachObserver(notice, observer) {
    if (!this._observers.get(notice)) {
      this._observers.set(notice, []);
    }
    // avoid repetition. 
    if (this._observers.get(notice).includes(observer)) return;

    // we update the module observers list
    observers.push({observer: observer, observable: this, notice: notice});
    
    return this._observers.get(notice).push(observer);
  }
  // remove observer from some notice
  dettachObserver(notice, observer) {
    if (!this._observers.get(notice)) return;
    this._observers.set(notice, this._observers.get(notice).filter(myObserver=>myObserver!=observer));
    observers=observers.filter(myObserver=>!(myObserver.observer===observer && myObserver.observable===this && myObserver.notice===notice));
  }
  replaceObserver(notice, observer, newObserver) {
    if (!this._observers.get(notice)) return;
    this._observers.set(notice, this._observers.get(notice).map(myObserver=>myObserver===observer ? newObserver : myObserver));
    observers=observers.map(myObserver=>myObserver.observer===observer && myObserver.observable===this && myObserver.notice===notice ? newObserver : myObserver);
  }
  notifyObservers(notice, ...params) {
    if (!this._observers.get(notice)) return;
    for (const observer of this._observers.get(notice)) {
      observer.reactNotice(notice, ...params);
    }
  }
  getNoticeList(observer) {
    return Array.from(this._observers).filter(([thisNotice, thisObserver])=>thisObserver===observer).map(([thisNotice, thisObserver])=>thisNotice);
  }
}

// when removing a node then we could remove its observer dependences
export function removeObserver(remObserver) {
  observers.filter(myOb=>myOb.observer===remObserver).forEach(myOb=>{
    for (const notice of myOb.observable.getNoticeList(remObserver)) {
      myOb.observable.dettachObserver(notice, remObserver);
    }
  });
}

// when replace a node then we could replace also oserver dependences
export function replaceObserver(oldObserver, newObserver) {
  observers.filter(myOb=>myOb.observer===newObserver).forEach(myOb=>{
    for (const notice of myOb.observable.getNoticeList(oldObserver)) {
      myOb.observable.replaceObserver(notice, oldObserver, newObserver);
    }
  });
}

// Cambios:
// _noticeReactions recibe los parametros directamente en modo spread