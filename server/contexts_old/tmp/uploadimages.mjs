import {config} from './cfg/main.mjs';
import authentication from './authentication.mjs';
import * as path from 'path';
import parseContent from '../../multipartreceiver.mjs';
import {errorResponse} from './respond.mjs';
import {isAllowedToUpdateCatalogImage} from './safety.mjs';

export default async function uploadImages(request, response){
  try {
    const user= await authentication(request.headers);
    if (!isAllowedToUpdateCatalogImage(user)) throw new Error("user not allowed to upload image");
    const elements = await parseContent(request, nameToPath);

    function nameToPath(name, fileName) {
      const imageName = path.basename(fileName);
      const imageSizeFolderName = name.includes('big') ? 'big' : 'small';
      const imagePath=path.join(config.catalogImagesPath, imageSizeFolderName, imageName);
      return imagePath;
    }
    response.write('true');
  }
  catch(err){
    errorResponse(err, response);
  }
  finally{
    response.end();
  }
}