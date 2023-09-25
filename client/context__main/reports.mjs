import Reporter from '../reports.mjs'
import configValues from './cfg/main.mjs'

const reporter=new Reporter();

export default function makeReport(msg) {
  return reporter.makeReport(msg, configValues.requestUrlPath)
}

export function setReportReactions(myCart, webuser) {
  return reporter.setReportReactions(myCart, webuser)
}
