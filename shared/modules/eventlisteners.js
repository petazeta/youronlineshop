//import NodeBasic from './nodebasic.js'

const EventListnerMixing=Sup => class extends Sup {
//export default class EventListner extends NodeBasic{
  constructor(){
    super();
    this.events=[]; // Event handler storing
  }
  addEventListener(type, listenerFunction, id, targetNode, oneTime) {
    if (!Array.isArray(type)) type=[type];
    type.forEach(mytype => {
      const myEvent={
        type: mytype,
        listenerFunction: listenerFunction,
        id: id,
        targetNode: targetNode,
        oneTime: oneTime
      };
      if (id) {
        const position=this.eventExists(myEvent);
        //if there is the event name we update it
        if (position!=-1) {
          this.events[position]=myEvent;
        }
        else this.events.push(myEvent);
      }
      else {
        this.events.push(myEvent);
      }
    });
  }

  removeEventListener(type, id, targetNode) {
    var index=null;
    while (index!=-1) {
      index=this.eventExists({type: type, id: id, targetNode: targetNode});
      if (index!=-1) this.events.splice(index,1);
    }
  }

  //Better for internal use only
  eventExists(event) {
    if (!event.id) return -1; //id is required to search coincidences
    let i=this.events.length;
    while(i--) {
      if (this.events[i].type==event.type && this.events[i].id==event.id) {
        if (event.targetNode) {
          //When loading nodes the object can be different so we check by props.id combined with the table name
          if (event.targetNode.detectMyGender=="female") {
            if (event.targetNode.props.name==this.events[i].targetNode.props.name
              && event.targetNode.partnerNode && event.targetNode.partnerNode.props.id == this.events[i].targetNode.partnerNode.props.id) {
              return i;
            }
          }
          else if (event.targetNode.props.id && this.events[i].targetNode.props.id==event.targetNode.props.id) {
            if (event.targetNode.parentNode && event.targetNode.parentNode.props.childtablename==this.events[i].targetNode.parentNode.props.childtablename) {
              return i;
            }
          }
        }
        else {
          return i;
        }
      }
    }
    return -1;
  }
  dispatchEvent(type, ...args) {
    let i=this.events.length;
    while (i>0) {
      if (this.events[i-1].type==type) {
        this.events[i-1].listenerFunction.call(this, ...args);
        if (this.events[i-1].oneTime==true) {
          this.events.splice(i-1,1);
          i--;
        }
      }
      i--;
    }
  }
}

export default EventListnerMixing;