//
import path from 'path';
import formidable from 'formidable';

const basePath=CATALOG_PATH + "/images/";
const smallPath=basePath + "small" + "/";
const bigPath=basePath + "big" + "/";
const maxSize=2000000;
const validExtensions=[];

function uploadfile(files, destFolder){
  const targeFile = destFolder + path.basename(files.filetoupload.name);
  if (validExtensions.length) {
    if (!validExtensions.includes(path.extname(targetFile))) return "File is not a valid image.";
  }
  // Check file size
  if (fs.statSync(files.filetoupload.name) > maxSize) {
    return "Sorry, your file is too large.";
  }
  fs.renameSync(files.filetoupload.path, targeFile);
  return true;
}

const form = new formidable.IncomingForm();
form.parse(req, function (err, fields, files) {
  for (const myFile of files) {
    let destinationFolder=smallPath;
    if  (parameters.fileSize=='big') destinationFolder=bigPath;
    uploadFile(files, destinationFolder);
  }
});