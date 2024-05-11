// *** sería ideal que se crearan las carpetas de las imagenes si no existen, de esta manera se evita tener esta estructura en el codigo fuente

import {authenticate} from "./authentication.mjs"
import {basename as pathBaseName, join as pathJoin, sep as pathSep} from "path"
import {parseContent} from "../multipartreceiver.mjs"
import {isAllowedToUpdateCatalogImage} from "../safety.mjs"
import {errorResponse} from "../errors.mjs" // ??? why it is not wided use
import {enviroments} from "./serverstart.mjs"
import {setConstructors} from "../dbutils.mjs"
import {existsSync, mkdirSync} from "fs"

export async function uploadImages(request, response, enviroment){
  try {
    const [Node, Linker, User] = setConstructors(enviroment.get("db-gateway"))
    const user = await authenticate(User, request.headers)
    if (!isAllowedToUpdateCatalogImage(user))
      throw new Error("user not allowed to upload image")
    createImageFolders(enviroment)
    const elements = await parseContent(request, nameToPath)

    function nameToPath(name, fileName) {
      const imageName = pathBaseName(fileName)
      const imageSizeFolderName = name.includes("big") ? "big" : "small"
      const imagePath = pathJoin(enviroment.get("images-path"), imageSizeFolderName, imageName)
      // crear aqui la carpeta cuando no exista
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

// Quizas mejor pasarlo al initServer
// It creates images folders if they doesn't exist
function createImageFolders(enviroment) {
  let baseFolder = enviroment.get("images-path")
  let folderNames = [], pathName
  for (const folderName of baseFolder.split(pathSep)) {
    pathName = pathName ? pathJoin(pathName, folderName) : folderName
    if (pathName && pathName!=".")
      folderNames.push(pathName)
  }

  createFolders(...folderNames, pathJoin(baseFolder, "small"), pathJoin(baseFolder, "big"))

  function createFolders(...folderNames) {
    for (const folderName of folderNames) {
      if (!existsSync(folderName))
        mkdirSync(folderName)
    }
  }
}