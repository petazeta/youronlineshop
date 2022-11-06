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

This is the idea, and the implementation module is at navhistory.js with these functions:

- setHistoryState(myNode, url, butAction); // For managing popstate event. It is called for the clickable nodes that has effect at the history state at the layout loading
- pushHistoryState(url); // Grabing the history at the browser when the user clicks a button element that take effect at the history state

# Search params and history status cases

Categiries/items, menus/docs and login

# Active buttons

Sometimes we need to highlight the element that has been selected. For example some category and subcategory. The selected element is in bold type for example. To set this feature we are using this module: activelauncher.js.

There is also another posibility when there are some buttons that take effect to the same container. In this case we would use a group to clasify these elements. We got the "central content" group for example so when a "button like" element is marked as selected the others that belong to the same group will be unselected.

## Procedure

myNode.highLightElement

## Casos especiales

Hay ocasiones en las que se produce el refresco de los elementos visuales, esto significa que los elementos que una vez estuvieron activos pueden volver a renderizarse. En esta situación un elemento activo debería conservar su renderización activa, por eso es necesario incluir una comprobación de si el elemento es activo en al mostrar su plantilla y volver a realizar el procedimiento en ese caso.

Por ejemplo un login de un administrador de productos produciría una nueva renderización de las categorías y subcategorías. La subcategoría activa debería al renderizarse producir de nuevo su activación y habría que incluir el siguiente código:

if (thisNode.selected) setActive(thisNode);

No sería necesario sin embargo incluir esta lógica en el layout de la categoría porque la activación de la subcategoría incluye la activación de las categorías por encima. Tampoco sería necesario realizar el setActiveInGroup, ya que el lastActive no ha cambiado. Cuidado con substituir setActive por setActiveInGroup, esto podría no funcionar correctamente.

# Pagination

El elemento central en la paginación son los elementos sobre los que se pagina y que se muestran en pantalla, en adelante llamaremos marco de paginación a la parte de la pantalla donde se muestran estos elementos. La paginación calcula el primer y el último elemento que se han de mostrar en el marco y crea unos botones que dan acceso a las otras páginas. Todos los elementos disponibles para el listado están numerados para ser mostrados en un orden. La plantilla encargada de crear el marco utilizará los valores startIndex y endIndex para mostrar el rango correspondiente. A partir de estos dos datos hará un request a la Bd para obtener esta franja de elementos. La plantilla 'catalog' es la encargada de este cometido.

La paginación consta de dos apartados:
- La parte que contiene los resultados (marco)
- La parte que contiene los índices (botones)

Antes de muostrar la paginación ha de conocerse de antemano el número de resultados para que la parte del índice pueda generarse. Por ello se carga el numero de resultados primero haciendo un loadRequest get my children con el parámetro count: true. (Esto es en subcategory tp).

Una vez cargado este número se crea un nuevo objecto pagination (clase pagination creada para tal fin) y se carga el template pagination. El template pagination a partir del objecto pagination genera el index (botones) y lo carga.

Es posible que la pagination de una subcategoría ya esté creada, y para eso existe un Map en el módulo pagination vinculando cada subcategoría con su paginación, para guardar los pagination creados y así mantener sus estados.

Para poder ajustar la edición de elementos al reglamento que se usa en paginación hemos creado unas funciones de ayuda que se aplicarán cuando se produzca edición: (borrado, añadido o movido) de elementos.

## Deleting

Cuando se elimina un elemento en un cuadro de paginación hay algunos casos en los que no hace falta hacer ningún reajuste: cuando estamos en la última página y aún quedan elementos que mostrar o cuando sólo hay una página.

Sin embargo si estamos en páginas intermedias hace falta rellenar el hueco que queda con los elementos posteriores. Para no complicarnos con nuevas consultas a la base de datos lo que haremos será reproducir la acción que se realiza al pinchar al index actual renovando así todos los elementos de la página.

Otra cosa que podría pasar es que la última página quedara vacía y por tanto habría que eliminar su index. Y si además coincide que es la página activa, hay que hacer ajustar el index actual (pasa a ser el anterior) antes de hacer la recarga de los elementos a través de la acción que produce el index al pincharlo.

## Adding

Al añadir un elemento si estamos en la última página y la página aún tiene espacio para un elemento más no habría que hacer nada especial. 

Si no estamos en la última página o la página es la última pero está completa habría que sacar el elemento último. Además si el elemento añadido coincide con el que se saca convendría pasar a esa página donde esta nuevo.

Si se incrementa el número de páginas hay que actualizar el índice.

## Moving

Cambiar un elemento de lugar puede ocasionar que ese elemento, si está en páginas intermedias, pase a otra página. Por ello habría que cambiar de página en esos casos.

## Serving pagination

Para usar este servicio se ha de crear un elemento pagination a través de la función del módulo apropiada y después cargar la plantilla pagination a través del nodo que es el partner de los elementos a ser mostrados. Esto se realiza en la plantilla subcategory. En la misma plantilla para ajustar los elementos de edición se ha de crear un listener a los eventos delete, create and move.

## Configuration

There is a configuration option that is the page size. This parameter name is catPageSize for the items pagination. See [config](config.md).


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