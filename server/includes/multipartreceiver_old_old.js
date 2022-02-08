/*
que pasa con el salto que hay antes del boundary?
recibe request
*/

/*
  Este módulo guarda los archivos a partir de un multi-part form data
  el procedimiento a seguir es el siguiente
  Primero se llama al método initialize que recibe como argumento el request
  
  A partir de entonces se podrían utilzar las siguientes funciones:
  - parseFiles(optional toPathName)
    Guarda en archivos el contenido de tipo file
    toPathName es un parámetro opcional  que puede ser una función la cual para cada nombre de archivo tal y como está indicado en el multi-part devuelve el path completo del archivo a escribir.
  - parseContent(name, type)
    Devuelve el contenido del multi-part que cuyo nombre es como el indicado, si no se indica el name devuelve un Map con todos los contenidos del tipo ******
*/

import fs from 'fs';
import {pipeline} from 'stream';

let source, entriesBoundary;
export function initalize(request, toPathName) {
  source=request;
  entriesBoundary=extractBoundary(request.headers['content-type'])
}

function extractBoundary(contentType) {
  const CONTENT_TYPE_RE = /^multipart\/(?:form-data|related)(?:;|$)/i;
  const CONTENT_TYPE_PARAM_RE = /;\s*([^=]+)=(?:"([^"]+)"|([^;]+))/gi;
  
  const contentType = request.headers['content-type'];
  let myMatch = CONTENT_TYPE_RE.exec(contentType);
  if (!myMatch) {
    return false;
  }
  
  let boundary;
  CONTENT_TYPE_PARAM_RE.lastIndex = myMatch.index + myMatch[0].length - 1;
  while ((myMatch = CONTENT_TYPE_PARAM_RE.exec(contentType))) {
    if (myMatch[1].toLowerCase() !== 'boundary') continue;
    boundary = myMatch[2] || myMatch[3];
    break;
  }
  return boundary;
}

// entry is type String
function extractFileName(entry){
  const headerBoundary='\r\n\r\n';
  const headerBoundaryIndex = entry.indexOf(headerBoundary);
  if (headerBoundaryIndex==-1) return;
  const header=entry.slice(0, headerBoundaryIndex);
  const fileNameMatch = header.match(/filename="(.*)"/);
  if (fileNameMatch) return fileNameMatch[1];
}

// entry is type String
function extractFileContent(entry){
  const headerBoundary='\r\n\r\n';
  const headerBoundaryIndex = entry.indexOf(headerBoundary);
  if (headerBoundaryIndex==-1) return;
  const contentStart=headerBoundaryIndex + headerBoundary.length;
  return entry.slice(contentStart);
}

// it uses entriesBoundary
async function* parseFilesCore(source) {
  let currentElement;
  for await (const chunk of source) {
    yield innerParseFiles(chunk, entriesBoundary);
  }
  // the non iterative function performace
  function innerParseFiles(chunk, entriesBoundary) {
    if (String(chunk).includes(entriesBoundary)) {
      const entireElements=[];
      const splited=String(chunk).split(entriesBoundary);
      // we get the central elements that are entire elements
      if (splited.length > 2) {
        const centralParts=splited.slice(1, -1);
        for (const centralPart of centralParts) {
          //centralPart = centralPart.slice(-2); 
          const fileName=extractFileName(centralPart);
          if (fileName) {
            const fileContent=extractFileContent(centralPart.slice(-2)); // removing \r\n that comes between first part and boundary
            console.log("write file ", fileName);
            fs.createWriteStream(fileName).end(Buffer.from(fileContent));
          }
        }
        writeFiles(splited.slice(1, -1));
      }
      const firstPart=splited.shift().slice(-2); // removing \r\n that comes between first part and boundary
      const lastPart=splited.pop();
      if (currentElement) {
        if (currentElement.writer) {
          // end element with the chunk first part
          console.log("wrinting ending", firstPart.length);
          currentElement.writer.end(Buffer.from(firstPart));
          // new element with the chunk last part
          createElement(lastPart);
        }
        else {
          // new element with the chunk last part
          createElement(lastPart);
        }
      }
      else {
        // very first chunk
        createElement(lastPart); //first part is void
      }
    }
    // no boundaries
    else {
      // there should be allways a currentElement if no boundary cause the very first line es a boundary
      if (currentElement.writer) {
          console.log("writing", String(chunk).length);
          currentElement.writer.write(chunk);
        }
      }
    }
  }
  
  function createElement(data) {
    currentElement={};
    const fileName=extractFileName(data);
    console.log("new element ", fileName);
    if (fileName) {
      currentElement.writer=fs.createWriteStream(fileName);
      const fileContent=extractFileContent(data);
      console.log("writing", fileContent.length);
      currentElement.writer.write(Buffer.from(fileContent));
    }
  }
  
}

// it uses entriesBoundary
async function* fixBoundaryInBetween(source) {
  let lastChunk;
  for await (const chunk of source) {
    if (lastChunk) {
      const lineEnd = String(chunk).indexOf('\r\n');
      if (lineEnd!=-1 && lineEnd<entriesBoundary.length) {
        const mixing=String(lastChunk).slice(-entriesBoundary.length) + String(chunk).slice(0, lineEnd);
        if (mixing.includes(entriesBoundary)) {
          console.log("fixing boundary");
          yield Buffer.from(String(lastChunk)+String(chunk));
          lastChunk=null; // we dont set lastChunk this time cause the current chunk is sent
          continue;
        }
      }
      yield lastChunk;
    }
    lastChunk=chunk;
  }
  if (lastChunk) yield lastChunk; // return the last pieze
}

export function parseFiles {
  pipeline(
    source,
    fixBoundaryInBetween,
    fixBoundaryInBetween,
    parseFilesCore,
    (err) => {
      if (err) {
        console.error('Pipeline failed.', err);
      }
    }
  );
}