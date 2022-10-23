// Event handler
// Types define the events as: click, hover, etc... in Dom
// To not duplicate is better to send an id and a targetNode
// if oneTime==true, the event is executed once and then is removed

const eventListnerMixin=Sup => class extends Sup {
  constructor(...args){
    super(...args);
    this._events=[]; // Event handler storing MEJOR A MAP eventName:id
  }
  addEventListener(type, listenerFunction, id, targetNode, oneTime=false) {
    if (!Array.isArray(type)) type=[type];
    type.forEach(myType => {
      const myEvent={
        type: myType,
        listenerFunction: listenerFunction,
        id: id,
        targetNode: targetNode,
        oneTime: oneTime
      };
      if (id) {
        const position=this._eventExists(myEvent);
        //if there is the event name we update it
        if (position!=-1) {
          this._events[position]=myEvent;
          return position;
        }
      }
      this._events.push(myEvent);
      return this._events.length;
    });
  }

  addEventListenerOnce(type, listenerFunction, id, targetNode) {
    return this.addEventListener(type, listenerFunction, id, targetNode, false);
  }

  removeEventListener(type, id, targetNode) {
    let index;
    while (index!=-1) {
      index=this._eventExists({type: type, id: id, targetNode: targetNode});
      if (index!=-1) this._events.splice(index,1);
    }
  }

  // return index if found or -1 if not found
  _eventExists(event) {
    if (!event.id) return -1; //id is required to search coincidences

    for (const [i, val] of Object.entries(this._events)) {
      if (val.type==event.type && val.id==event.id) {
        if (event.targetNode && !this.constructor.equivalent(val.targetNode, event.targetNode)) {
          continue;
        }
        return i;
      }
    }
    return -1;
  }

  dispatchEvent(type, ...args) {
    for (const [i, val] of Object.entries(this._events)) {
      if (val.type==type) {
        val.listenerFunction.call(this, ...args);
        if (val.oneTime) {
          this._events.splice(i,1); // No need of any extra action for the array size change: Object.entries doesn't get affected
        }
      }
    }
  }
}

export default eventListnerMixin;

// cambios eventExists => _eventExists 