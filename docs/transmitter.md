Transmitter
===========

## Funcionamiento

Patron similar a observer
Transmitter ofrece mejores características al introducir el elemento canal. Ofrece así una mayor claridad, un mejor interface
y una mayor fiabilidad.

El canal crea un iterator de promesas que se resuelven cuando se ejecuta el método myChannel.put, es decir cuando se introduce un nuevo dato al canal el cual resuelve la promesa actual con el dato introducido y genera una nueva promesa a la espera de un nuevo dato
A este iterator se accede con el método myChannel.take
En el lado del receptor se realizarían estas operaciones:
Se solicita la apertura del canal al transmisor: transmitter.openChannel, operacion que devuelve el canal
Se comienza la escucha receiver.listenChannel(theChannel, noticeTag, listener)
Nota: Hay un shortcut para estas dos operaciones con receiver.listenTo(transmiter, noticeTag, listener)
En el lado del transmisor se manda un dato: a un canal -> transmitter.sendNotice(channel, noticeTag, data) a todos los canales: broadcast
Cuando el receptor quiere cerrar el cannal se usa el método: closeChannel, closeAllChannels
Esto último se ha de realizar cuando el receptor deja de ser operativo. El receptor no podra pasar a ser eliminado de la memoria por el colector
de basura si no se cierra el canal, ya que el método "receptor.listenChannel" permanece activo mientras el iterator continue y éste termina al con la operación de cierre del canal.

## Notas implementación

Esta implementación es simple pero creo que válida para el caso más utilizado para las notificaciones, algo como:
El notificador es un elemento que permanece durante todo el tiempo del programa y no necesita cerrar canales
El receptor puede desaparecer pero durante su existencia nunca deja de escuchar una notificación en concreto aunque puede terminarlas todas cuando sea necesario, lo cual debería hacerse antes ser eliminado.
Una implementación más flexible que permitiera al receptor dejar de escuchar una notificación específica y al transmisor cerrar un canal podría realizarse a través del uso de Map en lugar de Set

## Casos de uso

Para el patron observer de forma similar a éste.

También se puede utilizar un transmisor como bus de señales:
```
// modulo independiente
const signals = new Transmitter()
// lado emisor
import signals
signals.broadcast("hola", {emiter: emitterNode, data: {..}})
// lado receptor
import signals
const myReceiver = new Receiver()
myReceiver.listenTo(signals, "hola", (value)=>console.log("value received", value))
```
