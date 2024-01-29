Making orders
=============

## Introduction

Ordering process starts when user adds a product to the [cart](cart.md). When cart is not empty we can click the checkout button. If the user is not logged in it will show the login layout and after the login the checkout process will continue.

It is showing the order and requesting user to introduce some data like the address and to select th shipping type and payment type. Then it will show the order and a button for the payment process that is external.

## Implementation

Checkout process is some of the largest facilities. The templates that take part on it are: chktmain, ordercart, orderitem, chktuserdata, useraddressview, userdata, singleinput, chktshipping, shippinglist, shippingtype, chktpayment, paymnentlist, paymenttype, chktend, order, ordershipping and the template for the payment: paypal.

It starts when launching template chktmain. It shows the order but first it creates the order node inside webuser node. The following code is for creating the order node and populating it with the cart elements.
```
  webuser.getRelationship("orders").addChild(new Node());
  webuser.getRelationship("orders").getChild().loadRequest("get my relationships")
  .then(myOrder=>{
    myCart.getRelationship().children.forEach(cartItem=>{
      myOrder.getRelationship("orderitems").addChild(new Node({quantity: cartItem.props.quantity, name: cartItem.item.props.name, price: cartItem.item.props.price}));
    });
[...]
```

### Order view

In this order view the order is still not confirmed. Its templates are ordercart and orderitem. It shows products quantities, price and subtotal.

### User address

The user address checkout process starts at template chktuserdata that in turn launchs useraddressview with parameter externalSave: true. This parameter allows other elements to perform saving address process. There is also the parameter showAddress for including the address data (other way it shows just name and contact data). The useraddressview template launchs in turn userdata. This last one is efectivelly showing the user address. It does it through the node method setPropsView that in turn uses the template singleinput that could use singlelabel as well.

### Shipping selection

The shipping view is built in three fases. First we set the title, second the container and third we print the shipping checking list. The correspondent layouts are: chktshipping, shippinglist adn shippingtype.

When selecting the shipping at shippint type, it is added to the webuser order. There is also a info element when clicking the shipping name, shipping description appears.

### Payment selection

Payment view is very similar to the shipping one. Layouts are: chktpayment, paymnentlist and paymenttype.

El payment type tiene unos valores que son template y otro que es vars. El valor template tiene como propósito definir el nombre del modulo y del template correspondiente al tipo de pago, el cual se mostrará en la siguiente pantalla de checkout. En vars hay valores de configuración correspondientes a la cuenta asociada al pago codificados en formato json.

Una vez seleccionado el pago estos datos son almacenados en el campo details de orderpaymenttype en formato json para ser recuperados en el siguiente paso de checkout.

### Continue with the order action

When clicking the continue button at chktmain we are saving the user data and adding the order to the database. We set the order with status=0 so this is the status for orders still not processed. Then we are launching chktend template. We are also reseting the cart. The next step is proceed payment.

### Proceed payment layout

This layout starts with chktend and it has in turn another layout element: the order view. This is showing the order including the shipping price, total and payment button and its layouts are order, orderitem and payment template. This last one payment template can be configured at the payment type. The payment template depends on the payment provider, in our case is paypal.

When the payment is done the orders payment prop "succeed" will be set to true.

#### Paypal integration

The paypal integration we have is based in the client side. The default parameters are for the test enviroment. It is needed a paypal business account to receive payments. For the test enviroment you must use the virutal users (they call it sandbox accounts).

Aqui hay un ejemplo de la integración:
https://developer.paypal.com/demo/checkout/

## Order config params

There are some configuration parameters at client/cfg/default.js related to this implementation:
```
  chktuserdata_On: true, // if false skip user data and address insertion
  chktaddress_On: true, // if false skip address data insertion
  chktshipping_On: true, // if false skip shipping type selection
  chktpayment_On: true, // if false skip payment type selection
  currencyCode: 'USD', // 'USD', 'EUR' ...
```
And the other configuration is related to the payment type and it is setled at its prop vars:
```
vars: {merchantId: 'test', template: 'paypal'}
```
The merchantId value is an identifier for the merchant that the payment provider supplies. To set this value you should log-in with systemadmin user and get to this page so the element will be editable.