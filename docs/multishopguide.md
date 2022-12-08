How to Build a multi shop
=========================

## Introduction

If you want to build several shops without the inconvenience of replicating all the source files you can do as follows.

## Steps

- Copy the yos/server-instances/main folder (and its content) once for each shop
- Modify the files:
  - yos/server-instances/new_shop/cfg/dbcustom.mjs => to set up the new mongodb url
  - yos/server-instances/new_shop/cfg/default.mjs => to set up the catalog-images folder and the logs file of the new shop.
- Execute (at yos folder):
  - node serverindex.mjs instances=./server-instances/new_shop/index.mjs:8001,./server-instances/another_shop/index.mjs:8002, etc...

## Note

If you are using redis as cache system (yos/instances/new_shop/cfg/default.mjs => cache: redis) then you must set up a redix prefix for each shop instance:
- yos/server-instances/new_shop/cfg/dbdefault.mjs => to set up the redix prefix