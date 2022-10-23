import {replaceLangData, splitLangTree} from './../shared/utils.mjs';
// import tree that contains lang data
export async function impData(newLangs, langrelname, datatree, currentLangs, rootelement) {
  if (!currentLangs) currentLangs=newLangs;
  
  if (rootelement) await rootelement.dbDeleteMyTree();
  
  const singleTrees=splitLangTree(datatree, newLangs.length);

  const newTree=singleTrees[0];
  await newTree.dbInsertMyTree(null, currentLangs[0].getRelationship(langrelname));

  //Now we add the new language content, just lang content
  if (newLangs.length > 1) {
    const requestData=[];
    const requestParams=[];
    for (let i=1; i<newLangs.length; i++) {
      await replaceLangData(newTree, singleTrees[i]).clone().dbInsertMyTreeTableContent("TABLE_LANGUAGES", null, currentLangs[i].getRelationship(langrelname));
    }
    return true;
  }
}