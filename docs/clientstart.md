Client Start
============

## Introduction

The client initial loading point is the 'index.html' document. This document path is defined at server config 'sitePath' parameter. The default value of the initial loading point is 'loader/main/index.html'. The 'index.html' document contains a loading animation that will appear meanwhile the entire application is loading. 'index.html' starts the initial script client/index.mjs that will call the main application module 'client/contexts/main/main.mjs'.

## index.html

The index html element that is loading at the very first contains a template for the errors showing and a loading element indicator. This is everything that is needed at this stage of the loading. Once the elements are loaded by the script at main.mjs, then the loading indicator will vanish and the app will start running.

## The main module

This script starts the process making some initial procedures and showing the errors that could happend.

We will see the main.js steps to expain them.

Imports that initializes elements and that could impact on other elements are:
- webuser.js: It creates the webuser and assing it to the global variable.
- reports.js: It creates and set the reporter element acting also over webuser.
- sitecontent.js: It creates and set partially siteText acting also over languages.

The first procedure after the imports is setting configuration parameters. We can chose from a developer configuration parameters or the running ones. These parameters are just some data in the config files. So at the begining we select the running mode by selecting the configuration.

Once the configuration is settled we check the launching of the app is going through a server and not directly from the index.html file. After that comprobation we set the initial navigation search process: client routing. This is about setting the initial navigation search params so the client routing can start finding the web state regarding to the url search.

Next step is loading the layout templates and the css content.

Then we will start loading web data content. We first load the languages collection. We get adventage of these search to check that we have no data so we are in a brand new installation. If this is the case we will show the [installation](newinstallation.md) layout, other case we follow with the normal loading.

- We load site languages and priorize them about browser preferences.

Next steps are:

- User population and automatic login.
- Load website text content from the database
- Start the layout loading/rendering begining from body (body.html).
- If errors happen we will be showing them on screen or in the browser developer console.

## Errors cathing

The error cathing at main.js doesn't catch errors at layouts. This is because the layouts are independent scripts, and don't belong to the main.js flow. Another consecuence is that errors from layouts doesn't show up the error source.