import http from "http"
import {join as pathJoin} from "path"
import {statSync, promises as fs} from "fs"
import {Services} from "./services.mjs"

// [ ["main", {folderName: "context__main", services: {serviceList: [...]}} ], ["dbmanager", {...}], ]
// serviceList: [{_server: httpServer, status: "on"}, {...}](Map)
export async function loadContexts(contextName, folderPath="./server"){
  const contexts = new Map(
    (await fs.readdir(folderPath))
    .filter(entity=>statSync(pathJoin(folderPath, entity)).isDirectory())
    .filter(dirname=>contextName ? dirname == "context__" + contextName : dirname.search(/^context__/)===0)
    .map(contextFolderName=>[contextFolderName.slice("context__".length), {folderName: contextFolderName, services: []}])
  )
  // Adding ports and service
  for (const [contextName, contextValues] of contexts) {
    contexts.get(contextName).services = new Services(contextValues.folderName)
    contexts.get(contextName).services.loadServices()
  }
  return contexts
}

export async function runServers(thisContexts){
  for (const [contextName, {folderName, services}] of thisContexts) {
    let {app} = await import("./" + pathJoin(folderName, "main.mjs"))
    for (const myService of services.serviceList) {
      if (myService.get("status")=="on")
        myService.set("_server", runServer(app, myService.get("port"), ()=>console.log("\n\x1b[35m%s\x1b[0m", `\n💻 Running server ${contextName} on port ${myService.get("port")}`)))
    }
  }
  return thisContexts
}

function runServer(app, port, callback){
  const myServer = http.createServer(app)
  myServer.listen(port, callback)
  return myServer
}