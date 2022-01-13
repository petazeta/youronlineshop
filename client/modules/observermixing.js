let observers=[];

// we presum this is instance of NodeMixing
// for example menu
const ObserverMixing=Sup => class extends Sup {
  constructor(...args) {
    super(...args);
    this.noticeReactions=new Map();
  }
  reactNotice(notice, params){
    const myReact = this.noticeReactions.get(notice);
    if (typeof myReact != "function") return;
    return myReact(params);
  }
  
}
// for example user
const ObservableMixing=Sup => class extends Sup {
  constructor(...args) {
    super(...args);
    this.observers=new Map();
  }
  attachObserver(observer, notice) {
    if (!this.observers.get(notice)) {
      this.observers.set(notice, []);
    }
    // avoid repetition. 
    if (this.observers.get(notice).includes(observer)) return;
    for (const myObserver of this.observers.get(notice)) {
      if (this.constructor.equality(myObserver, observer)) return;
    }
    // we update the observers list
    observers.push({observer: observer, observable: this, notice: notice});
    
    return this.observers.get(notice).push(observer);
  }
  dettachObserver(notice, observer) {
    let myObservers;
    if (myObservers=this.observers.get(notice)) {
      const newObservers=myObservers.filter(myObserver=>myObserver===observer);
      // we remove from observers list
      observers=observers.filter(myObserver=>myObserver.observer===observer && myObserver.observable===this && myObserver.notice===notice);

      return this.observers.set(notice, newObservers);
    }
  }
  replaceObserver(notice, observer, newObserver) {
    let myObservers;
    if (myObservers=this.observers.get(notice)) {
      const newObservers=myObservers.map(myObserver=>{
        if (myObserver===observer) return newObserver;
        return myObserver;
      });
      // we replace from observers list
      observers=observers.map(myObserver=>{
        if (myObserver.observer===observer && myObserver.observable===this && myObserver.notice===notice) {
          return newObserver;
        }
        return myObserver;
      });

      return this.observers.set(notice, newObservers);
    }
  }
  notifyObservers(notice, params) {
    const noticeObservers=this.observers.get(notice);
    if (!noticeObservers) return;
    for (const observer of noticeObservers) {
      if (typeof observer.reactNotice != "function") continue;
      observer.reactNotice(notice, params);
    }
  }
  getNoticeList(observer) {
    const noticeList=[];
    for (const notice of this.observers.keys()) {
      for (const myOb of this.observers.get(notice)) {
        if (myOb===observer) {
          noticeList.push(notice);
        }
      }
    }
    return noticeList;
  }
}

function removeObserver(observer) {
  const myObs=observers.filter(myOb=>myOb.observer===observer);
  if (myObs.length==0) return false;
  for (const myOb of myObs) {
    let notices=myOb.observable.getNoticeList(myOb.observer);
    for (const notice of notices) {
      myOb.observable.dettachObserver(notice, myOb.observer);
    }
  }
}

function replaceObserver(observer, newObserver) {
  const myObs=observers.filter(myOb=>myOb.observer===observer);
  if (myObs.length==0) return false;
  for (const myOb of myObs) {
    let notices=myOb.observable.getNoticeList(myOb.observer);
    for (const notice of notices) {
      myOb.observable.replaceObserver(notice, myOb.observer, newObserver);
    }
  }
}

const getObservers=()=>observers;

export {ObserverMixing, ObservableMixing, getObservers, removeObserver, replaceObserver};