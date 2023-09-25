How to Build a multi shop server
================================

## Introduction

We can achieve a multi shop server by starting serveral YOS instances running at different http ports. You can achieve this goal by running the instances through processes directly in the operative system or with in a container using an application like Docker. But you can also do it within the YOS application itself, which would consume less resources.

For making the derivations from the suitable host urls to their correspondent shop instance ports you can use a reverse proxy program like Nginx or just write the forwarding in Nodejs.

## Implementation

You can run several shops instances listening to different http ports in one machine in a multi-task form in two ways:

### Multi-task throughout OS

You can let the OS to run each shop instance separatelly. For this purpose exists containerizers automation programs like Docker that facilitates the process.

### Multi-task within the program

You can set different shops running at different ports at once directly with in the program. More details of how this is achieved are described at [Contexts](constexts.md).

#### Steps to reproduce multi-shop

- Replicate "context__main" folder (and its content) at "yos/server/context__main" once for each instance shop.
- Modify the files:
  - yos/server/context__new_shop/cfg/dbcustom.mjs => to set up the new mongodb url of the shop
  - yos/server/context__new_shop/cfg/default.mjs => to set up the catalog-images folder and the logs file of the new shop.
- Execute (at top folder):
  - node serverindex.mjs instances=./server/context__new_shop/main.mjs:8001,./server/context__another_shop/main.mjs:8002, etc...

## Sharing services

Once your shops are running in multi-task mode you may think that you can boost the performance of the overall application by sharing some shop services instead of having every single service in an individual shop. When you got a unique shop you need all the services on it but when you have more you can implement shared services for all of them. Services that are more likely to be exclusive are the ones related to the database, but there are others that can be shared. Layouts and client front end application files delivery services are some of those ones that could be shared.

When a service is shared, service configuration files and other data elements are a shared element for every service consumer. It is the same service for every consumer, it doesn't take in account the consumer of the service, it is the same for everyone. But service consumers requests could be different.

### Services orchestation

One shop backend application can be splitted in the following independent services:
- Layouts content service: deliver the layouts elements that conforms the html and css content.
- Client source files service: deliver the front end application to the client (browser).
- Products images files service: deliver products images.
- Upload products images files service.
- Database request service: provide access to database content for reading and writing (dependent of the invividual shop)

Lets say that for example we want to share layouts service. Therefore we can copy the context__main folder and rename it to context__layouts for instance. Then for every shop instance at the api gateway: server/context__shopname/main.mjs there would be a change. Instead of importing its own module for the layout service It will import it from the context__layouts.

`import('./layouts.mjs')  ==>  import('../context__layouts/layouts.mjs')` Note (1)

We can do the same for other servicies like `clientsource.mjs`

By doing so we are freeing every shop of that task what can be a great improvement in saving resources if we have several ones.

In case we would use multiprocess instead of multithreading we can still provide centralized services but the service orchestation should be done at the reverse proxy ahead and the forward parameters would be related to the requested url path and the service port.

- Note 1: Another minor change must be done in serverstart.mjs in the example in order to not use the layouts start service at the instance shops. This layoutsInit function is preloading some layouts functionallity so we can deactivate it from the serverstart functionallity of the instance shops.

### System desing

The system design could be having these shared services: layouts, client source files, product images, product uploadas and the database. Some of them could be upgraded by adding a cache system (Cache)[cache.md]. By default cache is enabled for the layouts service.

Then we can launch as many shops as posible in one machine (forwarding their services to the shared ones as described before). The number of shops should be measured depending on shops traffic and computer power.