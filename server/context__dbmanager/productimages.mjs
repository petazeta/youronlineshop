/*
  It serves static product images files
*/
import {join as pathJoin} from "path"
import {config} from "./cfg.mjs"
import {streamFile} from "../streamfile.mjs"

export function fileServer(request, response) {
  const searchParams = new URL(request.url, "http://localhost").searchParams
  const injectionGuard = /\.\.|\//
  if (searchParams.get("size").match(injectionGuard)
  || searchParams.get("image").match(injectionGuard))
    throw new Error("incorrect request")
  const pathName = pathJoin(config.get("images-path"), searchParams.get("size"), searchParams.get("image"))
  return streamFile(pathName, response)
}