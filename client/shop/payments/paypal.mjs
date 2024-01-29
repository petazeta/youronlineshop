import {selectorFromAttr, visibleOnMouseOver} from "../../frontutils.mjs" // (elm, attName, attValue)

const TEST_CLIENT_ID = "AYGA4EwRcgO09pNNRsr5ujnVm7u7QKkOCEpoOkxaQqwM3xVDwkKQlgXQFq8dYy0FvTaVkK0bguON31ty"

export async function renderPayment(getTemplate, myContainer, order, payment){
  // load template View
  const paymentTp = await getTemplate("paypal")
  myContainer.innerHTML=""
  myContainer.appendChild(paymentTp)
  if (!window.paypal)
    await loadScript(`https://www.paypal.com/sdk/js?components=buttons,card-fields&client-id=${payment.props.vars?.merchantId || TEST_CLIENT_ID}`)
  window.paypal
    .Buttons({
      createOrder: createOrderCallback,
      onApprove: onApproveCallback,
    })
    .render("#paypal-button-container")

  const cardField = window.paypal.CardFields({
    createOrder: createOrderCallback,
    onApprove: onApproveCallback,
  })

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

  // It should return paypalOrderId
  async function createOrderCallback(){
    const createPaymentData = await order.request("payment", {paymentAction: "create", payment: payment})
    if (createPaymentData?.id) {
      const orderDetails = new URLSearchParams(order.getRelationship("orderpayment").getChild().props.details)
      orderDetails.append("paypalOrderId", createPaymentData.id)
      order.getRelationship("orderpayment").getChild().props.details = orderDetails.toString() // We update the client version, database was updated at server request
      return createPaymentData.id
    } else {
      const errorDetail = createPaymentData?.details?.[0]
      const errorMessage = errorDetail
        ? `${errorDetail.issue} ${errorDetail.description} (${createPaymentData.debug_id})`
        : JSON.stringify(createPaymentData)

      throw new Error(errorMessage)
    }
  }

  async function onApproveCallback(data, actions) {
    const orderData = await order.request("payment", {paymentAction: "approve", payment: payment})
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
  }
  // Example function to show a result to the user. Your site's UI library can be used instead.
  function resultMessage(message) {
    const container = document.querySelector("#result-message")
    container.innerHTML = message
  }
}

// helpers

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