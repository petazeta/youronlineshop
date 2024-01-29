async function createOrderCallback() {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // use the "body" param to optionally pass additional order information
      // like product ids and quantities
      body: JSON.stringify({
        cart: [
          {
            id: "YOUR_PRODUCT_ID",
            quantity: "YOUR_PRODUCT_QUANTITY",
          },
        ],
      }),
    });

    const orderData = await response.json();

    if (orderData.id) {
      return orderData.id;
    } else {
      const errorDetail = orderData?.details?.[0];
      const errorMessage = errorDetail
        ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
        : JSON.stringify(orderData);

      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error(error);
    resultMessage(`Could not initiate PayPal Checkout...<br><br>${error}`);
  }
}

async function onApproveCallback(data, actions) {
  try {
    const response = await fetch(`/api/orders/${data.orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const orderData = await response.json();
    // Three cases to handle:
    //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
    //   (2) Other non-recoverable errors -> Show a failure message
    //   (3) Successful transaction -> Show confirmation or thank you message

    const transaction =
      orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
      orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
    const errorDetail = orderData?.details?.[0];

    // this actions.restart() behavior only applies to the Buttons component
    if (errorDetail?.issue === "INSTRUMENT_DECLINED" && !data.card && actions) {
      // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
      // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
      return actions.restart();
    } else if (
      errorDetail ||
      !transaction ||
      transaction.status === "DECLINED"
    ) {
      // (2) Other non-recoverable errors -> Show a failure message
      let errorMessage;
      if (transaction) {
        errorMessage = `Transaction ${transaction.status}: ${transaction.id}`;
      } else if (errorDetail) {
        errorMessage = `${errorDetail.description} (${orderData.debug_id})`;
      } else {
        errorMessage = JSON.stringify(orderData);
      }

      throw new Error(errorMessage);
    } else {
      // (3) Successful transaction -> Show confirmation or thank you message
      // Or go to another URL:  actions.redirect('thank_you.html');
      resultMessage(
        `Transaction ${transaction.status}: ${transaction.id}<br><br>See console for all available details`,
      );
      console.log(
        "Capture result",
        orderData,
        JSON.stringify(orderData, null, 2),
      );
    }
  } catch (error) {
    console.error(error);
    resultMessage(
      `Sorry, your transaction could not be processed...<br><br>${error}`,
    );
  }
}

window.paypal
  .Buttons({
    createOrder: createOrderCallback,
    onApprove: onApproveCallback,
  })
  .render("#paypal-button-container");

const cardField = window.paypal.CardFields({
  createOrder: createOrderCallback,
  onApprove: onApproveCallback,
});

// Render each field after checking for eligibility
if (cardField.isEligible()) {
  const nameField = cardField.NameField();
  nameField.render("#card-name-field-container");

  const numberField = cardField.NumberField();
  numberField.render("#card-number-field-container");

  const cvvField = cardField.CVVField();
  cvvField.render("#card-cvv-field-container");

  const expiryField = cardField.ExpiryField();
  expiryField.render("#card-expiry-field-container");

  // Add click listener to submit button and call the submit function on the CardField component
  document
    .getElementById("multi-card-field-button")
    .addEventListener("click", () => {
      cardField.submit().catch((error) => {
        resultMessage(
          `Sorry, your transaction could not be processed...<br><br>${error}`,
        );
      });
    });
} else {
  // Hides card fields if the merchant isn't eligible
  document.querySelector("#card-form").style = "display: none";
}

// Example function to show a result to the user. Your site's UI library can be used instead.
function resultMessage(message) {
  const container = document.querySelector("#result-message");
  container.innerHTML = message;
}



import {config} from '../../cfg.mjs' // currencyCode
import {sumTotal} from "../cart.mjs"
import {getRoot as getSiteText} from "../../sitecontent.mjs"
import {getLangBranch} from '../../languages/languages.mjs'

export function init(order) {
  const myVars=JSON.parse(orderPaymentType.props.details).vars;
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