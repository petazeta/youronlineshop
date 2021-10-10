//To extend the class Node to NodeFront
export function extendNodeBasic(source, target, avoid) {
  Object.getOwnPropertyNames(source).forEach(mymethod => {
    if (!avoid || !avoid.includes(mymethod)) {
      target[mymethod]=source[mymethod];
    }
  });
}

//To extend the class Node to NodeFront
export default function extendNode(source, target) {
  //We add methods
  extendNodeBasic(source, target, ["length", "prototype", "name"]);
  extendNodeBasic(source.prototype, target.prototype, ["constructor"]);
}