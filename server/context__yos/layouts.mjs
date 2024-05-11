// Interface for skins/layouts
import {config} from "./cfg.mjs"
import {SkinsTree} from "../layouts.mjs"
import {cacheDriver, cacheReadStream, cacheWriteStream} from "./cache.mjs"
import {streamErrorGuard} from "../errors.mjs"

const mySkinsTree = new SkinsTree(config.get("layouts-folder-path"))

// *** mejor quitar esto de seleccionar skin y style en config, ya se selecciona en client
// Revisar para hacer algo como un objeto skin ??

export async function startLayouts() {
  const searchParams = new URL(config.get("layouts-url-path"), "http://localhost").searchParams
  await mySkinsTree.createTree()
  // **** revisar searchParams
  //await mySkinsTree.getSkin(searchParams.get("skin") || "default")
  // initialicing cache content
  if (config.get("cache") != "none") {
    const cacheTpParams = {skinId: searchParams.get("skin") || "default", subSkinId: searchParams.get("subskin")}
    await mySkinsTree.writeAllTpContent(await cacheWriteStream("templates", cacheTpParams), searchParams.get("skin") || "default", searchParams.get("subskin"))

    const cacheCssParams = {css_skinId: searchParams.get("skin") || "default", css_subSkinId: searchParams.get("subskin"), css_styleId: searchParams.get("style") || "default"}
    await mySkinsTree.writeCssContent(await cacheWriteStream("css", cacheCssParams), searchParams.get("skin") || "default", searchParams.get("subskin"), searchParams.get("style") || "default")
  }
}

export async function respond(request, response, enviroment){
  const searchParams = new URL(request.url, "http://localhost").searchParams
  // *** mejor seleccionar antes searchparams skin || default en lugar de cada vez????, mejor en lugar de un nombre que se seleccione default el primero que encuentre
  response.setHeader("Content-Type", "text/html") // we may write header explicity instead: writeHeader
  if (searchParams.get("style")) {
    if (!cacheDriver) {
      await mySkinsTree.writeCssContent(response, searchParams.get("skin") || "default", searchParams.get("subskin"), searchParams.get("style") || "default")
      return
    }
    const cacheParams = {css_skinId: searchParams.get("skin") || "default", css_subSkinId: searchParams.get("subskin"), css_styleId: searchParams.get("style") || "default"}
    const cacheStream = await cacheReadStream("css", cacheParams)
    if (cacheStream === false) {
      await mySkinsTree.writeCssContent(response, searchParams.get("skin") || "default", searchParams.get("subskin"), searchParams.get("style") || "default")
      // actualizando cache
      await mySkinsTree.writeCssContent(await cacheWriteStream("css", cacheParams), searchParams.get("skin") || "default", searchParams.get("subskin"), searchParams.get("style") || "default")
      return
    }
    console.log("layouts css comes from cache")
    streamErrorGuard(cacheStream, response)
    cacheStream.pipe(response)
    return
  }

  if (searchParams.get("tp")){
    mySkinsTree.writeTpContent(response, searchParams.get("skin") || "default", searchParams.get("subskin"), searchParams.get("tp"))
    return
  }

  if (!cacheDriver) {
    await mySkinsTree.writeAllTpContent(response, searchParams.get("skin") || "default", searchParams.get("subskin"))
    return
  }
  const cacheParams = {skinId: searchParams.get("skin") || "default", subSkinId: searchParams.get("subskin")}
  const cacheStream = await cacheReadStream("templates", cacheParams)
  if (cacheStream === false) {
    await mySkinsTree.writeAllTpContent(response, searchParams.get("skin") || "default", searchParams.get("subskin"))
    // updating cache
    await mySkinsTree.writeAllTpContent(await cacheWriteStream("templates", cacheParams), searchParams.get("skin") || "default", searchParams.get("subskin"))
    return
  }
  console.log("layouts tps comes from cache")
  streamErrorGuard(cacheStream, response)
  cacheStream.pipe(response)
}