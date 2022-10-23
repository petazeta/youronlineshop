Requesting and responding
=========================

# Introduction

At datatransfer.md we describe how data is transferred between client and server. In this text we will explain the requested methodology for any client server interaction.

# Server

Serving the requests responses is the main deal for the server side scripts. For this reason we will first get into the server element as it goes more straight to the point.

The init server script acts like a router or switcher that sets which scripts (interfaces) should be executed. The server scripts are these ones:

- Database requests interface
- File serving interface (one for download and another for upload files)
- Themes interface

The response script selector consists on a string matching for the requested url. The url pathname is checked with the config pathname for all the above cases.

## Implementation of the switch

The switch base is a map for listing the posible interfaces. The map elements values are the interfaces selectors: selector function. These functions would return true (or anything not false) only when the corresponding interface has been requested by the url. These way we can loop for the map and stop whenever the suitable element is present. Then the interface is loaded for the corresponding request.

The switch act as a module which is loaded as the main app / function.

The code is at server/index.mjs

### State modules or stateless modules

I have called state modules, to that modules that has a status, that is, they holds memory or vars with data. Some modules data can be initiated once and reuse it or the data can be modified durent the program execution. When using these programing elements then we should care about what happens if there is two request that can have concurrency, that is, that intefare in the data. In that case we may use syncronous processes for avoiding unexpected results. But also sometimes we expect to process requests in order because the order has some imporance. In such a case asyncrinous requests could produce not to process the requests in order. For this reason we sometimes use await in the index.mjs code to proceed syncronously.

But we would like to get benefit of the asyncronous procedures so for the file manager we acts asyncronously. For these reason we are using the steteless modules elements on that case.

There is a config file containing the interfaces url paths. Config files are explained at the corresponding chapter. The code above is quite self explanatory so we are not going to give any more details.

We are not taking in account posible conflits of database requests, because we are sending the request to be processed and if another requests comes and access the same database resource that could cause confilct if some request makes changes in the resource. At the moment we left that posibility so we are not aware how the http module deals with requests. We could block the programming flue by using await for wating when sending the requests to be processed, but at the momento we are not doing that.

## The database requests interface

Database requests are the main server task. Once the web theme is loaded we are gonna make requests to fulfill the theme elements that comes from the database. This is therefore the key element for the user to interact with the web app. Database requests can be of these types: reading and writing requests. And the writing requests can be of these types: creating, updating and deleting.

For storing the suitable responses of the requests we will use the same strategy as the main thread switch: a map element containing the routines for every request. These routines will be also in charge of the routine authorization, that is, to check if the requester is authorized to proceed with the requested action. If the authorization is invalid then it will throw an error that will be passed through untill the request manager.

### The request manager

Request manager implementation is at respond.mjs file.

It is the entrance routine and it is in charge of collecting the request and deliver a response. It will lauch one of the response list routines and will send the result back. But it has also another task that is launching authentication routine. Authentication is described more in detail at userlogin.md. It consists in recognize the user that is making the request.

Once we got the request and the user then we can launch the corresponding routine. The routines list is at the response list. They require the action, the parameters and the user.

### The response list

Response lists also will authorize the request for the user. If the authorization is not performed the request would be blocked.

## Multi-site mode dejar para otro texto

and which database should be selected depending on the requested url

There is a multi-ste mode where the same script (code) is used for different site configurations and databases, this way we save the code installation for every site. In this mode 


# Client

nodesfront.js and request.js and some individuals for loadall
