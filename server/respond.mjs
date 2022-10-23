/*
Request manager
===============

Main tasks:
- Collect client request data
- User authentication
- Check authorization
- Perform the requested action
- write the response (deliver it to the client) 

*/

import config from './cfg/mainserver.mjs';
import reporting from './reports.mjs';
import makeRequest, {getResponseContentType} from './responses.mjs';
import authentication from './authentication.mjs';
import {cacheRequest, cacheResponse} from './cache.mjs';
import collectRequest from './collectrequest.mjs';

export default function sendResponse(request, response) {
  let data, user;

  async function mainRequest(request) {
    user= await authentication(request.headers);
    data = await collectRequest(request);
    if (Array.isArray(data.action)) {
      const queries=[];
      for (let i=0; i<data.action.length; i++) {
        let makeRequestParams;
        if (data.parameters) makeRequestParams=[user, data.action[i], data.parameters[i]];
        else makeRequestParams=[user, data.action[i]];
        queries.push(()=>makeRequest(...makeRequestParams));
      }
      const myResults=[];
      for (const query of queries) {
        myResults.push(await query());
      }
      return myResults;
      //Promise.all(queries); //this can produce problems for its asyncronicity
    }
    else {
      // check cache before requesting
      const cacheResult = cacheRequest(user, data.action, data.parameters);
      return cacheResult!==false ? cacheResult : makeRequest(user, data.action, data.parameters);
    }
  }
  
  function mainResponse(resultData, response) {
    if (!resultData) return; // null returned, no need to write
    response.setHeader('Content-Type', getResponseContentType(data.action));
    response.write(JSON.stringify(resultData));
    if (!Array.isArray(data.action)) {
      cacheResponse(resultData, user, data.action, data.parameters);
      reporting(resultData, data.action, request.headers);
    }
  }

  return mainRequest(request)
  .then(resultData=>{
    mainResponse(resultData, response);
  })
  .catch(err=>{
    errorResponse(err, response);
  })
  .finally(()=>response.end());
}

export function errorResponse(err, response) {
  console.log(err);
  let message="undefined error";
  if (typeof err=="string") message=err;
  else if (typeof err=="object" && err.message) message=err.message;
  response.statusCode=500;
  if (err.name && !isNaN(err.name)) response.statusCode=parseInt(err.name);
  response.setHeader('Content-Type', 'application/json');
  response.write(JSON.stringify({error: true, message: message}));
  reporting(message, "error");
}