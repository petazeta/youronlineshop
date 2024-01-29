Configuration
==============

## Introduction

There are some parts of the application that are customizable. For this reason we have a file with some customization parameters and also a module manager for this specific feature. The contexted client configuration feature is composed by default.mjs, custom.mjs, main.mjs and eventually devconfig.mjs files. 'default.mjs' file contains the configuration variables with their default values. The 'custom.mjs' file values will override the default ones. File 'main.mjs' manages the module behaviour.

The files path is 'contexts/"main"/cfg'.

## Module Use

We are explaining the client configuration module. The server config module is almost the same.

### Parameters setting

Before using the module we have first to set the custom.mjs vars. A 'default.mjs' file vars checking will give us the information about the config values and their meaning.

### Module import

When some configuration parameters need to be accesed in the application we have to import 'main.mjs' module which is delivering the config values.

## Server Config

We have also the config module version for the database configuration: cdbdefault.mjs, cdbustom.mjs, dbmain.mjs.
