import {createRequire} from "module"
import {join as pathJoin} from "path"
import {promises as fs} from "fs"

export class Services{
  constructor(contextFolderName){
    this.contextFolderName = contextFolderName
    this.serviceList
    this.rootPath = "./server"
    this.notDataKeys = ["positionContexts", "parentContexts"]
  }
  loadServices(){
    const require = createRequire(import.meta.url)
    this.serviceList = require("./" + pathJoin(this.contextFolderName, "services.json")).map(hostService=>new Map(hostService))
  }
  async insertService(serviceObj){
    this.serviceList.splice(serviceObj.positionContexts - 1, 0, new Map(Object.entries(serviceObj).filter(([key, value])=>!this.notDataKeys.includes(key))))
    //await this.saveServices()
  }
  async removeService(position){
    this.serviceList.splice(position-1, 1)
    //await this.saveServices()
  }
  async updateService(serviceObj){
    const position = serviceObj["positionContexts"]
    for (const key of Object.keys(serviceObj)) {
      if (this.notDataKeys.includes(key))
        continue
      this.serviceList[position - 1].set(key, serviveObj[key])
    }
    //await this.saveServices()
  }
  async saveServices(){
    //const savingData
    console.log("./" + pathJoin(this.rootPath, this.contextFolderName, "service2.json"))
    // Avoiding to insert any prop name that start with "_" which is reserver to not fields data
    await fs.writeFile("./" + pathJoin(this.rootPath, this.contextFolderName, "service2.json"), JSON.stringify(this.serviceList.map(service=>Object.fromEntries(Array.from(service).filter(([key, value])=>key.search(/^_/)!==0))), null, 2))
    
  }
}
