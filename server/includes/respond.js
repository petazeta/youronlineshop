import config from './../cfg/main.js';
import {reporting} from './reporting.js';
import {responseAuth} from './response.js';
import login from './authorization.js';
import {cacheRequest, cacheResponse} from './cachetotal.js';

export function sendResponse(request, response) {
  let body = '';
  request.on('data', data => {
    body += data;
    // Too much POST data, kill the connection!
    // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
    if (body.length > 1e6)
        request.connection.destroy();
  });
  request.on('end', async () => {
    async function makeRequest(user, action, parameters) {
      const reqAuth=responseAuth.get(action);
      if (!reqAuth) throw new Error("no action recognised: " + action);
      const result = await reqAuth(parameters, user);
      return result;
    }
    
    let  user;
    if (config.autoLogin) {
      const {userAutoLogin} = await import('./user.js');
      user = await userAutoLogin(config.autoLogin);
    }
    else user = await login(request.headers);

    const data=JSON.parse(body);

    if (!data.action) return response.end();
    response.writeHead(200, {'Content-Type': 'application/json'});
    let makeRequestFunc;
    if (Array.isArray(data.action)) {
      const queries=[];
      for (let i=0; i<data.action.length; i++) {
        let makeRequestParams;
        if (data.parameters) makeRequestParams=[user, data.action[i], data.parameters[i]];
        else makeRequestParams=[user, data.action[i]];
        queries.push(()=>makeRequest(...makeRequestParams));
      }
      makeRequestFunc=async ()=>{
        const myResults=[];
        for (const query of queries) {
          myResults.push(await query());
        }
        return myResults;
      };
      //makeRequestFunc=()=>Promise.all(queries); //this can produce problems for its asyncronicity
    }
    else {
      // check cache before requesting
      makeRequestFunc=async ()=>{
        const cacheResult = cacheRequest(user, data.action, data.parameters);
        return cacheResult!==false ? cacheResult : makeRequest(user, data.action, data.parameters);
      }
    }
    makeRequestFunc()
    .then(res=>{
      response.write(JSON.stringify(res));
      if (!Array.isArray(data.action)) {
        cacheResponse(res, user, data.action, data.parameters);
        reporting(res, data.action);
      }
    })
    .catch(res=>{
      let message="undefined error";
      if (typeof res=="string") message=res;
      else if (typeof res=="object" && res.message) message=res.message;
      console.log(res);
      response.write(JSON.stringify({error: true, message: message}));
      reporting(message, "error");
    })
    .finally(()=>response.end());
  });
}