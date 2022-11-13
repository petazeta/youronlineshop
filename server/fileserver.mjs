/*
  It serves static files
  The following files are allowed for retrieving:
  - / , ?values, index.html => site/index.html
  - ./images/ => site/images
  - ./client/ ./shared/ ./catalog-images/ <==>
*/
import path from 'path';
import makeReport from './reports.mjs';
import config from './cfg/mainserver.mjs';
import respond from './streamfile.mjs';

export default function fileServer(request, response) {
  let pathName=new URL(request.url, 'http://localhost').pathname;
  if (pathName=='/') pathName= '/index.html';
  if (pathName.match(/^\/index\.html/)) {
    pathName=path.join(config.sitePath,  pathName);
    respond(pathName, response);
  }
  else if (pathName.match(/^\/images\//)) {
    pathName=path.join(config.sitePath,  pathName);
    respond(pathName, response);
  }
  else if (pathName.match(/^\/(client|shared)\//)) {
    // sin nada seria: pathName=path.join('./',  pathName);
    const match=pathName.match(/^\/(client|shared)\//)[1];
    pathName=pathName.replace(match, '/');
    if (match=='client') pathName = path.join(config.clientPath, pathName);
    if (match=='shared') pathName = path.join(config.sharedPath, pathName);
    respond(pathName, response);
  }
  else if (pathName.match(new RegExp('^/' + config.catalogImagesUrlPath + '/'))) {
    pathName=pathName.replace(`/${config.catalogImagesUrlPath}/`, '/');
    pathName=path.join(config.catalogImagesPath,  pathName);
    respond(pathName, response);
  }
  else {
    response.writeHead(404);
    makeReport("trying to access forbiden content: " + pathName);
    return response.end(); //avoid server files
  }
}