Languages
=========

## Introduction

Dealing with language content is a basic feature for web applications. The model concept of the design is taking care of the languages content in a special way.

## Model and language content

The object node model for data has a lang data relationship. So for example we got a category and the category has a relationship named itemcategoriesdata which will contain as a children the lang content of the category: property name. This child is also descendent from a language, so the number of the itemcategoriesdata children is equal to the number of the languages settled.

## Languages object

There is a languages object at the module languages.js that is a linker node containig the site languages as children. Child languages has a property that is de lang code: langNode.prop.code.

At the database there is a collection for the languages of the site, defining languages and its properties.

## languages module

At the starting point of the application we need to set the languages. Then we call the module function selectMyLanguage. Then the site languages are loaded from the database and the current language is selected taking in account the browser languages of the user and the languages defined in the site at the database. The node object currentLanguage is now defined at the module languages.js and can be used in the future when required.

The current language object would be sometimes collected for using it when loading lang information at the client. Here it is an example of the usual way of doing this:

```
// This code will load lang data of the object for only the current language.
await paymentsMother.loadRequest("get my tree", {extraParents: currentLanguage.getRelationship("paymenttypesdata")});
```

This request will load the payment object containing just the language of the site.

## Other language related procedures

There is the posibility to change the language when the page is working not just at the beginning. For this purpouse is the function setCurrentLanguage at the languages.js module.

Other posibility is to add a new language to the site. This will produce to replicate the first language. The procedure of replicating a new language is not a direct approax. We need to add a node to any element that has some lang nodes inside. We are getting all the lang elements (that is easy: children from the language), duplicating them, getting their parental upper relationships and then insert them again but changing the extra parent for the language with the new language. This procedure is carried out through populateLang function at langcopy.js module.

Other procedures regarding to languages are the export/import facility. When we export elements that have lang text content we have to collect as well the languages list. We are collecting root element that we want to export with its descendents and the languages list. By collecting the languages list we can check that the importing languages check with the actual languages and we can assing the correspondent language to each language content.

There is also a procedure to explicity import a new language. That is the lang content of the siteElement data, the content includes just the site elements common to all sites, it doesn't inlclude pages nor categories.