Transfering data between client and server
==========================================

# Introduction

Between client and server there is always communication that in this application can be esentialy of two types. One is the usual communication for transfering files between client and server and the other is for transfering database content. We will reffer in this text to this second case.

# Transforming nested data to not nested one (packing)

There are some data saved at the database in the server and we would want to collect it from the client and maybe modify it or add some more data. Our data structure is basically a node, or data entity,that contain the data in some property (or properties) and is connected to other data nodes in sa hieraquical structure. We can unite the data in Json format and then transfer this data, and for a better data consistency and readability we would transform the structure to a not nested data structure format.

For this porpouse we would need to add an id to any node so we can have a way to reffer to that node as unique. Once having a unique id for each node we could list the nodes and assing a field for the parent node, this way we maintain the data structure.

## Implementation

The algoritm that makes it posible is at file shred/modules/utils.js. For make it posible we start by the root node then we use the parent element to mantain the structure format.

| id ; root node (with no references to other nodes) |

| id ; some node (with no references to other nodes) with parent id |

...

| 'index' ; id of the starting data node |


## Testing packing / unpacking algorithm

For testing it we would use it as a script inserted inside an html file to get benefit of the front end facilities for testing scripts. Got it we would need a server enviroment because open it directly from the browser would cause a the cors policy error. We will use for this porpouse the server script.

This is the test script that we attach to the html file:

import basicMixin from './shared/modules/basicmixin.js';
import linksMixin from './shared/modules/linksmixin.js';
import {commonMixin, linkerMixin, dataMixin, linkerExpressMixin, dataExpressMixin} from './shared/modules/linkermixin.js';
import {packing, unpacking} from './shared/modules/utils.js';

const DataNode = dataExpressMixin(dataMixin(commonMixin(linksMixin(basicMixin(class {})))));
const LinkerNode = linkerExpressMixin(linkerMixin(commonMixin(linksMixin(basicMixin(class {})))));

const MyData = new DataNode({myprop: "hola"});
const MyLinker = new LinkerNode("table1");

MyLinker.addChild(MyData);

console.log(MyLinker);
console.log(JSON.stringify(packing(MyLinker)), packing(MyLinker));
console.log(unpacking(packing(MyLinker)));

If we run the script we would see the suitable results fot the case.

# Data transfer protocol

There is a fixed protocol for the sending data that includes an action and some parameters. The response depends more of the action requested, and there is an error response protocol.

## The request data

We are sending a request, this request include the type of request (action) and some data, and it is wrapped like this:

{action: (some text content), paramenters: {nodeData: (the serilized node in packing format), ...}}.

This is the most common case. We are sending some request to server, for example "load my children" and we are including the serialized present node in packing format and optionally other parameters that can be useful. Obviusly we need to send this request element in text format, that is, JSON format.

## The response data

The server response hasn't a tight structure but depends of the data requested. Usually the answere is just the data requested but some time it comes with the field total (number of the resulting nodes) and data (for the data itself). The data used to come serialized and packed as well. And for some error response for the server the protocol is an error field set to true and a message field that contains some text error explanatory.

## Implementation

For implementing the data conversion we are using some functions in client side and server side.

### Client facilities (requesting)

For sending and receiving data we got the methods request and loadRequest at client/modules/nodesfront.js. The second method send data and loads data in the desired way. The file client/modules/request.js contains a list of functions organized by the request action. These functions return the data to be sent depending on the action requested,the present node that make the request and the parameters to be sent. Also, at the same file, there are another list of functions for loading the requested data (usually in the present node that makes the request). These functions are used by methods request and loadRequest. The usual function behaviour in request.js is to reduce the amount of data to be sent (to send just the data needed for the current request) and to pack the node data befor esending it. The oposit behaviour for loading the data used to be unpacking it and then loading it at the present node.

### Server facilities (responding)

Data request procesing is at file server/modules/response.js. The scripts there combinated with server/modules/respond.js make the petition execution and returns a response.