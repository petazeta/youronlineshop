import {config} from "./cfg.mjs"
import {startLayouts} from "./layouts.mjs"
//import {setDbSchema} from "./dbschema.mjs"
import {ServiceDbGateway} from "./dbgateway.mjs"
import {Services} from "../services.mjs"
import {loadContexts, runServers} from "../server.mjs"

const contexts = await loadContexts()
contexts.delete("serversmanager") // serversmanager is already running and doesn't need to be managed by server manager
await runServers(contexts) // running the other servers

export const enviroments = new Map()

export async function initServer(){
  console.log("initalizing server")
  const dbGateway = new ServiceDbGateway(contexts)
  const services = new Services("context__serversmanager") // setting own services
  services.loadServices()
  for (const serviceMap of services.serviceList) {
    const data = {props:{parentTableName: "TABLE_CONTEXTS", childTableName: "TABLE_SERVICES"}, partner: {props: {id: 2}}}
    const thisChild = {props: {"status": "on", "host-name": "localhost", "positionContexts": 1}}
    //console.log(dbGateway.getRoot("parentContext", {props:{childTableName: "TABLE_CONTEXTS"}}))
    console.log(await dbGateway.insertChild(["parentContexts"], "positionContexts", data, thisChild, null, true))
    enviroments.set(`${serviceMap.get("host-name")}:${serviceMap.get("port")}`, new Map([["db-gateway", dbGateway], ["loader-path", serviceMap.get("loader-path")], ["images-path", serviceMap.get("images-path")]]))
  }
  
  await startLayouts()

  process.env.TZ = config.get("timeZone")
}