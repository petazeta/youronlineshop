import {makeReport} from './reports.js';
import {unpacking} from './../../shared/modules/utils.js';

let host, referer;

// I am not sure about concurrency so if a new request come... it will overwrite this info??
export function setHeadersInfo(headers) {
  host = headers.host;
  referer= headers.referer;
}

const requestsRep=new Map();

requestsRep.set('get tables', (result)=>makeReport({host: host, referer: referer, get_tables: "get tables: " + result.length}));

requestsRep.set('init database', (result)=>console.log(result));

requestsRep.set('logout', (result)=>makeReport("log out"));

requestsRep.set('login', (result)=>{
  let answer;
  if (typeof result == "string") answer=result;
  else answer=unpacking(result).props.username;
  return makeReport("log in: " + answer)
});

requestsRep.set('update user pwd', (result)=>console.log(result));

requestsRep.set('update my user pwd', (result)=>console.log(result));

requestsRep.set('create user', (result)=>console.log(result));

requestsRep.set('send mail', (result)=>console.log(result));

requestsRep.set('edit my props', (result)=>console.log(result));

requestsRep.set('edit my sort_order', (result)=>console.log(result));

requestsRep.set('error', (result)=>console.log(result));



export function reporting(result, action){
  if (typeof requestsRep.get(action)=="function") { 
    requestsRep.get(action)(result);
  } 
};