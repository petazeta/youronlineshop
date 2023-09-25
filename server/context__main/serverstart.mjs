import {config} from "./cfg.mjs"
import {startLayouts} from "./layouts.mjs"
import {setDbSchema} from "./dbschema.mjs"
import {SiteDbGateway} from "../dbgateway.mjs"
import {hosts} from "./hosts.mjs"

const enviroments = new Map()

export async function initServer(){
  console.log("initalizing server")
  for (const [hostName, hostValues] of hosts) {
    const dbGateway = new SiteDbGateway()
    await dbGateway.connect(config.get("db-url") + hostValues.db_doc_name + "?authSource=admin", setDbSchema)
    enviroments.set(hostName, {dbGateway : dbGateway})
  }
  
  await startLayouts()

  process.env.TZ = config.get("timeZone")
}

export {enviroments}