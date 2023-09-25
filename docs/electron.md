Building a desktop application
==============================

## Electron

Our application is splited in the client and the server. We can run the server independly in a local or a remote computer and the client using Electron. Electron will wrap the client app into chrome. To do it we need to install Electron and use the basic Electron main.js script.

Building a client/server desktop application is a quite straightforward process by using Electron. The easiest way would be to load everything from a server that is running independentlly. And we can make it so by using an electron main.js file containing a instruction like `mainWindow.loadURL('http://host:port')`. There is an Electron main.js sample in resources/electron/sample.

## Desktop adventages

There would be some adventages of having our own client version runing insted of the generic one. By using Electron we can manipulate directly the client file system so, for example, we can make automatic catalog backup copies into the client computer or we could manage the printer device or any other devices.

## Loading client files from file system instead of server

We could also try to integrate the client side files in Electron which would be like opening them (starting by loader/main/index.html) directly from browser. In this case the load method would be `mainWindow.loadFile('loader/main/index.html')` insted of 'loadUrl'. Apart from the 'loader' files the other files needed for the client (server is runing apart) are the ones at the folders "client" and "shared". We should adjust the scripts paths at "loader/main/index.html" to point to the correct client and shared paths. We could do it automatically in Electron preload.js by searching for scripts and changing their source attribute. In this case check out that when accesing the source attribute it becomes the full path and not the relative one.

The next step is to change the API (server) entry points paths that are defined as relatives to the browser url path (which now is the file system). To do so we must change the settings at shared/cfg/default.mjs (or custom.mjs) correcting the entry point host part that can be either a localhost or a remote one.

If we want to load the themes layouts templates from the client file system instead of loading them from server we must transfer themes functionallity to Electron. We can not just do it by using server facilities diretly in client files. The procedure is by making a bridge between client js files and Electron (server) functionallity.

## Client / Server integration

Cliente / Server integration in Electron would be posible by using contextBridge:
`const {contextBridge} = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
    myKey: myValue,
    myFuncKey: (arg)=>arrayfunc
})`
Then at the client script we can access the data by:
`const myValue=window.electronAPI.myKey;
const myFetch=window.myFuncKey;
const myReturn=myFetch(data);`

It seems that Electron is not using ECMASCript for the import statements at server and it could be necesary to change the syntax to CommonJs or using 'require'. There are also another alternative https://www.npmjs.com/package/esm

For mongodb check also this document:
https://www.mongodb.com/docs/realm/sdk/node/integrations/electron/