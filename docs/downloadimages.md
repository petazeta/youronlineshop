Products images
===============

# Intro

At the database there is a specific collection for product images (itemsImages). The overal process for providing the images consists in get the item images names, set the image url to the src attribute of the image element attribute (client) and deliver the image to the browser when requested (server).

# Server

The specific process is the image file deliver from server to client. This is made by server/context__main/productimages.mjs. It takes the search params size and name from the url. Url matchs config.catalogImagesUrl.

# Client

See client/context__main/catalog.categories.mjs