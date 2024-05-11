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
import {setConstructors} from "../dbutils.mjs"
import {config} from './cfg.mjs'
import {reporting} from './reportcases.mjs'
import {authenticate} from './authentication.mjs'
import collectRequest from '../collectrequest.mjs'
import {makeReport} from "./reports.mjs"
import {Responses} from "../responses.mjs"


export async function respond(request, response, enviroment) {
  //const [hostname, port] = request.headers.host.split(":")
  const [Node, Linker, User] = setConstructors(enviroment.get("db-gateway"))

  const responses = new Responses(Node, Linker, User, (data)=>makeReport(data, request), enviroment.get("db-import-path"))
  
  const user = await authenticate(User, request.headers)
  const data = await collectRequest(request, config.get("request-max-size"))
  response.setHeader('Content-Type', responses.getResponseContentType(data.action))
  let resultData
  if (Array.isArray(data.action)) {
    const results = []
    response.write("[")
    for (let i=0; i<data.action.length; i++) {
      if (i != 0)
        response.write(",")
      results.push(await responses.handleRequest(response, user, data.action[i], data.parameters && data.parameters[i]))
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