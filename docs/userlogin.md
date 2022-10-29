User login and create new user
==============================

## Server

### Introduction

User login is one of the basic feature for almost any web application. It allows to customize the elements for any person or account. This way the elements can be also saved and recovered later on at the next user login. The server side user login facility has two functions one is to collect the user credentials (user and password) and the other is to check that the they are correct.

The first facility is named authentication and the second is the login check.

### Authentication

So when user provides its credentials succesfully we want to keep them available for any future user transaction that needs them. For this we need to use some http method. We will use token authentication. Tokens are tranferred in the http header as key value pairs. Tokens can be also encrypted or encoded for them not to be seen. For mantaining some standard we will use Basic Authentication encoding. Basic authentication uses data encoding in Base64 form. It can be easyly decoded but, as the https is now the standard, transaction would be safe.

Collecting the credentials from the header is the task of the authentication.mjs script.

### Login check

Las acciones del servidor que requieren autenticación utilizan el script antes mencionado authentication.mjs. Existe la posibilidad de que se de acceso a un determinado usuario automaticamente al entrar en la página si se configura en el servidor. Esta configuración se realiza poniendo el nombre de usuario en la configuración config.autoLogin.

El procedimiento se realiza como se ha explicado en el apartado authentication y una vez tomados los datos de usuario (username and password) se porcede a llamar a la función userLogin de user.mjs. Que realiza las comprobaciones en la base de datos. Si el resultado es el adecuado creará un objecto usuario con los datos del usuario correspondiente y lo devolvera para que se pueda usar en la comprobación siguiente para la autorización en la consulta.

### Creación de usuario



------

Login entrance and exit

When entrance for web admin we are showing sometimes the last page because usually we are in items view and we want to edit them for example. For logout the page state before login is also sometimes stablished.


