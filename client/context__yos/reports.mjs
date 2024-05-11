import Reporter from '../reports.mjs'
import {config} from './cfg.mjs'

const reporter = new Reporter()

export function makeReport(msg) {
  return reporter.makeReport(msg, config.get("reports-url-path"))
}
