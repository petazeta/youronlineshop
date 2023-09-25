// Event handler
// Types define the events as: click, hover, etc... in Dom
// To not duplicate is better to send an id and a targetNode
// if oneTime==true, the event is executed once and then is removed

const eventListnerMixin=Sup => class extends Sup {
  constructor(...args){
    super(...args);
    this._events=new Map();
  }
  addEventListener(type, listenerFunction, id, targetNode, oneTime=false) {
    if (!type) return this;
    const row={listenerFunction, id, targetNode, oneTime};
    const typeMatch=this._events.get(type);
    if (id && typeMatch) {
      const myMatch=this._eventExists(type, row);
      //if there is the event name we update it
      if (myMatch!=-1) {
        typeMatch[myMatch]=row;
        return this;
      }
    }
    if (typeMatch) {
      typeMatch.push(row);
      return this;
    }
    this._events.set(type, [row]);
    return this;
  }

  addEventListenerOnce(type, listenerFunction, id, targetNode) {
    return this.addEventListener(type, listenerFunction, id, targetNode, true);
  }

  removeEventListener(type, id, targetNode) {
    const typeMatch=this._events.get(type);
    if (!typeMatch) return;
    let index;
    while (index!=-1) {
      index=this._eventExists(type, {id, targetNode});
      if (index!=-1) {
        if (typeMatch.length>1) {
          typeMatch.splice(index,1);
        }
        else this._events.delete(type);
      }
    }
  }

  // return index if found or -1 if not found
  _eventExists(type, row) {
    if (!type || !row.id) return -1; //id is required to search coincidences
    const typeMatch=this._events.get(type);
    if (!typeMatch) return -1;
    const findRow=typeMatch.find(current=>current.id==row.id && current.targetNode==row.targetNode);
    if (findRow) return typeMatch.indexOf(findRow);
    return -1;
  }

  dispatchEvent(type, ...args) {
    const typeMatch=this._events.get(type);
    if (!typeMatch) return;
    typeMatch.forEach(row=>row.listenerFunction.call(this, ...args));
    typeMatch.filter(row=>row.oneTime).forEach(row=>typeMatch.splice(typeMatch.indexOf(row),1));
    if (typeMatch.length==0) this._events.delete(type);
  }
}

export default eventListnerMixin;

// cambios eventExists => _eventExists 