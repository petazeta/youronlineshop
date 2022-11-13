How to Build a multi shop
=========================

# Introduction

If you want to build several shops without the inconvenience of replicating all the code you can do as follows.

# Steps

- Copy the yos/main-instance folder (and its content) once for each shop
- Modify the files:
  - yos/new_shop_instance/cfg/dbcustom.mjs => to set up the new mongodb url
  - yos/new_shop_instance/cfg/default.mjs => to set up the catalog-images folder and the logs file of the new shop.
- Execute (at yos folder):
  - node serverindex.mjs instances:./new_shop_instance/index.mjs:8001,/another_shop_instance/index.mjs:8002, etc...
