Building a desktop application
==============================

## Electron

Our application is splited in the client and the server. We can run the server independly in a local or a remote computer and the client using Electron. Electron will wrap the client app into chrome. To do it we need to install Electron and use the basic Electron main.js script.

Building a client/server desktop application based in this web application is a quite straightforward process by using Electron. The easiest way would be to load everything from server. And we can make so by using an electron main.js file containing a instruction like `mainWindow.loadURL('http://host:port')`. There is an Electron main.js sample in resources/electron/sample. The other way to do so would be by loading the client side files from the client file system. It would be very similar to try to open the client files (starting by loader/main/index.html) directly from browser. In this case the load method would be like `mainWindow.loadFile('index.html')`. And for doing so, even using Elecron, we must deactivate the code at client/main.js that prevents it: `if window.location.protocol=="file:" ...`. Other adjustments are also needed in this case and we will discus them afterwards.

## Desktop adventages

There would be some adventages of having our own client version runing insted of the generic one. By using Electron we can manipulate directly the client file system so, for example, we can make automatic catalog backup copies into the client computer. We could also manage the printer device or any other devices.

## Loading client files from file system

For doing so we should use the `loadFile` method insted the `loadURL` one and copy the folder "loader/main" content into the root folder. The other files needed for the client (server is runing apart) are the ones at the folders "client" and "shared". The next step is to change the API (server) entry points paths that are defined as relatives to the browser url path (which by now is the file system). To do so we must change the client script at shared/cfg/default.mjs (or custom.mjs) for pointing to the new server entry point that can be either a localhost one or a remote one.

There should be some adjustments for the svg image files that are defined at the css. These files are being loaded from server, and not from the client folder structure, because they belong to the css themes feature. These behaviour is hidden from the client so Electron client version would try to get these files directly from the client folder structure. Therefore we would need to change some scripts (or css files) to change the path of these files to ensure the client is retrieving them from server. Other way of doing so it would be by moving the uploading themes feature from server to client or by patching the svg css process: copying the svg files to the image-css folder and renaming them to themeId_svg-name.

## Client / Server integration

I should mention that I think there are client/server (API) integration posibilities in Electron that could be interesting for some applications.
