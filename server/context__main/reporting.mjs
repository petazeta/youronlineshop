import {makeReport} from "./reports.mjs"

export async function reporting(request, response){
  const searchParams = new URL(request.url, "http://localhost").searchParams
  response.setHeader("Content-Type", "text/plain") // we may write header explicity instead: writeHeader
  if (searchParams.get("message")) {
  	makeReport(searchParams.get("message"), request)
  }
  response.end("ok")
}
