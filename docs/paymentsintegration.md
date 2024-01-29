curl https://api.stripe.com/v1/payment_intents \
  -u "sk_test_51H8v8qCEVHLN15pWxoCDsWohslb7XsXGZvdawI6uYifpmtwMWL0Qi0PAY2MrUdTSapkTjacNXEzhcsjtr49BB8Ya00MbjvJ5vW:" \
  -d amount=1099 \
  -d currency=eur

curl -v -X POST "https://api-m.sandbox.paypal.com/v1/oauth2/token"\
 -u "CLIENT_ID:CLIENT_SECRET"\
 -H "Content-Type: application/x-www-form-urlencoded"\
 -d "grant_type=client_credentials"

https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=elements