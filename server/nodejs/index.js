import http from 'http';
import url from 'url';
import fs from 'fs';
import getMimeType from './includes/mimetypes.js';

export default function (port) {
  console.log("app running");
  http.createServer((request, response) => {
    const q = url.parse(request.url, true);
    let filename = q.pathname;

    if (filename.includes("request")) {
      let body = '';
      request.on('data', data => {
        body += data;
        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6)
            request.connection.destroy();
      });

      request.on('end', () => {
        import('./includes/request.js')
        .then(({default: makeRequest})=>{
          
          const data=JSON.parse(body);
          //console.log("data:", data);
          if (!data.action) response.end();
          response.writeHead(200, {'Content-Type': 'application/json'});
          let makeRequestFunc;
          if (Array.isArray(data.action)) {
            const myresult=[];
            for (const i in data.action) {
              let makeRequestParams;
              if (data.parameters) makeRequestParams=[request.headers, data.action[i], data.parameters[i]];
              else makeRequestParams=[request.headers, data.action[i]];
              myresult.push(makeRequest(...makeRequestParams));
            }
            makeRequestFunc=()=>Promise.all(myresult);
          }
          else {
            makeRequestFunc=()=>makeRequest(request.headers, data.action, data.parameters);
          }
          makeRequestFunc()
          .then(res=>response.write(JSON.stringify(res)))
          .catch(res=>{
            let message="undefined error";
            if (typeof res=="string") message=res;
            else if (typeof res=="object" && res.message) message=res.message;
            console.log(res);
            response.write(JSON.stringify({error: true, message: message}));
          })
          .finally(()=>response.end());
        })
        .catch(e=>console.log(e));
      });
    }
    else if (filename.includes("upload")) {
      let body = '';
      request.on('data', data => {
        body += data.toString('binary');
        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6)
            request.connection.destroy();
      });

      request.on('end', async () => {
        const {parse} = await import('./includes/multipartreceiver.js');
        const content=parse(request, body);
        //save file
        const basePath='./catalog' + "/images/";
        const smallPath=basePath + "small/";
        const bigPath=basePath + "big/";
        const maxSize=2000000;
        let parameters, path, fileName, fileContent;
        for (const element of content) {
          if (element.get("name")=="parameters") parameters=JSON.parse(element.get("content"));
          if (element.get("type").includes("image")) {
            fileName=element.get("filename");
            fileContent=element.get("content");
          }
        }
        const actionPermited=["add my tree", "edit my props", "add myself"]; //actions are related to node safety permisions
        if (!actionPermited.includes(parameters.action)) {
          throw new Error("no upload action permited");
        }
        const {isAllowedToModify} = await import('./includes/safety.js');
        const {default: login}= await import('./includes/authorization.js');
        const user = await login(request.headers);
        if (!await isAllowedToModify(user, parameters.nodeData)) {
          throw new Error("Database safety");
        }
        path=bigPath;
        if (parameters.fileSize=="small") path=smallPath;
        fileName=path + fileName;
        fs.writeFile(fileName, fileContent, 'binary', function(err) {
          if(err) {
            response.write("false");
            response.end();
            return console.log(err);
          }
          fs.chmodSync(fileName, '777');
          response.write("true");
          response.end();
        });
        
      });
    }
    else if (filename.includes("loadallcomponents")) {
      let body = '';
      request.on('data', data => {
        body += data;
        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6)
            request.connection.destroy();
      });
      request.on('end', () => {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        import('./includes/loadallcomponents.js')
        .then(({getContent})=>{
          const data=JSON.parse(body);
          const content=getContent(data.theme_id);
          response.write(content);
        })
        .finally(()=>response.end());
      });
    }
    else if (filename.includes("dbcfg.json")) {
      return response.end();
    }
    else {
      if (filename=="/") filename='index.html';
      else filename="./" + filename;
      fs.readFile(filename, function(err, data) {
        if (err) {
          response.writeHead(404);
          return response.end();
        }
        response.writeHead(200, {'Content-Type': getMimeType(filename)});
        response.write(data);
        return response.end();
      });
    }
  }).listen(port);
}
