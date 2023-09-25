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

import {config} from './cfg/main.mjs';
import reporting from './reportcases.mjs';
import makeRequest, {getResponseContentType} from './responses.mjs';
import authentication from './authentication.mjs';
import {cacheRequest, cacheResponse} from './reqcache.mjs';
import collectRequest from '../../collectrequest.mjs';

export default function sendResponse(request, response) {
  let data, user;

  async function mainRequest(request) {
    user= await authentication(request.headers);
    data = await collectRequest(request, config.requestMaxSize);
    if (Array.isArray(data.action)) {
      const queries=data.action.map((myAction, i)=>{
        if (data.parameters) return ()=>makeRequest(user, data.action[i], data.parameters[i]);
        else return ()=>makeRequest(user, data.action[i]);
      });
      //Promise.all(queries); //this can produce problems for its asyncronicity
      const myResults=[];
      for (const query of queries) {
        myResults.push(await query());
      }
      return myResults;
    }
    else {
      // check cache before requesting
      const cacheResult = await cacheRequest(data.action, data.parameters);
      if (cacheResult!==false) {
        console.log(`${data.action} comes from cache`);
        return cacheResult;
      }
      return makeRequest(user, data.action, data.parameters);
    }
  }
  
  function mainResponse(resultData, response) {
    if (!resultData) return; // null returned, no need to write
    response.setHeader('Content-Type', getResponseContentType(data.action))
    response.write(JSON.stringify(resultData))
    if (!Array.isArray(data.action)) {
      cacheResponse(data.action, data.parameters, resultData)
      reporting(resultData, data.action, request.headers)
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
  else if (err?.message) message=err.message;
  response.statusCode=500;
  if (err.name && !isNaN(err.name)) response.statusCode=parseInt(err.name);
  response.setHeader('Content-Type', 'application/json');
  response.write(JSON.stringify({error: true, message: message}));
  reporting(message, "error");
}