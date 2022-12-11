Node.js http file server: deliver files content and upload files
================================================================

# The problem

Unless other server side languages like PHP in Node.js there is no file content delivery method by default but it is the server application which should be in charge of attending any file request from the client. This can be an adventage because the app has full control of the file delivering process so we can perform file delivering depending on any factors we may want to take in account. In other server side languages if we need to have extra control of the http file delivery process we must configure it from the http server or through some other tools. But in Node.js the app must perform this procedure which requires some extra code.

To perform file delivery we can find some simple scripts in javascript tutorials, for example, the popular tutorials web site w3schools has examples for Node.js file server procedure. The procedure exposed in the tutorial requires to read the entire file and then transfer the content to the server response. This method has the disadventage of using a considerable amount of system memory to store the file content before delivering it to the client. The same situation happens for the counterpart process of storing a file that comes from client.

There is a better procedure to transfer files and it is by streaming. Streaming transfer uses data chunks, which are pieces of data that are transferred one by one so the memory doesn't need to keep the whole file content but only the chunk size at a time. This method speeds up the transfer process and avoid memory for collapsing. So we will cover in this text some scripts that can perform the file transfer through streaming.

# The solution

As we have exposed there are two http file delivering posibilities: one is from server to client and another one is from client to server. The first one, from server to client, is the most common of two meanwhile the second one is for uploading files, which is less common and used to be related to form submition. This last one is more complex because we also must create a file and store it in server. Lets analize these two cases.


## Delivering files to client

The key concept for file delivering is streaming. Streaming is an asyncronous way of managing flow of data by using a buffer in memory. This way we don't deal with the whole data at once but only the buffer size data at a time.

Streaming implementation is a build in feature in Node.js so we just need to use the stream interface in our script. When we create an http server through the http module createServer function we are using a request parameter. This parameter is a stream interface (readable stream) as well as the response parameter (writeble stream). That means we can use stream procedures like piping, which connects an input stream of data to an output source. In our case the input source is the file and the output source is the http response.

Below there is the main code for the file server delivery script. 
````
import * as fs from 'fs';

fs.stat(filename, function(err, stat) {
  if (err) {
    console.log(err);
    response.writeHead(404);
    return response.end();
  }
  response.writeHead(200, {
    'Content-Type': getMimeType(filename),
    'Content-Length': stat.size
  });
  
  const readStream = fs.createReadStream(filename);

  readStream.on('open', () => {
    readStream.pipe(res);
  });

  readStream.on('error', function (err) {
    console.log(err);
    readStream.destroy();
    response.end();
  });
});
````

According to Mario Kandut regarding to streaming to an http response: "In most cases the pipeline method should be used, but pipeline destroys streams when an error occurs, and we would not be able to send a response back. Hence, for this use case manually error handling is acceptable." 

Pipeline mothod in our case would be like:
````
// Add pipeline input
import { pipeline } from 'stream';

// Replace the readStream bock with this code
pipeline(fs.createReadStream(filename), response, (err) => {
  console.log(err);
});
````

We prefer using pipe method insted pipeline one and also we are being caution about releasing file and memory from the read stream procedure by calling readStream.destroy() when a read stream error occurs as well as ending the http response.

Worth mentioning that we could serve files as attached content (delivering them for downloading) just by adding the header:
```
'Content-Disposition': 'attachment'
```   

## Receiving files from client

For transfering files from client to server via http we have to do a multipart upload request. We will take a file from client with FormData and send it to the server. Form transmision format we use the encoding type named "multipart/form-data" that consists in a series of data separated with a boundary and containing some header and data body all encoded in ISO-8859-1 (latin1) as is the HTTP 1.1 default charset.

### Parsing content

The following example illustrates "multipart/form-data" encoding. Suppose we have the following form:
```
 <FORM action="http://server.com/cgi/handle"
       enctype="multipart/form-data"
       method="post">
   <P>
   What is your name? <INPUT type="text" name="submit-name"><BR>
   What files are you sending? <INPUT type="file" name="files"><BR>
   <INPUT type="submit" value="Send"> <INPUT type="reset">
 </FORM>
```
If the user enters "Larry" in the text input, and selects the text file "file1.txt", the user agent might send back the following data:
```
   Content-Type: multipart/form-data; boundary=AaB03x

   --AaB03x
   Content-Disposition: form-data; name="submit-name"

   Larry
   --AaB03x
   Content-Disposition: form-data; name="files"; filename="file1.txt"
   Content-Type: text/plain

   ... contents of file1.txt ...
   --AaB03x--
```
If the user selected a second (image) file "file2.gif", the user agent might construct the parts as follows:

```
   Content-Type: multipart/form-data; boundary=AaB03x

   --AaB03x
   Content-Disposition: form-data; name="submit-name"

   Larry
   --AaB03x
   Content-Disposition: form-data; name="files"
   Content-Type: multipart/mixed; boundary=BbC04y

   --BbC04y
   Content-Disposition: file; filename="file1.txt"
   Content-Type: text/plain

   ... contents of file1.txt ...
   --BbC04y
   Content-Disposition: file; filename="file2.gif"
   Content-Type: image/gif
   Content-Transfer-Encoding: binary

   ...contents of file2.gif...
   --BbC04y--
   --AaB03x--
```

From these content elements we can now stablish a strategy for parsing the elements so we can extract the form input values and the files. First one thing is to split contents. Content is separated by a boundary which is not a fixed string but it is defined at the request header. After Spliting contents we need to split the header from the content itself at every part. Then if the content is a file we must save it.

The following script is a module and works for a multi-part of one file and any inputs. To use it we must import function parseContent and pass it the http request and the path of the file destination folder.

```
import * as fs from 'fs';
import {pipeline} from 'stream';
import * as path from 'path';

let source, entriesBoundary, contentPipe, filePath, contents=[];

// <--utils start
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
    const myMatch = header.match(new RegExp(`${attr}="(.*)"`));
    return myMatch && myMatch[1];
  });
}
// <-- utils end
// Iterative function. It uses entriesBoundary, contentPipe
async function* parseContentCore(source) {
  let currentElement;
  for await (const chunk of source) {
    yield innerParseContent(chunk, entriesBoundary);
  }
  // Non iterative function. It uses filePath
  function innerParseContent(chunk, entriesBoundary) {
    if (chunk.toString('latin1').includes(entriesBoundary)) {
      const entireElements=[];
      const splited=chunk.toString('latin1').split(entriesBoundary);
      // we get the central elements that are entire elements
      if (splited.length > 2) {
        const centralParts=splited.slice(1, -1);
        for (const centralPart of centralParts) {
          const [name, type, fileName]=extractPartAttributes(centralPart, ["name", "Content-Type", "filename"]);
          const partContent=extractPartContent(centralPart.replace(/\r\n$/, ''));
          if (fileName) {
            contents.push({name: name, type: type, filename: fileName});
            const myWriter=fs.createWriteStream(path.join(filePath, fileName), {encoding: 'binary'});
            myWriter.end(partContent);
          }
          else {
            contents.push({name: name, type: type, content: partContent});
          }
        }
      }
      const firstPart=splited.shift().replace(/\r\n$/, '');
      const lastPart=splited.pop();
      if (currentElement) {
        if (currentElement.writer) {
          // end element with the chunk first part
          contents.push({name: currentElement.name, type: currentElement.type, filename: currentElement.filename});
          currentElement.writer.end(firstPart);
        }
        else if (currentElement.parts) {
          // end element with the chunk first part
          contents.push({name: currentElement.name, type: currentElement.type, content: currentElement.parts.join('') + firstPart});
        }
      }
      // new element with the chunk last part
      if (lastPart.length<=4) return; // --\r\n (4 chars) after boundary indicates last boundary and it is garbage
      createElement(lastPart);
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
  // it uses filePath
  function createElement(data) {
    currentElement={};
    const [name, type, fileName]=extractPartAttributes(data, ["name", "Content-Type", "filename"]);
    if (fileName) {
      currentElement.writer=fs.createWriteStream(path.join(filePath, fileName), {encoding: 'binary'});
      const fileContent=extractPartContent(data);
      currentElement.writer.write(fileContent);
    }
    else {
      currentElement.parts=[];
      const partContent=extractPartContent(data);
      currentElement.parts.push(partContent);
    }
  }
}

// it uses entriesBoundary
async function* fixBoundaryInBetween(source) {
  let lastChunk;
  for await (const chunk of source) {
    if (lastChunk) {
      const lineEnd = chunk.toString('latin1').indexOf('\r\n');
      if (lineEnd!=-1 && lineEnd<entriesBoundary.length) {
        const mixing=lastChunk.toString('latin1').slice(-entriesBoundary.length) + chunk.toString('latin1').slice(0, lineEnd);
        if (mixing.includes(entriesBoundary)) {
          yield Buffer.concat([lastChunk, chunk]);
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

export function parseContent(request, myFilePath) {
  filePath=myFilePath;
  source=request;
  entriesBoundary=extractBoundary(request.headers['content-type']);
  return new Promise((resolve, reject)=>{
    contentPipe=pipeline(
      source,
      fixBoundaryInBetween,
      fixBoundaryInBetween,
      parseContentCore,
      (err) => {
        if (err) reject(err);
        else resolve(contents);
      }
    );
  });
}
```

The parser creates a pipeline for extracting the data. Files would be saved and fields returned as an object. For the returning value we are building the pareser as a Promise and we can call it this way:

```
const elements = await parseContent(request, filePath);
```

The function fixBoundaryInBetween is a helper function that has the task of making some arrangements when the boundary phrase is broken in two pieces (the extraordinary situation when it comes between two chunks of data). Function parseContentCore behaves as a write stream by using a generator function. A generator function is similar to a promise but it can resolve several times so can send a result for each time it recieves a data chunck. For every chunk it makes a subrutine for extracting the content and joining it to the previous data piece. This way we it forms the whole file.

This module works only with no Content-Transfer-Encoding defined, so regarding these encoding we would have two or more types of enconding at the source data. It is also defined for uploading just one file at a time.

# Resources

https://www.mariokandut.com/how-to-stream-to-an-http-response-in-node-js/

