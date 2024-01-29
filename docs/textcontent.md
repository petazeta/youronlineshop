Site Data Content
=================

## Introduction

The site content is a mix of data: text and images, and layouts: data formating. In this document we will talk about the text data which is the editable content. Layouts can not be edited with this software and images can not be edited but we can upload new images and replace the old ones.

In this document will focus on how the edition content feature works in client side.

## Data text content

Text content follows the [linker structure](linkerfmwk.md). Text data is contained in some properties of the data node. There can be some herarchy on text data.

## Language content

Due to the multilingual feature of the software, text nodes doesn't contain the text data directly but throug a language text node. Language text nodes would have two ascendents one would be the parent text node and the other the language in which it is written. There would be therefore language nodes that would belong to a different tree structure but that would share children with the text node herarchy structure.

Here it is a graphical explanation:

```
       [site languages]            |
                                   | lang parent nodes
[spanish]   [english]   [french]   |


                               [example: item description]                 |
                                                                           | text nodes
        [paragraph1]              [paragraph2]              [paragraph3]   |

[p1 es]  [p1 en]  [p1 fr]   [p2 es]  [p2 en]  [p2 fr]  [p3 es]  [p3 en]  [p3 fr]   | lang text nodes
```

## Implementation

Text content is represented as a nodes tree like the figure above. To manage this data there could be a class for the text content: categories, items, site pages, etc... 

These are the main classes to manage the text content:

- CategoriesContent: manages the catalog text content nodes.
- SiteContent: manage the site general text content.
- PagesContent: manage the pages (menus) content.

These classes have a common behaveuor that is reflexed in the class antecesor Content (contentbase.mjs)

Apart of them it is the Languages (languages.mjs) class that manages the language settings. This class tree structure shares children with the other classes as we have already seen.

Methods of the content class would be used to request and load the content from database in one or more phases, set reactions to some events like when user changes the default language, when a login is produced, etc...

Class TextContent uses several times languages module facilities for getting information about site language and its nodes language branch.

** we should explain about the data- attributes

### Languages

get data branch
get lang parent

### Display Procedure (Very important)

Displaying the content of a tree view would be sometimes carryed out in steps. Every step would belong to a level on the tree branch. We can describe the display procedure for any level.

Display elemet's children routine:
- Push the navigation history state of the element
- Set the element as active
- Load data for children if needed
- Set the reactions for the children collection elements modification events (when user has written permission) and ensure to set it when admin log (on log event set colleciton reactions).
- insert addition button when no children (when it has written permission)
- Dispach the event "displayChildren" for the main branch
- For each element's child:
  - Get child template, fill it with child data and set user lang change reaction
  - Set the child edition button and user log event edition reaction.
  - Set modification buttons and set user log events modification reaction
  - Declare its nav state
  - Set the onclick procedure: display child's children routine.

We can see that this procedure ends up stablishing a call to the same procedure but for the children when there is a click event. We can define therefore the same procedure for each level in the tree untill the whole tree display procedure is stablish. The root and leafs would have some variations to the routine and depending on the content the procedures could change.

We can use terms element modification and parent element collection edition as equivalent

---------
revisar edition.md, languages.md



