import {authorizationToken} from "./webuser/authorization.mjs";
import {packing, unpacking} from '../shared/utils.mjs';

const reduceExtraParents = (params)=>{
  if (params.extraParents) {
    if (!Array.isArray(params.extraParents)) params.extraParents=[params.extraParents];
    params.extraParents=params.extraParents.map(eParent=>{
      if (eParent.clone) { // por que hace esta comprobación??
        return packing(eParent.clone(1, 0, null, "id"));
      }
      return eParent;
    });
  }
  return params;
};

export const reqReduc = new Map();
export const reqLoaders = new Map();
export const reqMethods = new Map(); // http request method
export const reqContentType = new Map();

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
reqReduc.set("get my ascendent", myNode=>packing(myNode.clone(1, 1, "id")))
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
reqLoaders.set("get themes tree", (myNode, result)=>myNode.load(unpacking(result)))

reqReduc.set("add my link", [ myNode=>packing(myNode.clone(3, 0, null, 'id')), reduceExtraParents]) //we are keeping the props cause we need the sort_order positioning prop
reqMethods.set("add my link", ()=>"put")
reqReduc.set("add myself", [myNode=>packing(myNode.clone(3, 0, null, 'id')), reduceExtraParents])
reqLoaders.set("add myself", (myNode, result)=>{
  myNode.props.id=result
})
reqMethods.set("add myself", ()=>"put")
reqReduc.set("add my children", [myNode=>packing(myNode.clone(2, 1, 'id', 'id')), reduceExtraParents]) // we need the partner (and partner->parent for safety check)
reqLoaders.set("add my children", (myNode, result)=>{
  /*
  for (const i in result) {
    myNode.children[i].props.id=result[i]
  }
  */
  result.forEach((res, i)=>myNode.children[i].props.id=res)
})
reqMethods.set("add my children", ()=>"put")
reqReduc.set("add my tree", [myNode=>{
  if (myNode.constructor.nodeConstructor.detectLinker(myNode)) return packing(myNode.clone(2, null, null, 'id'))
  else return packing(myNode.clone(3, null, null, 'id'))
},  reduceExtraParents]) // we need the parent->partner (and parent->partner->parent for safety check)
reqMethods.set("add my tree", ()=>"put")
reqLoaders.set("add my tree", (myNode, result)=>{
  if (!result) return
  const resultNode=unpacking(result)
  if (!myNode.constructor.nodeConstructor.detectLinker(myNode)) {
    myNode.props.id=resultNode.props.id
  }
  myNode.loadDesc(resultNode)
})
reqReduc.set("add my tree table content", reqReduc.get("add my tree"))
reqMethods.set("add my tree table content", ()=>"put")
reqLoaders.set("add my tree table content", reqLoaders.get("add my tree"))
reqReduc.set("edit my sort_order", myNode=>packing(myNode.clone(3, 0, "id", "id"))) // we need the parent->partner (and parent->partner->parent for safety check)
reqMethods.set("edit my sort_order", ()=>"put")
reqReduc.set("edit my props", myNode=>packing(myNode.clone(2, 0, null, "id")))
reqMethods.set("edit my props", ()=>"put")

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

reqReduc.set("default", myNode=>packing(myNode.clone()))
reqLoaders.set("default", (myNode, result)=>myNode.load(result))
reqMethods.set("default", ()=>"post")
reqContentType.set("default", ()=>"application/json")

export function makeRequest(action, params, url) {
  const reqMethodFunc = reqMethods.get(action) || reqMethods.get("default")
  const method = reqMethodFunc(params)
  const contentType = reqContentType.get(action) || reqContentType.get("default")
  const fetchParams = {
    method: method,
    headers: {
      'Content-Type': contentType
    }
  }
  if (method != "get")
    fetchParams.body = JSON.stringify({action: action, parameters: params});
  if (authorizationToken)
    fetchParams.headers={...fetchParams.headers, ...authorizationToken}
  return fetch(url, fetchParams)
  .then(res => {
    if (!res?.ok)
      throw new Error("Error server response")
    return res.text()
  })
  .then(resultTxt => {
    // This is allowing a null result, it doesnt throw errur if resultTxt==null
    let result=null
    if (resultTxt) {
      try {
        result=JSON.parse(resultTxt)
      }
      catch(e){//To send errors from server in case the error catching methods at backend fail
        throw new Error(e.message + "Action: " + action + ". Error: Response error: "+ resultTxt)
      }
    }
    return result
  })
  .then(resultJSON => {
    if (resultJSON?.error==true) {
      throw new Error(action + '. SERVER Message: ' + result.message)
    }
    return resultJSON
  })
}
export function prepareRequest(myNode, action, parameters) {
  let reducFuncs = reqReduc.get(action) || reqReduc.get("default")
  if (!Array.isArray(reducFuncs)) reducFuncs = [reducFuncs] // we can get nodeRedFunc alone or [nodeRedFunc, paramRedFunc], we set it to an array anyway
  const [nodeRedFunc, paramRedFunc] = reducFuncs
  if (parameters && paramRedFunc) paramRedFunc(parameters) // no need to re-asign because we act to the object properties
  return [nodeRedFunc(myNode), parameters]
}
export function request(myNode, action, params, url) {
  const [nodeData, parameters={}] = prepareRequest(myNode, action, params)
  parameters.nodeData = nodeData
  return makeRequest(action, parameters, url)
}
export function loadResult(myNode, result, action, params) {
  const loadFunc = reqLoaders.get(action) || reqLoaders.get("default")
  loadFunc(myNode, result, params)
  return myNode
}
export async function loadRequest(myNode, action, params, url) {
  const result = await request(myNode, action, params, url)
  return loadResult(myNode, result, action, params)
}
export function prepareMultiRequest(action, dataNodes, parameters) {
  //In case we pass single args we multiplicate it for the nodes number
  if (typeof action=='string') {
    action = Array(dataNodes.length).fill(action)
  }
  if (parameters && !Array.isArray(parameters)) {
    parameters = Array(dataNodes.length).fill(parameters)
  }
  if (!parameters) parameters=[]
  const reducedNodes=[], reducedParams=[], params=[]
  // we make reduction and save the result also for reduce only option
  for (const index of Object.keys(dataNodes)) {
    [reducedNodes[index], reducedParams[index]={}] = prepareRequest(dataNodes[index], action[index], parameters[index])
  }
  return [reducedNodes, reducedParams]
}
export function requestMulti(action, dataNodes, parameters, url) {
  const [myNodes, myParams] = prepareMultiRequest(action, dataNodes, parameters)
  myNodes.forEach((myNode, i)=>{
    myParams[i]={...myParams[i], nodeData: myNode}
  })
  if (typeof action == 'string') {
    action = Array(dataNodes.length).fill(action)
  }
  return makeRequest(action, myParams, url)
}