import * as path from 'path';
import config from './cfg/mainserver.mjs';
import makeReport from './reportsserver.mjs';
import initServer from './serverstart.mjs';

await initServer();

makeReport("Server start");

const routerMap=new Set();

export default function (request, response) {
  Array.from(routerMap).some(myFunc=>myFunc(request, response));
}
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
// Request
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
// css image
routerMap.add((request, response)=>{
  const pathName=new URL(request.url, 'http://localhost').pathname;
  if (!pathName.match(new RegExp('^/css-images/'))) return false;
  import('./cssimageserver.mjs')
  .then(({default: sendResponse}) => sendResponse(request, response))
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
// static
routerMap.add((request, response)=>{
  import('./fileserver.mjs')
  .then(({default: fileServer})=>fileServer(request, response))
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