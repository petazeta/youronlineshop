import {hosts} from "./context__main/hosts.mjs"

export const servers = new Map([
  ["context__main/main.mjs", {ports: []}],
])

for (const [hostN, hostV] of hosts) {
  servers.get("context__main/main.mjs").ports.push(Number.parseInt(hostN.split(":")[1]))
}