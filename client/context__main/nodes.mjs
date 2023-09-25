import {BasicLinker, BasicNode} from '../../shared/linker.mjs'
import eventListenerMixin from '../eventlistenermixin.mjs'
import {modelRequestMixin, viewMixin, dataViewMixin, linkerViewMixin} from '../nodesmixin.mjs'
import {makeRequest, request, loadRequest, requestMulti} from './request.mjs'
import {getTemplate} from './layouts.mjs'
import prepareTpScripts from './viewcomponent.mjs'

const nodesConstructorsMixin=Sup => class extends Sup {
  static getLinkerConstructor() {
    return Linker
  }
  static getNodeConstructor() {
    return Node
  }
  static get nodeConstructor(){
    return Node
  }
  static get linkerConstructor(){
    return Linker
  }
}

const modelRequestContextMixin=Sup => class extends Sup {
  static async makeRequest(action, params, url) {
    return await makeRequest(action, params, url)
  }
  async request(action, params, url) {
    return await request(this, action, params, url)
  }
  async loadRequest(action, params, url) {
    return await loadRequest(this, action, params, url)
  }
  static async requestMulti(action, dataNodes, params, url) {
    return await requestMulti(action, dataNodes, params, url)
  }
}

const viewContextMixin=Sup => class extends Sup {
  // it seems it is becoming deprecated
  static async getTp(tpName) {
    return await super.getTp(tpName, getTemplate)
  }
}

const dataViewContextMixin=Sup => class extends Sup {
  // it seems it is becoming deprecated
  render(tp, params={}){
    return super.render(tp, params, prepareTpScripts)
  }
}

const Node=nodesConstructorsMixin(eventListenerMixin(dataViewContextMixin(dataViewMixin(viewContextMixin(viewMixin(modelRequestContextMixin(modelRequestMixin(BasicNode))))))))
const Linker=nodesConstructorsMixin(eventListenerMixin(linkerViewMixin(viewContextMixin(viewMixin(modelRequestContextMixin(modelRequestMixin(BasicLinker)))))))

export {Node, Linker}