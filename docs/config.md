Configuration
==============

# Introduction

There are some parts of the application that are customizable. For this reason we have a file with some customization variables and also a module for this specific feature. The config module is composed for the cfg/default.mjs, cfg/custom.mjs, cfg/main.mjs and cfg/mainserver.mjs files. The default file contains the configuration variables with their default values. The custom values will override the default ones.

File cfg/main.mjs and cfg/mainserver.mjs will manage the module behaviour.

# Module

We have described the server configuration module. Client module is the same but doesn't need the mainserver module element [*1*].

For using the module we have first to set the custom vars. At programing we have to import the module default element of cfg/mainserver.mjs that is an object containing the config vars. There is a version for server, client and the shared configuration. The client configuration importing module is main.js and it needs to be initiated through calling setConfig function that can have an argument and we would use it to add some alternative configuration in development process. The server doesn't need any initiation and both are taking the shared values within.

We have also the config module version for the database configuration: cfg/dbdefault.mjs, cfg/cdbustom.mjs, cfg/dbmain.mjs and cfg/dbmainserver.mjs.

[1] The "server" version of a module porpouse is to be an interface of the module. It can deliver a new instance of the module class object when changes in the object can be made during the request processing. This way other requests processing opeartions doesn't interfere in previous ones.
