User login and create new user
==============================

## Introduction

User log-in is one of the basic features for almost any web application. It enables to have customized elements for personal accounts. This way user data can be also saved and recovered later on at the next user session.

For keeping user session alive we are sending user credentials from client to server for every transaction that would require authentication. This procedure starts when the user provide its credentials through out the login page. If credentials are correct, they would be stored on client machine while webpage would remain open. There is no session stored in server or client, it is just the client script that saves credentials and sends them to server in the header when required.

## Server

### Introduction

Server side user log in facility is performed after user uses the log in form. The client is requesting the login action to server, then server returns the user object that is loaded by the client. The server answer is performed by the corresponding response at responses.mjs module. After a successful login attempt client will store user credentials and then for every transaction between client and server, requiring user credentials, the client would send credentials in the request header. Server then has to check it to authorize the transaction, this tasks is called authentication.

Authentication has mainly two tasks: one is to collect the user credentials (user and password) and the other is to check that the they are correct. Lets check now the authentication task.

### Authentication

We are using Basic Authentication encoding, that is, encoding in Base64 form. It can be easyly decoded but, as the https is now the standard, transaction would be safe anyway for https connections.

Collecting the credentials from the header is the main task of authentication.mjs script. The others are decode it and check that they are correct. This last one is performed by User class static method: login. This User class feature is defined at usermixin.mjs.

### User creation

User creation process at server starts when the client browser make a "create user" request to server api. The responses.mjs module acts as "multiplexer" for the several requests that can be received. When it receives the "create user" one it makes use of the static method create from User class that is defined at usermixin.mjs module. Lets take a look at this method.

The method "create" returns an error object if there is any problem, otherway it returs an user object. the user object is created and inserted at the database with the userType relationship and empty address and userdata database rows.

## Client

### Authentication

The module authorization.mjs stores the credentials values (authentication token). When a request is performed to the server these credentials would be sent in header. The module request.mjs performs the requests.

### Login

The login process starts when user gets into the login view. This process is performed by module webuser/login.mjs that will execute webuser's login method.

The webuser variable is at context__main/webuser/webuser.mjs and it is instantiated at very first at the entrance script function "main" at context__main/main.mjs module. The login user class method defined at webuser/usermixin.mjs main pourpose is to set the credentials for future requests. It makes a server request called login to check if credentials are correct. If server response is positive then the login method sets the credentials through out webuser/authorization.mjs setAuthorization and reset webuser variable data for loading the user data received from server. It also notify webuser observers about the login event, what could produce several reactions.

#### Login View

Login view and its behaviour is defined at context__main/webuser/login.mjs. The entrance function is setLogIcon that sets the login button action. it is called once at page load by context__main/body.mjs. It defines an entrace url path for login: "?login=true". There is no history registry for it but it can be used as a link to enter straight on to the login page.

The login page view is loaded as a layout above the main page. We achieve it by loading the login container element directly in the body at the same level that the background and, because of its styling, it remains above the other elements. We are using the rmBoxView function from rmbox.mjs for adding a close window button.

### Sing Up View

The user class static method create is executed for creating new user after the user creation is submited at context__main/webuser/login.mjs signUpFormSubm function. It makes a request to server called "create user" and if success it returns the user object. The User object is then passed to login method for making the login.

### Dashboard page
 ver userarea.md


