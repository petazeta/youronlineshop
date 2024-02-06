Payments
========

## Introduction

Online payment process depends on payment providers systems. It deservers some attention because it can be a bit tricky to integrate these systems in the general source code. Providers systems have two layers the front end and the back end layer. Front end layer used to come as a script that we can download from their site and load it in the client. The backend is an Api that we can consume. It usually should be consumed by our backend not by the front end (it might have to be with browser policies). 

## Payment types

At the database there is the collection PaymentTypes which purpose is to hold the payments types belonging to the providers. Documents fields are:
- image: image name for showing next to the payment option. Not currently in use.
- moduleName: name of the module (frontend) that contains the script with the code for performing the payment (explained below)
- vars: A json object that would usually contain data like merchant accout name.
- active: posibilite to set to inactive and not lose data (not currently in use)

There is also another collection called PaymentTypesPrivate that contains as well a vars field for the payment account information that is private, for example, some merchant account secret needed to access the Api. We have chosen to split this information in other collection because this way we can set this collection as private and the other as no private in the safety procedure at server.

## Payment procedure

For showing the payment the payment module has an export function to render the payment that is a process that works in combination with the payment provider script in client. The module used to have some process (script) for creating the payment at the provider thruogh a call to the provider Api and another for checking the payment has been made correctly also by a provider Api call. Provider Api calls are not made directly by frontend script so we need a script at server to serve as an intermediance between our Api and payment provider Api. Server module name is also the same as client module name.

Payment is recorded at the orderpayment collection and field success contains some numeric code to record if transaction has succeed. Also field details contains a Json object for recording other payment process data.

------

## Notes

curl https://api.stripe.com/v1/payment_intents \
  -u "sk_test_51H8v8qCEVHLN15pWxoCDsWohslb7XsXGZvdawI6uYifpmtwMWL0Qi0PAY2MrUdTSapkTjacNXEzhcsjtr49BB8Ya00MbjvJ5vW:" \
  -d amount=1099 \
  -d currency=eur

curl -v -X POST "https://api-m.sandbox.paypal.com/v1/oauth2/token"\
 -u "CLIENT_ID:CLIENT_SECRET"\
 -H "Content-Type: application/x-www-form-urlencoded"\
 -d "grant_type=client_credentials"

https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=elements