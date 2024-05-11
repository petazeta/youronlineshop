import fetch from "node-fetch" // after version nodejs 18 it is not need import

const [ TEST_CLIENT_ID,  TEST_CLIENT_SECRET ] = [ "sk_test_51H8v8qCEVHLN15pWxoCDsWohslb7XsXGZvdawI6uYifpmtwMWL0Qi0PAY2MrUdTSapkTjacNXEzhcsjtr49BB8Ya00MbjvJ5vW", "" ]
const base = "https://api.stripe.com"

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
export async function create(order, payment){
  const clientId = payment.props.vars?.merchantId
  const auth = Buffer.from(
    clientId || TEST_CLIENT_ID + ":",
  ).toString("base64")
  const response = (await fetch(`${base}/v1/payment_intents`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    method: "POST",
    body: formatOrder(order),
  }))
  const paymentData = await response.json()
  if (paymentData.error) {
    console.error("Failed to create payment order:", paymentData.error)
    return paymentData
  }
  // Save the paymentData id
  const myPayment = order.getRelationship("orderpayment").getChild()
  const details = new URLSearchParams(myPayment.props.details)
  details.append("stripeClientSecret", paymentData?.client_secret)
  myPayment.props.details = details.toString()
  await myPayment.dbUpdateMyProps({details: myPayment.props.details})
  return {client_secret: paymentData?.client_secret}
}

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
export async function approve(order, payment){
  //const orderId = getId(order)
  //const { jsonResponse, httpStatusCode } = await captureOrder(orderId)
  // no haria falta cargar details de la base de datos!! order.getRelationship("orderpayment").getChild().dbGetMyProps()
  const paypalOrderId = new URLSearchParams(order.getRelationship("orderpayment").getChild().props.details).get("paypalOrderId")
  const [clientId, secret] = await getCredentials(payment)
  const accessToken = await generateAccessToken( clientId || TEST_CLIENT_ID, secret || TEST_CLIENT_SECRET )
  const url = `${base}/v2/checkout/orders/${paypalOrderId}/capture`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
  })

  return response.json()
}

/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
 * @see https://developer.paypal.com/api/rest/authentication/
 */
const generateAccessToken = async (CLIENT_ID, CLIENT_SECRET) => {
  try {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      CLIENT_ID + ":" + CLIENT_SECRET,
    ).toString("base64");
    const response = await fetch(`${base}/v1/payment_intents`, {
      method: "POST",
      body: urlOrder.toString(),
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json()
    if (data.error)
      throw new Error(data.error)
    return data.access_token
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
}

async function getCredentials(payment){
  await payment.dbLoadMyTree()
  const vars = JSON.parse(payment.getRelationship("paymenttypesprivate").getChild()?.props.vars || "{}")
  return [vars.clientId, vars.secret]
}

// falta comprobar integridad de datos de precios y hacer cambios de moneda si los productos estan en otra moneda
function formatOrder(order){
  let total = 0
  for (const orderItem of order.getRelationship("orderitems").children) {
    // *** there is the risk that order in client is fake and prices are not what they should be, for this reason we should make the comprobation that prices correspond with the orderitems prices
    // this is not yet implemented

    total += orderItem.props.quantity * orderItem.props.price
  }
  let shippingPrice = order.getRelationship("ordershipping").getChild()?.props.price
  if (shippingPrice)
    total += shippingPrice
  const currencyCode = new URLSearchParams(order.getRelationship("orderpayment").getChild().props.details).get("currencyCode")
  const orderObj = {
    currency: currencyCode.toLowerCase(),
    amount: total,
  }
  return new URLSearchParams(orderObj).toString()
}

/* checking integrity of order
let orderItemParent = new orderItem.constructor.linkerConstructor("Items", "OrderItems")
orderItemParent.addChild(orderItem.clone(0))
await orderItemParent.dbLoadMyTreeUp()
let item = orderItemParent.
*/