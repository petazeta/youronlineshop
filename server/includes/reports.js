//
import fs from 'fs';

import config from '../cfg/main.js';

const fileNamePath=config.serverPath + "/logs/logs.txt";
const externalRecorderHost='youronlineshop.net';
const externalRecorderPath='/reprecord.php';
const maxSize=50000;

export function makeReport(data, location="internal") {
  const rowData={};
  if (typeof data=="string") {
    rowData.data=data;
  }
  else if (typeof data=="object") {
    Object.assign(rowData, data);
  }
  console.log("addRecord", rowData, location);
  return addRecord(rowData, location);
}

async function addRecord(dataRow, location){
  const row=[];
  process.env.TZ = 'Europe/Madrid';
  const myDate=new Date();
  row.push(myDate.toISOString().split('T')[0] + ' ' + myDate.toISOString().split('T')[1].slice(0, 8));
  for (const key in dataRow) {
    row.push(dataRow[key]);
  }
  if (location.includes("internal")) {
    fs.appendFile(fileNamePath, row.join(' ') + "\n", function (err) {
      if (err) throw err;
      reset(maxSize);
    });
  }
  if (location.includes("external")) {
    //const {address: row['IPhost']}=server.address();
    const sentences=[];
    for (const key in row) {
      sentences.push(key + '=' + encodeURIComponent(row[key]));
    }
    const http = await import('http');

    const options = {
      host: externalRecorder,
      path: externalRecorderPath + '?' + sentences.join('&')
    }
    const request = http.request(options, function (res) {
      let data = '';
      res.on('data', function (chunk) {
          data += chunk;
      });
      res.on('end', function () {
          console.log(data);
      });
    });
    request.on('error', function (e) {
      console.log(e.message);
    });
    request.end();
  }
  return true;
}

// better to make it async
function reset(maxSize=0){
  if (!fs.existsSync(fileNamePath) || fs.statSync(fileNamePath).size > maxSize) {
    if (fs.existsSync(fileNamePath)) fs.renameSync(fileNamePath, fileNamePath.replace('.txt', '') + '.old.txt');
    fs.writeFileSync(fileNamePath, "new file\n");
    fs.chmodSync(fileNamePath, '777');
  }
}