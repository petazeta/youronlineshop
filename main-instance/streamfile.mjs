import fs from 'fs';
import getMimeType from '../server/mimetypes.mjs';
import makeReport from './reportsserver.mjs';

export default function streamFile(pathName, response) {
  return fs.stat(pathName, function(err, stat) {
    if (err) {
      response.writeHead(404);
      makeReport("file not found: " + pathName);
      return response.end();
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
      makeReport("file read error: " + pathName);
      response.end();
      readStream.destroy();
    });
  });
}