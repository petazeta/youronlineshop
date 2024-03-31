Products images
===============

# Intro

At the database there is a specific collection for product images (itemsimages). The overal process for providing the images consists in getting the item image name, set the image url to the src attribute of the image element attribute (client) and deliver the image to the browser when requested (server).

# Server

The specific process is the image file deliver from server to client. This is made by server/context__main/productimages.mjs. It takes the search params size and image (image name) from the url params. Url address would match config catalog-images-url-path parameter.

There is a third parameter called source that can have two values: sample / catalog. When catalog it would get the image from the path images-path(config) and when sample it would take it from loader-path(config)/images/itemsamples. This way it can deliver images of sample products that are fixed ones and not uploaded thourgh out this service.

# Client

See client/context__main/catalog/categories.mjs