Linker Visual CMS
===================

## Introduction

Linker Visual CMS web engine is a content manager system that allows to edit the web while browsing.

The system GUI is build up from html templates, css and database text content. This last one element is the one that can be edited with the CMS.

Linker-web is very suitable for desinging web systems with text and images. It uses the single page application (SPA) strategy for loading just the content (templates and data: also known as components) needed at each time. It also has hierarchy for data and its linked elements.

We are covering in this document some core features of linker-web but the full linker-web documentation is spread at the whole your online shop documentation.

## Before continuing

A web application nowdays has growed so much in posibilities that if we want to get adventage of them all then the application will become necessarily very large. But large in size doesn't mean it will be also large in complexity. There are lot of projecs (libraries, frameworks, etc...) that are trying to embrace the whole web system (or some parts of it) to produce a systematical procedure of developing web applications in a unified way reducing therefore the amount of knowledge and complexity needed to achive this result. However I dont think these products are achieving their initial goal. I am trying to do so myself and I think the results are quite ok. The tool I come to is nevertheless not small, as I say it is probable not posible to resume the large web technology in a managable size. But dispite it is large I think it is simple enough to worth the time invested on get into it. So I advise the reader that this documentation is large and that it can take quite a long time to get it right, so be aware.

## The basics: A node to start

Thinking in data as nodes has become wide spread for software development. A node is an object that links to other objects (Tipically a node is a self-referential object, that is, an object that links to objects of the same class) to produce structured data. . Why and when are we using nodes in our system? Nodes are the briks of the application data. As data we meant elements that can be stored and being modifyed. And in our particular case these are the text data that represents our business data: users, orders, etc... and also web content as text in pages, menus, etc... but not so much pages views elements, that is, html or templates.

Once nodes are stated we got a fundamental element that can be applied to a large number of web systems so that is the power of the linker-web we are presenting.

## Computational Object

The general term "computational object" is sometimes used to distinguish the rest of the program computations from the user interface. We borrow this term to refer to a program that manages some tasks related to the database and the GUI content edition.

This computational object is our original creation which main purpose is to hold data in a structured manner. It will have some methods for model and view representation of the data. We are using "model" and "view" terms in the way of the model view controller (MVC) design model.

Our "node" is furthermore a basic computational object. It can link to other similar elements and produce effects in its data and in the representation view.

Links between nodes are made not directly but through out a special node called "linker". This element allows to create more rich structures than just the single parental link. Linkers will be in between parent and children acting as switchs. This structure allows a parent (we would call it partner) to have several kind of link relationships each of them with some kind of children type.

The Linker node would have special information about the relationship between nodes. This is the kind of relationship that would be reflected in a relational database structure. Using this methodology we are making an abstraction and a more simple representation of the foreing keys relational database structure map. We still need the foreing keys and its approach to store the data in a more effective way.

## Nodes and Linkers

Nodes are the most basic element and the basement of the system. Other systems like DOM (Document Object Model) have a node element, we also have this node element as a basic cell of information. Every node has properties that defines the data on it, an interface (or methods) for interacting and links to other "nodes".

The relationship from one node to other node is made by the linker node. Linker node represents a parent child relationship allways one way: from the parent to the child. Linker holds the children nodes (like a container) and relate them to a parent node (called partner). Children nodes that are related like siblings have a common linker (parent).

We are using this termonology for the linker chane: Node (partner) -> Linker (parent) -> Node (child)

The chane can continue indefinetily and children will become partners for the next parent that will contain more children elements and so on.

We can show this relationship in the following diagram where node elements that hold data are marked with a star to distinguish from the parents that doesn't contain any data representation.

```
                          | * child *
* partner * -> parent ->  | * child *
                          | * child *
```

In the diagram, that shows relationshsip from the parent point of view, the parent is a linker and the others are just nodes that hold data. As is showed in the diagram the parent can hold serveral children but just one partner. Children instead can belong to more than one parent allowing them to have more than one parental relationship.

The partner in turn could relate to several parents. The resulting graphic would be a tree of nodes or several trees overlapping.

```
// Tree of nodes. You can imagine some of these trees overlaping if some child has several parents

                            | * child *
            | -> parent ->  | * child *
            |               | * child *
* partner * |
            |               | * child *
            | -> parent ->  | * child *
                            | * child *
```

## The model

As you should already know the most widespread nodes use is the database representation. We will be relating data collections (collections in databases so called tables) elements with others collections (or same collection) elements. We will be following these rules at the database scheme:
- Each database document (or cell) from a collection will have got an unique "id" field.
- Documents could have several foreign keys for representing the parents (best known as partners in our node terminology): "partner_id".
- Each foreign key will correspond to some collection (it could be oneself collection).

The resulting nodes tree representation of the database will be like the one showed in the previous section. Nodes that hold data are having an instance variable object for holding the data as its properties. Here it is a representation of a data object:

- props - {propKey: propValue ...}
- parent : Linker
- relationships : [Linkers]

In turn the linker object will be this way:

- props - {propKey: propValue ...}
- partner : DataNode
- children : [DataNodes]

Linkers are holding these data:
- The database collections names
- The data types of the children nodes content.

In the diagram above we have seen that there is tree root which is a partner. But we would usually expect the upper extreme of a database content tree to be a parent, and that is because the linker is containing information of the child node that the child node itself doesn't contain. However we will usually consider the tree root as the data node (or partner) not the parent (or linker).

## Basic Nodes Methods

Nodes will have got methods to navigate between the node structure, also for addition and deletion of nodes. One fundamental method will be branch loading, that is to load a whole nodes structure to embody it in our object as node elements. That branch element can be in some data representation as in JSon format.

## Fetching data

## Nodes ordinality

Data nodes has an ordinal element to set the children order representation. This instance variable name is sort_order.

----


## Resuming all client basic facilities

A sammarized compendium of the basic elements needed to represent data and its content manager system is listed in this section. We can start by a template like "paragraph". This template contains all the containers of a basic element like a text (or value) container and edition and modification buttons containers. The computational object for this template comes from contentbase.mjs, pages/pages.mjs and main/pages/pages.mjs. The administration elements templates are the layouts at "admin" folder: "butedit", "butaddnewnode", "butdelete", etc... The computational object for the admin elements are at "admin" and "main/admin" folders (present at "client"). Other computational accesorial objects are the ones that facilitates some navigation functionalities: activelauncher.mjs, navhistory.mjs, main/navhistory.mjs and main/activeingroup.mjs. Others are languages.mjs, main/languages.mjs, webuser.mjs and main/webuser.mjs. These elements are the central elements needed for a representation and administration of some data, so we must pay atention to them as a whole.

### contentbase.mjs Content Class

When we are dealing with relational data as described in "The model" section we are describing a kind of data. For example we can manage data regarding to users, then users could have their own data properties like "user name" and can be related to other data types like "user address".

"user" : {username} -> "address" : {street name, street number}

So when we deal with users data content we are talking about all the users and its connections with other data, like "user address", "user contact", etc...

The content class is designed to load all the data starting from some database collection and following its relationships to load more data from more collections. Class formal parameters are the collection identifier and the deep level we want to reach in the data tree. The resulting object would be the tree untill that deep level. Sometimes documents in a collection is related to eachother having a tree structure at the collection itself. Hence documents in the collection will relate to parent ones in the same collection except the root that will not relate to any parent. In other cases parent nodes from one collection will belong to a different one.

Content class is designed to work with a unique root node. That means that will only work with collections that are also self related. We must take it in account when designing the database [1].

[1]. We may find a way to avoid the need of a root document in language content collections but at the moment is the more straightforward way.

#### Class use

The main class procedure is initData method. It will load data as described before but for language data it will load just the content belonging to the lanugage settled as the page current language.

The first load produced by initData will get the entire tree if deepLevel is not defined. But when deepLevel has a value it will load untill some level. The level is the sum of any node step including linkers. We sometimes would want to load the tree content in steps. Then initData is loading until some level and then each node at the tree end can load its children when needed.

initData will also set the notifications service at the root node for when there is a change in the user log or when there is a site language change. It means that when there is such an events the root node will notify its observers of the events. It is then responsability for the ContentView class to attach observers that should react to these events to the root node. ContentView methods for these purpose are setNodeEventsReactions and setTreeEventsReactions.

### contentbase.mjs ContentView Class

A tipical template that will contain text data available for editing will be like this one:
```
<li data-id="highlight">
  <span style="position:relative;">
    <div data-id="butedit" class="btbottomcenter"></div>
    <div class="bttopcenter">
      <div class="admnbtsgrid" data-id="admnbuts"></div>
    </div>
    <a class="menu" data-id="value"></a>
  </span>
</li>
```
Here it is a methods resume:

- write and writeLangData
This methods are for writing the data content in the suitable html element. Method writeLangData will select the subnode with the langdata before writing.
- expand: It prints the partner main branch childen.
- setViewLangData: similar to setView but as the previous method it selects the langdata node
- setActionButtons and setEditionButton
- setHistory and pushHistory.
The web page entrance point includes search params. In order to make available the actions asociated to the search params at the initial load and the posterior stages settled by the history navigation buttons we need make this asotiation. That is the function of setHistory. We would usually make the asotiations when the asotiated action buttons are being loaded on the page. When defining the class extension we must initiate the instance variable "searchParamsKeys".
pushHistory sets an history state at the history stack
- setActiveInSite
It sets the node as the active one (when we click on an element). It set it as selected and deselect others that could be actived before.
- setEditionChildrenEvents: For stablishing some after nodes adition or deletion performance
- setTreeEventsReactions and setNodeEventsReactions
setTreeEventsReactions sets the refresh of all the tree view when the language change, and when it doesn't need to refresh the whole tree but just individuals we could use setNodeEventsReactions

----

The model: Nodes could hava a representation in a database collection document. Then the database document properties correspond to node properties.

# The linker (nodes relationships or nodes container)

At many programing languages we can see simple parent-children relationships with no attributes. There is a parent and a child and the pointer that can be eather in the parent, the child or both. But we could add some semantic meaning to this relationship, so the relationship could have some attributes or specificities. This is the main idea behaind the linker. The linker acts as a container of the children and have some attributes that defines the nature of the parental relationship. It also acts as a link that represents a footprint of the children that can be produced from the parent through that relationship. We could even compare the linker with the mother cause it contains the children but its entity doesn't represent any data element as child or parent does.

There is a programming paradigm which is called the model (regarding to the model view controller) and that represents data and its relationship. The link framework has a strong model focus because is the data relational model which has a more meaninful relational structure.

When dealing with data we usually have a data footprint or data structure that is called table (at databases) but also model (no sql databases) or class (OOP). In our framework we have an entity for this data footprint that also acts as a the link between the parent and the child. So when there is some data object that has a parent the data footprint (linker) would contain a pointer to the parent data object. And the parent in turn would contain a pointer to this footprint from which it is connected to the children.

Lets do an exercise to understad it better. So imagine we have the entities client, address, order and product that would produce individual elements of the same class. There could be parental relationships between this objects or not. For example an order can have a parent that is the client and in turn a product can have a parent that is the order. This way we need to identify the relationship and therefore the elements resulting of that relationship. For example, Client named Roger could have in their relationship with orders three elements. The parental structure I am identifying would be something like:

```
                                | order date octubre 2nd
Roger -> relationship orders -> | order date november 2nd
                                | order date december 2nd
```
Roger and their orders are individuals but "relationship orders" has no individual data but only some more generic information about data properties. By introducing the relationship (linker) we have the adventage that there is a fixed structure for stablish relationships between data individuals so the complexity of the data elements is fixed and there is a standard implementation procedure.

There could be objects without any parent like clients:
`client linker -> Roger`

In this case "client linker" is no representing the relationship but the data footprint.

# Relationship stardards

- The relationship entity (linker) would contain the link to the parent and the link to the children as well as information about the children properties (children database columns).

- Data individuals (parents and children) would have a link to the linker (relationship) but not to the father (parent individual) neather to the children. Those links would be in the linker.

- linker link to parent is called "partner" an linker children link is called "children". Child link to linker is called "parent" and father link to linker is called "relationships".

- Individuals can be linked to several parents regarding to the relationship. But any relationship (linker) would be linked to only one partner. For example we can have an order that comes from a relatinoship with table customers cutomers-orders but also the same order can be linked to the staf that served it by the relationship stafs-orders. However the relationship customers-orders would link to only one partner element (for example Roger) and the same for the staf (only one staf is atendig the order).

Lets see an example code

``
``

# The View

cover the View paradigm with the linker relational framework, templates, etc...

# The Model

some database queries examples. Model requesting is similar to graphQL.

# Framework implementation




La implementación se está haciendo mediante el sistema de multiple inheritance. Sin embargo me gustaria revisar esta implementación ya que hay otros sistemas, por ejemplo algo similar al decorator patern : podría haber un objecto específico para lo que sería el model (datos de bd) y otros objectos para cada uno de los mixins, podría ser que el objecto resultante sería un agregado de cada uno de los componentes, quizá conteniendo referencias a estos. Es otra opción.


Parece que hay una estrategia para ahorrar memoria que convendría revisar, un patron de programación que cuando dos objetos tienen el mismo valor los guarda en un solo lugar. En cualquier caso cabría revisar la implementación the mother ya que es siempre igual en toda la cadena y sin embargo se crea un objecto diferente cada vez. Podría hacerse un sólo objecto y referir a este en lugar en crear uno nuevo para cada relación de objetos.

Notas: Conviene siempre tener un root para cualquier elemento que tenga que tener una posición, un orden y es así más fácil, aunque el root propiamente no tenga utilidad.