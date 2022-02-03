import http from 'http';
import app from './server/index.js';

const serverPort='8000';
console.log("app running at port: ",  serverPort);

http.createServer(app).listen(serverPort);
