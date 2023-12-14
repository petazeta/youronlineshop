import {config} from '../../cfg.mjs' // currencyCode
import {sumTotal} from "../cart.mjs"
import {getRoot as getSiteText} from "../../sitecontent.mjs"
import {getLangBranch} from '../../languages/languages.mjs'

export function init(order) {

}

function onApprove(orderData){
  const transactionStatus = orderData.purchase_units[0]?.payments?.captures[0]?.status
  const transactionId = orderData.purchase_units[0]?.payments?.captures[0]?.id
  if (transactionStatus=='COMPLETED' || transactionStatus=='PROCESSED') {
    orderPaymentType.props.succeed = 1
    orderPaymentType.request("edit my props", {values: {succeed: 1, details: "Payment id:" + transactionId}})
    .then(res=>{
      document.createElement("alert-element").showMsg(getSiteText().getNextChild("checkout").getNextChild("order").getNextChild("paysucceed").getLangData(), 3000)
      // we update the order view
      // -----
      //order.setView(document.getElementById("centralcontent"), 'onsucceed');
    });
  }
  else {
    document.createElement("alert-element").showMsg("Order status: " + transactionStatus, 3000)
  }
}

const loadScript = src => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.onload = resolve
    script.onerror = reject
    script.src = src
    document.head.append(script)
  })
}

//---------

const {default: {currencyCode}}=await import('./' + CLIENT_CONFIG_PATH + 'main.mjs');
const {sumTotal}=await import('./' + CLIENT_MODULES_PATH + 'cart.mjs');
const {AlertMessage} = await import('./' + CLIENT_MODULES_PATH + 'alert.mjs');
const {getSiteText}=await import('./' + CLIENT_MODULES_PATH + 'sitecontent.mjs');



const orderPaymentType=thisNode;
const order=orderPaymentType.parent.partner;
const myVars=JSON.parse(orderPaymentType.props.details).vars;
const myorderitems=order.getRelationship("orderitems");
const myordership=order.getRelationship("ordershippingtypes");
const mytotal=(sumTotal(myorderitems.children) + sumTotal(myordership.children)) / 100;
const onApprove=(orderData)=>{
  const transactionStatus = orderData.purchase_units[0]?.payments?.captures[0]?.status;
  const transactionId = orderData.purchase_units[0]?.payments?.captures[0]?.id;
  if (transactionStatus=='COMPLETED' || transactionStatus=='PROCESSED') {
    orderPaymentType.props.succeed=1;
    orderPaymentType.request("edit my props", {values: {succeed: 1, details: "Payment id:" + transactionId}})
    .then(res=>{
      const myNode=getSiteText().getNextChild("checkout").getNextChild("order").getNextChild("paysucceed").getRelationship("siteelementsdata").getChild();
      new AlertMessage(myNode.props.value, 3000).showAlert();
      // we update the order view
      order.setView(document.getElementById("centralcontent"), 'onsucceed');
    });
  }
  else {
    new AlertMessage("Order status: " + transactionStatus, 3000).showAlert();
  }
}
  
const onScriptLoaded=function(){
  paypal.Buttons({
      style: {
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          label: 'paypal',
      },
      createOrder: function(data, actions) {
          return actions.order.create({
              purchase_units: [{
                  amount: {
                      value: mytotal,
                      currency_code: config.get("currency-code")
                  }
              }]
          });
      },
      onApprove: function(data, actions) {
          return actions.order.capture()
          .then(onApprove);
      }
  }).render('#paypal-button-container');
}
  /**
 * Loads a JavaScript file and returns a Promise for when it is loaded
 */
const loadScript = src => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.onload = resolve
    script.onerror = reject
    script.src = src
    document.head.append(script)
  })
}
let paypalurl='https://www.paypal.com/sdk/js' + '?' + 'client-id=' + myVars.merchantId + '&' + 'currency=' +  currencyCode;
loadScript(paypalurl)
  .then(() => {
    onScriptLoaded();
  })
  .catch(() => console.error('Something went wrong with paypal.'))