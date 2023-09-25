import {Node as ProtoNode, Linker as ProtoLinker} from '../nodes.mjs'
import {dbGateway} from './dbgateway.mjs'

const nodesConstructorsMixin=Sup => class extends Sup {
  static get nodeConstructor(){
    return Node
  }
  static get linkerConstructor(){
    return Linker
  }
}
const nodeSettingsMixin=Sup => class extends Sup {
  static get dbGateway(){
    return dbGateway
  }
}
const Node = nodeSettingsMixin(nodesConstructorsMixin(ProtoNode))
const Linker = nodeSettingsMixin(nodesConstructorsMixin(ProtoLinker))


// deprecated
export function nodeFromDataSource(dataSource){
  return Node.clone(dataSource);
  /*
  const myClon= Node.detectLinker(dataSource) ? new Linker() : new Node();
  return myClon.load(dataSource);
  */
}

export {Node, Linker}

// getNodeConstructor(dbGateway), getLinkerConstructor(dbGateway)