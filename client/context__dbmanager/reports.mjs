import Reporter from '../reports.mjs'
import {config} from './cfg.mjs'

const reporter = new Reporter()

export default function makeReport(msg) {
  return reporter.makeReport(msg, config.get("reports-url-path"))
}
