/*

*/

export class TmptsCache{
  constructor(memDriver){
    this.cacheMem = memDriver
  }
  async readStream(contentType, parameters) {
    if (await isInCache(this.cacheMem, parameters))
      return this.cacheMem.readStream(contentType)
  }
  async writeStream(contentType, parameters) {
    // it only push when the cache is empty to avoid refreshing every time
    if (! await isInCache(this.cacheMem, parameters)) {
      for (const key in parameters) {
        this.cacheMem.set(key, parameters[key])
      }
      return this.cacheMem.writeStream(contentType)
    }
  }
}

// --- Helpers

async function isInCache(cacheMem, parameters) {
  for (const key in parameters) {
    if (parameters[key] != await cacheMem.get(key))
      return false
  }
  return true
}