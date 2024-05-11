import {makeRequest as superMakeRequest, request as superRequest, requestMulti as superRequestMulti, loadRequest as superLoadRequest} from "../request.mjs"
import {config} from './cfg.mjs'
import {Requests} from "../requests.mjs"

const requests = new Requests()

const prepareRequest=(...args)=>requests.prepareRequest(...args)
const prepareMultiRequest=(...args)=>requests.prepareMultiRequest(...args)
const loadResult=(...args)=>requests.loadResult(...args)

export async function makeRequest(action, params, url=config.get("request-url-path")) {
  return await superMakeRequest(prepareRequest, requests.reqMethods, requests.reqContentType, action, params, url)
}
export async function request(myNode, action, params, url=config.get("request-url-path")) {
  return await superRequest(prepareRequest, requests.reqMethods, requests.reqContentType, myNode, action, params, url)
}
export async function requestMulti(action, dataNodes, params, url=config.get("request-url-path")) {
  return await superRequestMulti(prepareMultiRequest, requests.reqMethods, requests.reqContentType, action, dataNodes, params, url)
}
export async function loadRequest(myNode, action, params, url=config.get("request-url-path")) {
  return await superLoadRequest(loadResult, prepareRequest, requests.reqMethods, requests.reqContentType, myNode, action, params, url)
}