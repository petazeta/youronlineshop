Overview
========

## Introduction

This software performs what so called Single Page Application (SPA). Any SPA need some services and it is common to use a framework for this purpouse. We have developed our own framework which name is: [Linker framework](linkerfmwk.md) or linker ecosystem.

In this guideline we will see some information about the linker ecosystem and the basic services of the SPA, some of them could be included as part of the the linker ecosystem to use them in other applications.

Plus to it we are using templates to show the elements and insert them into the html document (as well as perform some actions). These elements are contained in files at the layouts folder. We will refer sometimes to them using its file name without the file extension.

## Linker framework / ecosystem

Object classes where introduced to produce structured elements that could contain the basic data types. What is the next step forward? It is the way to produce structured elements containing another elements. This is what the linker framework helps doing by using relationships in database elements.

Linker framework is belonging to the singleton factory pattern. The "node" is the singleton that performs the vast mayoritiy of the procedures.

The node object can be extended for backend and frontend purpouses and it relates to other nodes in a parent-child tree structure, allowing the relationships regarding to the relational data structure of the database.

For the frontend (client) we are adding some characteristics to the basic node object:
- Loading templates and render them: showing them at the DOM and executing scripts inside them.
- Making requests to the server and retrieving the responses.

For the backend (server) we add some other characteristics for:
- Making database operations.

[Read more about the linker ecosystem](linkerfmwk.md)

## Server

Server is composed from these main services:

- [Files deliver service](staticserver.md)
- [Database service](db.md)
- [Layout service](layout.md)
- [Catalog images upload service](uploadimages.md)

And also these minor services:

- [Authenticate service](userlogin.md)
- [Cache service](cache.md)
- [Reports service](reporting.md)
- Starting service
- [Request manager](reqres.md)
- [Entrance script]()

## Client

Client main services are:

- [Start service](clientstart.md)
- [Request service](reqres.md)
- [Templates service](layout.md)
- [Login service](userlogin.md)
- [Languages service](languages.md)
- [Navigation facility](navigation.md)
- [Edition](edition.md)
- [Css](css.md)

Client minor services:

- Catalog images update service
- [Layout management](layout.md)
- [New installation](newinstall.md)
- [Observable](observerpattern.md)
- [Reporting](statistics.md)
- [Event listener](eventlistener.md)
- [Active link](activation.md)
- [Pagination facility](pagination.md)


## Shared services

Services common in client and server are:

- [Packing service](datatransfer.md)
- [Config service](config.md)

## Accesorial services

- [Error manging service](errors.md)

## Fundamentals

- [javascript inheritance](jsinheritance.md)
- [Asynchronicitiy](asyncawait.md)
- [Function composition](composition.md)

## Template files

Template files define the screen views and are included in themes. A theme is a collection of templates and css files. These files plus the client (and shared) scripts conform the front-end application. The client scripts are usually utilities that are invoked for the templates. So the front-end application core is the templates. Starting from the body template the other desired templates are requested depending of the application state. So for example an application could have a body that loads the login template. Login template would use some login scripts, perform login actions and then load the following template screen views. This procedure would be consecuently repeated for the new templates and so on.

Main facilities implementations that you can find in templates are:
- [Checkout](checkout.md)
- [User area](userarea.md)
- [Alerts]()

## Creating a desktop client with Electron

[Electron client](electron.md)
