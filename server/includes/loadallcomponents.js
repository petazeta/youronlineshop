import {getTpFilesList} from './themesback.js';
import fs from 'fs';

function getContent(themeId) {
  const fileList=getTpFilesList(themeId);
  let tpContent='';
  for (const key in fileList) {
    let template=fs.readFileSync(fileList[key], {encoding: "utf8"});
    tpContent += "<template id='tp" + key + "'>\n" + template + "\n</template>\n";
  }
  //header('Access-Control-Allow-Origin: *'); //To allow use of external
  return tpContent;
}

export function sendContent(request, response) {
  let body = '';
  request.on('data', data => {
    body += data;
    // Too much POST data, kill the connection!
    // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
    if (body.length > 1e6)
        request.connection.destroy();
  });
  request.on('end', () => {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    const data=JSON.parse(body);
    const content=getContent(data.theme_id);
    response.write(content);
    response.end();
  });
}

