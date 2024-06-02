import {join as pathJoin} from "path"
import {setConstructors, importSchema} from "./dbutils.mjs"
import {proxyServer} from './proxyserver.mjs' // --- production mode

export const contexts = await loadContexts()
await startContextsServices(contexts)

// --- production mode start

// const proxyServerPort = '8001'

// proxyServer(contexts, proxyServerPort)

// --- production mode end

async function loadContexts(){
  const dbUrl = "servicedb://localhost/borrar1"
  const dbMode = Object.fromEntries([["cache", ["Contexts","Services"]]])
  const rootPath = "./data/services"
  const schemaPath = pathJoin("./data/services", "schema.json")
  const dbType = new URL(dbUrl, "http://localhost").protocol.split(":")[0]
  const {DbGateway} = await import("./" + dbType + "gateway.mjs")
  const dbGateway = new DbGateway(rootPath)
  await dbGateway.init(dbUrl, await importSchema(schemaPath), dbMode)
  const [_, Linker] = setConstructors(dbGateway)
  const contextsRoot = await new Linker("Contexts").dbLoadMyRoot()
  await contextsRoot.dbLoadMyTree()
  return contextsRoot
}
async function startContextsServices(contextRoot){
  contextRoot.props.portCount = 4000
  for (const context of contextRoot.getRelationship("contexts").children) {
    let {startServices} = await import("./" + pathJoin(context.props.folderName, "serverstart.mjs"))
    await startServices(context)
  }
}