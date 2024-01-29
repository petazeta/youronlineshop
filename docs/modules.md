# Modularity

# Prebound methods pattern

This is the general pattern that we used to use at every module.

https://python-patterns.guide/python/prebound-methods/

## The problem with state in server modules

I have called state modules, to that modules that has a status, that is, they holds memory or vars with data. Some modules data can be initiated once and reuse it or the data can be modified durent the program execution. When using these programing elements then we should care about what happens if there are two request that can have concurrency, that is, that intefare in the same data. In that case we may use syncronous processes for avoiding unexpected results. But also sometimes we expect to process requests in order because the order has some imporance. In such a case asyncrinous requests could produce not to process the requests in order. This is an odd subject that asyncronicity would lead us.

It could be useful to ignite the program and have some data saved for the hole process. Some data could be: some cache things.

To show this we are gonna create a module with vars inside, and see how this values are in different requests.

```
import http from 'http';

http.createServer(function (request, response) {
  import('./statemodule.mjs')
    .then(({sendContent}) => sendContent(request, response));
}).listen(8080);
```

```
let value=1;

export async function sendContent(request, response){
  value++;
  console.log("Start: ", value);
  let awaitFunc= () => new Promise(resolve => setTimeout(()=>{console.log("End await: ", value);resolve();}, 5000));
  await awaitFunc();
  return;
}
```


// Result:
Start:  2
Start:  3
End await:  3
End await:  3

By sending two requests in a row we can see that the action process doesnit wait from the first process to be done and the sencond process is starting before the previous one has finished.

# Solution: server interface for modules

The "server" middleware or interface of a module is another module which porpouse is to be an interface of the module. It can deliver a new instance of the module class object when changes in the object can be made during the request processing. This way other requests processing opeartions doesn't interfere in previous ones.

# The modules executes once.

Modules commands are executed when loading first time. For executing code pieces we need to do it by functions.

La opción para el caso multisite podría ser que los módules contivieran clases, de esa manera se reutilizaría un código sin datos. También para seguir aprovechamiento la reutilización de datos, se podría crear algo así como una caché, que mantuviera ciertos datos para cada sitio, de esa manera se obendrían los datos rapidamente sin necesidad de volver a generarlos cada vez.