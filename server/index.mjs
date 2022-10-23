import path from 'path';
import config from './cfg/mainserver.mjs';
import makeReport from './reporting.mjs';
import initServer from './serverstart.mjs';

await initServer();

makeReport("Server start");

const routerMap=new Set();

export default function (request, response) {
  Array.from(routerMap).some(myFunc=>myFunc(request, response));
}

// Request
routerMap.add((request, response)=>{
  if (new URL(request.url, 'http://localhost').pathname != config.requestUrlPath) return false;
  import('./respond.mjs').then(({default: sendResponse}) => sendResponse(request, response));
  return true;
});
// css image
routerMap.add((request, response)=>{
  if (!new URL(request.url, 'http://localhost').pathname.match(new RegExp('^/' + config.cssImagesUrlPath + '/'))) return false;
  import('./cssimageserver.mjs').then(({default: sendResponse}) => sendResponse(request, response));
  return true;
});
// upload
routerMap.add((request, response)=>{
  if (new URL(request.url, 'http://localhost').pathname != config.uploadImagesUrlPath) return false;
  import('./uploadimages.mjs').then(({default: upload})=>upload(request, response));
  return true;
});
// static
routerMap.add((request, response)=>{
  import('./fileserver.mjs').then(({default: fileServer})=>fileServer(request, response));
  return true;
});