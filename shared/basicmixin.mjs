// Basic node props operations: set props, load other element props.

// A node has props, that is an object for key value pairs

const basicMixin=Sup => class extends Sup {
  // parent is unique while children is a list element
  constructor(props) {
    super(props);
    this.props = {};
    if (props) Object.assign(this.props, props);
  }

  // thisProps: If not missed defines which props to load
  load(source, thisProps) {
    return copyProps(this, source, thisProps);
  }
  static equivalent(nodeOne, nodeTwo){
    if (Object.keys(nodeOne.props).length != Object.keys(nodeTwo.props).length) return false;
    if (!Object.keys(nodeOne.props).every(key=> key in nodeTwo.props)) return false;
    return Object.keys(nodeOne.props).every(key=> nodeOne[key]==nodeTwo[key]);
  }
  equivalentTo(otherNode) {
    return this.constructor.equivalent(this, otherNode);
  }
}

export default basicMixin;

export function copyProps(target, source, thisProps) {
  if (!source) return target;
  if (thisProps) {
    if (!Array.isArray(thisProps)) thisProps=[thisProps]; // single type
    thisProps.filter(key=>Object.keys(source.props).includes(key)).forEach(key=>target.props[key] = source.props[key]);
    return target;
  }
  Object.assign(target.props, source.props);
  return target;
}

/*
cambios con respecto al código antiguo:
*/