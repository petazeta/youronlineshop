// recursively inspect the tree to replace lang data
const replaceData=(origin, target, relName, relDataName)=>{
  const innerReplace=(origin, target)=>{
    if (!target.getRelationship(relDataName) || !origin.getRelationship(relDataName) || origin.getRelationship(relDataName).children==0) return;
    target.getRelationship(relDataName).children=[];
    target.getRelationship(relDataName).addChild(origin.getRelationship(relDataName).getChild());
  }
  innerReplace(origin, target);
  if (!origin.getRelationship(relName)) return;
  for (let i=0; i<origin.getRelationship(relName).children.length; i++) {
    if (!target.getRelationship(relName) || !target.getRelationship(relName).children[i]) continue;
    replaceData(origin.getRelationship(relName).children[i], target.getRelationship(relName).children[i], relName, relDataName);
  }
  return target;
}
export {replaceData};