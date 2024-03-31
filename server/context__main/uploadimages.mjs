// *** sería ideal que se crearan las carpetas de las imagenes si no existen, de esta manera se evita tener esta estructura en el codigo fuente

import {authenticate} from "./authentication.mjs"
import {basename as pathBaseName, join as pathJoin} from "path"
import {parseContent} from "../multipartreceiver.mjs"
import {isAllowedToUpdateCatalogImage} from "../safety.mjs"
import {errorResponse} from "../errors.mjs" // ??? why it is not wided use
import {enviroments} from "./serverstart.mjs"
import {setConstructors} from "./respond.mjs"

export async function uploadImages(request, response){
  try {
    const enviroment = enviroments.get(request.headers.host)
    const [Node, Linker, User] = setConstructors(enviroment.get("db-gateway"))
    const user = await authenticate(User, request.headers)
    if (!isAllowedToUpdateCatalogImage(user))
      throw new Error("user not allowed to upload image");
    const elements = await parseContent(request, nameToPath);

    function nameToPath(name, fileName) {
      const imageName = pathBaseName(fileName)
      const imageSizeFolderName = name.includes("big") ? "big" : "small"
      const imagePath = pathJoin(enviroment.get("images-path"), imageSizeFolderName, imageName)
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