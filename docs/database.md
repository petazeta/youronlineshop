Database
========

## Introduction

## ODM

For communicating with database and making operations we are using mongoose ODM library. We are implementing our own features on the top of these ODM in class SiteDbGateway at server/dbgateway.mjs. Some features are for example insertChild, getChildren, ect... for a given node model. We will need to develop some utilities related to the database schema definition. Mongoose has a schema definition system and we are using it in server_instances/main/dbschema.mjs.

## DB Gateway

As we have stated we are using a db gateway to perform the db operations we need in our system. Database internals are then managed for the db gateway. This allows to write another version of this db gateway for diferent database systems.

### Database internals

Database collections names are based in the schema definition model names (dbschema.mjs), but they are not the same. Collection names are a derivative from the model names following this rule:
- Collection names for mongoose models: Mongoose automatically looks for the plural, lowercased version of your model name

At the python case we are using pymongo ODM library. To adapt it for the mongoose schema definition we are making a database schema from dictionaries at server/dbschema.py.


## Formatos

Las fechas en la base de datos estan en formato Date. Al ser transferidas en formato JSON se realizan a través del procedimiento objectoDate.toISOSstring(), dando como resultado algo como: "2022-10-30T08:55:18.009Z"

## Streaming

para hacer un streaming directamente desde la bse de datos se puede usar.
    query
    .cursor() // devuelve stream
    .pipe(JSONStream.stringify()) // to combine documents into an array instead of single objects
    .pipe(res.type('json')) // which sets the HTTP Content-Type header to application/json and returns itself (the response stream) again
