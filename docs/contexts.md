Contexts
========

## The inherent multi-task feature of the asynchronous model

The program is inherent multi task because it uses the asynchronous model. A main function (application entry-point) instance is launched for every request no matter other previous requests have been responded yet (1). The consequent concurrency situtation requires some restrictions for the requests not to have a mutated state in the program that could produce misfunctionality. The program could be interrupted any time an await cluase is happening and other requests could enter the program at that time.

There is two consecuencies of it when designing a program that works concurrently.

- If the concurrent requests run instances of the same application the state data can not mutate in a way that wuold produce misfuncionality.
- If they "run" different applications the state data has to be atomic (belong to the application), this is, can not be shared.

_Note1_: This is how Nodejs deal with concurrency. Every time there is an await clause the program control comes back to the event loop for processing new requests.

## Concurrency in the same application

We need the state data not to mutate: being deleted or modified. If data is added chances are less of a collision with the previous data but maybe two additions at the same time could corrupt data. The problem is that a previous request is expecting some data and the data mutates due another request entrance meanwhile an await statement. This is a similar situation as the race condition but with the adventange that only the asynchronous calls could produce a change in the execution stack.

Some state data is located at request var, and it is atomic for every request because is an argument of the program main function.

The rest of the state data is located at some objects inside modules at context__main folder. This data can be:
- Layouts content (could grow on requests, but usually is fixed)
- Configuration data (it doesn't change)
- Database connection (it doesn't change)
- Logs content (could grow)

Other data present in files or in database could cause problems when modified, for example, if previous data records where fetched.

### How to prevent concurrency problem

One best measure is that data should not change once loaded. For loading data we may prevent not to open request availability before server has completly initiated and populated. Logs could produce some corrupt data but that is not important. Database could produce collisions but we are expecting user not to change the same data concurrently and if data is changed during users browsing the page, there would be of course some lagging content problems and other errros, so we should pay atention or look for a solution: maybe produce some blocking while data is being changed.

## Concurrency in different applications at the same time

There could be situations where we would like to run two or more applications at the same time in the same run enviroment and sharing some elements between them. We can make it posible by splitting up the aplications that contain context elements (state data) from the ones which can work without a context. This way we could share the uncontext elements between applications and make the contexts ones to be atomic for each application.

In our case we have already isolated the application context that has been discribed above. We will come back to this subject later.

So the situation is this: We may want to run serveral shops in the same application at different ports. Or we may want to run other applications like plug-ins or whatever within the same Nodejs instance.

This will require some encapsulation (or lock mechanism) for each main function (application entry-point) instance. For doing so, one way is to replicate the contexted modules once for each call instance. The mechanism is as described below.

## Prebound method modules pattern

For doing so we have to use different contexts. Our strategy is two use contexted modules through prebound methods pattern. It consists in launching each application instance as a module. Each application instance would have its own entrance module and also will own every module that is having a context (a state). Modules that have no context can be shared and doesn't need to be replicated for each application module instance.

We will save the contexted modules files related to a specific context inside the same folder. This way there would be one folder for each context. We are using the folder name "main" for main context.

The Prebound method modules pattern can be used for splitting a class from the context that is used when instantiated. This way we can use the class definition as a shared element for every application instance.

The technique produces a class definition in one module and an interface of a class instance in another module. For each context there would be an interface module. This way the interface module would belong to the application context that is not shared between applications but the class definition can be a shared element.

## Preloaded context funcionalities

When an external context functionality is used in a module we can send it as a parameter to the method or function of the module. The method or function get some context functionalities like arguments in the generic version and in the contexted version it has this arguments implicits.

## Contexted extended class

When we use several instances of the same class (for example the Node class) in one application then we can not use an interface like in prebound patterns. In this case we can use a extended version of the class with implicit arguments for the contexted elements it uses.

## How we use contexts

We are using contexts at server for launching several instances of the application and share modules between them. And we are developing the contexts in client to be able to execute plugins.

client/context__main/viewcomponent.mjs sets the templates scripts execution enviroment variable "thisAppFolder" by getting it from the current module address.

## Propuesta

// Se podria hacer mejor automatizando los contextos para que no hubiera que copiarlos manualmente para cada una de las instancias
// para ello crearíamos algo así como un nuevo servicio para los contextos. Se podrían crear contextos
// mediante clases. Quizá una clase contexto que realizara las operaciones que realizan individualmente los
// modulos en el contexto, quizá el modulo contexto podría tener una funcion la cual sirviera de ayuda para añadir el contexto
// al modulo de contextos, añadiendo las funcoines que forman parte del interface
// el módulo main importaría la clase contexto, crearía un contexto por instancia
// quiza se podrian añadir los métodos al contexto al inicio o se podría hacer bajo demanda