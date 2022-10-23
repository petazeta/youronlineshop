import http from 'http';
import app from './index.mjs';

const serverPort='8000';

http.createServer(app).listen(serverPort, ()=>console.log("app running at port: ",  serverPort));
