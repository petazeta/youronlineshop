import {getSiteText} from './sitecontent.js';
import {Node, NodeMale, NodeFemale} from './nodesfront.js';
import {packing, unpacking, detectGender} from './../../shared/modules/utils.js';
import {languages} from './languages.js';

const exportFunc = new Map();

// To export data with lang content we first export the tree with the current lang and the langs tree separately

exportFunc.set("general", async ()=>{
  //get data from the structure
  const {loadText} = await import('./pagescontent.js')
  const pagesText=await loadText();
  const titClone=getSiteText().getNextChild("page_head_title").cloneNode(null, 0);
  titClone.loadRequest("get my tree");
  const subtitClone=getSiteText().getNextChild("page_head_subtitle").cloneNode(null, 0);
  subtitClone.loadRequest("get my tree");
  const textClone=pagesText.cloneNode(null, 0);
  await textClone.loadRequest("get my tree");
  return {"languages": await Node.requestMulti("add my tree", languages.children, null, true), "tree": [await titClone.request("add my tree", null, true), await subtitClone.request("add my tree", null, true), await textClone.request("add my tree", null, true)]};
});

exportFunc.set("catalog", async ()=>{
  const categoriesrootmother=await new NodeFemale("TABLE_ITEMCATEGORIES", "TABLE_ITEMCATEGORIES").loadRequest("get my tree");
  //data from the structure
  return {"languages": await Node.requestMulti("add my tree", languages.children, null, true), "tree": await categoriesrootmother.getChild().request("add my tree", null, true)};
});

exportFunc.set("checkout", async ()=>{
  const shippingtypesmother=await new NodeFemale("TABLE_SHIPPINGTYPES").loadRequest("get my tree");
  const paymenttypesmother=await new NodeFemale("TABLE_PAYMENTTYPES").loadRequest("get my tree");
  return {"languages": await Node.requestMulti("add my tree", languages.children, null, true), "tree": [await shippingtypesmother.request("add my tree", null, true), await paymenttypesmother.request("add my tree", null, true)]};
});

exportFunc.set("lang", async (langdata)=>{
  //data from the structure
  const myNodes=await Node.requestMulti( "get my tree", Array(langdata.children.length).fill(getSiteText().cloneNode(null, 0)), langdata.children.map(result => new Object({extraParents: result.getRelationship("siteelementsdata")})));
  const nodesInsert=[];
  for (let i=0; i<myNodes.length; i++) {
    // Request result is an array of arrays with the relationships. myNodes[0] => siteelements
    let loadNode=getSiteText().cloneNode(0, 0);
    loadNode.load(unpacking(myNodes[i]));
    //Now we remove titles custom elements
    loadNode.getRelationship().removeChild(loadNode.getNextChild("page_head_title"));
    loadNode.getRelationship().removeChild(loadNode.getNextChild("page_head_subtitle"));
    nodesInsert.push(await loadNode.request("add my tree", null, true));
  }
  return {"languages": await Node.requestMulti("add my tree", langdata.children, null, true), "trees": nodesInsert};
});

exportFunc.set("users", async ()=>{
  const usertypemother=await new NodeFemale("TABLE_USERSTYPES").loadRequest("get all my children", {filterProps: {type: "customer"}});
  const usertype=await usertypemother.getChild().loadRequest("get my tree", {deepLevel: 3});
  const users= usertype.getRelationship("users").children;
  const mydatanodes=[];
  for (let i=0; i<users.length; i++) {
    mydatanodes.push(users[i].getRelationship("usersdata"));
    mydatanodes.push(users[i].getRelationship("addresses"));
  }
  //I think we are using multi because is mor straight forward thant doing itchild by child
  const resultData=await Node.requestMulti("get my children", mydatanodes);
  const arrayusersdata=[];
  const arrayaddresses=[];
  
  for (let i=0; i<resultData.length; i++) {
    if (i % 2) { //impar
      arrayaddresses.push(resultData[i].data);
    }
    else {
      arrayusersdata.push(resultData[i].data);
    }
  }
  for (let i=0; i<users.length; i++) {
    users[i].getRelationship("usersdata").load(arrayusersdata[i]);
    users[i].getRelationship("addresses").load(arrayaddresses[i]);
  }
  return packing(usertype.getRelationship("users"));
});

export {exportFunc};