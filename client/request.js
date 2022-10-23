import {DataNode, LinkerNode} from './nodes.js';
import {detectLinker} from './../shared/linkermixin.mjs';
import {packing, unpacking} from './../shared/utils.mjs';

const reduceExtraParents = (params)=>{
  if (params.extraParents) {
    if (!Array.isArray(params.extraParents)) params.extraParents=[params.extraParents];
    params.extraParents=params.extraParents.map(eParent=>{
      if (eParent instanceof LinkerNode) { // por que hace esta comprobación??
        return packing(eParent.clone(1, 0, null, "id"));
      }
      return eParent;
    });
  }
  return params;
};

const reqReduc = new Map();
const reqLoaders = new Map();
const reqMethods = new Map();

reqReduc.set("get my root", myNode=>packing(myNode.clone(0, 0)));
reqLoaders.set("get my root", (myNode, result)=>{
  myNode.children=[];
  if (result!=null) myNode.addChild(new DataNode().load(result));
});
reqReduc.set("get my childtablekeys", reqReduc.get("get my root"));
reqReduc.set("get my relationships", myNode=>packing(myNode.clone(1, 0, "id")));
reqLoaders.set("get my relationships", (myNode, result)=>{
  myNode.relationships=[];
  result.forEach(rel=>myNode.addRelationship(new LinkerNode().load(rel)));
});
reqReduc.set("get my children", [myNode=>packing(myNode.clone(1, 0, "id")), reduceExtraParents]);
reqLoaders.set("get my children", (myNode, result)=>{
  myNode.children=[];
  result.data.forEach(child=>myNode.addChild(new DataNode().load(child)));
  myNode.props.total=result.total;
});
reqReduc.set("get all my children", reqReduc.get("get my root"));
reqLoaders.set("get all my children", reqLoaders.get("get my children"));
reqReduc.set("get my tree", [myNode=>packing(myNode.clone(1, 0, "id")), reduceExtraParents]);
reqLoaders.set("get my tree", (myNode, result, params)=>{
  if (detectLinker(myNode)) {
    myNode.children=[];
    if (result.total==0) return;
    const myResult=unpacking(result.data);
    for (const child of myResult.children) {
      myNode.addChild(new DataNode().load(child));
    }
    myNode.props.total=result.total;
    return;
  }
  if (params && params.myself) {
    myNode.load(unpacking(result));
    return;
  }
  myNode.relationships=[];
  const myResult=unpacking(result);
  for (const rel of myResult.relationships) {
    myNode.addRelationship(new LinkerNode().load(rel));
  }
});
reqReduc.set("get my ascendent", myNode=>packing(myNode.clone(1, 1, "id")));
reqReduc.set("get my tree up", reqReduc.get("get my ascendent"));
reqLoaders.set("get my tree up", (myNode, result)=>{
  if (!result) return result;
  if (detectLinker(myNode)) {
    myNode.partner=new DataNode().load(unpacking(result));
    myNode.partner.addRelationship(this);
    return;
  }
  if (Array.isArray(result)) {
    myNode.parent=[];
    for (let i=0; i<result.length; i++) {
      myNode.parent[i]=new LinkerNode().load(unpacking(result[i]));
      myNode.parent[i].addChild(this);
    }
    return;
  }
  myNode.parent=new LinkerNode().load(unpacking(result));
  myNode.parent.addChild(this);
});
reqLoaders.set("get themes tree", (myNode, result)=>myNode.load(unpacking(result)));

reqReduc.set("add my link", [ myNode=>packing(myNode.clone(3, 0, null, 'id')), reduceExtraParents]); //we are keeping the props cause we need the sort_order positioning prop
reqMethods.set("add my link", params=>"put");
reqReduc.set("add myself", [myNode=>packing(myNode.clone(3, 0, null, 'id')), reduceExtraParents]);
reqLoaders.set("add myself", (myNode, result)=>{
  myNode.props.id=result;
});
reqMethods.set("add myself", params=>"put");
reqReduc.set("add my children", [myNode=>packing(myNode.clone(2, 1, 'id', 'id')), reduceExtraParents]); // we need the partner (and partner->parent for safety check)
reqLoaders.set("add my children", (myNode, result)=>{
  for (const i in result) {
    myNode.children[i].props.id=result[i];
  }
});
reqMethods.set("add my children", params=>"put");
reqReduc.set("add my tree", [myNode=>{
  if (detectLinker(myNode)) return packing(myNode.clone(2, null, null, 'id'));
  else return packing(myNode.clone(3, null, null, 'id'));
},  reduceExtraParents]); // we need the parent->partner (and parent->partner->parent for safety check)
reqMethods.set("add my tree", params=>"put");
reqLoaders.set("add my tree", (myNode, result)=>{
  if (!result) return;
  const resultNode=unpacking(result);
  if (!detectLinker(myNode)) {
    myNode.props.id=resultNode.props.id;
  }
  myNode.loadDesc(resultNode);
});
reqReduc.set("add my tree table content", reqReduc.get("add my tree"));
reqMethods.set("add my tree table content", params=>"put");
reqLoaders.set("add my tree table content", reqLoaders.get("add my tree"));
reqReduc.set("edit my sort_order", myNode=>packing(myNode.clone(3, 0, "id", "id"))); // we need the parent->partner (and parent->partner->parent for safety check)
reqMethods.set("edit my sort_order", params=>"put");
reqReduc.set("edit my props", myNode=>packing(myNode.clone(2, 0, null, "id")));
reqMethods.set("edit my props", params=>"put");

reqReduc.set("delete my link", reqReduc.get("edit my sort_order"));
reqMethods.set("delete my link", params=>"put");

reqReduc.set("delete my children", reqReduc.get("add my children"));
reqMethods.set("delete my children", myNode=>"delete");
reqReduc.set("delete my tree", reqReduc.get("edit my props")); // we need the partner for update siblings position
reqMethods.set("delete my tree", myNode=>"delete");
reqReduc.set("delete my tree table content", reqReduc.get("delete my tree"));
reqMethods.set("delete my tree table content", myNode=>"delete");
reqReduc.set("delete myself", reqReduc.get("delete my tree"));
reqMethods.set("delete myself", myNode=>"delete");

reqReduc.set("default", myNode=>packing(myNode.clone()));
reqLoaders.set("default", (myNode, result)=>myNode.load(result));
reqMethods.set("default", myNode=>"post");

export {reqReduc, reqLoaders, reqMethods};