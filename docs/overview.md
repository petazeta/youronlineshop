Programmers Manual
==================

# 🚧 Work in progress 🚧

## Introduction

This software performs what so called Single Page Application (SPA). For carrying out this task it is build through out some fundamental software procedures, some of them are widespread metodologies and anothers are unique features that we have developed. There are almost no dependencies of any libraries except the basics for some external features. The concepts that inspire the software are some of the ones that configure the nowdays software paradigms: Object Oriented Programming, Modules, Design Paterns, Arrow functions, Function Generators, Asynchronicitiy, Promises, Regular Expresions, Nodes, Trees, Relational Databases and Context. And also the current technologies for the web: HTML (DOM, templates) and CSS.

This software belongs to a bigger software project product which is still not finished which could be applyed to several other web services not related with e-commerce.

## Documentation

At the current stage of the sofware we are trying to produce a documentation that could be used like a guide for any developer. Reading and understanding this documentation is the best way to understand the software which is following an exclusive design paradigm.

There are three pilars that holds the most important software implemention, these are:

- [Linker-web System](linker.md)
- [Contexts](contexts.md)
- [Layout](layout.md)

Understanding basic mechanics of these elements is essential for being able to develop additional software pieces. 


## Software fundations

The software here present is made through Linker Visual CMS web engine (or linker-web for simplicity) which is a library for developing web solutions. You can find more information about it [here](linker.md).

## Fundamentals

As we have said above in the introduction there are some principles that should be well known for any developer interested in this software. We have written a guide to some of the key concepts that support the software and the issues that can produce and how we are resolving them. We enfatize in the aspects that are related with this sofware implementation. Developers should pay special atention to [Linker-web System](linker.md) that is a principle we are following for the entire application and to [Contexts](contexts.md) to understand modules organization.

- [Coding standards](standards.md)
- [Javascript inheritance](jsinheritance.md)
- [Composition](composition.md)
- [Asynchronicitiy](asyncawait.md)
- [Function composition](functioncomposition.md)
- [Contexts](contexts.md)
- [Server side concurrency](concurrency.md)
- [Iterables](iterables.md)
- [Linker-web System](linker.md)

## Server-Client distintion

This software has a clear distintion between server components and client components. Sometimes also known as backend and frontend elements.

## Server

Server is composed from these main services:

- [Client source files](staticserver.md)
- [Database](database.md)
- [Layout](layout.md)
- [Catalog images](downloadimages.md)
- [Catalog images upload](uploadimages.md)

And also these minor services:

- [Authenticate](userlogin.md)
- [Cache](cache.md)
- [Reports](reporting.md)
- Starting
- [Request](reqres.md)
- [Entrance script]()
- [Utils](utils.md)

## Client

Client main services are:

- [Start service](clientstart.md)
- [Request service](reqres.md)
- [Templates service](layout.md)
- [Login service](userlogin.md)
- [Text content service](sitecontent.md)
- [Navigation facility](navigation.md)
- [Edition](edition.md)
- [Css](css.md)

Client minor services:

- [Config service](config.md)
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

- [Utils](utils.md)

## Accesorial services

- [Error manging service](errors.md)

## Other features

- [plugins](plugins.md)

## Template files

Template files define the screen views and are included in themes. A theme is a collection of templates and css files. These files plus the client (and shared) scripts conform the front-end application. The client scripts are usually utilities that are invoked for the templates. So the front-end application core is the templates. Starting from the body template the other desired templates are requested depending of the application state. So for example an application could have a body that loads the login template. Login template would use some login scripts, perform login actions and then load the following template screen views. This procedure would be consecuently repeated for the new templates and so on.

Main facilities implementations that you can find in templates are:
- [Checkout](checkout.md)
- [User area](userarea.md)
- [Alerts]()

## Creating a desktop client with Electron

[Electron client](electron.md)

## Miscelaneous

[Multi shop](multishopguide.md)
[Multi service](microservices.md)
[Versioning](versioning.md)
