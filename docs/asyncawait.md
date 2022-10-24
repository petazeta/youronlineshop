Async Await
==============

# Introduction

There are some dificulties

# It is waiting or not

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
