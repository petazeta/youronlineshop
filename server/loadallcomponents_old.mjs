import {createTheme} from './themes.mjs';
import fs from 'fs';
import config from './cfg/mainserver.mjs';
import path from 'path';

function getContent(themeId, subThemeId) {
  const myTheme=createTheme(path.join(config.themesPath, themeId));
  if (subThemeId) myTheme.setActive(subThemeId);
  const fileList=myTheme.getTpFilesList();
  let tpContent='';
  for (const key in fileList) {
    let template=fs.readFileSync(fileList[key], {encoding: "utf8"});
    tpContent += "<template id='tp" + key + "'>\n" + template + "\n</template>\n";
  }
  //header('Access-Control-Allow-Origin: *'); //To allow use of external
  return tpContent;
}
// Falta manejo de errores como en respond.mjs
export async function sendContent(request, response) {
  const buffers = [];
  let totalLength=0;
  for await (const chunk of request) {
    buffers.push(chunk);
    totalLength += chunk.length;
    if (totalLength > config.requestMaxSize) {
      request.connection.destroy();
      const myError = new Error('Max request length exceeded');
      myError.name="400";
      throw myError;
    }
  }
  const body = Buffer.concat(buffers).toString();
  const data = JSON.parse(body);
  
  const content=getContent(data.theme_id, data.subtheme_id);
  response.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': Buffer.byteLength(content)});
  response.end(content);
}

