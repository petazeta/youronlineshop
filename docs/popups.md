Pop ups
=======

## Introduction

What makes the different between a popup and a normal append is that popups are displayed over the other elements as an independent element (not affecting other elements layout) and therefore thay can be removed the same way.

## Implementation

We must implement these two element features, one is the appearence and the other is the behaviour.

### Apparience

We would need to use some css commands for the element to appear above the others. A common class for this purpose can be like:
.popup {
  position: fixed !important;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  min-width: 16em;
  max-width: 90%;
  z-index:100;
}

And we also would like to show a "curtain" to cover the behind elements. This container element class could be like:
.backframe{
    top: 0;
    left: 0;
	bottom: 0;
	right: 0;
    position: fixed;
    z-index: 50;
	background-color: hsl(0deg 0% 0% / 10%);
}

At our css we have classes alert and login-frame. For appening the element we can just append it directly inside body.

### Closig feature (behaviour).

This can be made in different ways (javascript). Depending on the way that it would be closed (by clicking button, by clicking unhover the element, etc...) we would chose one of the posibilities we have already implemented.

- Custom code

Sometimes we need a custom way to remove the popup or the popup removal comes with some other functionalities. In this cases the best option is usually to create custom code. We are using custom code for example at loadimg.mjs.

- Showing a popup message

We can show easily a popup this way:
```
document.createElement("alert-element").showMsg(msg, timeOut)
```
This is a custom element based in class Alert at alert.mjs. we can as well use other methods, for example showAlert(tmp) shows an HTML element.

- Popup with a "X" close button on the corner

To show this kind of popup we can use the module rmbox.mjs, it is using rmbox template. This implementation doesn't provide any popup location so we would probably need to provide a class for it or combine it with the method showAlert that we have noticed before.





