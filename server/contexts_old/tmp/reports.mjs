import {config} from './cfg/main.mjs'
import {SiteReport} from '../../reports.mjs'

const myReport = new SiteReport(config.reportsFileMaxSize)

export default function makeReport(data) {
  return myReport.makeReport(config.reportsFilePath, data)
}