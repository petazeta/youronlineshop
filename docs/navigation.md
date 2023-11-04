Navigation utility
==================

# Intro

At any single page application (SPA) the navigation browser features, for example buttons for backward and forward, are useless unless we would take control of them. There are some DOM objects methods that will help us to develop the navigation feature.

Navigation facility has two features:

- The initial search params at the entrance url that determines the page we are looking for.

- The navigation states which are reachable through out the backward and forward buttons.

# Search params

The two features shown above are working through out search params. Search params are key value pairs and determines the application history states that we can reach through out the initial search params or by the navigation buttons.

We have params available for some application elements, like menus pages, categories and items and login form. Some of these, like items, need a full path to reach them because some searchs are made in steps. A path to an item would look like: "?category=cat_Id&subcategory=subcat_Id&item=item_Id"

Navigation states are defined by an url and search params define these urls. We can get to them through browser navigation buttons and the url search field.

# Browser History

We are using these browsers navegation history features:

- window.onpopstate = (event) => {} // Dispatching an event when some navigator feature like backward browser button is clicked
- window.history.pushState(stateElement, null, url) // Set a browser history states

# Observer pattern applyed to browser history

We are implementing navigation facility through out a observable object which we are creating specially for this facility. We will attach an observer for every reachable history state. Observer object would be the node that defines the status key value, for example, some subcategory. The node id property would be the value to check for coincidence with the url search params. There can be situations where observer has no id, for example for the login screen state. In these cases we will be searching just for a key with value equal to "true". Here it is a example url search params: "?login=true"

When a browser navigation action is fired the observable navigation object will notify observers and they will check if their params values match to the url params search. When params are matching, the appropiate action is being performed.

# Implementation

The navigation object class is defined at client/navhistory.mjs. This object is implementing two facilities: the initial navigation url search procedure and the history buttons behaviour.

The procedure for using this facility at rendering is as follows:

The initial action would be to stablish the url states of the site. This states become available as soon as page elements are being rendered. The rendering elements that are part of some navigation history state are responsible of register its state. SetNav method helps to do so. When there there is posible to reach the state from the initial url param search then we should search for coincidences between the element search params and the browser url search params. For this we can use the initialNavSearch method.

## Initial navigation url search procedure

The initialNavSearch method helps to look for the corresponding action when there is a match between the inital url search and elements that have asociated a navigation state. This method should be executed everytime there is a rendering of some element that have a history state asociated.

## Search params herarchy

For rendering some history state pages there can be some rendering stages. 

## History procedure

When user gets to some page which an associated history state then it should be pushed. The pushNav method helps to do so. When the navigation buttons are pressed then an event is dispatched and the associated history state action is fired.


# Browser search params (client routing)

For the browser url search (initial) params we will use a similar approach. We just need to check at the clickable elements in layous if the element path name matchs the one at the search params and then produce the action.

# Search params and history implementation

This is the general idea, and the implementation module is at navhistory.js with these functions:

- setHistoryState(myNode, url, butAction); // For managing popstate event. It is called for the clickable nodes that has effect at the history state at the layout loading
- pushHistoryState(url); // Grabing the history at the browser when the user clicks a button element that take effect at the history state

# Search params and history states cases

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