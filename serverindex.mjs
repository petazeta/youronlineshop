import http from 'http';
// import app from './server/index.mjs';

let defaultInstance='./server_instances/main/main.mjs';
let defaultPort='6000';
let instances=[];

for (let i=2; i<process.argv.length; i++) {
  if (process.argv[i]?.match(/^default-port=/)) {
  	defaultPort=process.argv[i].match(/^default-port=(\d+)/)[1];
  }
  if (process.argv[i]?.match(/^instances=/)) {
  	instances=process.argv[i].match(/^instances=(.+)/)[1].split(',');
  }
}
if (!instances.length) instances.push(defaultInstance + ':' + defaultPort);
for (const instance of instances) {
  const [myInstance, myPort]=instance.split(':');
  const {default: app} = await import(myInstance);
  http.createServer(app).listen(myPort, ()=>console.log(myInstance + " running at port: ",  myPort));
}