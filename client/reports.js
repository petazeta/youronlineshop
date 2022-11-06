import {Node} from './nodes.js';
import {myCart} from './cart.js';
import {observerMixin} from './observermixin.js';

const ReporterBase=observerMixin(Node);

class Reporter extends ReporterBase{
  constructor(...args){
    super(...args);
    this.uniqueId=new Date().getTime().toString(32).substring(3);
  }
  makeReport(msg) {
    return this.constructor.makeRequest("report", {repData: `${this.uniqueId} : ${msg}`});
  }
  setReports() {
    webuser.attachObserver("checkout", this);
    this.setReaction("checkout", order=>{
      console.log(`reporter said "webuser checkout"`);
      this.makeReport('checkout');
    });

    myCart.attachObserver("cart item", this);
    this.setReaction("cart item", item=>{
      console.log(`reporter said "cart item"`);
      this.makeReport('cart item operation');
    });
  }
}

const reporter=new Reporter();

export default function makeReport(msg) {
  return reporter.makeReport(msg);
}

export function setReports() {
  return reporter.setReports();
}
