import {createReadStream, promises as fs} from "fs";
import getMimeType from "../server/mimetypes.mjs"
import {streamErrorGuard} from "./errors.mjs"

// Errors are catched and reporter in main.mjs
export async function streamFile(pathName, response, source /* stream from other source*/) {
  // no entiendo por que hay que hacer writeHead aqui y en otros no hace falta
  response.writeHead(200, {
    "Content-Type": getMimeType(pathName),
    "Content-Length": (await fs.stat(pathName)).size
  })
  const readStream = source || createReadStream(pathName)
  streamErrorGuard(readStream, response)
  // I don't really know the difference between do pipe directly or after open event triggered
  readStream.pipe(response) // pipe => equiv to on("data") (chk)=> resp.write(chk); on("end") ()=> resp.end())
}

export async function writeFile(pathName, response) {
  const readStream = createReadStream(pathName)
  streamErrorGuard(readStream, response)
  // I don't really know the difference between do pipe directly or after open event triggered
  readStream.on("open", ()=> readStream.pipe(response)) // pipe => equiv to on("data") (chk)=> resp.write(chk); on("end") ()=> resp.end())
}

/*
 No entiendo por que hay que hacer writeHead, en su lugar sería mejor simplemente establecer los headers:
  response.setHeader("Content-Type", "text/html")
  response.setHeader("Content-Length", (await fs.stat(pathName)).size)

*/