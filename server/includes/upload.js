import clientConfig from './../../client/cfg/default.js';
import config from './../cfg/main.js';
import {isAllowedToModify} from './safety.js';
import login from './authorization.js';
import path from 'path';
import url from 'url'; 
import {parseContent} from './multipartreceiver.js';

export async function upload(request, response){
  const size = url.parse(request.url,true).query.size;
  // it uses parameterssize
  function nameToPath(fileName) {
    // esto es una chapucilla, mejor sería que no tomara el directorio catalog-images si no que lo detectara  a partir de clientConfig.cat.
    const smallPath=path.join(config.basePath, clientConfig.catalogImagesSmallPath.replace(/catalog-images/g, path.join('catalog-images/', config.catalogImagesFolderName)));
    const bigPath=path.join(config.basePath, clientConfig.catalogImagesBigPath.replace(/catalog-images/g, path.join('catalog-images/' , config.catalogImagesFolderName)));
    
    let resultPath=bigPath;
    if (size=="small")  resultPath=smallPath;
    return path.join(resultPath, fileName);
  }
  const elements = await parseContent(request, nameToPath);
  const parameters=JSON.parse(elements.find(elm=>elm.name=="parameters").content);
  debugger;
  // por que parameters no es string?????
  const actionPermited=["add my tree", "edit my props", "add myself"]; //actions are related to node safety permisions
  if (!actionPermited.includes(parameters.action)) {
    throw new Error("no upload action permited");
  }
  let  user;
  if (config.autoLogin) {
    const {userAutoLogin} = await import('./user.js');
    user = await userAutoLogin(config.autoLogin);
  }
  else user = await login(request.headers);
  if (!await isAllowedToModify(user, parameters.nodeData)) {
    throw new Error("Database safety");
  }
  response.write("true");
  response.end();
}