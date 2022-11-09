import path from 'path';
import config from './cfg/mainserver.mjs';
import makeReport from './reporting.mjs';
import initServer from './serverstart.mjs';

await initServer();

makeReport("Server start");

const routerMap=new Set();

export default function (request, response) {
  /*
  const pathName=new URL(request.url, 'http://localhost').pathname;
  if (config.urlBasePath) {
    // removing forward slashes beginning and end
    let basePath=config.urlBasePath;
    if (basePath[0]=='/') basePath=basePath.substr(1);
    if (basePath[basePath.length-1]=='/') basePath=basePath.substr(0, basePath.length-1);
    // correcting the no bar url
    if (pathName.match(new RegExp('^\/' + basePath + '$'))) {
      return response.writeHead(301, {
        Location: `${basePath}/`
      }).end();
    }
    // removing the basePath of the pathName
    if (pathName.match(new RegExp('^\/' + basePath + '\/'))) {
      pathName = pathName.replace(pathName.match(new RegExp('^\/' + basePath + '\/'))[0], '/');
    }
  }
  */
  Array.from(routerMap).some(myFunc=>myFunc(request, response));
}

// Request
routerMap.add((request, response)=>{
  const pathName=new URL(request.url, 'http://localhost').pathname;
  if (!pathName.match(new RegExp('^/' + config.requestUrlPath))) return false;
  import('./respond.mjs').then(({default: sendResponse}) => sendResponse(request, response));
  return true;
});
// css image
routerMap.add((request, response)=>{
  const pathName=new URL(request.url, 'http://localhost').pathname;
  if (!pathName.match(new RegExp('^/' + config.cssImagesUrlPath + '/'))) return false;
  import('./cssimageserver.mjs').then(({default: sendResponse}) => sendResponse(request, response));
  return true;
});
// upload
routerMap.add((request, response)=>{
  const pathName=new URL(request.url, 'http://localhost').pathname;
  if (!pathName.match(new RegExp('^/' + config.uploadImagesUrlPath))) return false;
  import('./uploadimages.mjs').then(({default: upload})=>upload(request, response));
  return true;
});
// static
routerMap.add((request, response)=>{
  import('./fileserver.mjs').then(({default: fileServer})=>fileServer(request, response));
  return true;
});