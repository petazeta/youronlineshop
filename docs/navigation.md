Navigation utility
==================

# Intro

At any single page application (SPA) the traditional navigation browser features as the navigation history: buttons for backward and forward are useless unless we would take control of them. This feature plus the active link highlight and also the pagination feature is what we would cover in this chapter.

# Navigation search params

The navigation search params used to set the history and to get an element from its url works for these layout elements (at the time of this writting): doc menus, categories-subcategories-products, login screen and checkout screen. For the categories and products the params should come with the full path, for example: ?category=cat_id&subcategory=subcat_id&product=product_id. This way we can know in advance the clicking events needed to get the last param element.

# Navigation History

There are these browsers navegation history features:

- window.onpopstate = (event) => {}
- window.history.pushState(stateElement, null, url);

The first feature is for dispatching an event when some navigator feature like backward browser button is clicked.

To implement this feature we would use the observable pattern. There would be an observable that would notify about browser history events. The observers to be noticed would be the nodes that would be clickable elements and that have effect at the navigation history. To set these elements we will do it dinamically when each link object that has an effect on the state will load. There is a code example of this feature below.

The pushState function allows to grab at the browser state some props that we would use as arguments for when the recovering state event happens. This can be an example of the grab state situation at the login state:

```
history.pushState({url: '?login=0'}, null, '?login=0');
```
Managing onpopstate event example code:

```
// Observable:

const navigationObservable=new observableMixin(Object); // Object == Class {}

window.onpopstate = (event) => {
  if (!event.state) return;
  navigationObservable.notifyObservers("history event", new URL(event.state.url, 'http://localhost'));
};

// Observers:

// Adding observerMixin feature when needed
const {observerMixin, observerMixinConstructorCallable} = await import(pathJoin('./', CLIENT_MODULES_PATH, 'observermixin.js'));
const ThisNodeClass = observerMixin(thisNode.constructor);
Object.setPrototypeOf(thisNode, ThisNodeClass.prototype); // adding observers characteristics
observerMixinConstructorCallable(thisNode);

const {navigationObservable} = await import(pathJoin('./', CLIENT_MODULES_PATH, 'navigation.js'));

navigationObservable.attachObserver("history event", thisNode);

thisNode.setReaction("history event", (params)=>{
  let coincide=params.urlObject.searchParams.get("login")===0;
  if (coincide) thisNodeButAction();
});
```

# Browser search params (client routing)

For the browser url search (initial) params we will use a similar approach. We just need to check at the clickable elements in layous if the element path name matchs the one at the search params and then produce the action.

# Search params and history implementation

This is the general idea, and the implementation module is at navhistory.js with these functions:

- setHistoryState(myNode, url, butAction); // For managing popstate event. It is called for the clickable nodes that has effect at the history state at the layout loading
- pushHistoryState(url); // Grabing the history at the browser when the user clicks a button element that take effect at the history state

# Search params and history status cases

Categiries/items, menus/docs and login

# Active buttons

Sometimes we need to highlight the element that has been selected. For example some category and subcategory. The selected element is in bold type for example. To set this feature we are using this module: activelauncher.js.

There is also another posibility when there are some buttons that take effect to the same container. In this case we would use a group to clasify these elements. We got the "central content" group for example so when a "button like" element is marked as selected the others that belong to the same group will be unselected.

## Procedure

To set this facility in a web project layout we must identify the elements that we want to set to the history state. In a practical example this could be a button element that sets a web page section with some content. For example we have a menu button (conected with its node element: thisNode). At the menu button layout we have to set the history state, asociated with the resulting screen, to an url, for example: `const url='?menu=' + thisNode.props.id`, and then we call the function setHsitoryState: `setHistoryState(menuNode, url, ()=>thisNode.setView(document.getElementById("container"), "menuContent"));`.

After setting the button action as an history element we have to actually push it when clicked. Then we have two options:
- push it at the onclick event.
- push it at the element layout loading.

Whichever option we would use the action would be: `pushHistoryState(url); // url as exposed previously`

## Casos especiales

Hay ocasiones en las que se produce el refresco de los elementos visuales, esto significa que los elementos que una vez estuvieron activos pueden volver a renderizarse. En esta situación un elemento activo debería conservar su renderización activa, por eso es necesario incluir una comprobación de si el elemento es activo en al mostrar su plantilla y volver a realizar el procedimiento en ese caso.

Por ejemplo un login de un administrador de productos produciría una nueva renderización de las categorías y subcategorías. La subcategoría activa debería al renderizarse producir de nuevo su activación y habría que incluir el siguiente código:

if (thisNode.selected) setActive(thisNode);

No sería necesario sin embargo incluir esta lógica en el layout de la categoría porque la activación de la subcategoría incluye la activación de las categorías por encima. Tampoco sería necesario realizar el setActiveInGroup, ya que el lastActive no ha cambiado. Cuidado con substituir setActive por setActiveInGroup, esto podría no funcionar correctamente.


## Pagination and init search url

Pagination offers a new dificulty in the init url search process. The paginated elements that doesn't appear at the screen can have a push state, so the search for a product would not work for the pagination.

Here it is the solution we were creating for this issue in the past:

catalog.html
  //When url init is with product we show product
  //We can not use the regular script (that cames in product view) cause not all products are listed
  import('./' + CLIENT_MODULES_PATH + 'initurl.js')
  .then(({initUrl})=>{
    if (!initUrl) return;
    if (itemIdMatch=initUrl.match(/item=(\d+)/)) {
      for (const child of itemsRel.children) {
        if (child.props.id==itemIdMatch[1]) {
          return; //If the product is to be displayed then it will produce the action itself
        }
      }
      //we don't find it in pageSize, so we have to get it from database
      const myItem=new Node();
      myItem.props.id=itemIdMatch[1];
      itemsRel.addChild(myItem);
      myItem.loadRequest("get my tree", {extraParents: extraParents, myself: true})
      .then(myItem=>{
        myItem.setView(document.getElementById("centralcontent"), "itempicture");
        //Productview will produce the action
      });
      return; //Ends the entire script
    }
  });