import {runService} from "../serverutils.mjs"
import {config} from "./cfg.mjs"
import {startLayouts} from "./layouts.mjs"
import {basename, dirname, join as pathJoin} from "path"
import {makeReport} from "./reports.mjs"
import {listener} from "./main.mjs"

export async function startServices(context){
  await setContext(context)
  for (const myService of context.getRelationship("services").children
  .filter(myService=>myService.props.status=="on")) {
    await setService(myService)
    await runService(myService, listener)
  }
}

export async function setService(myService){ // *** quizas mejor que mande service props, en principio no se necesita service en el enviroment
  const configDefaults = ["proxy", "db-root-folder-path", "db-schema-file-path", "db-permissions-file-path", "db-import-file-path", "db-mode", "loader-path"]
  for (const defaultConfig of configDefaults) {
    if (!(defaultConfig in myService.props)) // otra opcion == undefined
      myService.props[defaultConfig] = config.get(defaultConfig)
  }
  const enviromentVars = ["loader-path", "images-path"]
  myService._enviroment = new Map(Object.entries(myService.props).filter(([key, value])=>enviromentVars.includes(key)))
  myService._enviroment.set("service", myService)
  if (myService.props["db-url"]) {
    const dbType = new URL(myService.props["db-url"], "http://localhost").protocol.split(":")[0]
    const {DbGateway} = await import("../" + dbType + "gateway.mjs")
    const dbGateway = new DbGateway(myService.props["db-root-folder-path"])
    let dbMode = myService.props["db-mode"]
    if (dbMode)
      dbMode = Object.fromEntries(dbMode)
    const {importSchema, importPermissions} = await import("../dbutils.mjs")
    await dbGateway.init(myService.props["db-url"], await importSchema(myService.props["db-schema-file-path"]), dbMode, await importPermissions(myService.props["db-permissions-file-path"]))
    const {total} = await dbGateway.elementsFromTable("UsersTypes", undefined, undefined, true)
    if (total == 0) {
      // hacer populate
      const {populateDb} = await import( "../import.mjs")
      const {setConstructors} = await import( "../dbutils.mjs")
      const [Node] = setConstructors(dbGateway)
      await populateDb(Node, myService.props["db-import-file-path"] || config.get("db-import-file-path"))
      console.log(`Database ${basename(new URL(myService.props["db-url"]).pathname)} from ${myService.parent.partner.props.name} service in port ${myService.props.port} pupulated, consider change admin passwords`)
    }
    myService._enviroment.set("db-gateway", dbGateway)
  }
}

async function setContext(context){
  await startLayouts() // layouts is the same for all services in context, se seleccionan en cliente ??
  process.env.TZ = config.get("timeZone") // #como puede ser esto local para cada contexto????
  makeReport(`Server ${context.props.name} started`) // make report should be called after enviroments are settled
}
