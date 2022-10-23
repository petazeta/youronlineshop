Making orders
=============

## Introduction

Ordering process starts when user adds a product to the [cart](cart.md). When cart is not empty we can click the checkout button. If the user is not logged in it will show the login layout. After login the checkout process starts.

## Implementation

Checkout process is some of the largest elements. It starts when launching template chktmain. It shows the order, but first it creates the order node at the webuser node. The following code is creating the order node and populating it with the cart elements.
```
  webuser.getRelationship("orders").addChild(new DataNode());
  webuser.getRelationship("orders").getChild().loadRequest("get my relationships")
  .then(myOrder=>{
    myCart.getRelationship().children.forEach(cartItem=>{
      myOrder.getRelationship("orderitems").addChild(new DataNode({quantity: cartItem.props.quantity, name: cartItem.item.props.name, price: cartItem.item.props.price}));
    });
```
Other templates that participate in checkout are: chktuserdata, useraddressview, chktshipping, shippinglist, shippingtype, chktpayment, paymnentlist, paymenttype, chktend, order template.



Total en chckend is error.

add my tree

Que datos se muestran en order?? estan estos datos antes de ser insertarda la orden o merece la pena cargarla de nuevo?



## Config params