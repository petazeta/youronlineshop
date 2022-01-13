import url from 'url'; 
import {setHeadersInfo as setReportInitData} from './includes/reporting.js';
import {setSiteFromRequest} from './includes/site-path.js';
import config from './cfg/default.js';
import configList from './cfg/config.js';
import {setSiteConfig} from './cfg/main.js';
import {setDbSiteConfig} from './cfg/dbmain.js';
import {makeReport} from './includes/reports.js'

const routerMap=new Map();

export default function (request, response) {
  const myPath=url.parse(request.url, true).pathname;
  // trailing slash forced in multisite mode for sites with slash method
  if (!config.isSiteUnique
  && myPath.match(/^\/[^\/]+$/)
  && Array.from(configList.keys()).some(key=>configList.get(key).siteMethod=='slash' && myPath=='/' + key)) {
    console.log("redirect", myPath)
    return response.writeHead(301, {
      Location: `http://${request.headers.host}${myPath}/`
    }).end();
  }
  setReportInitData(request.headers);
  let siteName;
  if (!config.isSiteUnique && !(siteName=setSiteFromRequest(request))) {
    // Error site not found!!
    makeReport("site required but not found");
    return response.writeHead(404).end("site required but not found");
  }
  setSiteConfig(siteName);
  setDbSiteConfig(siteName);
  
  Array.from(routerMap.values()).some(myFunc=>myFunc(request, response));
}

routerMap.set('request', (request, response)=>{
  let filePath = url.parse(request.url, true).pathname;
  if (!filePath.includes("request.cmd")) return false;
  return import('./includes/respond.js')
    .then(({sendResponse}) => sendResponse(request, response));
});

routerMap.set('loadallcomponents', (request, response)=>{
  let filePath = url.parse(request.url, true).pathname;
  if (!filePath.includes("loadallcomponents.cmd")) return false;
  return import('./includes/loadallcomponents.js')
    .then(({sendContent}) => sendContent(request, response));
});

routerMap.set('upload', (request, response)=>{
  let filePath = url.parse(request.url, true).pathname;
  if (!filePath.includes("upload.cmd")) return false;
  return import('./includes/upload.js')
    .then(({upload}) => upload(request, response));
});

routerMap.set('static', (request, response)=>{
  return import('./includes/static-file-server.js')
  .then(({fileServer}) => fileServer(request, response));
});