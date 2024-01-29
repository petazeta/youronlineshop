// we create the tree
import {Node, Linker} from './nodes.mjs';
import fs from 'fs';
import {join as pathJoin} from 'path';
import {unpacking, arrayUnpacking} from '../../../shared/utils.mjs';
import dbConfig from './cfg/dbmainserver.mjs';

import {getMainBranchDataNodes, arrayFromTree} from '../../../shared/utils.mjs'

const data=JSON.parse(fs.readFileSync(pathJoin('../../../', dbConfig.importPath, 'mongodb_dtbs.json'), 'utf8'));
const langsRoot=new Node().load(unpacking(data.languages));
const langs=langsRoot.getRelationship();

const newLangs=langs.children;
const usersMo=new Linker().load(unpacking(data.tree.shift()));
const dataTrees=[]
while(data.tree.length) {
  dataTrees.push(Node.clone(unpacking(data.tree.shift())));
}
for (const dataTree of dataTrees) {
	//console.log(dataTree.props)
}

console.log(dataTrees[1].arrayFromTree().length)
console.log(arrayFromTree(dataTrees[1]).length)