import {detectGender, replaceLangData, splitLangTree} from './../../shared/modules/utils.js';
import {Node, NodeMale, NodeFemale} from './nodesfront.js';
// recursively inspect the tree to replace lang data
export function replaceData(origin, target, relName, relDataName) {
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

// import tree that contains lang data
export async function impData(newLangs, langrelname, datatree, currentLangs, rootelement) {
  if (!currentLangs) currentLangs=newLangs;
  
  if (rootelement) await rootelement.request("delete my tree");
  
  const singleTrees=splitLangTree(datatree, newLangs.length);

  const newTree=singleTrees[0];
  await newTree.loadRequest("add my tree", {extraParents: currentLangs[0].getRelationship(langrelname)});  

  //Now we add the new language content, just lang content
  if (newLangs.length > 1) {
    const requestData=[];
    const requestParams=[];
    for (let i=1; i<newLangs.length; i++) {
      requestData.push(replaceLangData(newTree, singleTrees[i]).cloneNode());
      requestParams.push({extraParents: currentLangs[i].getRelationship(langrelname), tableName: "TABLE_LANGUAGES"});
    }
    return await Node.requestMulti("add my tree table content", requestData, requestParams);
  }
}

