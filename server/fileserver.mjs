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

export default function fileServer(pathName, request, response) {
  if (pathName===undefined) pathName=new URL(request.url, 'http://localhost').pathname;
  if (pathName=='/') pathName= '/index.html';
  if (pathName.match(/^\/index\.html/)) {
    pathName=path.join(config.basePath, config.sitePath,  pathName);
    respond(pathName, response);
  }
  else if (pathName.match(/^\/images\//)) {
    pathName=path.join(config.basePath, config.sitePath,  pathName);
    respond(pathName, response);
  }
  else if (pathName.match(/^\/(client|shared)\//)) {
    pathName= path.join(config.basePath, pathName);
    respond(pathName, response);
  }
  else if (pathName.match(new RegExp('^/' + config.catalogImagesUrlPath + '/'))) {
    const fileName=path.basename(pathName);
    if (pathName.includes(config.catalogImagesUrlBigPath)) pathName=path.join(config.basePath, config.catalogImagesPath, config.catalogImagesBigPath, fileName);
    else pathName=path.join(config.basePath, config.catalogImagesPath, config.catalogImagesSmallPath, fileName);
    respond(pathName, response);
  }
  else {
    response.writeHead(404);
    makeReport("trying to access forbiden content: " + pathName);
    return response.end(); //avoid server files
  }
}