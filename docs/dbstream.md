Database read stream
====================

We can read from database in a stream maner. This is now useful for the cache documents. We are working to connect now the database with the response, some experiments are being made in main.mjs, streamfromdatabase.mjs.

Parece que en mongodb el stream lo hace por fila (chunck = document) y no por contendio, asi que no valdría.

Para redis:
var stream = redis.scanStream();