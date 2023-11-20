Import db
=========

## Introduction

Database data and the application data is stored in different ways. Application data has the structure of a tree, using the [Linker](linker.md) format. In the database system the data is stored in documents and collections. This data format although different is equivalent to the tree structure, so we can transfer from one format to another.

## Back up file

### Tree data format

To save application data and recover it later we use as well another format. This format is closer to the application data itself than to the database format but because data has circular relationships we can not save it directly like it is just using a json parser. And there could be another convenient factors that would bring us to choose the backup data format that we are using. However we had to make the choice already for using it in the communications between server and client. We use a package format for the data so we can use this format as well.

### Trees

Data trees are explained at [exportdb.md](exportdb.md).
