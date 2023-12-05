import {config} from "./cfg.mjs"
import authentication from "./authentication.mjs"
import {basename as pathBaseName, join as pathJoin} from "path"
import {parseContent} from "../multipartreceiver.mjs"
import {isAllowedToUpdateCatalogImage} from "./safety.mjs"
import {errorResponse} from "../errors.mjs"

export async function uploadImages(request, response){
  try {
    const user = await authentication(request.headers)
    if (!isAllowedToUpdateCatalogImage(user))
      throw new Error("user not allowed to upload image");
    const elements = await parseContent(request, nameToPath);

    function nameToPath(name, fileName) {
      const imageName = pathBaseName(fileName)
      const imageSizeFolderName = name.includes("big") ? "big" : "small"
      const imagePath = pathJoin(config.get("imges-path"), imageSizeFolderName, imageName)
      return imagePath
    }
    response.write("true")
  }
  catch(err){
    errorResponse(err, response)
    throw err // reporting upwards
  }
  finally{
    response.end()
  }
}