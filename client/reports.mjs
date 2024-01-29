//import {makeRequest} from './request.mjs'
//import {observerMixin} from './observermixin.mjs'

export default class Reporter{
  constructor(){
    this.uniqueId = new Date().getTime().toString(32).substring(3)
  }
  makeReport(msg, url) {
    const reqUrl = new URL(window.location.protocol + "//" + window.location.host + '/' + url)
    reqUrl.searchParams.append("message", `${this.uniqueId} : ${msg}`)
    return makeRequest(reqUrl)
  }
}

// Helper
function makeRequest(reportsUrlPath) {
  return fetch(reportsUrlPath)
  .then(res => {
    if (!res?.ok)
      throw new Error("Error server: report")
    return res.text()
  })
}