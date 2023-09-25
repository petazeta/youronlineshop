import {promises as fs} from 'fs'

export class SiteReport {
  constructor(maxSize=50000){
    this.maxSize=maxSize
  }
  makeReport(reportsFile, dataRow) {
    if (!Array.isArray(dataRow))
      dataRow = [dataRow]
    console.log("reporting", dataRow)
    const myDate=new Date()
    dataRow.unshift(myDate.toISOString().split('T')[0] + ' ' + myDate.toISOString().split('T')[1].slice(0, 8))
    return fs.appendFile(reportsFile, dataRow.join(' ') + "\n")
    .then(()=>resetIfMaxSize(reportsFile, this.maxSize))
    .catch(err=>console.log("Error reporting", err))
  }
}

function resetIfMaxSize(reportsFile, maxSize){
  return fs.stat(reportsFile)
  .then(stat=>{
    if (stat.size > maxSize) {
      fs.rename(reportsFile, reportsFile.replace('.txt', '') + '.old.txt').then(()=>fs.writeFile(reportsFile, "new file\n"));
    }
  });
}
