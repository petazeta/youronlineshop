**This work is still in progress...**

## 1. Prolog

The YOS software importance is about its architecture. That has to do with its core or engine.
It doesn't matter very much that the system implements an online shop system. It could implement a press release system or an e-learning app for example. You shouldn't take it only as an application for a shop system but as an application to do several types of web systems.

## 2. Introduction

This code is a lot about templates. You will find templates several times at the code. Tag "template" is used and its content has to do with the document layout, database elements associated to the contents and with the dom element behavior. That's a great thing so yo can manage the programming work flow by modules. Another great thing of the soft is that you don't need to touch the back-end (php) to create or modify the application. Everything you need is made at the front-end (javascript/browser). Once the web is loaded for the browser there is no reason to connect to the server (back-end) again except to make database requests. And those are made hidden through Ajax so user didn't even notice about it. The result is a web that behaves like a desktop app. Data transfers between front and back end are JSON wrapped.

Lets see an example:

["domelement" template at includes/documentparts/menus.php](https://github.com/petazeta/youronlineshop/blob/master/includes/documentparts/menus.php)

Looking just at the **template "domelementtp"**, this is the template that is been used to show each "paragraph" at the central content of the page. The main subject here is about the "span" tag. The span is filled in with the proper content `thisNode...` or with a default value that comes when element is void `websections...`.
The code bellow has to do with the administration area and makes the span content editable for web administrator. Lets forget that last thing by now.

Looking at the template we note that there are code inside the span attribute "data-js" and in a script tag. These are the two ways of inserting javascript code in a templete. Each way has its adventages an inconvenients. We will discuss about that later on.

At the scripts you will notice two vars that are: **thisElement** and **thisNode**. thisElement refers to the actual element, that is, the "span" for the first script and the "div" for the second, and thisNode refers to the "javascript object" that contains the database information (text content) to filling the dom element with.

thisElement and thiNode are utilized serveral times. You will be familiar with this two variables. While thisElement is just a dom element, that is, an element of the web page, thisNode is a "javascript object", a "common" object that holds the content (information that comes from the database). thisNode is therefore something that must have being managed in advance to fill it with the database content (before taking the template).

Lets finish this introduction now. You will know more about these "javascript objects" in the next chapter.

## 3. The data node structure and the template system

Javascript objects are used here as nodes that contains information. The node structure is like a tree: there is a root and then branches. It is similar to the dom structure but meanwhile the dom has to do just with the document view, our node structure will deal with data. That increases the level of complexity of the tree. Now, parents can't have just any node as a child but for example: a node parent "user", will not have childs like "items". "Orders" will have childs like "items" and "users" could have childs like "orders".

To determine which parents comes with which children there is a relationships definition. Each relationship brings a table parent with its table children. And no one else.

At the node structure the "relationship" becomes a node object as well but it will not contain the data. It will be the link. For example, the database table users will have relationships with database table addresses and database table users_types. When we load one user we will load its relationships also, and the children from that relationships will be the addresses of that user and its user_type.

Lets see a code that gets the root node of the table "documents" and loads its child "documents" to show them (documents name) at the menus navigation bar. 

The menus in the middle navigation bar are the name of what we have called "documents". When click a menu (document name) the text is displayed, so that is why we have called documents and no menus.

In this case we have chosen to have a root for the documents (menus) to improve the management of them (elements that have parents can be ordered and be managed much better than without). So first of all we load the root document (menu). Once the root document is loaded we load its children and then display their names at the navigation bar.

[includes/documentparts/menus.php](https://github.com/petazeta/youronlineshop/blob/master/includes/documentparts/menus.php)

This is the whole thing that displays the menus nav, displays de their content when clicking at some menu, adds the administration buttons when web administrator logs and perform some actions to assure that the selected menu (document) is exactly what is showed at the central part of the web.

The file is a bit large, don't pay atention to all of the code, just to the parts that we will be indicating afterwards.

Templates are at the front (top) of the file cause we want to enssure they are loaded before the script runs. In this case as the script doesn't run immediately the position doesn't really matter. Lets look at the code.

The first thing is the "nav" tag. This will be the container of the menus (documents names). And we will fill it up with menus templates, one for each menu present.

Then, there are the templates and after it is the "script". Lets look at the script. It is the one that performs actions with the javascript objects. It will generate the objects (also we call them nodes cause they are objects with links) and fill them with the correspondent database information.

This script isn't inside any template. That means it is executed on page loading. The first line is `webuser.addEventListener...` and the arguments are `loadses` and a function. We are saying that the function should be executed when the user session is loaded. That allows the program get allways the correct webuser information.

The first thing we have to do is load the menus root element. For doing so we have to make some tricks (that's whay this peace of code is a bit more messy that others). Menus root element is needed for giving the menus a sort order (to appear in some secuence, list). As the sort order is related to a common parent we need a root document (menu), but actually the root has no data and doesn't appear at the web page. To load the root we have to figure out the root parents, so that's the way we load node elements: through its parents. The immediately up relative of the node is the relationship node, as we discused before. The relationship node hold information about the relationship. It contains the **parent table name** and the **child table name** of the relationship and points to the parent element.

<pre>
                 menus      menus
(name:"root")  (parentTable childTable)
node parent ---> node realtional ---> node child1 (name:"About")
                                 ---> node child2 (name:"How To")
</pre>

*Notice that in this case the relationship is with in the same table: menus to menus (menus inside menus)*

The node relational is named **NodeFemale** and the parent and child nodes are named **NodeMale**. That is because the relational node hold children while the normal one holds relationships and from a relationship with a femaleNode that comes the children.

Lets see the scheme:

<pre>
					 NodeMale                       (partnerNode)
					    |
        (relationships) 	  ------------------------                   ^
				  |                      |
			      NodeFemale            NodeFemale          (parentNode)
				  |                      |
	   (children)       -----------           ------------               ^
			    |         |           |          | 
			NodeMale   NodeMale    NodeMale   NodeMale      (partnerNode)
			    |         |           |          |
 (relationships)         ------     ------      -----      -----             ^
	      NodeFemale |    |     |    |      |   |      |   |        (parentNode)
   (children)           ---  ---   ---  ---    ---  ---   ---  ---           ^
               NodeMale | |  | |   | |  | |    | |  | |   | |  | |      (partnerNode)

</pre>

Object nodes of type male will have relationships and female nodes will have children. And at the oposit way: male nodes will get to parentNodes and female ones will get to partnerNodes. This is the terminology used for the node structure.

>**Tip:** In the premium version of the software there is a tool for managing the database called "dbmanager". With this tool you can watch the relationships between elements. It is a good exercise for better understunding the nodes structure.

**To load an element (node) we get the father and mother and then we can load it through out that relationship**. But is there no father for the root node, cause it is the root, but we can make it just with the mother: The mother holds the **childtable name** and we need that information for the database request. Once we have the parents nodes (or the mother in this situation) we sent this data (json wraped) to the php requester file and Bingo!, that is the root. But for the php requester to know exactly what to do we have to tell it the action that in this case is "load root". This action just need the table name becouse *it will return the node of that table that has no parent link*: the root node.

So that is what is done the following lines: making up a mother node and fill it with the information of the table name (TABLE DOCUMENTS).

Then we get the generic form and fill it with the parent information, that is throwgh **setView** method. More about this method later. Then we send the form (`loadfromhttp`) and wait for the response. When the response arrives the node is filled (`documentrootmother`) and the function is executed. The filling will be: the child that is the root node. So now `documentrootmother` will have one child that is the **root**.

Then it is the function:
With this data we make another request, we ask for the children of the root node. For that, instead of loading the root relationships as the relationship is the same, we just copy the relationship again. And then make the request, but this time the action will be **load my children**.

So the children are loaded (menus) by the `loadfromhttp` method and the function following will have to append them to the document page, inside the container: the "nav" element. That comes to the rescue **refreshChildrenView** method. This method is executed nearly at the end: `this.refreshChildrenView(docum...`. Before that there are some listeners added to ensure the refreshed is right (mostly after some web administrator menus edition activities).

Following `refreshChild...` there is a function. That is an optional funcion that can be passed to execute it just after the refreshing. In this case we want that (on page loading) the first menu will be showed at the central part of the page. We want to have an init page information: the first menu. So the action is clicking on it once the menus are refreshed.

I understand it is not so easy for first time to understand everything is showed in this chapter. But don't be discouraged you just get the overall thing. You will understand it better in next chapters. And pay atention: this code understanding is most of you need to write code and make modifications.

## 4. The template system

Lets look at the templates code at:

[includes/documentparts/menus.php](https://github.com/petazeta/youronlineshop/blob/master/includes/documentparts/menus.php)

First, there is the menu template. At the template the first we get is a span element. That is the wrapping thing of the menu. It has the class "adminlauncher adminsinglelauncher". Those classes purpose is to enable administration buttons to show at mouseover at the menu.

After that it is the "a" tag that will be the actual menu element. It will contain the menu name in the textContent. To do so is the script below. As we have noticed before there are two ways of introducing scripts at the templates. One is by the data-js attribute and the other through a "script" element. The script element should come immediately after the actual element we refer to. *So don't locate the script incorrectly inside of the dom element (in this case the "a" tag), that will produce errors*. We have chosed to put it outside so the filling up of the element don't overwrite the script element. That wouldn't have any efect to the script anyway but could disallow it to be executed later on.

The script first line is for filling in the menu with the proper content, that is, the menu name. As we have told if the name is void we will show some text instead of it to notice the element is void.
Second line we pass over, then there is the onclick event. When click at the menu a document will be shown. That is done by the code at the bottom: `elements.refreshChildrenView...` Method **refreshChildrenView** is crucial. It will be instanced several times to append a list of elements, in this case, the paragraphs of the documents.

Then there is a div and a script, we let these two for later. The wrapper span is closed and so the template.

The next template is that we have already seen at the Introduction section, it is the paragraph element for the document. Notice there is data-js instead an script, so both solutions are valid.

There is a difference between the "data-js" attribute and the "script" element that should be mentioned. The "datajs" attribute is executed in advance (at the "setView" method is executed) meanwhile the script is executed after when the template element is inserted in the dom. That is an adventage sometimes for the data-js so we don't need to insert the element in the dom, and sametimes we don't need to do it, for example when we want fulfill a form with the node data before making a database request. We send the form to the request without inserting it to the dom.

>**Tip:** We can re-execute some of the scripts inside a template. That is made by calling `setView`. In case of a data-js script the argument will be the dom element and for a "script" the argument should be the script.

There are template files are at the includes/templates folder and others inside the files at includes/documentsparts folder. We have chosed to put them as close as possible to the place they will be renderized.

The page document begins at index.php and loads parts that are located at includes/documentparts folder. Only files that can be directly accesed for http request should be at the root folder. The rest are located in inside folders.

We will get more about the document page at the Index.php section.

## 5. The node object

As you should have noticed, until now we haven't mentioned any php code. That is the greate thing of YOS, that you could do everything at the front end, no need to worry for the back end. The back end is generally utilized to send request of nodes, and that code is almost the same for any app we want to make.

The node object definition is:

[includes/javascript/nodes.js](https://github.com/petazeta/youronlineshop/blob/master/includes/javascript/nodes.js)

**Node properties:**

- properties

- parentNode, partnerNode

- children, relationships

**Node methods:**

- setView method

The setView method comes from a node: node.setView and its argument is a dom element. node.setView(domelement) will perform the actions at the inside scripts at the domelement. If the dom element is still a template (that is hasn't been rendered at the document, it is not in the document dom) some actions don't have effect till the node will be append at the page document.

This method is mostly used to fulfill the requester form (the one that holds the parents of a node) to request some database actions: load children, remove child x, update child x, add new child (database row), etc...

This is the generic form:

[includes/templates/formgeneric.php](https://github.com/petazeta/youronlineshop/blob/master/includes/templates/formgeneric.php)

As you see the actions are fulfilling the json input with the parents node (json formated).

### refreshView method

Comes from a node and gets the container and the template: node.refreshView(container, template). So it append the template at the dom position inside the container (removing container children first) and perform the actions planned at the template.

### refreshChildrenView method

Similar to refreshView but it is called by a NodeFemale node. It appends one template for each child element. Each template is fulfilled with the child data or whatever actions are planned at the scripts of the template.

### loadfromhttp method

Sends the form and load the resulting json objet at the actual node: node.loadfromhttp. The arguments are the form (fulfilled with the node information) and optionally a function to execute after the request.

### load and loadasc methods

These methos copy the data from a node inside anoter. Meanwhile load inserts the data of the descendent nodes loadasc insert the data for the ascendent ones. There is an example of it at:
[includes/templates/formgeneric.php](https://github.com/petazeta/youronlineshop/blob/master/includes/templates/formgeneric.php)
"loadasc" function allows a number argument that will limit the number of ascendent nodes loaded.

### addEventListener method (removeEventListener)

This is to add some kind of action (function) when a event happends. node.addEventListener(eventname, function). The event should have happened at the specific node that calls the method not any other.

removeEventListener(event, id) will remove some listener.

### getRelationship and getChild methods

The first one is for NodeMale to get one of its relationship by giving the name of the relationship and the second for the NodeFemale to get one if its children by giving also the name (or some other property).

## 6. The index.php.

[index.php](https://github.com/petazeta/youronlineshop/blob/master/index.php)

The index.php file is the one where everything begins. So we must look at it carefully. Looking at the body we first vew the inclusion of the templates. We include them at first so there will be accesible for the program. Then two templates are append at the body. These are tow forms that are generic and will be used as a recurse at the database requests.

[includes/templates/formgeneric.php](https://github.com/petazeta/youronlineshop/blob/master/includes/templates/formgeneric.php)

The code action at the form is to set the input value to the node and its parents. So with this information we will be able send a request to load the node children or to modify the node at the database.

Next action is laoding the data tree of websections and its asociated domelements. With that information we will be able to fill some elements of the document. Next we show an advert messenge to notice we are loading crucial information so nothing will work till this action is done. Then we add a listener to the loading procedure at websectionsroot to hide this advert.

The myalert var is created so we will be able to reuse it to prompt new messanges or we will create new Alert objects. The alert object definition is at the [includes/javascript/alert.js](https://github.com/petazeta/youronlineshop/blob/master/includes/javascript/alert.js) script.

Then the webuser var is created. This var will stand for all the sesion. And we will use it to check information about the user, mostly if the user is web administrator or order administrator.

We add a listener for when user is logged and then define which page is loaded.

That is all about that script at index.php. Then is comming the document definition. There will be some parts loding with the php include directive. That is to

Lets see about them.

## 7. The rest of the document

### top.php

Following in secuence we have at index.php the inclusion of top.php:

[includes/documentparts/top.php](https://github.com/petazeta/youronlineshop/blob/master/includes/documentparts/top.php)

This hasn't any code, just the inclusion of another files. The last one inclusion is menus.php that we have already discussed about. The others are "toph1.php" and "toph2.php". Those are the title and subtitle of the page. Lets see them:

### toph1.php and tph2.php

[includes/documentparts/toph1.php](https://github.com/petazeta/youronlineshop/blob/master/includes/documentparts/toph1.php)

We see three elements: One is the "div" at the beggining, the next one the "template" and the last one is the "script". The script isn't inside any template so it will be executed on page loading. Lets look at it.

websectionsroot is a global variable. We have loaded first at index.php so it contains information to fill elements of the page. What we are doing is getting the information that comes at the "top heading 1" element (page title) and then fill the template to insert inside the div. That is what headtt.refreshView... does.

Now lets look at the template. The script bellow the "h1" element set the "h1" textContent to that of the property innerHTML of the data node. That property refers to the column so named of the table row selected at the script through the tree search performed with getRelationship and getChild. You can check the "dbmanager" aplication and surf throgh websections to find the same result.

At the template there is bellow a div element and its correspondent associated script. That is to include the administration elements (the pencil) when user is web admin.

toph2.php is the same as toph1 just change the table row element. Note that we are tolking about the database row to make it clear the procedence of the information but actually that data has been already loaded at index.php so what we are accessing is the copy of the database in our node sctructure.

Extension .php at toph1 and toph2 could be omited as there is no php instructions at the document. We just keep the extension all the time just in case.

### middle.php

[includes/documentparts/middle.php](https://github.com/petazeta/youronlineshop/blob/master/includes/documentparts/middle.php)

It is the next inclusion at index. It has some document parts and the inclusions of more document parts. The script at the bottom makes some redistributions of the elements of the page to fit better at smart phone screems.

### left.php

[includes/documentparts/left.php](https://github.com/petazeta/youronlineshop/blob/master/includes/documentparts/left.php)

That is the left column. It includes the catalogbox file.

### catgbox.php

[includes/documentparts/catgbox.php](https://github.com/petazeta/youronlineshop/blob/master/includes/documentparts/catgbox.php)

Whe have some document parts and inside some templates. And then at the botom there is a "script".

The catalog box includes a head. The script select the node for the head title and replace the span element with that content. Next operations we make is to get the category root and load the categories. That is the same we made with the websections. But now at the document flow script we just get the root and copy the relationship but we doesn't load the children. We have choose to load the children in a template. There are two templates nested. The outer one is loaded inside the cell by the refreshView operation at the bottom script. This one load the children (categories) and make the refreshChildrenView over the table with the nested template that represents a row. Notice that refreshChildrenView second argument selector gets a template that seems the outer one but as we have already loaded the outer template at the cell that template doesn't exists at the work flow at the moment refreshChildrenView works.

Plus filling the category name throgh the "category template" it sets the onclick to load the subcategories and then show them at the central part of the document. The template used to show subcategories include also the template to show the items (or products). That templated is present at that file but we insert it by the include directive to make the document shorter. Lets look at that template.

### catalog.php

[includes/templates/catalog.php](https://github.com/petazeta/youronlineshop/blob/master/includes/templates/catalog.php)

We got to show the flaps (subcategories). That is for thisNode.refreshChildrenView(thisElement, thisElemen...
It fill the container "div" style="dis... with the flap template and then select first flap so the items of the flap (the products) will be showed.

The flap template fill the flap text content ("a" tag) and sets the onclick operation. That will be loading the items then refreshing about the item template: `items.refreshChildrenView()`. Notice we set the container and the template in advance to call refreshChildrenView.

The item template performs a row and fill the elements about the item properties. Lets skeep the part about the image that uploads an image by now.

The button add item calls the cart procedure "additem".



### center.php

[includes/documentparts/left.php](https://github.com/petazeta/youronlineshop/blob/master/includes/documentparts/left.php)

That is the center part. Here it is the element centralcontent that will be the container of the main content of the page.

### right.php

[includes/documentparts/right.php](https://github.com/petazeta/youronlineshop/blob/master/includes/documentparts/right.php)

That includes:

### logbox.php

[includes/documentparts/logbox.php](https://github.com/petazeta/youronlineshop/blob/master/includes/documentparts/logbox.php)

Again the same structure: div, template, script.

This template has some dificulty cause it contents change depending on user status (if user is loged in or not). Also the actions performed can change depending on this.

User object script:

[includes/javascript/user.js](https://github.com/petazeta/youronlineshop/blob/master/includes/javascript/user.js)

### cartbox.php

[includes/documentparts/cartbox.php](https://github.com/petazeta/youronlineshop/blob/master/includes/documentparts/cartbox.php)

Again we got the same structure: "div" element, "template" and "script". Script is runing independently (no template) so the var mycart is being a global one. We will be able to access it later. We remind there are already some global vars we should take in account: websectionsroot, myalert, webuser and mycart.

As we did at the toph1.php we catch the node that contains the cartbox title text. And then refreshView: set the div filled with the template content. First part of the template is to fill the title of the cartbox. Second is about mostly about settig the mycart node cartboxitems with the information about the container and the template: itemlisttp. So this information is saved on node cartboxitems and later calls to cartboxitems.refresh... will regard to the container table just above the script and the itemlisttp. But it actually does not fill the cart so the cart is empty when loading the page.

The itemlisttp template is the row that is printed (appended) for each cart item element. The iformation that fills with is quantity, item name and item price. It has also a funcionality to remove items of the cart that is the script about.

The next is about the checkout button. Fill the label for the checkout button. And set the clickon to the mycart.tocheckout function.

This is the cart object definition:
[includes/javascript/cart.js](https://github.com/petazeta/youronlineshop/blob/master/includes/javascript/cart.js)

### Other parts

We have cover most of the web page parts or blocks that comes at first load. The rest is about the login, the administration facilities, the order administration and the checkout process.