import {authorizationToken} from "./webuser/authorization.mjs"

export function makeRequest(prepareRequest, reqMethods, reqContentType, action, params, url) {
  const parameters = prepareRequest(action, params)
  const reqMethodFunc = reqMethods.get(action) || reqMethods.get("default")
  const method = reqMethodFunc(params)
  const contentType = reqContentType.get(action) || reqContentType.get("default")
  const body = {action: action, parameters: parameters}
  return doRequest(method, contentType, body, url)
}

export function request(prepareRequest, reqMethods, reqContentType, myNode, action, params={}, url) {
  return makeRequest(prepareRequest, reqMethods, reqContentType, action, {nodeData: myNode, ...params}, url)
}
export async function loadRequest(loadResult, prepareRequest, reqMethods, reqContentType, myNode, action, params, url) {
  const result = await request(prepareRequest, reqMethods, reqContentType, myNode, action, params, url)
  return loadResult(myNode, result, action, params)
}

export function requestMulti(prepareMultiRequest, reqMethods, reqContentType, action, dataNodes, parameters, url) {
  const myParams = prepareMultiRequest(action, dataNodes, parameters)
  if (typeof action == 'string') {
    action = Array(dataNodes.length).fill(action)
  }
  const method = reqMethods.get("default")(parameters)
  const contentType = reqContentType.get("default")
  const body = {action: action, parameters: myParams}
  return doRequest(method, contentType, body, url)
}

// helpers

function doRequest(method, contentType, body, url) {
  const fetchParams = {
    method: method,
    headers: {
      'Content-Type': contentType
    }
  }
  if (method != "get")
    fetchParams.body = JSON.stringify(body)
  if (authorizationToken)
    fetchParams.headers={...fetchParams.headers, ...authorizationToken}
  return fetch(url, fetchParams)
  .then(res => {
    if (!res?.ok)
      throw new Error("Error server response", {cause: "server response"})
    return res.text()
  })
  .then(resultTxt => {
    // This is allowing a null result, it doesnt throw error if !resultTxt
    let result = null
    if (resultTxt) {
      try {
        result = JSON.parse(resultTxt)
      }
      catch(e){//To send errors from server in case the error catching methods at backend fail
        throw new Error(`${e.message}. Action: ${action}. Error: Response error: ${resultTxt}`)
      }
    }
    return result
  })
  .then(resultJSON => {
    if (resultJSON?.error==true) {
      throw new Error(action + '. SERVER Message: ' + result.message, {cause: "api response"})
    }
    return resultJSON
  })
}