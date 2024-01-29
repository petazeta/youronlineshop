***********************
* DBMANAGER EXTENSION *
***********************

v0.1. 18-11-2022 (day-month-year)


***********
* Support *
***********

Please write: melchorherrera@gmail.com


*********
* About *
*********

This extension of your online shop (YOS) is a database manager.


****************
* Installation *
****************

1 - Create a new YOS instance and copy the the instance files (overwrite existing files). no no se
2 - Copy the extension layout/dbmanager folder inside YOS layout folder. no
3 - Edit database settings at: instance/cfg/dbcfg.json.
4 - tampoco


*******************
* Getting started *
*******************

-----------------------
# spcefic DbManager files

README.md  README.txt

./server:
safety.mjs, responses.mjs (añadir responseAuth.set('get table list', ()=>Array.from(getTableList().values()));)

./client:
main.js 

./client/.../css:
common.css  dbadmin.css

.client/.../css/images:
expander.svg  pluslink.svg  reducer.svg  trashlink.svg

./shared:
usermixing.js

./client/.../views:
body.html        butdeletelink.html  node.html
butaddlink.html  linker.html       table.html
nodesview.html

./loader/main/images/
icon.svg