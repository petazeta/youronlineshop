/*
  It serves the following static files that are the client app source ones
  The following files are allowed for retrieving:
  - / , index.html => site path /index.html
  - ./images/ => site path /images
  - ./client/ ./shared/ <==> client and shared path
*/
import {join as pathJoin} from "path"
import makeReport from "./reports.mjs"
import {config} from "./cfg.mjs"
import {streamFile, writeFile} from "../streamfile.mjs"

export async function fileServer(request, response) {
  let filePathName = new URL(request.url, "http://localhost").pathname
  if (filePathName == "/")
    filePathName = "/index.html"
  try {
    if (filePathName.match(/^\/index\.html/)) {
      filePathName = pathJoin(config.get("loader-path"),  filePathName)
      await streamFile(filePathName, response)
      return
    }
    if (filePathName.match(/^\/images\//)) {
      filePathName = pathJoin(config.get("loader-path"),  filePathName)
      await streamFile(filePathName, response)
      return
    }
    if (filePathName.match(/^\/(client|shared)\//)) {
      // sin nada seria: filePathName=pathJoin("./",  filePathName)
      const match = filePathName.match(/^\/(client|shared)\//)[1]
      filePathName = filePathName.replace(match, "/")
      if (match == "client") filePathName = pathJoin(config.get("client-path"), filePathName)
      if (match == "shared") filePathName = pathJoin(config.get("shared-path"), filePathName)
      await streamFile(filePathName, response)
      return
    }
    else throw new Error("stream file error")
  }
  catch(err) {
    response.writeHead(404)
    makeReport("error trying to access file: " + filePathName)
    response.end()
  }
}