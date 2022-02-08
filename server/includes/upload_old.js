import {parse} from './multipartreceiver.js';
import clientConfig from './../../client/cfg/default.js';
import config from './../cfg/main.js';
import {isAllowedToModify} from './safety.js';
import login from './authorization.js';
import fs from 'fs';

export function upload(request, response){
  let body = '';
  request.on('data', chunk => {
    body += chunk.toString('binary');
    // Too much POST data, kill the connection!
    // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
    if (body.length > 1e6)
        request.connection.destroy();
  });

  request.on('end', async () => {
    const content=parse(request, body);
    // esto es una chapucilla, mejor sería que no tomara el directorio catalog-images si no que lo detectara  a partir de clientConfig.cat.
    const smallPath=config.basePath + '/' + clientConfig.catalogImagesSmallPath.replace(/catalog-images/g, 'catalog-images/' + config.catalogImagesFolderName);
    const bigPath=config.basePath + '/' + clientConfig.catalogImagesBigPath.replace(/catalog-images/g, 'catalog-images/' + config.catalogImagesFolderName);
    const maxSize=2000000;
    let parameters, path, fileName, fileContent;
    for (const element of content) {
      if (element.get("name")=="parameters") parameters=JSON.parse(element.get("content"));
      if (element.get("type").includes("image")) {
        fileName=element.get("filename");
        fileContent=element.get("content");
      }
    }
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
    path=bigPath;
    if (parameters.fileSize=="small") path=smallPath;
    fileName=path + fileName;
    fs.writeFile(fileName, fileContent, 'binary', function(err) {
      if(err) {
        response.write("false");
        response.end();
        return console.log(err);
      }
      response.write("true");
      response.end();
    });
  });
}