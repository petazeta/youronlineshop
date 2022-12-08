import {Node as ProtoNode, Linker as ProtoLinker} from '../../server/nodes.mjs';
import dbGateway, {initDb} from './dbgatewayserver.mjs';

export class Node extends ProtoNode{}
export class Linker extends ProtoLinker{}

Node.linkerConstructor=Linker;
Node.dbGateway=dbGateway;

Linker.nodeConstructor=Node;
Linker.dbGateway=dbGateway;

export function nodeFromDataSource(dataSource){
  const myClon= Node.detectLinker(dataSource) ? new Linker() : new Node();
  return myClon.load(dataSource);
}