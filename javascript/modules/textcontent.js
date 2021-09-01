import {NodeFemale} from './nodesfront.js'
export let textContentRoot;
export const textContent = {
  initRoot: async function() {
    const domelmtsmum=await (new NodeFemale("TABLE_DOMELEMENTS", "TABLE_DOMELEMENTS")).loadRequest("get my root");
    //if no root means that table domelements doesn't exist or has no elements
    if (domelmtsmum.children.length==0) {
      throw new Error('Database Content Error');
    }
    textContentRoot=domelmtsmum.getChild();
    return await textContentRoot.loadRequest("get my tree", {deepLevel: 2});
  },
  
  loadSiteText: async function() {
    const {currentLanguage} = await import("./languages.js");
    return await textContentRoot.getNextChild("labels").loadRequest("get my tree", {extraParents: currentLanguage.getRelationship("domelementsdata")});
  },
}