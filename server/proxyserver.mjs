import {Proxy} from './proxy.mjs'
import http from "http" // production

// --- production mode
export function proxyServer(contexts, serverPort) {
  http.createServer((request, response)=>reverseProxy(contexts, request, response)).listen(serverPort, ()=>servicePrompt("Reverse Proxy", serverPort))
}

function reverseProxy(contexts, request, response) {
  for (const context of contexts.getRelationship("contexts").children) {
    for (const myService of context.getRelationship("services").children.filter(myService=>myService.props.proxy)) {
      if (checkService(myService, request)) {
        if (!myService._proxy)
          myService._proxy = new Proxy(myService.props.port, "localhost")
        myService._proxy?.pipe(request, response)
        break
      }
    }
  }
  /* experimental
  const myService = contexts.getRelationship("contexts").children
  .find(context=>context.findcheckService(myService, request))

  .reduce((acc, contexts)=>[...acc, ...contexts.getRelationship("services").children], [])
  .find(myService=>checkService(myService, request))
  myService?._proxy?.pipe(request, response)
  */
}

function checkService(myService, request){
  if (getSubdomain(myService.props["host-name"])!=getSubdomain(request.headers.host))
    return false
  return true

  function baseHost(host){
    return host.slice(0, host.indexOf(":")) //*** revisar
  }
  function getSubdomain(host) {
    return host.slice(0, baseHost(host).indexOf(".")) //*** revisar
  }
}

function servicePrompt(myService, port){
  console.log("\n\x1b[35m%s\x1b[0m", `\n💻 Running server ${myService} on port ${port}`)
}
