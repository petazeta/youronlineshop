/*
  It serves static files
  The following files are allowed for retrieving:
  - / , ?values, index.html => site/index.html
  - ./images/ => site/images
  - ./client/ ./shared/ ./catalog-images/ <==>
*/
import makeReport from './reports.mjs';
import respond from '../../streamfile.mjs';
import {getCssImagePathFromUrlPath} from './themesserver.mjs';

export default function fileServer(request, response) {
  const pathName=getCssImagePathFromUrlPath(new URL(request.url, 'http://localhost').pathname);
  if (pathName) {
    respond(pathName, response);
  }
  else {
    response.writeHead(404);
    makeReport("trying to access forbiden content: " + pathName);
    response.end(); //avoid server files
  }
}