import config from './cfg/mainserver.mjs';
import SiteReport from '../server/reports.mjs';

const myReport = new SiteReport(config.reportsFilePath, config.reportsFileMaxSize);

export default function makeReport(data) {
  return myReport.makeReport(data);
}