Making orders
=============

## Introduction

Ordering process starts when user adds a product to the [cart](cart.md). When cart is not empty we can click the checkout button. If the user is not logged in it will show the login layout. After login the checkout process starts. It is showing the order and requesting user to introduce some data like the address and to select th shipping type and payment type. Then it will show the order and a button for the payment process that is external.

## Implementation

Checkout process is some of the largest facilities. The templates that take part on it are: chktmain, ordercart, orderitem, chktuserdata, useraddressview, userdata, chktshipping, shippinglist, shippingtype, chktpayment, paymnentlist, paymenttype, chktend, order, ordershipping and the template for the payment: paypal.

It starts when launching template chktmain. It shows the order but first it creates the order node inside webuser node. The following code is for creating the order node and populating it with the cart elements.
```
  webuser.getRelationship("orders").addChild(new DataNode());
  webuser.getRelationship("orders").getChild().loadRequest("get my relationships")
  .then(myOrder=>{
    myCart.getRelationship().children.forEach(cartItem=>{
      myOrder.getRelationship("orderitems").addChild(new DataNode({quantity: cartItem.props.quantity, name: cartItem.item.props.name, price: cartItem.item.props.price}));
    });
[...]
```

### Order view

In this order view the order is still not confirmed. Its templates are ordercart and orderitem. It shows products quantities, price and subtotal.

### User address

The user address checkout process starts at template chktuserdata that in turn launchs useraddressview with parameter externalSave: true. This parameter allows other elements to perform saving address process. There is also the parameter showAddress for including the address data (other way it shows just name and contact data). The useraddressview template launchs in turn userdata. This last one is efectivelly showing the user address. It does it through the node method setPropsView.

### Shipping selection

The shipping view is built in three fases. First we set the title, second the container and third we print the shipping checking list. The correspondent layouts are: chktshipping, shippinglist adn shippingtype.

When selecting the shipping at shippint type, it is added to the webuser order. There is also a info element when clicking the shipping name, shipping description appears.

### Payment selection

Payment view is very similar to the shipping one. Layouts are: chktpayment, paymnentlist and paymenttype.

### Continue with the order action

When clicking the continue button we are saving the user data and adding the order to the database. Then we are launching chktend template. We are also reseting the cart. The next step is proceed payment.

### Proceed payment layout

This layout has two elements: the order view and a payment button.
The first one is showing the order including the shipping price and total. Its layouts are order and orderitem. Second element

## Order config params