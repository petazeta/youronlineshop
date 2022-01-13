// Combines mixing props and methods to an object
// By combining we are not modifying the prototype, but only the present element

function combineBasic(source, target, avoid) {
  Object.getOwnPropertyNames(source).forEach(mymethod => {
    if (!avoid || !avoid.includes(mymethod)) {
      target[mymethod]=source[mymethod];
    }
  });
}

export default function combineFromMixing(sourceMixing, target) {
  const concretClass=sourceMixing(Object);
  const concret=new concretClass();
  // We add object elements (props, methods)
  combineBasic(concret, target, ["length", "prototype", "name"]);
  // We add inheritance elements except constructor
  combineBasic(concretClass.prototype, target, ["constructor"]);
}