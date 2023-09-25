import {Readable, Writable} from "stream"

export async function getDriver(device) {
  const devices = new Map()

  devices.set("mem", async function (){
    const content = new Map()
    return {
      get: (key)=>content.get(key),
      set: (key, value)=>content.set(key, value),
      readStream: (key)=>{
        return Readable.from(content.get(key))
      },
      writeStream: (key)=>{
        const streamValue = []
        content.set(key, streamValue)
        return new Writable({
          write(chunk, encoding, callback) {
            streamValue.push(chunk)
            callback()
          },
        })
      },
      delete: (key)=>content.delete(key),
      has: (key)=>content.has(key),
    }
  })
  return (await devices.get(device))()
}

export async function isInCache(cacheMem, key, parameters) {
  if (!cacheMem.has(key))
    return false
  for (const key in parameters) {
    if (parameters[key] != await cacheMem.get(key))
      return false
  }
  return true
}