Pagination
==========

El elemento central en la paginación son los elementos sobre los que se pagina y que se muestran en pantalla, en adelante llamaremos marco de paginación a la parte de la pantalla donde se muestran estos elementos. La paginación calcula el primer y el último elemento que se han de mostrar en el marco y crea unos botones que dan acceso a las otras páginas. Todos los elementos disponibles para el listado están numerados para ser mostrados en un orden. La plantilla encargada de crear el marco utilizará los valores startIndex y endIndex para mostrar el rango correspondiente. A partir de estos dos datos hará un request a la Bd para obtener esta franja de elementos. La plantilla 'catalog' es la encargada de este cometido.

La paginación consta de dos apartados:
- La parte que contiene los resultados (marco)
- La parte que contiene los índices (botones)

Antes de mostrar la paginación ha de conocerse de antemano el número de resultados para que la parte del índice pueda generarse. Por ello se carga el numero de resultados primero haciendo un loadRequest get my children con el parámetro count: true. (Esto es en subcategory tp).

Una vez cargado este número se crea un nuevo objecto pagination (clase pagination creada para tal fin) y se carga el template pagination. El template pagination a partir del objecto pagination genera el index (botones) y lo carga.

Es posible que la pagination de una subcategoría ya esté creada, y para eso existe un Map en el módulo pagination vinculando cada subcategoría con su paginación, para guardar los pagination creados y así mantener sus estados.

Para poder ajustar la edición de elementos al reglamento que se usa en paginación hemos creado unas funciones de ayuda que se aplicarán cuando se produzca edición: (borrado, añadido o movido) de elementos.

## Deleting

Cuando se elimina un elemento en un cuadro de paginación hay algunos casos en los que no hace falta hacer ningún reajuste: cuando estamos en la última página y aún quedan elementos que mostrar o cuando sólo hay una página.

Sin embargo si estamos en páginas intermedias hace falta rellenar el hueco que queda con los elementos posteriores. Para no complicarnos con nuevas consultas a la base de datos lo que haremos será reproducir la acción que se realiza al pinchar al index actual renovando así todos los elementos de la página.

Otra cosa que podría pasar es que la última página quedara vacía y por tanto habría que eliminar su index. Y si además coincide que es la página activa, hay que hacer ajustar el index actual (pasa a ser el anterior) antes de hacer la recarga de los elementos a través de la acción que produce el index al pincharlo.

## Adding

Al añadir un elemento si estamos en la última página y la página aún tiene espacio para un elemento más no habría que hacer nada especial. 

Si no estamos en la última página o la página es la última pero está completa habría que sacar del cuadro el elemento último. Además si el elemento añadido coincide con el que se saca convendría pasar a esa página donde esta nuevo.

Si se incrementa el número de páginas hay que actualizar el índice.

## Moving

Cambiar un elemento de lugar puede ocasionar que ese elemento, si está en páginas intermedias, pase a otra página. Por ello habría que cambiar de página en esos casos.

## Serving pagination

Para usar este servicio se ha de crear un elemento pagination a través de la función del módulo apropiada y después cargar la plantilla pagination a través del nodo que es el partner de los elementos a ser mostrados. Esto se realiza en la plantilla subcategory. En la misma plantilla para ajustar los elementos de edición se ha de crear un listener a los eventos delete, create and move.

## Procedure

Para paginar los resultados de requiere un layout que cumpla las premisas de recibir como parámetros los índices de comienzo y final y como nodo principal el parent partner de los elementos a mostrar. Esta plantilla mostrará los elementos correspondientes a los índices. Para el ejemplo a la plantallia la llamaremos elementsView.

Antes de mostrar esa plantilla realizaremos las siguientes acciones:

- Se importa el módulo: `const {getPagination}= await import('./' + CLIENT_MODULES_PATH + 'pagination.js');`
- Se calcula el numero total de resultados a mostrar, algo como: `await rootNode.getRelationship('relName').loadRequest("get my children", {count: true});`
- Se crea el elemento pagination con los parámetros correspondientes: `createPagination(rootNode, url, pageSize, rootNode.getRelationship('relName'), 'elementsViewTemplate');`
- Se visualiza la plantilla: `rootNode.setView(document.getElementById("centralcontent"), "pagination");`

En la plantilla se cargarán los resultados y se mostrarán:

`await rootNode.getRelationship("relName").loadRequest("get my tree", {extraParents: extraParents, limit: [thisParams.startIndex, thisParams.endIndex]});
await rootNode.getRelationship("relName").setChildrenView(thisElement, "elementTp");`

Cuando haya posibilidad de edición habrá que establecer unos listeners para los casos correspondientes, por ejemplo:
```
rootNode.getRelationship("relName").addEventListener('addNewNode', (elementNode)=>getPagination(rootNode).onAdded(elementNode), 'addNewNode');
rootNode.getRelationship("relName").addEventListener('deleteChildNode', (elementNode)=>getPagination(rootNode).onDeleted(elementNode), 'deleteChildNode');
rootNode.getRelationship("relName").addEventListener('moveNode', (move, elementNode, newOrder)=>getPagination(rootNode).onMoved(move, elementNode, newOrder), 'moveNode');
```

## Notas

No entiendo por qué utilizamos el parent partner como argumento en getPagination, ¿y si tuvieramos dos pagination distintas para un mismo parent parnter? no sería mejor tomar como argumento el parent?