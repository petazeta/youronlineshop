Servers Manager
======


# Introduction

To be able to deal with the software instances that are runing in the server (server side) we are building this tool.


# Contexts and services

We have already implemented a way to manage server instances for starting them. We have contexts that are special instances (some custom code) and then services that are using the same code but different enviroment variables.

We are using a rootContext to wrap the contexts that therefore have services. This structure contains all the information about services and some elements to interact (request handler, dbgateway)

# Service manament

At client we could have a standard database manager like (dbmanager) and then in server we could some database mixed with the contexts database. We would manage the database as a whole.

One option would be to create database (including users, languages) at the same with the contexts.