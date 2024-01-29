Async Await
==============

# Introduction

Asynchronicity is a critical concern for event driven applications like ours. The asynchornous mechanism behavior is not clear if we don't understand how is managed by node.js

## Todo son eventos

Cuando usamos asincronicidad mediante async/await, promises o callbacks estamos usando elementos que funcionan en respuesta a eventos. Cuando hacemos un callback es en muchos casos evidente que un cierto evento activa esa función. Cuando hacemos una promesa tambien. Cuando hacemos un await no es tan claro porque parece que el programa se queda bloqueado esperando la respuesta pero normalmente el bloqueo se realiza dentro de una función que en el caso del servidor es un callback, ya que es respuesta a un request del servidor. Por tanto otro request que llega es independiente y se puede atender. En el momento que la espera termina se transfiere el control al elemento correspondiente.

## stream.read setream.write

En un servidor http tenemos los métodos read y write en request/respond. Estos métodos pertenecen a stream y no son bloqueantes. respond.write devuelve false si no se han podido enviar todos los valores. Se le puede enviar un callback para cuando los escriba pero no bloquea, es como una promesa.

## When to use async/promises

An application as a web server is event driven. When a request comes it is inmediatelly scheduled for whenever there is a halting operation like await. If we dont use await and use synchronous functions the next request can't be processed until the whole previous one is responded. We don't want the request to await so much time so we should be careful to not access files system or databases in a synchronous way to not block other threads (requests) execution. Such operations should be executed using promises or asynchronous functions which don't halt the event loop and other threads can continue while waiting for those operations to complete.

## When it is waiting or and when not

Whenever a callback or not awaited promise is launched as new independent thread is runned. The original thread is splitting and whenever we are awiating the original thread or not, doesn't affect the new thread. Lets see with examples.

There is some situations that could couse confusion. One is that about awaint an asyncronous funcion that execute a promise (or asyncronous function) inside that is not being awaited.

For example in the following script we are awaiting a function that executes a not awaited element.

let awaitFunc= () => new Promise(resolve => setTimeout(()=>{console.log("end await");resolve();}, 5000));

let upperFunc = async ()=>{
	await awaitFunc();
	awaitFunc();
	return "upper function return";
}
console.log("begin upper");
await upperFunc().then((res)=>console.log(res));
console.log("end upper");


// Result:

begin upper
end await
upper function return
end upper
undefined
end await


The result shows that if we excute a not awaited promise inside to an awaited function, the promise is not awaited.

This situation will cause a non awaited case:

let awaitFunc= () => new Promise(resolve => setTimeout(()=>{console.log("end await");resolve();}, 5000));

let upperFunc = ()=>{
	awaitFunc();
}
console.log("begin upper");
await upperFunc();
console.log("end upper");

For the awaited to be perform we must change it in this way:
let upperFunc = ()=>{
	return awaitFunc();
}

we can not make a map, foreEach, etc... function with await [1,2].map(async ()=>2) // [Promise, Promise]