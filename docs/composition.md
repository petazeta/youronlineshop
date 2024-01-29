Object composition
==================

Object composition is just a really basic concept of Object Oriented Programming. It just states that we can use references of some objets in some other object properties.

We are using this technique masively in the software because it is based in nodes that contains child nodes forming a node tree.

## Inheritance through object composition

We can use composition as a way of building inheritance. In this case we create the ascendant element when constructing asinging it to some object property. We must explicity define the ascendant methods we want to use in the descendent class. We will replace the super keyword with the property containing the ascendant element.

class Dog{
  constructor(name) {
    this.name = name
    this.mammal = new Mammal(name)
  }
  giveBirth() {
    return this.mammal.giveBirth()
  }
}

## Inheritance versus composition

Concernig to what some people say about that is preferable using composition (decorator) over inheritance I dont agree because any decorator can be done using inheritance (prefarable multi-inheritance) in a simpler way. I would use composition only sometimes when the inheritance line is not clear and the functionalities are not related therefore we would mantain more coherence in the object structure.

## Decorator pattern

This patter is similar to the above one but the different is that we encapsulate some already created objet. The purpose is to set some object functionality without modifying it.

class SpeakingDog{
  constructor(someDog) {
    this.dog=someDog
  }
  // Optional: we can set decorator method or use decorated object directly
  giveBirth() {
    return this.dog.giveBirth()
  }
  speak() {
    return "hello my name is " + this.dog.name
  }
}

## Strategy pattern

This patter is very similar to decorator but this time the purpose is not to extend an object functionality but to set some funtionality as the one from other object.

class Mammal{
  constructor(someAnimal) {
    this.animal=someAnimal
  }
  giveBirth() {
    return this.animal.giveBirth()
  }
}

## For more Composing techniques

Check Eric Elliott Composing software