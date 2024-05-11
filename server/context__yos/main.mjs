/*  Entry point of the application
    Calls server initialization and acts as services gateway

    Quizas mejor importar al principio en lugar de dinamicamente ???
*/
import {config} from "./cfg.mjs"
//import {makeReport} from "./reports.mjs" // --- production mode

const routerMap = new Set()

// --- Routing

// Deliver client source files static content. It is first because it is more often
routerMap.add(async (request, response, enviroment)=>{
  const pathName = new URL(request.url, "http://localhost").pathname
  if (pathName.match(new RegExp(".cmd$")))
    return false
  const {fileServer} = await import("./clientsource.mjs")
  await fileServer(request, response, enviroment)
  return true
})
// DB Request
routerMap.add(async (request, response, enviroment)=>{
  const pathName = new URL(request.url, "http://localhost").pathname;
  if (!pathName.match(new RegExp("^/" + config.get("request-url-path"))))
    return false
  const {respond} = await import("./respond.mjs")
  await respond(request, response, enviroment)
  return true
})
// Deliver product image files static content
routerMap.add(async (request, response, enviroment)=>{
  const pathName = new URL(request.url, "http://localhost").pathname
  if (!pathName.match(new RegExp("^" + new URL(config.get("catalog-images-url-path"), "http://localhost").pathname)))
    return false
  const {fileServer} = await import("./productimages.mjs")
  fileServer(request, response, enviroment)
  return true
})
// layouts
routerMap.add(async (request, response, enviroment)=>{
  const pathName = new URL(request.url, "http://localhost").pathname;
  if (!pathName.match(new RegExp("^" + new URL(config.get("layouts-url-path"), "http://localhost").pathname)))
    return false // config comes with default searchParams
  const {respond} = await import("./layouts.mjs")
  await respond(request, response, enviroment)
  return true
})
// upload
routerMap.add(async (request, response, enviroment)=>{
  const pathName = new URL(request.url, "http://localhost").pathname;
  if (!pathName.match(new RegExp("^/" + config.get("upload-images-url-path"))))
    return false
  const {uploadImages} = await import("./uploadimages.mjs")
  uploadImages(request, response, enviroment)
  return true
})
// reports
routerMap.add(async (request, response, enviroment)=>{
  const pathName = new URL(request.url, "http://localhost").pathname;
  if (!pathName.match(new RegExp("^/" + config.get("reports-url-path"))))
    return false
  const {reporting} = await import("./reporting.mjs")
  reporting(request, response, enviroment)
  return true
})

// ** entrance point, serving suitable http server **

export async function listener(request, response, enviroment) {
  for (const myFunc of Array.from(routerMap)) {
    try {
      if (await myFunc(request, response, enviroment))
        break // no need to keep searching for the routing response
    }
    catch(err) {
      response.end()
      request.destroy()
      throw err // --- development mode
      // makeReport(err) // --- production mode
    }
  }
}