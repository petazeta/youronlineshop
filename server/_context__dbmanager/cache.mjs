// It would be posible to add devices like redis or mongodb, olders versions has it implemented

import {config} from "./cfg.mjs"
import {isInCache, getDriver} from "../cache.mjs" // helpers

export const cacheDriver = config.get("cache")!="none" && await getDriver(config.get("cache"))

export async function cacheReadStream(key, parameters) {
  if (!await isInCache(cacheDriver, key, parameters))
    return false
  return cacheDriver.readStream(key)
}

export async function cacheWriteStream(key, parameters, data) {
  for (const key in parameters) {
    cacheDriver.set(key, parameters[key])
  }
  return cacheDriver.writeStream(key)
}

export async function cacheDelete(key, parameters) {
  for (const key in parameters) {
    cacheDriver.delete(key)
  }
  return cacheDriver.delete(key)
}