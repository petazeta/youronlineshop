import {getTpFilesList} from './themesback.js';
import fs from 'fs';

export function getContent(themeId) {
  const fileList=getTpFilesList(themeId);
  let tpContent='';
  for (const key in fileList) {
    let template=fs.readFileSync(fileList[key], {encoding: "utf8"});
    tpContent += "<template id='tp" + key + "'>\n" + template + "\n</template>\n";
  }
  //header('Access-Control-Allow-Origin: *'); //To allow use of external
  return tpContent;
}