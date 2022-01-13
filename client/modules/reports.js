import {NodeMale} from './nodesfront.js';
import {myCart} from './cart.js';

const uniqueId=new Date().getTime().toString(32).substring(3);

export default function makeReport(msg) {
  return NodeMale.makeRequest("report", {repData: `${uniqueId} : ${msg}`});
}

export function setReports() {
  webuser.addEventListener("checkout",
  (order)=>makeReport("checkout"),
  "report");
  
  myCart.addEventListener("cart item",
  (item)=>makeReport("cart item operation"),
  "report");
}

