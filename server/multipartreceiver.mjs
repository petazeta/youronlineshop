/*
  This modules parse the multipart form content: saves the files and returns other data
  arguments: request, nameToPath: (filename) => pathfilename
  return: array of objects: [{name, contenType, filename}, {...}]
  
  Note: To proper encode the binary files is important to write always buffers this way: toString('binary')
*/

import {createWriteStream} from 'fs';
import {pipeline} from 'stream';

export function parseContent(request, nameToPath) {
  const contents=[];
  const entriesBoundary = extractBoundary(request.headers['content-type']);

  return new Promise((resolve, reject)=>pipeline(
    request,
    fixBoundaryInBetween(entriesBoundary),
    fixBoundaryInBetween(entriesBoundary),
    parseContentCore(entriesBoundary, contents, nameToPath),
    (err) => {
      if (err) reject(err);
      else resolve(contents);
    }
  ));
  function extractBoundary(contentType) {
    const CONTENT_TYPE_RE = /^multipart\/(?:form-data|related)(?:;|$)/i;
    const CONTENT_TYPE_PARAM_RE = /;\s*([^=]+)=(?:"([^"]+)"|([^;]+))/gi;
    
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
    return '--' + boundary; //boundaries starts with -- and last boundary also has -- at the end
  }

    // Iterative function. It uses entriesBoundary, contents, nameToPath
  parseContentCore(entriesBoundary, contents, nameToPath) {
    return async function * parseContentCoreIter(source) {
      let currentElement;
      for await (const chunk of source) {
        yield innerParseContent(chunk, entriesBoundary, contents, nameToPath)
      }
      // Non iterative function.
      function innerParseContent(chunk, entriesBoundary, contents, nameToPath) {
        if (chunk.toString('latin1').includes(entriesBoundary)) {
          const entireElements=[];
          const splited=chunk.toString('latin1').split(entriesBoundary);
          // we get the central elements that are entire elements
          if (splited.length > 2) {
            const centralParts=splited.slice(1, -1);
            for (const centralPart of centralParts) {
              const [name, fileName]=extractPartAttributes(centralPart, ["name", "filename"]);
              const partContent=extractPartContent(centralPart.replace(/\r\n$/, ''));
              if (fileName) {
                contents.push({name: name, filename: fileName});
                if (nameToPath) {
                  createWriteStream(nameToPath(name, fileName), {encoding: 'binary'}).end(partContent);
                }
              }
              else {
                contents.push({name: name, content: partContent});
              }
            }
          }
          const firstPart=splited.shift().replace(/\r\n$/, '');
          const lastPart=splited.pop();
          if (currentElement) {
            if (currentElement.writer) {
              // end element with the chunk first part
              contents.push({name: currentElement.name, filename: currentElement.filename});
              currentElement.writer.end(firstPart);
            }
            else if (currentElement.parts) {
              // end element with the chunk first part
              contents.push({name: currentElement.name, content: currentElement.parts.join('') + firstPart});
            }
          }
          // new element with the chunk last part
          if (lastPart.length<=4) return; // --\r\n (4 chars) after boundary indicates last boundary and it is garbage
          createElement(lastPart, nameToPath);
        }
        // no boundaries
        else {
          // there should be allways a currentElement if no boundary cause the very first line es a boundary
          if (currentElement.writer) {
            currentElement.writer.write(chunk);
          }
          else if (currentElement.parts) {
            currentElement.parts.push(chunk.toString('latin1'));
          }
        }
      }
      function createElement(data, nameToPath) {
        const [name, fileName]=extractPartAttributes(data, ["name", "filename"]);
        if (fileName) {
          currentElement={name: name, filename: fileName};
          if (!nameToPath) return;
          currentElement.writer=createWriteStream(nameToPath(name, fileName), {encoding: 'binary'});
          const fileContent=extractPartContent(data);
          currentElement.writer.write(fileContent);
        }
        else {
          currentElement={name: name};
          currentElement.parts=[];
          const partContent=extractPartContent(data);
          currentElement.parts.push(partContent);
        }
      }
      // entry is type String
      function extractPartContent(entry){
        const headerBoundary='\r\n\r\n';
        const headerBoundaryIndex = entry.indexOf(headerBoundary);
        if (headerBoundaryIndex==-1) return;
        const contentStart=headerBoundaryIndex + headerBoundary.length;
        return entry.slice(contentStart);
      }

      // entry is type String
      function extractPartAttributes(entry, attributesList){
        const headerBoundary='\r\n\r\n';
        const headerBoundaryIndex = entry.indexOf(headerBoundary);
        if (headerBoundaryIndex==-1) return [];
        const header=entry.slice(0, headerBoundaryIndex);
        return attributesList.map(attr=>{
          const myMatch = header.match(new RegExp(`${attr}="(.*?)"`));
          return myMatch && myMatch[1];
        });
      }
    }
  }
  // It uses entriesBoundary
  fixBoundaryInBetween(entriesBoundary) {
    return async function * fixBoundaryInBetweenIter(source) {
      let lastChunk
      for await (const chunk of source) {
        if (lastChunk) {
          const firstLineEndPos = chunk.toString('latin1').indexOf('\r\n')
          // descartamos además cuando la línea supera el número de caracteres de entriesBoundary pues boundary ocupa toda la línea
          if (firstLineEndPos != -1 && !(firstLineEndPos > entriesBoundary.length)) {
            const chunksJoint = lastChunk.toString('latin1').slice(-entriesBoundary.length) + chunk.toString('latin1').slice(0, firstLineEndPos);
            if (chunksJoint.includes(entriesBoundary)) { // when the match is in between chunks we join chunks
              yield Buffer.concat([lastChunk, chunk])
              lastChunk=null // we dont set lastChunk to chunk this time cause the current chunk is sent. Otherwise current chunk would be sent twice
              // Therefore we are not checking boundaries between current chunk and next
              // The easier way to solve it is to repeat twice the function in the pipeline so boundaries not checked would be checked in a second round
              continue
            }
          }
          yield lastChunk
        }
        lastChunk = chunk
      }
      if (lastChunk) yield lastChunk // return the last pieze
    }
  }
}



