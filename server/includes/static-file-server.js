/*
  It serves static files
  The following files are allowed for retrieving:
  - / , ?values, index.html => site/index.html
  - ./images/ => site/images
  - ./client/ ./shared/ ./catalog-images/ <==>
  -  default.js => default.js (change some file content)
*/
import url from 'url'; 
import path from 'path';
import fs from 'fs';
import getMimeType from './mimetypes.js';
import {makeReport} from './reports.js';
import customConfig from './../cfg/main.js';
import config from './../cfg/default.js';
import {getSiteName} from './site-path.js';

export function fileServer(request, response) {
  let filename=url.parse(request.url, true).pathname;
  if (!config.isSiteUnique && !getSiteName()) throw new Error('No site');
  if (!config.isSiteUnique && customConfig.siteMethod=='slash') filename=filename.replace(getSiteName(), '').replace('//', '/');
  
  filename=filename.replace(/^\/+/, ''); // removing / // at the begining Deprecated

  if (filename=='') filename= 'index.html';
  if (filename.match(/^index\.html/) || filename.match(/^images\//)) {
    filename=path.join(customConfig.basePath, 'site', customConfig.siteFolderName,  filename);
    fs.stat(filename, function(err, stat) {
      if (err) {
        console.log(err);
        response.writeHead(404);
        makeReport("file not found: " + filename);
        return response.end();
      }
      response.writeHead(200, {
        'Content-Type': getMimeType(filename),
        'Content-Length': stat.size
      });
      
      const readStream = fs.createReadStream(filename);
      readStream.pipe(response);

      readStream.on('error', function (err) {
        console.log(err);
        return response.end();
      });
    });
  }
  else if (filename.match(/^(client|shared|catalog-images)\//)) {
    // shared, client, catalog-images and site
    filename= path.join(customConfig.basePath, filename);
    if (!filename.includes("default.js")) {
      fs.stat(filename, function(err, stat) {
        if (err) {
          console.log(err);
          response.writeHead(404);
          makeReport("file not found: " + filename);
          return response.end();
        }
        response.writeHead(200, {
          'Content-Type': getMimeType(filename),
          'Content-Length': stat.size
        });
        
        const readStream = fs.createReadStream(filename);
        readStream.pipe(response);

        readStream.on('error', function (err) {
          console.log(err);
          return response.end();
        });
      });
    }
    else {
      // replacing some client config
      fs.readFile(filename, function(err, data) {
        if (err) {
          response.writeHead(404);
          makeReport("file not found: " + filename);
          return response.end();
        }
        response.writeHead(200, {'Content-Type': getMimeType(filename)});
        const defaultCfg=data.toString();
        const newDefaultCfg=defaultCfg.replace(/catalog-images/g, path.join('catalog-images/', customConfig.catalogImagesFolderName));
        return response.end(newDefaultCfg);
      });
    }
  }
  else {
    response.writeHead(404);
    makeReport("trying to access forbiden content: " + filename);
    return response.end(); //avoid server files
  }
}