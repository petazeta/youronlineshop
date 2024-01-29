/*
Request manager
===============

Main tasks:
- Collect client request data
- User authentication
- Check authorization
- Perform the requested action
- write the response: responses.mjs

*/
import {Node as ProtoNode, Linker as ProtoLinker} from "../nodes.mjs"
import userMixin from "../../shared/usermixin.mjs"
import {userModelMixin} from "../usermixin.mjs"
import {config} from './cfg.mjs'
import {reporting} from './reportcases.mjs'
import {authenticate} from './authentication.mjs'
import collectRequest from '../collectrequest.mjs'
import {enviroments} from "./serverstart.mjs"
import {makeReport} from "./reports.mjs"
import {Responses} from "../responses.mjs"
import {isAllowedToRead, isAllowedToInsert, isAllowedToModify} from "../safety.mjs"


export async function respond(request, response) {
  //const [hostname, port] = request.headers.host.split(":")
  const enviroment = enviroments.get(request.headers.host)

  const nodesConstructorsMixin = Sup => class extends Sup {
    static get nodeConstructor(){
      return Node
    }
    static get linkerConstructor(){
      return Linker
    }
    static get userConstructor(){
      return User // never needed at the moment
    }
  }
  const nodeSettingsMixin=Sup => class extends Sup {
    static get dbGateway(){
      return enviroment.get("db-gateway")
    }
  }
  const Node = nodeSettingsMixin(nodesConstructorsMixin(ProtoNode))
  const Linker = nodeSettingsMixin(nodesConstructorsMixin(ProtoLinker))
  const User = userModelMixin(userMixin(Node))

  const responses = new Responses(Node, Linker, User, isAllowedToRead, isAllowedToInsert, isAllowedToModify, (data)=>makeReport(data, request), enviroment.get("db-import-path"))
  
  // --- dbmanager custom start
  // Specific dbmanager request
  responses.responseAuth.set("get collections", async ()=>{
    return Node.dbGateway.getTables().map(tableName=>"TABLE_" + tableName.toUpperCase(),)
  })
  // --- dbmanager custom end
  const user = await authenticate(User, request.headers)
  const data = await collectRequest(request, config.get("request-max-size"))
  response.setHeader('Content-Type', responses.getResponseContentType(data.action))
  let resultData
  if (Array.isArray(data.action)) {
    const results = []
    response.write("[")
    for (let i=0; i<data.action.length; i++) {
      results.push(await responses.handleRequest(response, user, data.action[i], data.parameters && data.parameters[i]))
      if (i != 0)
        response.write(",")
    }
    response.end("]")     
    resultData = results
  }
  else {
    resultData = await responses.handleRequest(response, user, data.action, data.parameters)
    response.end()
  }
  reporting(resultData, data.action, request)
}

// -- helpers

function toJSON(myObj){
  return (myObj && JSON.stringify(myObj)) || ""
}