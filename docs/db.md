Database
========

## ORM

For communicating with database and making operations we are using an ORM system. There is a ORM that works with mongodb for node js called mongoose. We are implementing our special ORM at the top of this one to build all the features we need. These features are for example insertChild, getChildren, ect... for a given node model. We would need to develop some utilities as well for making these operations which are related to the database schema definition. Mongoose has a schema definition system and we are using it in dbschema.mjs. The file dbgateway.mjs is the implementation of our ORM and the utililies.

At the python case we are using pymongo ORM. For it we are making a database schema form dictionaries at file dbschema.py.
