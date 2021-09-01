import EventListener from './modules/eventlisteners.js';
import {NodeBase, NodeFemaleBase, NodeMaleBase} from './nodebase.js';
import {NodeFront, NodeFemaleFront, NodeMaleFront} from './nodesfront.js';

class Node extends EventListener(NodeFront(NodeBase)) {};
class NodeFemale extends EventListener(NodeFemaleFront(NodeFemaleBase)) {};
class NodeMale extends EventListener(NodeMaleFront(NodeMaleBase)) {};
export {Node, NodeFemale, NodeMale};