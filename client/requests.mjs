import {packing, unpacking, crawler} from '../shared/utils.mjs'

export class Requests{
  constructor() {
    this.reqReduc = new Map(reqReduc)
    this.reqLoaders = new Map(reqLoaders)
    this.reqMethods = new Map(reqMethods) // http request method
    this.reqContentType = new Map(reqContentType)
  }

  prepareRequest(action, parameters={}) {
    const onlyParams = parameters.nodeData? Object.fromEntries(Object.entries(parameters).filter(([key, value])=>key!="nodeData")) : parameters
    const nodeData = parameters.nodeData
    let reducFuncs = this.reqReduc.get(action) || this.reqReduc.get("default")
    if (!Array.isArray(reducFuncs))
      reducFuncs = [reducFuncs] // we can get nodeRedFunc alone or [nodeRedFunc, paramRedFunc], we set it to an array anyway
    const [nodeRedFunc, paramRedFunc] = reducFuncs
    const parametersReduc = onlyParams && paramRedFunc? paramRedFunc(onlyParams) : onlyParams
    const nodeReduc = nodeData && nodeRedFunc? nodeRedFunc(nodeData) : nodeData
    return {nodeData: nodeReduc, ...parametersReduc}
  }

  loadResult(myNode, result, action, params) {
    const loadFunc = this.reqLoaders.get(action) || this.reqLoaders.get("default")
    loadFunc(myNode, result, params)
    return myNode
  }

  prepareMultiRequest(action, dataNodes, parameters=[]) {
    //In case we pass single args we multiplicate it for the nodes number
    if (typeof action=='string') {
      action = Array(dataNodes.length).fill(action)
    }
    if (parameters && !Array.isArray(parameters)) {
      parameters = Array(dataNodes.length).fill(parameters)
    }
    const reducedParams=[]
    // we make reduction and save the result also for reduce only option
    for (const index of Object.keys(dataNodes)) {
      reducedParams[index] = this.prepareRequest(action[index], {nodeData: dataNodes[index], ...parameters[index]})
    }
    return reducedParams
  }
}

const reqReduc = new Map()
const reqLoaders = new Map()
const reqMethods = new Map() // http request method
const reqContentType = new Map()

reqReduc.set("get my root", myNode=>packing(myNode.clone(0, 0)))
reqLoaders.set("get my root", (myNode, result)=>{
  myNode.children=[]
  if (result!=null) myNode.addChild(new myNode.constructor.nodeConstructor().load(result))
})
reqReduc.set("get my childtablekeys", reqReduc.get("get my root"))
reqReduc.set("get my relationships", myNode=>packing(myNode.clone(1, 0, "id")))
reqLoaders.set("get my relationships", (myNode, result)=>{
  myNode.relationships=[]
  result.forEach(rel=>myNode.addRelationship(new myNode.constructor.linkerConstructor().load(rel)))
})
reqReduc.set("get my children", [myNode=>packing(myNode.clone(1, 0, "id")), reduceExtraParents])
reqLoaders.set("get my children", (myNode, result)=>{
  myNode.children=[]
  result.data.forEach(child=>myNode.addChild(new myNode.constructor.nodeConstructor().load(child)))
  myNode.props.total=result.total
})
reqReduc.set("get all my children", reqReduc.get("get my root"))
reqLoaders.set("get all my children", reqLoaders.get("get my children"))
reqReduc.set("get my tree", [myNode=>packing(myNode.clone(1, 0, "id")), reduceExtraParents])
reqLoaders.set("get my tree", (myNode, result, params)=>{
  if (myNode.constructor.nodeConstructor.detectLinker(myNode)) {
    myNode.children=[]
    if (result.total==0) return
    const myResult=unpacking(result.data)
    for (const child of myResult.children) {
      myNode.addChild(new myNode.constructor.nodeConstructor().load(child))
    }
    myNode.props.total=result.total
    return
  }
  if (params?.myself) {
    myNode.load(unpacking(result))
    return
  }
  myNode.relationships=[]
  const myResult=unpacking(result)
  for (const rel of myResult.relationships) {
    myNode.addRelationship(new myNode.constructor.linkerConstructor().load(rel))
  }
})
reqReduc.set("get my props", myNode=>packing(myNode.clone(1, 0, "id")))
reqLoaders.set("get my props", (myNode, result)=>{
  Object.assign(myNode.props, result)
})
reqMethods.set("get my props", ()=>"put")
reqReduc.set("get my ascendent", myNode=>packing(myNode.clone(1, 1, "id"))) // *** que diferencia con my tree up?
reqReduc.set("get my tree up", reqReduc.get("get my ascendent"))
reqLoaders.set("get my tree up", (myNode, result)=>{
  if (!result) return result
  if (myNode.constructor.nodeConstructor.detectLinker(myNode)) {
    myNode.partner=new myNode.constructor.nodeConstructor().load(unpacking(result))
    myNode.partner.addRelationship(myNode)
    return
  }
  if (Array.isArray(result)) {
    /*
    myNode.parent=[];
    for (let i=0; i<result.length; i++) {
      myNode.parent[i]=new myNode.constructor.linkerConstructor().load(unpacking(result[i]));
      myNode.parent[i].addChild(myNode);
    }
    */
    myNode.parent=result.map(res=>new myNode.constructor.linkerConstructor().load(unpacking(res)))
    myNode.parent.forEach(parent=>parent.addChild(myNode))
    return
  }
  myNode.parent=new myNode.constructor.linkerConstructor().load(unpacking(result))
  myNode.parent.addChild(myNode)
})
reqLoaders.set("get themes tree", (myNode, result)=>myNode.load(unpacking(result))) // *** anticuado??

reqReduc.set("add my link", [ myNode=>packing(myNode.clone(3, 0, null, 'id')), reduceExtraParents]) //we are keeping the props cause we need the sort_order positioning prop
reqMethods.set("add my link", ()=>"put")
reqReduc.set("add myself", [myNode=>packing(myNode.clone(3, 0, {"id": false}, 'id')), reduceExtraParents])
reqLoaders.set("add myself", (myNode, result)=>{
  Object.assign(myNode.props, result)
})
reqMethods.set("add myself", ()=>"put")
reqReduc.set("add my children", [myNode=>packing(myNode.clone(2, 1, {"id": false}, 'id', {"id": false})), reduceExtraParents]) // we need the partner (and partner->parent for safety check)
reqLoaders.set("add my children", (myNode, result)=>{
  result.forEach((res, i)=>Object.assign(myNode.children[i].props, res)) // *** esta parseado res con los tipos???
})
reqMethods.set("add my children", ()=>"put")
reqReduc.set("add my tree", [myNode=>{
  if (myNode.constructor.nodeConstructor.detectLinker(myNode))
    return packing(myNode.clone(2, null, {"id": false}, 'id', {"id": false}), true)
  else
    return packing(myNode.clone(3, null, {"id": false}, 'id', {"id": false}), true)
}, reduceExtraParents]) // we need the parent->partner (and parent->partner->parent for safety check)
reqMethods.set("add my tree", ()=>"put")
reqLoaders.set("add my tree", (myNode, result)=>{
  if (!result) return
  crawler(myNode, unpacking(result))
})
reqReduc.set("add my tree table content", reqReduc.get("add my tree"))
reqMethods.set("add my tree table content", ()=>"put")
reqLoaders.set("add my tree table content", reqLoaders.get("add my tree"))
reqReduc.set("edit my sort_order", myNode=>packing(myNode.clone(3, 0, "id", "id"))) // we need the parent->partner (and parent->partner->parent for safety check)
reqMethods.set("edit my sort_order", ()=>"put")
reqReduc.set("edit my props", myNode=>packing(myNode.clone(2, 0, null, "id")), true)
reqMethods.set("edit my props", ()=>"put")
reqLoaders.set("edit my props", reqLoaders.get("get my props"))

reqReduc.set("delete my link", reqReduc.get("edit my sort_order"))
reqMethods.set("delete my link", ()=>"put")

reqReduc.set("delete my children", reqReduc.get("add my children"))
reqMethods.set("delete my children", ()=>"delete")
reqReduc.set("delete my tree", reqReduc.get("edit my props")) // we need the partner for update siblings position
reqMethods.set("delete my tree", ()=>"delete")
reqReduc.set("delete my tree table content", reqReduc.get("delete my tree"))
reqMethods.set("delete my tree table content", ()=>"delete")
reqReduc.set("delete myself", reqReduc.get("delete my tree"))
reqMethods.set("delete myself", ()=>"delete")

reqReduc.set("payment", [myNode=>packing(myNode.clone()), params=>{
  if (params.payment)
    params.payment = packing(params.payment.clone(1, 0, null, "id"))
  return params
}])
reqLoaders.set("payment", (myNode, result)=>{
  Object.assign(myNode.props, result)
})
reqMethods.set("payment", ()=>"put")

// ***Por que no añadir una funcion default para parametros y asi seguir el mismo patron:
// reqReduc.set("default", myNode=>packing(myNode.clone()), params=>params)

reqReduc.set("default", myNode=>packing(myNode.clone()))
reqLoaders.set("default", (myNode, result)=>myNode.load(result))
reqMethods.set("default", ()=>"post")
reqContentType.set("default", ()=>"application/json")

function reduceExtraParents(params){
  if (params.extraParents && typeof params.extraParents == "object") {
    if (!Array.isArray(params.extraParents))
      params.extraParents = [params.extraParents]
    params.extraParents = params.extraParents.map(eParent=>{
      if (eParent.clone) { // por que hace esta comprobación??
        return packing(eParent.clone(1, 0, null, "id"))
      }
      return eParent
    })
  }
  return params
}