Javascript single and multiple inheritance
==========================================

# Abstract

Javascript doesn't support multi inheritance and so we must achieve it somehow by a function or piece of code. Also Js uses prototypes instead of classes for the object oriented programming inheritance concept, and that is as well another dificulty. In this articule we will try to clarify how to build inheritance in Js and find a way to build up multi inheritance.

# Javascript single inheritance approach

## Javascript prototyping

Compared to class based languages, in Js there is no a class neather object instance of the class but a prototype, which can be seen as an upper layer of the object. Prototypes have methods and properties available for next layers.

Any Js object has a prototype which is an object itself. And the prototype has a constructor property that is a function which is as well an object because functions in Js are also objects. So the constructor will have in turn a prototype and that prototype will be inheredited by the objects instanced through the constructor.

Lets see an example:

To build an Array object we use the following syntax:

const myArray = new Array

or

const myArray = new Array()

In this example Array is the constructor and we are using the keyword new before the constructor name to build an array object. The new object prototype is the same as the Array prototype. The new object inherits all the Array prototype properties and methods.

Any object in Js is in the end an instance of 'Object' and its prototype is the last prototype in the prototype chain.

## Inheriance in Js

According to Mario Kandut there are three ways to perform inheritance in Js:

- Fuctional
- Constructor Functions
- Class-syntax constructors


### Functional

The functional approach to create prototype chains is to use Object.create. The first Object create argument is the prototype and the second is the properties descriptor object. Let's have a look at an example. For the example code, we will use the animal and dog taxonomy, where animal is a prototype of dog.

````
const animal = {
  eat: function() {
    console.log(this.name + ' eats');
  },
};

const dog = Object.create(animal, {
  bark: {
    value: function() {
      console.log(this.name + ' woofs');
    },
  },
});

const henry = Object.create(dog, {
  name: {
    value: 'Henry',
    writable: true,
    enumerable: true
  },
});

henry.bark();
henry.eat();
````

Henry prototype is dog, dog prototype is animal and animal prototype is Object prototype, and the prototype of the Object prototype is null. We can access an object prototype by the function Object.getPrototypeOf(obj).

We can define proprties of an object using the following function:

````
Object.defineProperty(o, 'a', {
  value: 37,
  writable: true,
  enumerable: true,
  configurable: true
});
````

Default proprties attributes defined through the functions above are false, so the property value would be fixed for example and would not be used for the iterations like "for ... in" if we dont specify otherwise.

### Constructor Functions

There is also another way of inheritance with Object.crate: Constructor functions or Object create classical inheritance.

Below is an example of how to use Object.create() to achieve classical inheritance.

````
// Shape - superclass
function Shape() {
  this.x = 0;
  this.y = 0;
}

// superclass method
Shape.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  console.info('Shape moved.');
};

// Rectangle - subclass
function Rectangle() {
  Shape.call(this); // call super constructor.
}

// subclass extends superclass
Rectangle.prototype = Object.create(Shape.prototype);

//If you don't set Rectangle.prototype.constructor to Rectangle,
//it will take the prototype.constructor of Shape (parent).
//To avoid that, we set the prototype.constructor to Rectangle (child).
Rectangle.prototype.constructor = Rectangle;

var rect = new Rectangle();

console.log('Is rect an instance of Rectangle?', rect instanceof Rectangle); // true
console.log('Is rect an instance of Shape?', rect instanceof Shape); // true
rect.move(1, 1); // Outputs, 'Shape moved.'
````

At the constructor function there is a property called prototype that points to the prototype to be inheredit for the objects instanced through the constructor function. The prototype in turn contains the property constructor that points to the constructor of the prototype.


### Class-syntax constructors

The class syntax does significantly reduce boilerplate when creating a prototype chain.

Let's have a look at some code. For the example code, we will use the animal and dog taxonomy, where animal is a prototype of dog.

````
class Animal {
  constructor(name) {
    this.name = name;
  }
  eat() {
    console.log(this.name + ' eats');
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name + ' the dog');
  }
  bark() {
    console.log(this.name + ' barks');
  }
  static moveTail(pet) {
    console.log(pet.name + ' is moving its tail');
  }
}

const henry = new Dog('Henry');

henry.eat(); // prints "Henry the dog eats"
henry.bark(); // prints "Hentry the dog barks"
Dog.moveTail(henry): // prints "Henry the dog is moving its tail"
````

To describe the full prototype chain:

- The prototype of Henry is Dog.prototype
- The prototype of Dog.prototype is Animal.prototype
- The prototype of Animal.prototype is Object.prototype.

The class-syntax is the preferred way to create a prototype chain in JavaScript


# Javascript multi inheritance approach

We can achieve a certain grade of multi inheritance with the functional approach by recycling the properties descriptor objects as mixins for the composal of objects. However at functional approach we have the inconvenient that we can not use the constructor, not the super keyword neither the static methods as we do when using class-syntax.

But there is a smart class syntax solution for implementing multi inheritance in Js that is rarely seen but that covers all the inheritance elements as super class, constructor and static methods. It consists in using a function to define classes instead of the class itself, lets see an example continuing with the dog paradox:

````
const Chiwawa = ChiwawaMixin(DogMixin(Animal));

const henry = new Chiwawa('Henry');
````

The mixin funtions will be like:

````
class Animal {
  constructor(name) {
    this.name = name;
  }
  eat() {
    console.log(this.name + ' eats');
  }
}

const DogMixin = Sup => class extends Sup {
  constructor(name) {
    super(name + ' the dog');
  }
  bark() {
    console.log(this.name + ' barks');
  }
  static moveTail(pet) {
    console.log(pet.name + ' is moving its tail');
  }
}

const ChiwawaMixin = Sup => class extends Sup {
  constructor(name) {
    super('chiwawa ' + name);
  }
  jump() {
    console.log(this.name + ' jumps');
  }
}
````

So with this methodology we can build multi inheritance at the top of the class syntax procedure preserving all the inheritance elements. We would call it mixins as they are mixing classes.

Another option for a similar implementation could be through functional way:
````
class Animal {
  constructor(name) {
    this.name = name;
  }
  eat() {
    console.log(this.name + ' eats');
  }
}

const dogMixin = Sup => Object.create(Sup, {
  name: {
    value: Sup.name + ' the dog',
    writable: true,
    enumerable: true
  },
  bark: {
    value: function() {
      console.log(this.name + ' barks')
    }
  },
});

const chiwawaMixin = Sup => Object.create(Sup, {
  name: {
    value: 'chiwawa ' + Sup.name,
    writable: true,
    enumerable: true
  },
  jumps: {
    value: function() {
      console.log(this.name + ' jumps')
    }
  },
});

const chiwawaBuilder = name => chiwawaMixin(dogMixin(new Animal(name)));

const henry = chiwawaBuilder("henry");

````

This implementation is using properties definition but it can not use constructor neither static methods so easely.

# Composition

There are another strategy for reusing classes that doesn't requires inheritance, this is composition. The strategy is to have instances of the minor objects in a main object rather than extend objects with functionality. In our code we are in favor of using multi inheritance and object mixins but some composition could be useful when an object is already created. For example for the observermixin sometimes we are adding this class after the object is created. The metodology is this:

```
// Event for refreshing when log
const {observerMixin, observerMixinConstructorCallable} = await import(pathJoin('./', CLIENT_MODULES_PATH, 'observermixin.js'));
const HeadTopTextClass = observerMixin(headTopText.constructor);
Object.setPrototypeOf(headTopText, HeadTopTextClass.prototype); // adding observers characteristics
observerMixinConstructorCallable(headTopText);
```
There is a problem when trying to exec the constructor, it is not posible to exect the constructor without using new, so we have developed the solution of having the constructor function available.

Another solution could be to develop a function to compose the headTopText element with an observer object, something like this:

function compose(target) {
  const ObsClass=observerMixin(Object);
  target.observerElement= new ObsClass();
  target.reactNotice=(...args)=>target.observerElement.reactNotice(...args);
  target.setReaction=(...args)=>target.observerElement.setReaction(...args);
  target.deleteReaction=(...args)=>target.observerElement.deleteReaction(...args);
}

Esto es similar o igual al llamado strategy pattern.


# Extending an object class

Changing an object class is as easy as these:

Object.setPrototypeOf(myObject, TheNewClass.prototype)
myObject.constructor=TheNewClass

But there is still a problem: TheNewClass constructor is not applyed to the object so not any of the new class properties would be settled to the object prototype.

For solving these problem we can not use the new class constructor over the object because javascript language prevents tu use constructors as normal functions. So we have to make a workaround these way:
we can desing the class to have a init method to be used for the constructor, this way we can apply this method to the object:
class TheNewClass{
  constructor(...args){
    super(...args)
    this.init()
  }
  init(){
    this.myVar = "value" // init functionality
  }
}
TheNewClass.prototype.init.call(myObject)

When using mixins the solution is these way:

Object.setPrototpyeOf(myObject, newClassMixin(myObject.constructor).prototype)
myObject.constructor=newClassMixin(myObject.constructor)
newClassMixin(Object).prototype.init.call(myObject)

## Mixins

## Polymorphism

We call polymorphism the characteristic of a method of having diferent behavior depending of the type of object in which it is called. We can achieve it through inheritance by overriding an inherited method.

# Resources

https://www.mariokandut.com/inheritance-in-javascript-and-the-prototype-chain-explained/
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create

