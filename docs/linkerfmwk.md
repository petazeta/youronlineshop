Linker framework
===============================

# Introduction

Mostly we as programmers use frameworks, so we have reference libraries and working methodology for our applications. But when you don't want to follow a standard framework but to make a great application you would usually end up building your own framework. That is my case so my resulting work can be summarized in this framework, which I call "linker framework".

# Nodes

There is a basic node element that is like the brick of the framework. Other systems like DOM (Document Object Model) has the node element, we also have this node element as a basic cell of information. Every node has properties that defines the data on it, an interface for interacting and links to other nodes. It could have also a layout (html template) for itself to define how the data is printed in the web page. It would have also some CRUD (Create, Read, Update, Delete) interface for interact with de database.

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
``
client linker -> Roger


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

some database queries examples

# Framework implementation




La implementación se está haciendo mediante el sistema de multiple inheritance. Sin embargo me gustaria revisar esta implementación ya que hay otros sistemas, por ejemplo algo similar al decorator patern : podría haber un objecto específico para lo que sería el model (datos de bd) y otros objectos para cada uno de los mixins, podría ser que el objecto resultante sería un agregado de cada uno de los componentes, quizá conteniendo referencias a estos. Es otra opción.


Parece que hay una estrategia para ahorrar memoria que convendría revisar, un patron de programación que cuando dos objetos tienen el mismo valor los guarda en un solo lugar. En cualquier caso cabría revisar la implementación the mother ya que es siempre igual en toda la cadena y sin embargo se crea un objecto diferente cada vez. Podría hacerse un sólo objecto y referir a este en lugar en crear uno nuevo para cada relación de objetos.

Notas: Conviene siempre tener un root para cualquier elemento que tenga que tener una posición, un orden y es así más fácil, aunque el root propiamente no tenga utilidad.