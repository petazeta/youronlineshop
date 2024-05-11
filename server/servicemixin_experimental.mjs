import {saveServices} from "./servicesfiles.mjs"

export const serviceMixin = Sup => class extends Sup {

  static run(myService) {
    return myService._server.listen(myService.props.port)
  }
  run() {
    return this.constructor.run(this)
  }

  static close(myService) {
    return myService._server.close()
  }
  close() {
    return this.constructor.close(this)
  }

  dbInsertMySelf(extraParents=null, updateSiblingsOrder=false){
    return super.dbInsertMySelf(extraParents, updateSiblingsOrder)
  }
  async dbUpdateMyProps(pops){
    const result = await super.dbUpdateMyProps(pops)
    // *** we should reload props
    console.log(result)
    if (!this.props.status=="on") {
      //this.close()
    }
    else {
      //his.run()
    }
    await saveServices(this.parent.partner)
    return result
  }
}