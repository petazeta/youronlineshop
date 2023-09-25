User login and create new user
==============================

## Server

### Introduction

User login is one of the basic feature for almost any web application. It allows to customize the elements for any person or account. This way the elements can be also saved and recovered later on at the next user login. The server side user login facility has two functions one is to collect the user credentials (user and password) and the other is to check that the they are correct. This is the task of the authentication element.

### Authentication

So when user provides its credentials succesfully we want to keep them available for any future user transaction that needs them. For this we need to use some http method. We will use token authentication. Tokens are tranferred in the http header as key value pairs. Tokens can be also encrypted or encoded for them not to be seen. For mantaining some standard we will use Basic Authentication encoding. Basic authentication uses data encoding in Base64 form. It can be easyly decoded but, as the https is now the standard, transaction would be safe.

Collecting the credentials from the header is one of the task of the authentication.mjs script. The other is to check that they are correct. This is performed through the userlogin function in module user.mjs.

Existe la posibilidad de que se de acceso a un determinado usuario automaticamente en la parte del servidor si se configura así. Esta configuración se realiza poniendo el nombre de usuario en la configuración config.autoLogin del servidor.

All this process has as result an user object. This object will be available for further queries, to check if user has or not permision for any concret action. Authentication is done automatically when the credentials are availabe en the head (token authentication), each time a request, that requires some action, is made from client.

### Creación de usuario

La creación de usuario comienza con la plantilla newform cuando se realiza la petición 'create user' a la Api. Esto produce en el servidor la creación de usuario a través de la clase User. La creación de usuario produce la creación del usuario en la base de datos incluyendo la fecha de creación, el nombre de usuario, el establecimiento del tipo de usuario (customer), la codificación del password y además los elementos de userdata y address que en principio no tendrán valores establecidos. También se realiza un reporte sobre la creación de usuario.

Como resultado la Api nos devuelve el usuario completo (tambien devuelve el dato del password codificado).

## Client

### Login

En cliente cuando un usuario reclama el login (con resultado satisfactorio) esto produce que se cargue el usuario en el cliente y que se establezcan los valores para que en próximas conexiones esten disponibles las credenciales.

La petición de login es un request (action: login) con el numbre de usuario y el password como parámetros. El password parece que no está codificado en la petición ni en cuando se guarda en el cliente. En el servidor la petición de login no produce ningún efecto, tan sólo actualiza la fecha de acceso del usuario en la bd y da como respuesta los datos del usuario o una respuesta de error. Como vimos anteriormente el proceso de autentificación en servidor se realiza automaticamente cuando se reciben las credenciales en el header.

En cliente el usuario esta disponible en la variable global webuser. La realización del login se hace a través de la plantilla loginform y el método login de la clase usuario en user.js. Este método produce la notificación del evento a algunos elementos que pueden cambiar el estado de elementos de la pantalla (como elementos que tengan posibilidad de edición) y otras cuestiones que se hayan definido mediante addEventListener o setReaction. 

La pantalla de login es un layout que va por encima de la página, no se carga dentro de centralcontent si no que va como una capa superior a todo. Por esta razón no produce un cambio en el grupo de activación de central content pero si tiene un estado de navegación cuyo url es '?login=0'. Los que sí producirán cambio en el grupo de activación de central content son los espacios de usuario que aparecen cuando el usuario ha entrado. Pero éstas no crean estados de navegación.


### Nuevo usuario

El cliente mediante la plantilla newform realiza un request 'user create' como se ha indicado en el apartado del servidor. Si el resultado es correcto realiza el login con este nuevo usuario creado y pasa al área de usuario.

### logout

La plantilla usermenu tiene el botón que realiza el logout. La acción de desarrolla a través del método del mismo nombre en la clase User. Se borrarán los datos del usuario y la autentificación además de realizar las notificaciones pertinentes. También se realiza un report de la acción logout.


