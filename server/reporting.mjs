//
import fs from 'fs';
import path from 'path';

import config from './cfg/mainserver.mjs';

const fileNamePath=path.join(config.basePath, config.reportsFilePath);

export default function makeReport(data) {
  if (typeof data=="string") {
    data=[data];
  }
  return addRecord(data);
}

function addRecord(dataRow){
  process.env.TZ = 'Europe/Madrid';
  const myDate=new Date();
  dataRow.unshift(myDate.toISOString().split('T')[0] + ' ' + myDate.toISOString().split('T')[1].slice(0, 8))

  return fs.promises.appendFile(fileNamePath, dataRow.join(' ') + "\n")
  .then(()=>resetAtMax())
  .catch(err=>console.log("Error reporting", err));
}

function resetAtMax(){
  return fs.promises.stat(fileNamePath)
  .then((stat)=>{
    if (stat.size > config.reportsFileMaxSize) {
      fs.promises.rename(fileNamePath, fileNamePath.replace('.txt', '') + '.old.txt').then(()=>fs.promises.writeFile(fileNamePath, "new file\n"));
    }
  });
}