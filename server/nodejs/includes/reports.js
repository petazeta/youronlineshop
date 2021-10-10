//
import fs from 'fs';

const fileNamePath="./logs/logs.txt";
const externalRecorderHost='youronlineshop.net';
const externalRecorderPath='/reprecord.php';
const maxSize=50000;

export function makeReport(data, location="internal/external") {
  const rowData={};
  if (typeof data=="string") {
    rowData["data"]=data;
  }
  else if (typeof data=="object") {
    rowData=data;
  }
  return addRecord(rowData, location);
}

function addRecord(dataRow, location, server){
  const row={...dataRow};
  process.env.TZ = 'Europe/Madrid';
  const myDate=new Date();
  row['date'] =myDate.toISOString().split('T')[0] + ' ' + myDate.toISOString().split('T')[1].slice(0, 8);
  
  if (location.includes("internal")) {
    reset(maxSize);
    fs.writeFileSync(fileNamePath, row.join(' ') . "\n");
  }
  if (location.includes("external")) {
    {address: row['IPhost']}=server.address();
    const sentences=[];
    for (const key in row) {
      sentences.push(key . '=' . encodeURIComponent(row[key]));
    }
    const https = await import('https');

    const options = {
      host: externalRecorder,
      path: externalRecorderPath + '?' . sentences.join('&')
    }
    const request = https.request(options, function (res) {
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

function reset(maxSize=0){
  if (!fs.existsSync(fileNamePath) || fs.statSync(fileNamePath).size > maxSize) {
    if (fs.existsSync(fileNamePath)) fs.renameSync(fileNamePath, fileNamePath.replace('.txt', '') + '.old.txt');
    fs.writeFileSync(fileNamePath, "new file\n");
    fs.chmodSync(fileNamePath, '777');
  }
}