// Interface for skins/layouts
import {config} from "./cfg.mjs"
import {Skin} from "../layouts.mjs"
import {cacheDriver, cacheReadStream, cacheWriteStream} from "./cache.mjs"
import {streamErrorGuard} from "../errors.mjs"

const mySkin = new Skin(config.get("layouts-folder-path"))

export async function startLayouts() {
  const searchParams = new URL(config.get("layouts-url-path"), "http://localhost").searchParams
  await mySkin.getSkin(searchParams.get("skin") || "root")
  // initialicing cache content
  if (config.get("cache") != "none") {
    const cacheTpParams = {skinId: searchParams.get("skin")  || "root", subSkinId: searchParams.get("subskin")}
    await mySkin.writeAllTpContent(await cacheWriteStream("templates", cacheTpParams), searchParams.get("skin")  || "root", searchParams.get("subskin"))

    const cacheCssParams = {css_skinId: searchParams.get("skin")  || "root", css_subSkinId: searchParams.get("subskin"), css_styleId: searchParams.get("style") || "main"}
    await mySkin.writeCssContent(await cacheWriteStream("css", cacheCssParams), searchParams.get("skin")  || "root", searchParams.get("subskin"), searchParams.get("style") || "main")
  }
}

export async function respond(request, response){
  const searchParams = new URL(request.url, "http://localhost").searchParams
  response.setHeader("Content-Type", "text/html") // we may write header explicity instead: writeHeader
  if (searchParams.get("style")) {
    if (!cacheDriver) {
      await mySkin.writeCssContent(response, searchParams.get("skin")  || "root", searchParams.get("subskin"), searchParams.get("style") || "main")
      return
    }
    const cacheParams = {css_skinId: searchParams.get("skin")  || "root", css_subSkinId: searchParams.get("subskin"), css_styleId: searchParams.get("style") || "main"}
    const cacheStream = await cacheReadStream("css", cacheParams)
    if (cacheStream === false) {
      await mySkin.writeCssContent(response, searchParams.get("skin")  || "root", searchParams.get("subskin"), searchParams.get("style") || "main")
      // actualizando cache
      await mySkin.writeCssContent(await cacheWriteStream("css", cacheParams), searchParams.get("skin")  || "root", searchParams.get("subskin"), searchParams.get("style") || "main")
      return
    }
    console.log("layouts css comes from cache")
    streamErrorGuard(cacheStream, response)
    cacheStream.pipe(response)
    return
  }

  if (searchParams.get("tp")){
    mySkin.writeTpContent(response, searchParams.get("skin")  || "root", searchParams.get("subskin"), searchParams.get("tp"))
    return
  }

  if (!cacheDriver) {
    await mySkin.writeAllTpContent(response, searchParams.get("skin")  || "root", searchParams.get("subskin"))
    return
  }
  const cacheParams = {skinId: searchParams.get("skin")  || "root", subSkinId: searchParams.get("subskin")}
  const cacheStream = await cacheReadStream("templates", cacheParams)
  if (cacheStream === false) {
    await mySkin.writeAllTpContent(response, searchParams.get("skin")  || "root", searchParams.get("subskin"))
    // updating cache
    await mySkin.writeAllTpContent(await cacheWriteStream("templates", cacheParams), searchParams.get("skin")  || "root", searchParams.get("subskin"))
    return
  }
  console.log("layouts tps comes from cache")
  streamErrorGuard(cacheStream, response)
  cacheStream.pipe(response)
}