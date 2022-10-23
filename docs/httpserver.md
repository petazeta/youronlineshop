Node.js http server (web server)
================================

# The problem

Unless other server side languages like PHP in Node.js there is an http server that attends the http requests. Php uses apache server so when apache recieves a request and that request includes a php file. Apache server executes the php file instructions and returns the http response. But in Node we use the build in http module which is in charge of attending the http requests. That means that there is allways some explicit Js code to perform this procedure.

In this text we will see how we can achive the http server procedure looking at some examples and techniques.

# The solution

A part from the build in modules there is a popular external module named express. This module extends some of the http module elements and also has its own approach for the http server. We will cover here the build in modules case and briefly the express module.

The http module can create an http server that listens to server ports and gives a response back to the client.

Use the createServer() method to create an http server:

```
import http from 'http';
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('Hello World!');
  res.end();
}).listen(8080);
```

In the examples we are using the ES6 notation for modules import which sometimes need some extra requirements so you should be noticed of it.

http.createServer creates the server and we should pass it a function with two arguments: the request and the response. From the request we can take the information from each client request and at the response we will send the data. Request and response are also instances of stream (revisar esto) that means that can be managed for sending / recieving data this way. For serving web pages we need to send as well the right content type header. We are also indicating the port at which the server is listening. The standard http port for web pages is 80 and for secure http is 440, that means that if we are using port 80 the address would be just http://localhost/ but in our case the server address would be http://localhost:8080/.

Now that we know the basics about serving pages in Node we are going to stablish a strategy in order to receive and send responses to client requests.

Other http servers like apache and maybe enginx serve pages based in the files path but also can follow some other rules that must be stabilsh for urls. In Node there is no default strategy and we are free to follow any strategy. This makes the Node option more flexible and complet so we could build a reverse proxy, load balancer etc... directly in our application.

## The switch strategy (routing)

So as for any web server the server response would depend on the client request. Therefore our answer would depend on the request and this usually corresponds with a switch that would connect the response with the appropiate functionality.
```
             |=>function A
[request] => |=>function B
             |=>function C
```
To implement this methodology (also known as routing) we can use a Map element to set a list of the functionality. To determine which functionality use in each case we should also have some selection component. We can also integrate the selection procedure inside the funcionality so when that functionallity is not the apropiate for a specific request we can break and pass to the next option and so on untill we will find the suitable one (or we consume every option). This way we don't need an extra element in our main file. Lets see an example:

```
import http from 'http';
import url from 'url'; 

const routerMap=new Map();

function router(request, response) {
  Array.from(routerMap.values()).some(myFunc=>myFunc(request, response));
}

http.createServer(function (request, response) {
  router(request, response);
}).listen(8080);

routerMap.set('blog', (request, response)=>{
  const filePath = url.parse(request.url, true).pathname;
  if (!filePath.match(new RegExp("^/blog/?$"))) return false; // matching /blog or /blog/
  import('./includes/blog.js')
    .then(({sendContent}) => sendContent(request, response));
  return true;
});

routerMap.set('contact', (request, response)=>{
  let filePath = url.parse(request.url, true).pathname;
  if (!filePath.match(new RegExp("^/contact/?$"))) return false;
  import('./includes/contact.js')
    .then(({sendContent}) => sendContent(request, response));
  return true;
});
```

In the script we define a map and the elements in map will be functions that are checking if request should be answered or not for that component. When the condition of the request fulfil the map function case the suitable response is given by importing the subsequent module. In the example we are just checking the url path, but any request element (like parameters or host name) are suitable for the selection process.

Just after creating the server we are calling the main function (router) that is fixed and doesn't depend on the map elements. With this implementation we have therefore the adventage of the open-closed principle, so we can add more funcionalities just adding more code and we don't need to modify the existing one.


# Resources:

https://www.w3schools.com/nodejs/nodejs_http.asp



