import {loadContexts, runServers} from "./server.mjs"

await runServers(await loadContexts())