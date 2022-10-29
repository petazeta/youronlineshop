import basicMixin from './basicmixin.mjs';
import linksMixin from './linksmixin.mjs';
import {commonMixin, linkerMixin, nodeMixin, linkerExpressMixin, nodeExpressMixin} from './linkermixin.mjs';

const BasicNode = nodeExpressMixin(nodeMixin(commonMixin(linksMixin(basicMixin(class {})))));

const BasicLinker = linkerExpressMixin(linkerMixin(commonMixin(linksMixin(basicMixin(class {})))));

export {BasicLinker, BasicNode}