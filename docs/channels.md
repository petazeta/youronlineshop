Channels
=============

## Implementation
```
export const channelMixin=Sup => class extends Sup {
  constructor(){
  	super()
    this.isClose=false
    function *chanGen(thisChannel){
      while(!thisChannel.isClose) {
      	let iter=new Promise((resolve, rej)=>{
      	  thisChannel.put=(value)=>{resolve(value)}
      	  thisChannel.cancel=(value)=>reject(value)
      	})
        yield iter
      }
    }
    this.channelIter=chanGen(this)
  }
  take(){ return this.channelIter}
  close(){ this.isClose=true }
}
const Channel=channelMixin(Object)
let myChannel=new Channel()

async function listening() {
	for await (const data of myChannel.take()) {
		console.log("data receiving", data)
	}
}
listening()
console.log("start sending hola")
myChannel.put("hola")
setTimeout(()=>myChannel.put("hola de nuevo"), 100)
setTimeout(()=>myChannel.put("hola otra vez"), 200)
```