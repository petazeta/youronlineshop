import {config} from './cfg.mjs'
import {SiteReport} from '../reports.mjs'
import {existsSync, mkdirSync} from "fs"
import {basename as pathBaseName, join as pathJoin, sep as pathSep} from "path"

const myReport = new SiteReport(config.get("reports-file-maxsize"))

export function makeReport(data, request) {
  if (!Array.isArray(data))
    data = [data]
  if (request)
    data.unshift(request.headers.host)
  createLogsFolders(config)
  return myReport.makeReport(config.get("reports-file-path"), data)
}

// It creates images folders if they doesn't exist
function createLogsFolders(enviroment) {
  let baseFolder = enviroment.get("reports-file-path")
  baseFolder = baseFolder.slice(0, baseFolder.indexOf(pathBaseName(baseFolder)))
  if (baseFolder.charAt(baseFolder.length -1) == pathSep)
    baseFolder = baseFolder.slice(0, baseFolder.length -1)
  let folderNames = [], pathName
  for (const folderName of baseFolder.split(pathSep)) {
    pathName = pathName ? pathJoin(pathName, folderName) : folderName
    if (pathName && pathName!=".")
      folderNames.push(pathName)
  }
  createFolders(...folderNames)

  function createFolders(...folderNames) {
    for (const folderName of folderNames) {
      if (!existsSync(folderName))
        mkdirSync(folderName)
    }
  }
}