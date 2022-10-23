Javascript observer pattern implementation
==========================================

# About

This is about the implementation of the observer pattern in Javascript. We will write the implementation in a module file and will explain it. We will also write some javascript examples with the porpouse of check the correct implementation performance. We are writing it in the context of a web app.

# Observer pattern

Observer pattern is a method for making some elements to respond simustaneously to some events. There is another option for the same thing that is called event handler. Event handler moethod consists in attachiung the responses to the events. In observer pattern, events are notices that can be produced by some elements. So the difference is that in the observer pattern there is a context related to the elements that produces the notices which is not present at the event handler approach.

# Implementation

The implementation of this pattern is contained in observermixin file.
Observer mixin is a mixin that can be used as usual mixins to get the observer class:
const ObserverNodeClass = observerMixin(class {});

# Testing

This script is usually used in front end enviroments. Therefore the best way for testing would be to use it as a script inserted inside an html file. For testing it this way we would need a server enviroment because open it directly from the browser would cause a the cors policy error. We will use for this porpouse the server script.

This is the test script that we attach to the html file:

```
import {observerMixin, observableMixin, replaceObserver, removeObserver} from './client/modules/observermixin.js';

const ObserverNodeClass = observerMixin(class {});
const ObservableNodeClass = observableMixin(class {});

const observerNodeA = new ObserverNodeClass;
const observerNodeB = new ObserverNodeClass;
const observableNode = new ObservableNodeClass;

observableNode.attachObserver("edition", observerNodeA);
observableNode.attachObserver("edition", observerNodeB);

observerNodeA.setReaction("edition", ()=>console.log("node edition A"));
observerNodeB.setReaction("edition", ()=>console.log("node edition B"));

observableNode.notifyObservers("edition");
replaceObserver(observerNodeA, observerNodeB);
observableNode.notifyObservers("edition");
observableNode.dettachObserver("edition", observerNodeB);
observableNode.notifyObservers("edition");
removeObserver(observerNodeB);
observableNode.notifyObservers("edition");
```

If we run the script we would see the suitable results fot the case.