import {createRequire} from "module"

const require = createRequire(import.meta.url)

export const services = loadService()
/*
export function reloadHosts() {
  const newHosts = loadHosts()
  hosts.clear()
  for (const [key, value] of newHosts){
  	hosts.set(key, value)
  }
}
*/

function loadService(){
  return require("./service.json").map(hostService=>new Map(hostService))
}