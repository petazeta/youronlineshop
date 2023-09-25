import {makeRequest as superMakeRequest, request as superRequest, requestMulti as superRequestMulti, loadRequest as superLoadRequest} from "../request.mjs"
import configValues from './cfg/main.mjs'

export async function makeRequest(action, params, url=configValues.requestUrlPath) {
  return await superMakeRequest(action, params, url)
}
export async function request(myNode, action, params, url=configValues.requestUrlPath) {
  return await superRequest(myNode, action, params, url)
}
export async function requestMulti(action, dataNodes, params, url=configValues.requestUrlPath) {
  return await superRequestMulti(action, dataNodes, params, url)
}
export async function loadRequest(myNode, action, params, url=configValues.requestUrlPath) {
  return await superLoadRequest(myNode, action, params, url)
}