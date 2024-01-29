/*
  It serves static product images files
*/
import {join as pathJoin} from "path"
import {streamFile} from "../streamfile.mjs"
import {enviroments} from "./serverstart.mjs"

export function fileServer(request, response) {
  const enviroment = enviroments.get(request.headers.host)
  const searchParams = new URL(request.url, "http://localhost").searchParams
  const injectionGuard = /\.\.|\//
  if (searchParams.get("size").match(injectionGuard)
  || searchParams.get("image").match(injectionGuard))
    throw new Error("incorrect request")
  const pathName = pathJoin(enviroment.get("images-path"), searchParams.get("size"), searchParams.get("image"))
  return streamFile(pathName, response)
}