Cart Feature
============

## Introduction

Shopping cart feature is about a container for the products added to it. It displays the products name and quantity and a button to procced to checkout.

## Implementation

Cart implementation elements are:
- Cart module (It contains the class Cart)
- Money module (Money formatting)
- Specific templates: carticon, cartbox, cartboxtitle, cartboxckout and itemlist.
- Templates itemlistpicture and itempicturelarge contain the add item to cart button.

We start at body template by launching carticon and cartbox. The first one is the button to show the cart. Cartbox is the cart continer. 

## Cart module

Cart class is a extended [Linker](linkerfmwk.md) with [observable](observerpattern.md) facilities (To send notifications to [reports](statistics.md)). Cart children are the cart items. When the user adds a item to the cart, cart adds a new cart item which props are "id" and "quantity". It attachs also the item object to the cart not as a "prop" but directly in the object (as a property) with the name item. Cart main method "addItem" checks if the item is already in the cart and in that case it sums the quantity.

## Checkout

Checkout process is at template chkmain. It will get the cart information to make the order through the webuser elements at relationships ordercart and orderitems. The checkout process is described more in detail at [checkout](checkout.md).