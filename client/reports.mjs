import {makeRequest} from './request.mjs';
import {observerMixin} from './observermixin.mjs';

const ReporterBase=observerMixin(Object);

export default class Reporter extends ReporterBase{
  constructor(){
    super()
    this.uniqueId=new Date().getTime().toString(32).substring(3);
  }
  makeReport(msg, url) {
    return makeRequest("report", {repData: `${this.uniqueId} : ${msg}`}, url);
  }
  setReportReactions(myCart, webuser) {
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