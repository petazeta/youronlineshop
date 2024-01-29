import {config} from './cfg.mjs'
import {SiteReport} from '../reports.mjs'

const myReport = new SiteReport(config.get("reports-file-maxsize"))

export function makeReport(data, request) {
  if (!Array.isArray(data))
    data = [data]
  if (request)
    data.unshift(request.headers.host)
  return myReport.makeReport(config.get("reports-file-path"), data)
}