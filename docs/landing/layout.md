Landing page layout
===================

## Loading strategy

Para cargar la página el loading es la propia página. Los componentes que se cargan en layouts no aparecen al princio. Para el tema del los params iniciales se hace por javascript, a traves de una función. Quiza habria que asegurarse para el tema de los params que se hayan cargado los componentes layouts antes de ejecutar el javascript que muestra el componente a través de los params iniciales. Habria que mirar para el tema de los idiomas como se podria hacer.

## Styles sheets files

There is a styles.css file that it is in loader. This file contains the styles that are needed in the main entrance. Then there are the style sheets files that are from the skin.



## Trabajo

Explicar los archivos de estilos, ver que archivos y como se podria organizar y renombrar tambien lo que sea necesario.

Probar este color hsl(221 21% 51% / 1); para texto. he puesto una imagen svg de fondo, convendría cambiarla para que pudiera repetirse y encajar como una sola imagen. Hay que cambiar atributos para el texto para que no se parta al reducir el marco, en el menu y en los login.
La x de cerrar se puede poner blanca con un cuadrado en la esquina con color de fondo: rgb(77, 91, 124); y hover rgb(36, 51, 90); y border-radius: 0 16px

La lista de veneficios puede tener un check al lado. Tambien habría que dejar mas espacio entre lineas. Quiza fijarse en lista webador.

Para la pantalla de login me estoy fijando en el diseño de digital ocean. El tamaño y la forma se asemejarán a digital ocean.
Me voy por boton de login, hay unas variables para radius cre en styles.css que convendria revisar para hacerlo acorde. Podria cambiar al verde el morado: #82fba2. El tamaño del boton no es acorde, ver como hacer el height, los inputs tienen line height, hacerlo todo acorde con parametros iguales. parece que sobresalen los inputs quiza hay que reducir el size (numero de letras). Me falta transicion en botones de menu, hacerlo como el de login.

Para el tema del dashboard de landing page:

Me he fijado en como es el dashboard de digital ocean y de wix. Tambien me he dado cuenta que la entrada para el login es muy parecida en ambas. parece que lo mas razonable es hacer una tabla en la cual la primera entrada sea el nombre de la tienda, la siguiente seria el url. Luego habria botones o un menu para las acciones. En el dashboard de digital ocean tiene unos iconos para añadir mas elementos. Lo divide en añadir algo nuevo y añadir recursos a lo pripio. En digital ocean tiene un boton ademas para crear de otro color. Una cosa que ambos tienen son las estadisticas que en el caso de digitalocean las muestra al pinchar el droplet y en wix las muestra directamente.
El diseño de la tabla me gusta mas la de digital ocean.

Para el tema de crear pagina en landing page:

Hay un auncio en landing page para free website, al pulsar se pretende crear una cuenta fantasma. Las cuentas fantasma no entran en dashboard pero se mantiene el login, de esta forma se controlan las tiendas que un mismo usuario produce. Se podria añadir el atributo fantasma con las credenciales de esta forma si fantasma esta activo no se muestra el dashboard. Las cuentas fantasma no estan validadas por email, si se validan con el email (quizas simplemente entrando con log in, se manda el password al email) ya no seria cuenta fantasma.

El tema de cuentas fantasma sería quizás mejor que se creara una cuenta sin nombre de usuario, de esta forma no sería necesario pedir ningún dato al usuario, se le crearia una url con nombre aleatorio y se le da la opcion de cambiara a otro nombre. Estas cuentas fantasma se validarían con el id de usuario.

He visitado webnode, quiza una idea es en lugar de sign in, poner create an store. Hay que tener en cuenta que todas estas tiendas tienen la administracion en dashboard mientras que yo la tengo en la propia web.

Fijarse en este layout: https://tina.io/

Revisar:
https://github.com/BradleyA/Linux-admin/tree/master/github-repository-traffic#github-repository-traffic