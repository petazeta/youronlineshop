/*  Entry point of the application
    Calls server initialization and acts as services gateway

    Quizas mejor importar al principio en lugar de dinamicamente ???
*/
import {config} from "./cfg.mjs";
import {makeReport} from "./reports.mjs";
import {initServer} from "./serverstart.mjs";
import {join as pathJoin} from "path"

await initServer()

makeReport("Server start") // make report should be called after initServer, for enviroments to be set

const routerMap = new Set()

// --- Routing

// Deliver client source files static content. It is first because it is more often
routerMap.add(async (request, response)=>{
  const pathName = new URL(request.url, "http://localhost").pathname
  if (pathName.match(new RegExp(".cmd$")))
    return false
  const {fileServer} = await import("./clientsource.mjs")
  await fileServer(request, response)
  return true
})
// DB Request
routerMap.add(async (request, response)=>{
  const pathName = new URL(request.url, "http://localhost").pathname;
  if (!pathName.match(new RegExp("^/" + config.get("request-url-path"))))
    return false
  const {respond} = await import("./respond.mjs")
  await respond(request, response)
  return true
})
// Deliver product image files static content
routerMap.add(async (request, response)=>{
  const pathName = new URL(request.url, "http://localhost").pathname
  if (!pathName.match(new RegExp("^" + new URL(config.get("catalog-images-url-path"), "http://localhost").pathname)))
    return false
  const {fileServer} = await import("./productimages.mjs")
  fileServer(request, response)
  return true
})
// layouts
routerMap.add(async (request, response)=>{
  const pathName = new URL(request.url, "http://localhost").pathname;
  if (!pathName.match(new RegExp("^" + new URL(config.get("layouts-url-path"), "http://localhost").pathname)))
    return false // config comes with default searchParams
  const {respond} = await import("./layouts.mjs")
  await respond(request, response)
  return true
})
// upload
routerMap.add(async (request, response)=>{
  const pathName = new URL(request.url, "http://localhost").pathname;
  if (!pathName.match(new RegExp("^/" + config.get("upload-images-url-path"))))
    return false
  const {uploadImages} = await import("./uploadimages.mjs")
  uploadImages(request, response)
  return true
})
// reports
routerMap.add(async (request, response)=>{
  const pathName = new URL(request.url, "http://localhost").pathname;
  if (!pathName.match(new RegExp("^/" + config.get("reports-url-path"))))
    return false
  const {reporting} = await import("./reporting.mjs")
  reporting(request, response)
  return true
})

// ** entrance point, serving suitable app **

export async function app(request, response) {
  for (const myFunc of Array.from(routerMap)) {
    try {
      if (await myFunc(request, response))
        break // no need to keep searching for the routing response
    }
    catch(err) {
      response.end()
      request.destroy()
      throw err // development mode
      // makeReport(err) // production mode
    }
  }
}