Layouts
=======

## Introduction

Layouts facility is one of the fundamentals of the entire software. It manages the templates that are an essential part of the application. Their duties are:
- Grouping templates and css to form the application skin
- Read and transfer templates and css content from server to client
- Insert templates content in DOM and execute some code on them.

## Web Components infrastructure

A modern web element is the web component. This component holds HTML (View) and behaviour (controller). We want to reproduce this idea that is as well present in a lot of frameworks in their own way. Our components will be html pieces that would usually have some elements with specific attributies to be filled in with data. They could as well contain scripts that can be executed in a specific way. A common way we are using to mark the elements to be filled in is with custom attributes. HTML custom attributes start with characters "data-".

## Skins and layouts (Definition)

A set of template files and css files that make the whole website view is named skin. A single template file or a group of them is called a layout. So a layout is the view of any element but the skin is only the whole website view. We can call subskin to a specific version of a parent skin.

## Templates and css files

Layouts are build from templates and css files. These files are contained in the "layouts" folder.

## Layouts herarchy

Layouts are organized in a child-parent structure. The layouts down the structure have preference (that is, replace the upper ones), similar to css herarchy and other herarchy scheemes. This structure has a first approach in files and folders and a second is by translating it to a linker tree one. 

## Layouts folder strcucture

layouts
  skin_1
    children (=> mejor cambiar a sublayouts o descendents??)
      sub_skin_1
        [same structure]
    css (css files)
      images (svg files)
    views (templates)
      some_folder (optional)
  ..
  
The folder structure can hold subskins in a layered way, so the subskin layout files would replace the parent skin. That is, layout templates and css files not present in subskin would be retrieved from the parent. This characteristic makes it necesary to develop a manager for the skin and layout loadings.

The css contents are the css files and image svg files at css/images folder. There is a css file named common.css and then there would be a selected css file that would be included. The common.css file is combined with the selected style to build the css content. 

Note: Inside views folder there could be other folders to organize the content. However the files inside views folder and subfolders make a whole and are processed in the same way as if they would belong to the root view folder. They also would be identified by its file name and therefore they can not be named the same no matter if they belong to different folders.

## Estructura del arbol

A partir de la estructura de carpetas indicada se genera un arbol de tipo linker de la siguiente forma
root_parent_rel (name: "descendents")
  -root_skin_1- (path: layouts/root_1)
    -relationship_descendents- (name: 'descendents'):
      [.. descendent layouts ..]
    -relationship_styles- (name: 'styles'):
      -child_css_1- (path: 'root/css/main.css')
      ..
    -relationship_views- (name: 'views'):
      -child_tp_1- (path: 'root/views/body.html')
      ..

## Server

Server can deliver to client this content:

- All templates (templates from specific subfolders could be excluded).
- A specific template.
- Css content.

For getting the templates content client sends the request indicating skin, subskin among other params.

Server has default skin and subskin at server configuration for loading a default skin tree at server initialization. 

Request params comes in the search params string. This string is composed with the optional tokens: skin, subskin, tp, style.



Old -> Css content is something like: <style>---</style><style>---</style>. This is because the first style is a common style and then it comes the specific one. This way we can manage a common style pattern while making some variations.

Old -> Svg images can be inlcuded in css content by storing them in folder "images". That is because the css content manager is not responsable for images loading so to make it consistent we put all the css content in one place. The manager (SiteLayout class) would transfer the svg images with the css content by embeding the images on it.

### Testing

For testing this module we can create a server script and use the chrome devtools for inspecting results. First we need a layout content (folders and files) to read from it.

```
import http from 'http';
import {startLayouts, getTemplatesContent, getTemplate, getCssContent} from './layoutsserver.mjs';

http.createServer(app).listen(3000, ()=>console.log("app running at port: 3000"));

function app(request, response) {
  const layouts=startLayouts("root")

  const tpscontent = getTemplatesContent("root", "sub");
  const csscontent = getCssContent("main", "root", "sub");
  const catalogTp = getTemplate('catalog', 'root', "sub");

  console.log(tpscontent.length, csscontent.length, catalogTp.length);
}
```

- Note: for devtools to be connected with node we must use the option "inspect": node --inspect.

## Client

At the client there are the module layouts.js and layoutsserver.js for loading the templates and the css. Templates are loaded at a hashset (Map) variable and the styles are loaded directly at the DOM inside the Head.

### How templates and css are fetched

Templates and css are fetched from server through the well known 'makeRequest' method from the node layer modelMixin. The implementation is at client/nodes.js

Below there is some Api information.

#### Api (client/server)

Action: get templates content, Params: skinId, subSkinId
Action: get template content, Params: tpId, skinId, subSkinId
Action: get css content, Params: styleId, skinId, subSkinId

### How templates are rendered

#### DataNodes and templates

Usually a datanode (linker framework dataNode) is asotiated to some template or templates as its view component. Datanodes could hold some database model (for example customer) and this model could have asociated some templates to form its view or views (for example customer-data-view).

#### Inserting templates in the dom and executing thier scripts

Templates are composed by html components and script elements. The script elements would be executed when templates are inserted in the Dom. We provide an enviromet for the scripts to be able to access to some data we want to provide at the render process. Data is transfer through these variables:
thisNode => The dataNode asociated to the template
thisParams => Params object containing some parameters at its properties
thisElement => The previous Dom element of the 

To insert templates in dom we just need to append the template content at the Dom. But before we need to prepare the enviromet for the script. The implementation of this preparation feature is at client/viewcomponents.js module. The insertion usually would be performed by a node layer composed by dataViewMixin, linkerViewMixin and viewMixin that contains the methods needed to perform the templates insertion. The main methods are: setView, setChildrenView and setPropsView. The implementation is at client/nodes.js

### Testing

To do

### How css are rendered

To do
