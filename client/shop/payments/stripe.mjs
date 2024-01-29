import {selectorFromAttr, visibleOnMouseOver} from "../../frontutils.mjs" // (elm, attName, attValue)

const TEST_CLIENT_ID = "pk_test_51H8v8qCEVHLN15pWePJk8fzXPVGijbPpw0cf6UBmgKaDOlLCIJOGQ7KNCViXHsykVqgXWTaxhHqENMNjMD7mJgzl00Idvp8qou"

export async function renderPayment(getTemplate, myContainer, order, payment){
  // load template View
  const paymentTp = await getTemplate("stripe")
  myContainer.innerHTML=""
  myContainer.appendChild(paymentTp)
  if (!window.Stripe)
    await loadScript("https://js.stripe.com/v3/")
  const createPaymentData = await order.request("payment", {paymentAction: "create", payment: payment})
  const clientSecret = createPaymentData?.client_secret
  if (clientSecret) {
    const orderDetails = new URLSearchParams(order.getRelationship("orderpayment").getChild().props.details)
    orderDetails.append("stripeClientSecret", clientSecret)
    order.getRelationship("orderpayment").getChild().props.details = orderDetails.toString() // We update the client version, database was updated at server request
  } else {
    const errorDetail = createPaymentData?.details?.[0]
    const errorMessage = errorDetail
      ? `${errorDetail.issue} ${errorDetail.description} (${createPaymentData.debug_id})`
      : JSON.stringify(createPaymentData)

    throw new Error(errorMessage)
  }
  const clientId = payment.props.vars?.merchantId
  // Set your publishable key: remember to change this to your live publishable key in production
  // See your keys here: https://dashboard.stripe.com/apikeys
  const stripe = Stripe(clientId || TEST_CLIENT_ID)
  const options = {
    clientSecret: clientSecret,
    // Fully customizable with appearance API.
    appearance: {/*...*/},
  };

  // Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in a previous step
  const elements = stripe.elements(options);

  // Create and mount the Payment Element
  const paymentElement = elements.create('payment');
  paymentElement.mount('#payment-element');

  const form = document.getElementById('payment-form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const {error} = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: 'https://example.com/order/123/complete',
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      const messageContainer = document.querySelector('#error-message');
      messageContainer.textContent = error.message;
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  })
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