Overview
========

## Introduction

This software performs what now is called a Single Page Application (SPA). Any SPA need some services and it is common to use a framework for this purpouse. We have develop our own framework so our development is not following any other framework. However the framework we are using has a name and it is the Linker framework or linker ecosystem. We are trying to develop it in a modular way so the components are autonomous and can be invoqued in different apps. However there is a common basic pattern: the linker ecosystem and its basic object: the "node".

As we aready see, this ecosystem determines a singleton object: the node. We would use this node for forntend and backend purpouses, each with its own characteristics. This node element defines a model for data objects and its parent-child structure. It allows relationships between child and parents conforming a relational data structure.

The basic node can be extended in the way it is needed.

In this guideline we will see some information about the linker ecosystem and the basic services of the SPA, some of them could be included as part of the the linker ecosystem to use them in other applications.

## Linker framework / ecosystem

Linker framework core are the following classes defined in these three modules: basicmixin.mjs, linksmixin.mjs and linkermixin.mjs. In this order they are layers of the basic object. (Design pattern is singleton factory)

For the frontend (client) we are adding some characteristics to the basic node object:

- Loading templates and render them: showing them at the DOM and executing scripts inside them.
- Making requests to the server and retrieving the responses.

For the backend (server) we add some other characteristics for:

- Making database operations.

[Read more about the linker ecosystem](linkerfmwk.md)

## Server

Server is composed from these main services:

- [Files deliver service](staticserver.md)
- Database service
- [Layout service](layout.md)
- [Catalog images upload service](uploadimages.md)

And also these minor services:

- Authenticate service
- Cache service
- [Reports service](reporting.md)
- Services Igniting service
- Request manager
- [Entrance script]()

This clasification comes from the diferent services sources or because some services can be shared betwen installations.

## Client

Client main services are:

- [Start service](clientstart.md)
- Request service
- Templates service
- [User and login service](userlogin.md)
- Language content service
- [Navigation facility](navigation.md)
- [Edition](edition.md)
- [Css](css.md)

Client minor services:

- Alerts
- Catalog images update service
- Layout management
- [Languages service](languages.md)
- New installation
- [Observable](observerpattern.md)
- [Reporting](statistics.md)


## Shared services

Services common in client and server are:

- Packing service
- [Config service](config.md)

## Accesorial services

- Error manging service.

## Template files

Template files define the screen views and are included in themes. A theme is a collection of templates and css files. These files plus the client (and shared) scripts conform the front-end application. The client scripts are usually utilities that are invoked for the templates. So the front-end application core is the templates. Starting from the body template the other desired templates are requested depending of the application state. So for example an application could have a body that loads the login template. Login template would use some login scripts, perform login actions and then load the following template screen views. This procedure would be consecuently repeated for the new templates and so on.

Main facilities implementations that you can find in templates are:
- [Checkout](checkout.md)
