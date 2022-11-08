import path from 'path';
import config from './cfg/mainserver.mjs';
import makeReport from './reporting.mjs';
import initServer from './serverstart.mjs';

await initServer();

makeReport("Server start");

const routerMap=new Set();

export default function (request, response) {
  let pathName=new URL(request.url, 'http://localhost').pathname;
  if (config.requestBasePath && pathName.match(new RegExp('^\/?' + config.requestBasePath))) {
    let basePath=config.requestBasePath;
    if (basePath[0]=='/') basePath=basePath.substr(1);
    if (basePath[basePath.length-1]=='/') basePath=basePath.substr(0, basePath.length-1);
    pathName = pathName.replace(pathName.match(new RegExp('^\/' + basePath + '\/?'))[0], '/');
  }
  Array.from(routerMap).some(myFunc=>myFunc(pathName, request, response));
}

// Request
routerMap.add((pathName, request, response)=>{
  if (!pathName.match(new RegExp('^/' + config.requestUrlPath))) return false;
  import('./respond.mjs').then(({default: sendResponse}) => sendResponse(request, response));
  return true;
});
// css image
routerMap.add((pathName, request, response)=>{
  if (!pathName.match(new RegExp('^/' + config.cssImagesUrlPath + '/'))) return false;
  import('./cssimageserver.mjs').then(({default: sendResponse}) => sendResponse(request, response));
  return true;
});
// upload
routerMap.add((pathName, request, response)=>{
  if (!pathName.match(new RegExp('^/' + config.uploadImagesUrlPath))) return false;
  import('./uploadimages.mjs').then(({default: upload})=>upload(request, response));
  return true;
});
// static
routerMap.add((pathName, request, response)=>{
  import('./fileserver.mjs').then(({default: fileServer})=>fileServer(pathName, request, response));
  return true;
});