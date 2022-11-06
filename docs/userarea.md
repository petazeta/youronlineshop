User Area
=========

## Introduction

El área de usuario se concentra en el menu de usuario (layout usermenu). Este menu de usuario contiene una serie de botones los cuales son para todo tipo de usuarios o los que son especificamente para los usuarios con el rol de administrador. Estos botones dan acceso a unas áreas de usuario determinadas, veamos cuales son:
- Datos básicos del usuario: nombre, email, etc...
- Datos de los pedidos del usuario o datos de los pedidos en general si se entra con rol ordersadmin
- Datos de la dirección del usuario
- Acción de cambio del password
- Elementos administrables del contenido web que no son accesibles mediante la navegación (rol webadmin)
- Herramienta para la edición de texto (script introducido de una otra app)
- Exportación de contenido (rol systemadmin)
- Importación de contenido (rol systemadmin)
- Administración de lenguages (rol systemadmin)

## Botones del menu

En el layout usermenu se muestran los botones para acceder a las áreas indicadas así como un botón más para el logout. Los que dan acceso a las áreas se implementan con el layout stdbutton al que se le pasan unos parámetros para que realice la acción adecuada al ser pulsado.

## Áreas de usuario

### Información básica de usuario

La información de usuario se muestra a través de la plantilla: showuserinfo que a su vez carga useraddressview que a su vez utiliza userdata la cual usa la función setPropsView que muestra cada campo utilizando a su vez la plantilla singleinput. De esto ya se habló en [checkout.md](checkout.md).
Esta información será editable.

### Pedidos del usuario

Los pedidos del usuario son almacenados en la base de datos y tienen una propiedad llamada status que determina si el pedido ha sido o no procesado: status => 0: sin procesar, 1: procesado.

Los pedidos se mostrarán organizados según si han sido procesados o están pendientes de procesamiento.

En el caso de que el usuario se de tipo cliente se mostrarán los pedidos realizados por ese usuario. Y podrá ver la dirección del pedido y el pedido en sí. El pedido al mostrarse también puede mostrar el botón de pago en caso de que el pago esté sin realizar, que se puede saber a través de la propiedad del objecto payment, llamada succeed.

En el caso de que el usuario sea de tipo ordersadmin se mostrarán todos los pedidos que existan y se permitirá eliminar pedidos o cambiar su estado de procesamiento.

Las plantillas que participan en este proceso son: showorders, userorders y userordersline. Además si se pincha en el pedido participarán: order, ordershipping and the template for the payment: paypal. Si se pincha en address participarán: useraddressview, userdata y singleinput. Además cuando el usuario es del tipo ordersadmin se mostrarán las plantillas butdelete y butsuccessorder.

### Info de usuario

Estos datos se muestran con la misma plantilla que se usa cuando se muestra el pedido o cuando se pide la dirección para la realización del pedido. Las plantillas son: useraddressview, userdata y singleinput/singlefield/singlelabel.

### Cambio de password

La plantilla changepwd realiza el cambio de password a través del método de la clase usuario updateMyPwd. Este método realiza la consulta con action "update my user pwd". Esta petición a la Api produce el cambio del password en la base de datos. Como es el propio usuario el que realiza este cambio, no es necesario ningún tipo de comprobación de seguiridad extra.

### Edición de elementos extraordinarios

La plantilla extraedition muestra un listado de valores a editar con botones de edición. Estos elementos son complicados de editar en su visualización por la manera en que aparecen en pantalla y por eso se da esta opción de edición. Se requiere ser usuario con rol webadmin.

### Herramienta para la edición de texto

Aparece aquí una herramiento que es software externo. 

### Export

La plantilla export que se ayuda del script export.js permite exportar para luego importar contenido actual de la base de datos. Si se exporta la base de datos entera se puede guardar en el archivo serer/utils/mongodb_dtbs.json que servirá para que se carge esa base de datos en una nueva instalación. Se puede ver en este último caso cómo esta estructurada la base de datos. Se requiere el rol systemadmin.

### Import

La plantilla import que se ayuda del script import.js permite cargar datos exportados para así establecer elementos como contenido textual de la página. Actualmente las operaciones de importación que se pueden hacer son:
- Contenido de los menus y su contenido en páginas
- Contenido del catálogo
- Tipos de envios y de pagos
- ...

### Languages