/*  Entry point of the application
    Calls server initialization and acts as services gateway
*/
import {config} from './cfg/main.mjs';
import makeReport from './reports.mjs';
import initServer from './serverstart.mjs';

await initServer();

makeReport("Server start");

const routerMap=new Set();

export default function (request, response) {
  Array.from(routerMap).some(myFunc=>myFunc(request, response));
}
// Deliver client source files static content. It is first because it is more often
routerMap.add((request, response)=>{
  const pathName=new URL(request.url, 'http://localhost').pathname;
  if (pathName.match(new RegExp(".cmd$"))) return false;
  import('./clientsource.mjs')
  .then(({default: fileServer})=>fileServer(request, response))
  .catch(err=>{
    makeReport(err);
  });
  return true;
});
/*
// EXPERIMENTAL: para hacer streaming del resultado de la bd
routerMap.add((request, response)=>{
  const pathName=new URL(request.url, 'http://localhost').pathname;
  if (!pathName.match(new RegExp('^/' + 'stream-cache-from-database'))) return false;
  import('./streamfromdatabase_experimental.mjs')
  .then(({default: sendResponse}) => sendResponse(request, response))
  .catch(err=>{
    makeReport(err);
  });
  return true;
});
*/
// Bd Request
routerMap.add((request, response)=>{
  const pathName=new URL(request.url, 'http://localhost').pathname;
  if (!pathName.match(new RegExp('^/' + config.requestUrlPath))) return false;
  import('./respond.mjs')
  .then(({default: sendResponse}) => sendResponse(request, response))
  .catch(err=>{
    makeReport(err);
  });
  return true;
});
// layouts
routerMap.add((request, response)=>{
  const pathName=new URL(request.url, 'http://localhost').pathname;
  if (!pathName.match(new RegExp('^' + new URL(config.layoutsUrlPath, 'http://localhost').pathname))) return false; // config comes with default searchParams
  import('./layouts.mjs')
  .then(({respond})=>respond(request, response))
  .catch(err=>{
    makeReport(err);
  });
  return true;
});
// upload
routerMap.add((request, response)=>{
  const pathName=new URL(request.url, 'http://localhost').pathname;
  if (!pathName.match(new RegExp('^/' + config.uploadImagesUrlPath))) return false;
  import('./uploadimages.mjs')
  .then(({default: upload})=>upload(request, response))
  .catch(err=>{
    makeReport(err);
  });
  return true;
});
/*
// quizas convendria crear una funcion para distinguir si el error viene del codigo, y quizas en ese caso salir del catch
// tambien se podria crear un Error propio, llamarlo ThrowError: if (!err instanceof ThrowError) throw err;
  .catch(err=>{
    makeReport(err);
    if (err instanceof SyntaxError || err instanceof ReferenceError || err instanceof TypeError) throw err;
  });
*/