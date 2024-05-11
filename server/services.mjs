import {contexts} from "./server.mjs"
import {join as pathJoin} from "path"
import {runService} from "./serverutils.mjs"

export async function createContextService(contextName, serviceName, extraProps=[]){
  const myDomain = "localhost"
  // Check if serviceName is taken
  const myContext = contexts.getRelationship("contexts").getChild({name: contextName})
  const {data} = await myContext.getRelationship("services").dbGetMyChildren(undefined, {"host-name": serviceName + "." + myDomain})
  if (data.length) {
    throw new Error("service name is taken", {cause: "service api error response"})
  }
  const serviceSettings = [
    ["host-name",serviceName + "." + myDomain],
    ["positionContexts", myContext.getRelationship("services").children.length + 1]
  ]
  serviceSettings.push(...extraProps)
  const myService = myContext.getRelationship("services").addChild(new myContext.constructor.nodeConstructor(Object.fromEntries(serviceSettings)))
  myService.props = await myService.dbInsertMySelf()
  return myService.props.id
}
export async function startContextService(myNode){
  const myService = getContextService({id: myNode.parent.partner.props.id}, myNode.props.id)
  if (!myService)
    throw new Error("No service")
  return await startService(myService)
}

async function startContextService_old(contextName, serviceId){
  // we have to load the service to the context tree if it is not loaded yet
  const myService = getContextService({name: contextName}, serviceId)
  if (!myService) {
    throw new Error("No service")
  }
  return await startService(myService)
}

async function startService(myService){
  const myContext = myService.parent.partner
  if (!myService._enviroment) {
    const {setService} = await import("./" + pathJoin(myContext.props.folderName, "serverstart.mjs"))
    await setService(myService)
    // **** aqui actualiza la cache de la bd a los valores que pone en myservice ??? por que??
  }
  const {listener} = await import("./" + pathJoin(myContext.props.folderName, "main.mjs"))
  await runService(myService, listener)
  return true
}
// match ==> {id: value}
export function getContextService(match, serviceId){
  const myContext = contexts.getRelationship("contexts").getChild(match)
  return myContext.getRelationship("services").children.find(child=>child.props.id==serviceId)
}

//

export async function stopContextService(myNode){
  const myService = getContextService({id: myNode.parent.partner.props.id}, myNode.props.id)
  if (!myService)
    throw new Error("No service")
  await stopService(myService)
}

export async function stopContextService_old(contextName, serviceId){
  const myService = getContextService({name: contextName}, serviceId)
  if (!myService)
    throw new Error("No service")
  await stopService(myService)
}

async function stopService(myService){
  myService._server.close() // free port
  if (myService.props.status == "on")
    await myService.dbUpdateMyProps({status: "off"})
  // the service is still in context but status is off
  return true
}

// *** prueba
export function getContexts(){
  return contexts.clone(1, 3)
}
export function getContextServices(contextName){
  // we have to load the service to the context tree if it is not loaded yet
  const myContext = contexts.getRelationship("contexts").getChild({name: contextName})
  return myContext?.getRelationship("services")
}