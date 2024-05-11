import http from "http"

const networkInterface = "localhost" // not sending outside ---- production mode / --- development mode

export async function runService(myService, listener, callBack=()=>servicePrompt(myService)){
  if (!myService.props.port)
    myService.props.port = myService.getRoot().getChild().props.portCount++
  myService._server = runServer((request, response)=>listener(request, response, myService._enviroment), myService.props.port, callBack)
  myService._server.once('error', async function(err) {
    if (err.code === 'EADDRINUSE') {
      console.log("Port in use, try another port")
    }
  })
}

export function runServer(app, port, callback){
  return http.createServer(app).listen(port, networkInterface, callback)
}

export function servicePrompt(myService){
  console.log("\n\x1b[35m%s\x1b[0m", `\n💻 Running server ${myService.parent.partner.props.name} on port ${myService.props.port}`)
}