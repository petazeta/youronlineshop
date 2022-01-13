
const reduceExtraParents = (params)=>{
  if (params.extraParents) {
    if (!Array.isArray(params.extraParents)) params.extraParents=[params.extraParents];
    params.extraParents=params.extraParents.map(eParent=>{
      if (eParent.avoidrecursion) {
        eParent=eParent.cloneNode(1, 0, "id", "id");
        eParent.avoidrecursion();
      }
      return eParent;
    });
  }
  return params;
};

const requestsReduc = new Map();

requestsReduc.set("get my root", (myNode)=>myNode.cloneNode(0, 0));
requestsReduc.set("get my childtablekeys", requestsReduc.get("get my root"));
requestsReduc.set("get all my children", requestsReduc.get("get my root"));
requestsReduc.set("get my relationships", (myNode)=>myNode.cloneNode(1, 0, "id", "id"));
requestsReduc.set("get my children", [requestsReduc.get("get my relationships"), reduceExtraParents]);
requestsReduc.set("get my tree", [requestsReduc.get("get my relationships"), reduceExtraParents]);
requestsReduc.set("edit my sort_order", (myNode)=>myNode.cloneNode(3, 0, "id", "id")); // we need the parent->partner (and parent->partner->parent for safety check)
requestsReduc.set("delete my link", requestsReduc.get("edit my sort_order"));
requestsReduc.set("add my link", [requestsReduc.get("edit my sort_order"), reduceExtraParents]);
requestsReduc.set("add myself", [(myNode)=>myNode.cloneNode(3, 0, null, "id"), reduceExtraParents]);
requestsReduc.set("add my children", [(myNode)=>myNode.cloneNode(2, 1, "id", "id"), reduceExtraParents]); // we need the partner (and partner->parent for safety check)
requestsReduc.set("delete my children", requestsReduc.get("add my children"));
requestsReduc.set("delete my tree", (myNode)=>myNode.cloneNode(2, 0, null, "id")); // we need the partner for update siblings position
requestsReduc.set("delete myself", requestsReduc.get("delete my tree"));
requestsReduc.set("edit my props", requestsReduc.get("delete my tree"));
requestsReduc.set("get my parent", (myNode)=>myNode.cloneNode(1, 1, "id"));
requestsReduc.set("get my tree up", requestsReduc.get("get my parent"));
requestsReduc.set("add my tree", [(myNode)=>myNode.cloneNode(3, null, null, "id"), reduceExtraParents]); // we need the parent->partner (and parent->partner->parent for safety check)
requestsReduc.set("add my tree table content", [requestsReduc.get("add my tree"), reduceExtraParents]);

export {requestsReduc};