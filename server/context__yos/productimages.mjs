/*
  It serves static product images files
  Tenemos que poner en cfg un parametro default-image que coincida con el cfg de cliente, o usar un codigo fijo sin estar en config mejor. este codigo carga la imagen que estara en loader/images
*/
import {join as pathJoin} from "path"
import {streamFile} from "../streamfile.mjs"

const samplePath = "images/samples" // sample images subpath in loader/

export function fileServer(request, response, enviroment) {
  const searchParams = new URL(request.url, "http://localhost").searchParams
  const injectionGuard = /\.\.|\//
  if (searchParams.get("size").match(injectionGuard)
  || searchParams.get("image").match(injectionGuard))
    throw new Error("incorrect request")
  const origin = searchParams.get("source")=="sample" ? pathJoin(enviroment.get("loader-path"), samplePath) : enviroment.get("images-path")
  const pathName = pathJoin(origin, searchParams.get("size"), searchParams.get("image"))
  return streamFile(pathName, response)
}