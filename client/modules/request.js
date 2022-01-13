import {NodeMale, NodeFemale} from './nodesfront.js';
import {packing, unpacking, detectGender} from './../../shared/modules/utils.js';

const reduceExtraParents = (params)=>{
  if (params.extraParents) {
    if (!Array.isArray(params.extraParents)) params.extraParents=[params.extraParents];
    params.extraParents=params.extraParents.map(eParent=>{
      if (eParent instanceof NodeFemale) {
        return packing(eParent.cloneNode(1, 0, "id", "id"));
      }
      return eParent;
    });
  }
  return params;
};

const reqReduc = new Map();
const reqLoaders = new Map();

reqReduc.set("get my root", myNode=>packing(myNode.cloneNode(0, 0)));
reqLoaders.set("get my root", (myNode, result)=>{
  myNode.children=[];
  if (result!==false) myNode.addChild(new NodeMale().load(result));
});
reqReduc.set("get my childtablekeys", reqReduc.get("get my root"));
reqReduc.set("get my relationships", myNode=>packing(myNode.cloneNode(1, 0, "id", "id")));
reqLoaders.set("get my relationships", (myNode, result)=>{
  myNode.relationships=[];
  result.forEach(rel=>myNode.addRelationship(new NodeFemale().load(rel)));
});
reqReduc.set("get my children", [reqReduc.get("get my relationships"), reduceExtraParents]);
reqLoaders.set("get my children", (myNode, result)=>{
  myNode.children=[];
  result.data.forEach(child=>myNode.addChild(new NodeMale().load(child)));
  myNode.props.total=result.total;
});
reqReduc.set("get all my children", reqReduc.get("get my root"));
reqLoaders.set("get all my children", reqLoaders.get("get my children"));
reqReduc.set("get my tree", [reqReduc.get("get my relationships"), reduceExtraParents]);
reqLoaders.set("get my tree", (myNode, result, params)=>{
  if (myNode.detectMyGender()=="female") {
    myNode.children=[];
    if (result.total==0) return;
    const myResult=unpacking(result.data);
    for (const child of myResult.children) {
      myNode.addChild(new NodeMale().load(child));
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
    myNode.addRelationship(new NodeFemale().load(rel));
  }
});
reqReduc.set("edit my sort_order", myNode=>packing(myNode.cloneNode(3, 0, "id", "id"))); // we need the parent->partner (and parent->partner->parent for safety check)
reqReduc.set("delete my link", reqReduc.get("edit my sort_order"));
reqReduc.set("add my link", [ myNode=>packing(myNode.cloneNode(3, 0, null, "id")), reduceExtraParents]); //we are keeping the props cause we need the sort_order positioning prop
reqReduc.set("add myself", [myNode=>packing(myNode.cloneNode(3, 0, null, "id")), reduceExtraParents]);
reqLoaders.set("add myself", (myNode, result)=>{
  myNode.props.id=result;
});
reqReduc.set("add my children", [myNode=>packing(myNode.cloneNode(2, 1, "id", "id")), reduceExtraParents]); // we need the partner (and partner->parent for safety check)
reqLoaders.set("add my children", (myNode, result)=>{
  for (const i in result) {
    myNode.children[i].props.id=result[i];
  }
});
reqReduc.set("delete my children", reqReduc.get("add my children"));
reqReduc.set("delete my tree", myNode=>packing(myNode.cloneNode(2, 0, null, "id"))); // we need the partner for update siblings position
reqReduc.set("delete myself", reqReduc.get("delete my tree"));
reqReduc.set("edit my props", reqReduc.get("delete my tree"));
reqReduc.set("get my parent", myNode=>packing(myNode.cloneNode(1, 1, "id")));
reqReduc.set("get my tree up", reqReduc.get("get my parent"));
reqLoaders.set("get my tree up", (myNode, result)=>{
  if (!result) return result;
  if (myNode.detectMyGender()=="female") {
    myNode.partnerNode=new NodeMale().load(unpacking(result));
    myNode.partnerNode.addRelationship(this);
    return;
  }
  if (Array.isArray(result)) {
    myNode.parentNode=[];
    for (let i=0; i<result.length; i++) {
      myNode.parentNode[i]=new NodeFemale().load(unpacking(result[i]));
      myNode.parentNode[i].addChild(this);
    }
    return;
  }
  myNode.parentNode=new NodeFemale().load(unpacking(result));
  myNode.parentNode.addChild(this);
});
reqReduc.set("add my tree", [myNode=>{
  if (myNode.detectMyGender()=="female") return packing(myNode.cloneNode(2, null, null, "id"));
  else return packing(myNode.cloneNode(3, null, null, "id"));
},  reduceExtraParents]); // we need the parent->partner (and parent->partner->parent for safety check)
reqLoaders.set("add my tree", (myNode, result)=>{
  if (!result) return;
  const resultNode=unpacking(result);
  if (resultNode.props.id)  myNode.props.id=resultNode.props.id; //female has no id
  myNode.loaddesc(resultNode);
});
reqReduc.set("add my tree table content", reqReduc.get("add my tree"));
reqLoaders.set("add my tree table content", reqLoaders.get("add my tree"));
reqLoaders.set("get themes tree", (myNode, result)=>myNode.load(unpacking(result)));
reqReduc.set("default", myNode=>packing(myNode.cloneNode()));

export {reqReduc, reqLoaders};