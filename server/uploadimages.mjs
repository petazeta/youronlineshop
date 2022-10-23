import config from './cfg/mainserver.mjs';
import authentication from './authentication.mjs';
import path from 'path';
import parseContent from './multipartreceiver.mjs';
import {errorResponse} from './respond.mjs';
import {isAllowedToUpdateCatalogImage} from './safety.mjs';

export default async function uploadImages(request, response){
  try {
    const user= await authentication(request.headers);
    if (!isAllowedToUpdateCatalogImage(user)) throw new Error("user not allowed to upload image");
    const elements = await parseContent(request, nameToPath);

    function nameToPath(name, fileName) {
      const imageName = path.basename(fileName);
      const imageSizePath = name.includes('big') ? config.catalogImagesBigPath : config.catalogImagesSmallPath;
      const imagePath=path.join(config.basePath, config.catalogImagesPath, imageSizePath, imageName);
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