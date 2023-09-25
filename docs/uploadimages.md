Upload images service
=====================

# Intro

At the database there is a specific collection for product images (itemsImages). The overal process for uploading images consists in creating a new database document (or editing an existing one) for the image and saving the image file in two sizes (big and small) at the correspondent folder. The image file name would be the same as the document id and there would be a folder for big images and another for the small ones.

# Server

The upload process is an important feature of our application and we are developing our own script for this purpouse. The feature is a bit complex because we are dealing with streams and multipart forms. About the most technical element of the upload, contained at the multipart.mjs module, we are not going to get into details. Only we would like to say that in our reasearch process we didn't find something similar to the fixBoundaryInBetween function that take in account the case when the boundary between parts appears splited in two, and we came to this solution for that situation.

The multipart module unique function parseContent is spliting the multipart form contents and saving any files to the disck. The files disck names and locations are calculated through the fields "name" and "filename" of the file part header. It takes a parameter that is the nameToPath function, which is a function that returns the file path destination and takes name and filename fields as argument.

The uploadimage.mjs module is invoked at the index.mjs module when the url path is the required for the catalog image upload. This module is sending the request and the nameToPath function to the parseContent function and it is responding thuogh the http server with 'true' or an error regarding to the result of the mentioned function.

# Client

The loadimg.html layout is in charge of managing the client process. It shows the image nodes for the porduct and the file input for selecting a new image. After the selecting image event it starts the following process:

- It resizes the image in two sizes using the module resizeimage.js.
- It creates a new node for the new image using addition.js module and sets its imagename property. (db request)
- It uploads the image using loadimg.js module.
- It shows the image small version at the screen view.

The loadimg.js module clreates a blank formdata and appends the images to it. Then it sends the formdata to server for uploading the images.

Module resizeimage.js uses canvas element and some other facilities to make the image resizing. The argument is the horizontal pixels and it returns an image blob.

Layout loadimglist.html preforms the image representation of the uploaded image. It is invoked as a child element from loadimg.html layout.