import {config} from "./cfg.mjs"
import {startLayouts} from "./layouts.mjs"
import {setDbSchema} from "./dbschema.mjs"
import {SiteDbGateway} from "../dbgateway.mjs"
import {Services} from "../services.mjs"
import {basename, dirname} from "path"

export const enviroments = new Map()

export async function initServer(){
  console.log("initalizing server")
  const services = new Services(basename(dirname(import.meta.url)))
  services.loadServices()
  for (const serviceMap of services.serviceList) {
    const dbGateway = new SiteDbGateway()
    await dbGateway.connect(config.get("db-url") + serviceMap.get("db-doc-name") + "?authSource=admin", setDbSchema)
    const envMap = new Map([["db-gateway", dbGateway]])
    const enviromentVars = ["loader-path", "images-path", "db-import-path"]
    for (const envVar of enviromentVars) {
      envMap.set(envVar, serviceMap.get(envVar))
    }
    enviroments.set(`${serviceMap.get("host-name")}:${serviceMap.get("port")}`, envMap)
  }
  
  await startLayouts()

  process.env.TZ = config.get("timeZone")
}