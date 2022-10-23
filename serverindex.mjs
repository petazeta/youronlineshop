import http from 'http';
import app from './server/index.mjs';

const serverPort='3000';

http.createServer(app).listen(serverPort, ()=>console.log("app running at port: ",  serverPort));
