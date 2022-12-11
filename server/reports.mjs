import * as fs from 'fs';
import * as path from 'path';

export default class SiteReport {
  constructor(reportsFile, maxSize=50000){
    this.reportsFile=reportsFile;
    this.maxSize=maxSize;
  }
  makeReport(data) {
    if (!Array.isArray(data)) data=[data];
    return this.addRecord(data);
  }

  addRecord(dataRow){
    console.log("reporting", dataRow);
    const myDate=new Date();
    dataRow.unshift(myDate.toISOString().split('T')[0] + ' ' + myDate.toISOString().split('T')[1].slice(0, 8))
    return fs.promises.appendFile(this.reportsFile, dataRow.join(' ') + "\n")
    .then(()=>this.resetIfMaxSize())
    .catch(err=>console.log("Error reporting", err));
  }

  resetIfMaxSize(){
    return fs.promises.stat(this.reportsFile)
    .then(stat=>{
      if (stat.size > this.maxSize) {
        fs.promises.rename(this.reportsFile, this.reportsFile.replace('.txt', '') + '.old.txt').then(()=>fs.promises.writeFile(this.reportsFile, "new file\n"));
      }
    });
  }
}