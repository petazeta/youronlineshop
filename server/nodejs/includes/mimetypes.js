import path from 'path';
import {createRequire} from "module";
const require = createRequire(import.meta.url);

const myMimes=new Map(Object.entries(require('./mimetypes.json')));

export default function getMimeType(filename) {
  const fileExt=path.parse(filename).ext.slice(1);
  const contentType=myMimes.get(fileExt) || 'text/plain';
  return contentType;
}