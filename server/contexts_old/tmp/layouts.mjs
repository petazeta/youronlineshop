// Interface for skins/layouts
import {config} from './cfg/main.mjs'
import Skin from '../../layouts.mjs'
import {cacheRequest, cacheResponse} from './tmptscache.mjs';

const {layoutsUrlPath, layoutsPath} = config
const mySkin = new Skin(layoutsPath)

export function startLayouts() {
  return mySkin.getSkin(new URL(layoutsUrlPath, 'http://localhost').searchParams.get("skin") || "root")
}

export async function respond(request, response){
  const searchParams = new URL(request.url, 'http://localhost').searchParams
  console.log("respond", request.url)
  response.setHeader("Content-Type", "text/html")
  if (searchParams.get("style")) {
    const cacheParams = {css_skinId: searchParams.get("skin")  || "root", css_subSkinId: searchParams.get("subskin"), css_styleId: searchParams.get("style")}
    const cacheResult = await cacheRequest("css", cacheParams)
    if (cacheResult!==false) {
      console.log("css content comes from cache")
      response.write(cacheResult)
    }
    else {
      const rqResult = mySkin.getCssContent(searchParams.get("skin") || "root", searchParams.get("subskin"), searchParams.get("style"))
      response.write(rqResult)
      cacheResponse("css", cacheParams, rqResult)
    }
  }
  else if (searchParams.get("tp")){
    response.write(mySkin.getTpContent(searchParams.get("skin")  || "root", searchParams.get("subskin"), searchParams.get("tp")))
  }
  else {
    const cacheParams = {skinId: searchParams.get("skin")  || "root", subSkinId: searchParams.get("subskin")}
    const cacheResult = await cacheRequest("templates", cacheParams)
    if (cacheResult!==false) {
      console.log("tp content comes from cache")
      response.write(cacheResult)
    }
    else {
      const rqResult = mySkin.getAllTpContent(searchParams.get("skin")  || "root", searchParams.get("subskin"))
      response.write(rqResult)
      cacheResponse("templates", cacheParams, rqResult)
    }
  }
  return response.end()
}