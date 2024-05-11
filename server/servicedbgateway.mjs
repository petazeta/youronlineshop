import {DbGateway as BaseDbGateway} from "./filedbgateway.mjs"
import {promises as fs} from "fs"
import {join as pathJoin} from "path"
import {unpacking} from '../shared/utils.mjs'

// falta update delete

export class DbGateway extends BaseDbGateway{

  async init(myUrl, schema, modeSettings, permissions, collectionMapping) {
    await super.init(myUrl, schema, modeSettings, permissions, collectionMapping)
    this.contextsPath = "./server"
  }

  async readDocs(collectionName) {
    if (collectionName=="Contexts")
      return await this.getContexts()
    if (collectionName=="Services")
      return await this.getAllServices()
    return await super.readDocs(collectionName)
  }

  async readDoc(collectionName, thisId){
    if (!collectionName || !thisId)
      return
    const documents = await this.getDocuments(collectionName)
    return documents.find(rec=>rec.id==thisId)
  }
  async writeDoc(collectionName, myRow){
    if (collectionName=="Services") {
      const contexts = await this.getDocuments("Contexts")
      const context = contexts.find(rec=>rec.id==myRow.parentContexts)
      await this.writeService(context, myRow)
    }
    else if (collectionName=="Contexts") {
      await this.writeContext(myRow)
    }
    else
      return await super.writeDoc(collectionName, myRow)
  }
  async removeDoc(collectionName, thisId){
    if (collectionName=="Services") {
      // it is already removed from cache by deleteMe, so readDoc(collectionName, thisId) is not valid
      const contextId = (await this.getAllServices()).find(service=>service.id==thisId).parentContexts
      const contexts = await this.getDocuments("Contexts")
      const context = contexts.find(rec=>rec.id==contextId)
      await this.removeService(context, thisId)
    }
    else if (collectionName=="Contexts") {
      await this.removeContext(thisId)
    }
    else
      return await super.removeDoc(collectionName, thisId)
  }

  async getServices(context){
    if (!context.folderName)
      return []
    const filePath = pathJoin(this.contextsPath, context.folderName, "services.json")
    let services = JSON.parse(await fs.readFile(filePath))
      .map(serviceEntities=>Object.assign(Object.fromEntries(serviceEntities), {parentContexts: context.id}))
    // If any manual record is added then we set an id
    if (services.some(service=>!service.id)) {
      services = services.map(serviceProps=>serviceProps.id ? serviceProps : Object.assign(serviceProps, {id: this.idGenerator.genId()}))
        .map(serviceProps=>serviceProps.positionContexts ? serviceProps : Object.assign(serviceProps, {positionContexts: 1}))
        .sort((a,b)=>a.positionContexts-b.positionContexts)
        .map((serviceProps, index)=>Object.assign(serviceProps, {positionContexts: index + 1}))
      await this.writeServices(context, services)
    }
    return services
  }

  async writeServices(context, services){
    const filePath = pathJoin(this.contextsPath, context.folderName, "services.json")
    // adds formating for a quick view to the file
    let content = JSON.stringify(services.map(doc=>Object.entries(doc).filter(([key])=>key!="parentContexts")), null, 2)
    .replace(/\n\s+([^\[\s])/g, '$1')
    .replace(/\]\]/g, "]\n  ]")

    return await fs.writeFile(filePath, content)
  }
  async getContext(contextName){
    const contextFolderName = "context__" + contextName
    const contexts = await this.getDocuments("Contexts")
    const rootContextId = contexts[0].id
    const contextIndex  = contexts.length
    if (!(await fs.lstat(pathJoin(this.contextsPath, contextFolderName))).isDirectory())
      return
    return Object.fromEntries(
      [
      ["name", contextFolderName.slice("context__".length)],
      ["folderName", contextFolderName],
      ["parentContexts", rootContextId],
      ["positionContexts", contextIndex + 1],
      ["id", this.idGenerator.genId()]
      ])
  }

  async getAllServices(context){
    let contexts, services = []
    if (context)
      contexts = [context]
    else
      contexts = await this.getDocuments("Contexts")
    for (const context of contexts) {
      services = [...services, ...await this.getServices(context)]
    }
    return services
  }
  async writeService(context, myRow){
    const collectionName = "Services"
    /*
    if (this.cache.has(collectionName)) { // esto parece que ya lo hace filedbgateway revisar ***
      const services = this.cache.get(collectionName)
      const index = services.findIndex(rec=>rec.id==thisId)
      if (index)
        services[index] = myRow
      else
        services.push(myRow)
    }
    */
    const services = await this.getServices(context)
    const index = services.findIndex(rec=>rec.id==myRow.id)
    if (index!=-1)
      services[index] = myRow
    else
      services.push(myRow)
    await this.writeServices(context, services)
  }
  async removeService(context, thisId){
    const collectionName = "Services"
    const services = await this.getServices(context)
    const index = services.findIndex(rec=>rec.id==thisId)
    if (index)
      services.splice(index, 1)
    await this.writeServices(context, services)
  }
  async getContexts(){
    const rootContextId = this.idGenerator.genId()
    const documents = [
      {id: rootContextId, name: "root"},
     ...(await fs.readdir(this.contextsPath))
    .filter(async entity=>(await fs.lstat(pathJoin(this.contextsPath, entity))).isDirectory())
    .filter(dirname=>dirname.search(/^context__/)===0)
    .map((contextFolderName, contextIndex)=>Object.fromEntries(
      [
      ["name", contextFolderName.slice("context__".length)],
      ["folderName", contextFolderName],
      ["parentContexts", rootContextId],
      ["positionContexts", contextIndex + 1],
      ["id", this.idGenerator.genId()]
      ]))
    ]
    this.cache.set("Contexts", documents)
    return documents
  }
  async writeContext(myRow){
    const collectionName = "Contexts"
    if (this.cache.has(collectionName)) {
      const contexts = this.cache.get(collectionName)
      const index = contexts.findIndex(rec=>rec.id==myRow.id)
      if (index)
        contexts[index] = myRow
      else
        contexts.push(myRow)
    }
  }
  async removeContext(thisId){
    const collectionName = "Contexts"
    if (this.cache.has(collectionName)) {
      const contexts = this.cache.get(collectionName)
      const index = contexts.findIndex(rec=>rec.id==thisId)
      if (index)
        contexts.splice(index, 1)
    }
  }
  async importUsers(Node, importFilePath){
    const data = JSON.parse(await fs.readFile(importFilePath))
    const usersRoot = new Node().load(unpacking(data))
    await usersRoot.dbInsertMyTree()
  }
}