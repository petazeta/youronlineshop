import http from "http"
import {servers} from "./server/serverinstances.mjs"
import {join as pathJoin} from "path"

let openBrowserinstances = false

for (const [pathName, {ports}] of servers) {
  let {app} = await import("./" + pathJoin("./server", pathName))
  for (const port of ports) {
    let myServer = http.createServer(app)
    myServer.listen(port, ()=>{
      console.log("\n\x1b[35m%s\x1b[0m", pathName + `:\n💻 Running development server on http://localhost:${port} (^C to quit)`)
      if (openBrowserinstances){
        console.log("\n✨ You can now preview \x1b[1m%s\x1b[0m", "Your Online Shop", "in your web browser.")
        import("./utils/openbrowser.mjs")
        .then(({default: openBrowser})=>openBrowser("http://localhost:" + port))
      }
    })
  }
}