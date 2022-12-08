Edition Feature
===============

## Introduction

This feature is about editing an element, deleting an element or adding a new element. Edition buttons are layout elements (templates) that appears in certain situations when user has administration permisions. The buttons target is some node elements (usually children attached to a parent relationship). After the edition the changes are displayed at screen and a notification can be showed.

## Procedure

A typical script for the edition button can be something like this

```
<span style="position:relative;">
  <div data-id="butedit" class="btmiddleright"></div>
  <div data-id="money" style="padding-right: 0.2em" data-money-value=""></div>
  <script>
    thisElement.textContent=thisNode.getRelationship("itemsdata").getChild().props.price;
    //adding the edition pencil
    if (webuser.isProductAdmin()) {
      const {visibleOnMouseOver}=await import('./' + CLIENT_MODULES_PATH + 'frontutils.js');
      visibleOnMouseOver(thisElement.parentElement.querySelector('[data-id=butedit]'), thisElement.parentElement);
      thisNode.getRelationship("itemsdata").getChild().appendView(thisElement.parentElement.querySelector('[data-id=butedit]'), "butedit", {editElement: thisElement, thisProperty: "price"});
    }
  </script>
</span>
```
A typical script for the addition, deletion and position change in a template layout could be like this one:

```
  <div style="position:relative;z-index:6;">
    <div data-id="admnbuts">
      <div class="admnbtsgrid"></div>
    </div>
  </div>
  <script>
    if (webuser.isProductAdmin()) {
      const {visibleOnMouseOver}=await import('./' + CLIENT_MODULES_PATH + 'frontutils.js');
      visibleOnMouseOver(thisElement.querySelector('[data-id=admnbuts]'), thisElement.parentElement);
      thisNode.appendView(thisElement.querySelector('.admnbtsgrid'), "butchpos", {position: 'vertical'});
      thisNode.appendView(thisElement.querySelector('.admnbtsgrid'), "butdelete");
      thisNode.appendView(thisElement.parentElement.querySelector('.admnbtsgrid'), "butaddnewnode");
    }
  </script>
```

## Addition

The addition template button at butaddnewnode is complemented with the module addition.js. This module exported function is "addition" which main argument is the new node or the previous sibling (If it is the previous sibling it creates a new node based on this one).

For adding a new node we sometimes need to create an empty one. For this reason exists createInstanceChild method at linker nodes and the createInstanceChildText function at module languages.js. These methods create a new empty data node based on the parent one and for the text version it also creates a subnode for the lang content.

This action produces the event triger "addNewNode" at the parent.

A typical addition button at a row/document tamplate could be like the one at procedure chapter: `thisNode.appendView(thisElement.parentElement.querySelector('.admnbtsgrid'), "butaddnewnode");`

This button is shown at every row/document, so it can be added at the position that is just after that row/document.

And we also need to create an event for when there is no rows/documents at the collection but we need to show the add button, something like this:
```
const {createInstanceChildText} = await import('./' + CLIENT_MODULES_PATH + 'languages.js');
//To show add product when no products in the category
thisNode.getRelationship("items").addEventListener("setChildrenView", function() {
  if (webuser.isProductAdmin() && thisNode.getRelationship("items").children.length==0) {
    createInstanceChildText(this)
    .then(newNode=>newNode.setView(thisElement, "butaddnewnode"));
  }
}, "addNewNodeButton");

await thisNode.getRelationship("items").setChildrenView(thisElement, "itemlistpicture");
```

## Deletion

Deletion template is butdelete. It shows a confirmation alert for the user. It triggers 'deleteChildNode'.

## Move

Moving a node position template is butchpos. It receives a parameter to show its buttons in horizontal or vertical format. It is supported by the module changepos.js. It triggers moveNode.

## Content edition

La edición de contenido se produce directamente en la pantalla.

### Content that can not be edited directly on them.

For these cases we got the user menu Extra edition elements

## Extraordinary cases

Los casos anteriores tienen en cuenta que el usuario sea administrador, en cuyo caso muestran las ediciones. Sin embargo muchas veces estos objetos ya están en pantalla cuando el usuario realiza el login. Por ello se necesita un procedimiento de refresco de estos elementos. Se utilizarán observadores en estos elementos que recibirán notificaciones de login del usuario, en ese caso esos elementos se refrescaran. Esto es así en el caso de elementos fijos de la pantalla, como categorías, menús y encabezado. Para los elementos no fijos (pertenecientes a la parte central) normalmente el login producirá un refresco de esa pantalla y esos elementos podrán mostrar sus elementos de edición.

Ver [observerpattern](observerpattern.md)