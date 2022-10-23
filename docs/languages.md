Languages
=========

## Introduction

Dealing with language content is a basic feature for web applications. We have developed the module languages.js and others at the client for managing some languages features.

## Languages object and database

There is a languages object at the module languages.js that is a linker node containig the site languages as children. Child languages has a property that is de lang code: langNode.prop.code.

At the database there is a collection for the languages of the site, defining languages and its properties.

Some other collections in the database contains langdata. In that case documents contained in those collections would have a reference to the language of the text. The reference would be a parental reference, so all that documents would be children of some language document.

## language procedures

At the starting point of the application we need to set the languages. Then we call the module function selectMyLanguage. Then the site languages are loaded from the database and the current language is selected taking in account the browser languages of the user and the languages defined in the site at the database. The node object currentLanguage is now defined at the module languages.js and can be used in the future when required.

The current language object would be sometimes collected for using it when loading lang information at the client. Here it is an example of the usual way of doing this:

```
// This code will load lang data of the object for only the current language.
await paymentsMother.loadRequest("get my tree", {extraParents: currentLanguage.getRelationship("paymenttypesdata")});
```

Here there is a list of some other procedures related with languages:

populateLang (langcopy.js), replaceLangData and splitLangTree (utils.mjs).

Explicar sobre el uso de  {extraParents: currentLanguage.getRelationship("shippingtypesdata")} en los requests.