import {config} from './cfg.mjs'
import {SiteReport} from '../reports.mjs'

const myReport = new SiteReport(config.get("reports-file-maxsize"))

export default function makeReport(data) {
  return myReport.makeReport(config.get("reports-file-path"), data)
}