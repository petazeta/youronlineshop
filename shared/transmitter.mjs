
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
export const transmitterMixin=Sup => class extends Sup {
  constructor(){
    super()
    this._outChannels=new Set()
  }
  openChannel(){
    const myChannel=new Channel()
    this._outChannels.add(myChannel)
    return myChannel
  }
  sendNotice(channel, notice, value){
    if (channel.isClose) {
      this._outChannels.delete(channel)
    }
    else channel.put({notice, value})
  }
  broadcast(notice, value) {
    this._outChannels
    .forEach(channel=>this.sendNotice(channel, notice, value))
  }
}

export const receiverMixin=Sup => class extends Sup {
  constructor(){
    super()
    this._inChannels=new Set()
  }
  listenTo(transmitter, notice, listener){
    const myChannel=transmitter.openChannel()
    this.listenChannel(myChannel, notice, listener)
    return myChannel
  }
  async listenChannel(channel, notice, listener){
    if (this._inChannels.has(channel)) return
    this._inChannels.add(channel)
    for await (const data of channel.take()) {
      if (data.notice==notice) listener(data.value)
    }
  }
  closeChannel(channel){
    channel.close()
    this._inChannels.delete(channel)
  }
  closeAllChannels(){
    this._inChannels
    .forEach(channel=>this.closeChannel(channel))
  }
}

/* usecase
const Transmitter=transmitterMixin(Object)
const Receiver=receiverMixin(Object)

let myTransmitter=new Transmitter()
let myReceiver = new Receiver()
myReceiver.listenTo(myTransmitter, "hola", (value)=>console.log("value received", value))
myTransmitter.broadcast("hola", 1) // transmitimos 1 -> recibimos 1
setTimeout(()=>{myTransmitter.broadcast("hola", 2); myReceiver.closeAllChannels()}, 100) // transmitimos 2 recibimos 2, cerramos comunicación
setTimeout(()=>{console.log(myReceiver._inChannels.size, myTransmitter._outChannels.size); myTransmitter.broadcast("hola", 3)}, 200) // Transmitimos 3 pero no recibimos al estar cerrada la comunicación
setTimeout(()=>console.log(myReceiver._inChannels.size, myTransmitter._outChannels.size), 300) // El transmisor al detectar la comunicación cerrada ha eliminado el canal
*/



