Cart Feature
============

## Introduction

Shopping cart feature is about a container for the products added to it. It displays the products name and quantity and a button to procced to checkout.

## Implementation

Cart implementation elements are:
- Shop/Cartmixin.mjs:
  - It contains the class Cart
  - It contains sumTotal function
- context__main/Shop/cart.mjs: Contexted version. Main functions: CartBoxView (cart container) and SetCartIcon (button) for body.mjs.
- Specific templates: cartbox, itemlist.
- Templates itemlistpicture and itempicturelarge contain the add item to cart button.

## Cart class

Cart class is [Node](linker.md) descendent. Cart has one relationship which children are the cart items (Node class). When the user adds a item to the cart, cart adds a new cart item which props are "id" and "quantity". It attachs also the item object to the cart not as a "prop" but directly in the object (as a property) with the key item. Cart method "addItem" checks if the item is already in the cart and in that case it sums the quantity.

## Checkout

Checkout process implementation is also at context__main/shop/ctk.mjs. It is making an order object from the cart information. The order will be attached to webuser as child from relationship "orders". The checkout process is described more in detail at [checkout](checkout.md).