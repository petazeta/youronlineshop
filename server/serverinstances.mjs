// Parece que este modulo esta implementado de momento para compartir el servicio de request de la base de datos

import {join as pathJoin} from "path"
//import {hosts} from "./context__dbmanager/hosts.mjs"

export const servers = new Map([
  ["context__main", {ports: []}],
  ["context__dbmanager", {ports: []}],
])

for (const [serverPathName, serverValues] of servers) {
  let {hosts} = await import("./" + pathJoin(serverPathName, "hosts.mjs"))
  for (const [hostN, hostV] of hosts) {
    servers.get(serverPathName).ports.push(Number.parseInt(hostN.split(":")[1]))
  }
}
/*
for (const [hostN, hostV] of hosts) {
  servers.get("context__dbmanager/main.mjs").ports.push(Number.parseInt(hostN.split(":")[1]))
}
*/