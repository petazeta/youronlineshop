import fs from 'fs';
import getMimeType from '../server/mimetypes.mjs';
// import makeReport from './reportsserver.mjs';

export default function streamFile(pathName, response) {
  return fs.promises.stat(pathName)
  .then(stat=>{
    response.writeHead(200, {
      'Content-Type': getMimeType(pathName),
      'Content-Length': stat.size
    });
    const readStream = fs.createReadStream(pathName);

    readStream.on('open', () => {
      readStream.pipe(response);
    });

    readStream.on('error', function (err) {
      response.end();
      readStream.destroy();
      // makeReport("file read error: " + pathName);
      throw new Error("file read error: " + pathName);
    });
  })
  .catch(err=>{
    response.writeHead(404);
    response.end();
    // makeReport("file not found: " + pathName);
    //throw new Error("file not found: " + pathName);
    throw err;
  });
/*
  return fs.stat(pathName, function(err, stat) {
    if (err) {
      response.writeHead(404);
      response.end();
      // makeReport("file not found: " + pathName);
      throw new Error("file not found: " + pathName);
      return;
    }
    response.writeHead(200, {
      'Content-Type': getMimeType(pathName),
      'Content-Length': stat.size
    });
    
    const readStream = fs.createReadStream(pathName);

    readStream.on('open', () => {
      readStream.pipe(response);
    });

    readStream.on('error', function (err) {
      response.end();
      readStream.destroy();
      // makeReport("file read error: " + pathName);
      throw new Error("file read error: " + pathName);
    });
  });
  */
}