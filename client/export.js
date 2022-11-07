import {getSiteText} from './sitecontent.js';
import {Node, Linker} from './nodes.js';
import {packing, unpacking} from './../shared/utils.mjs';
import {languages} from './languages.js';

const exportFunc = new Map();

// To export data with lang content we first export the lang tree for first 2 levels: root and its rels (languages key). Then the root element tree to be exported with all langs.

exportFunc.set("menus", async ()=>{  
  const {getPageText} = await import('./pagescontent.js')
  const pagesText=await getPageText();
  const textClone=pagesText.clone(null, 0);
  await textClone.loadRequest("get my tree");
  return {"languages": await Node.requestMulti("add my tree", languages.children, null, true), "tree": await textClone.getRelationship("pageelements").request("add my tree", null, true)};
});

exportFunc.set("catalog", async ()=>{
  const {getCategoriesRoot} = await import('./categories.js');
  const catRoot = await getCategoriesRoot().clone(null, 0).loadRequest("get my tree");
  //data from the structure
  return {"languages": await Node.requestMulti("add my tree", languages.children, null, true), "tree": await catRoot.getRelationship("itemcategories").request("add my tree", null, true)};
});

exportFunc.set("checkout", async ()=>{
  const shippingtypesmother=await new Linker("TABLE_SHIPPINGTYPES").loadRequest("get my tree");
  const paymenttypesmother=await new Linker("TABLE_PAYMENTTYPES").loadRequest("get my tree");
  return {"languages": await Node.requestMulti("add my tree", languages.children, null, true), "tree": [await shippingtypesmother.request("add my tree", null, true), await paymenttypesmother.request("add my tree", null, true)]};
});

exportFunc.set("lang", async (selectedLangs)=>{
  //data from the structure
  const siteTextsData=await Node.requestMulti( "get my tree", Array(selectedLangs.children.length).fill(getSiteText().clone(null, 0)), selectedLangs.children.map(lang => new Object({extraParents: lang.getRelationship("siteelementsdata")})));
  const siteTexts=[];
  for (const i of siteTextsData.keys()) {
    // Request result is an array of arrays with the relationships. siteTextsData[0] => siteelements
    let siteText=getSiteText().clone(0, 0);
    siteText.load(unpacking(siteTextsData[i]));
    siteTexts[i]=await siteText.request("add my tree", null, true);
  }
  return {"languages": await Node.requestMulti("add my tree", selectedLangs.children, null, true), "trees": siteTexts};
});

exportFunc.set("users", async ()=>{
  const usertypemother=await new Linker("TABLE_USERSTYPES").loadRequest("get all my children", {filterProps: {type: "customer"}});
  const usertype=await usertypemother.getChild().loadRequest("get my tree", {deepLevel: 3});
  // No se hace usertype.getRelationship("users").loadRequest("get my tree") para no cargar los pedidos
  const users= usertype.getRelationship("users").children;
  const usersData=await Node.requestMulti("get my children", users.map(user=>user.getRelationship("usersdata")));
  const usersAddress=await Node.requestMulti("get my children", users.map(user=>user.getRelationship("address")));
  users.forEach((user, i)=>{
    user.getRelationship("usersdata").load(usersData[i]);
    user.getRelationship("addresses").load(usersAddress[i]);
  })
  return packing(usertype.getRelationship("users"));
});

exportFunc.set("db", async ()=>{
  const db=[];
  db.push(await new Linker("TABLE_USERSTYPES").loadRequest("get my tree"));
  const {getPageText} = await import('./pagescontent.js')
  db.push(await getPageText().clone(null, 0).loadRequest("get my tree"));
  const {getSiteText} = await import('./sitecontent.js')
  db.push(await getSiteText().clone(null, 0).loadRequest("get my tree"));
  const {getCategoriesRoot} = await import('./categories.js');
  db.push(await getCategoriesRoot().clone(null, 0).loadRequest("get my tree"));
  db.push(await new Linker("TABLE_SHIPPINGTYPES").loadRequest("get my tree"));
  db.push(await new Linker("TABLE_PAYMENTTYPES").loadRequest("get my tree"));
  
  return {"languages": await languages.partner.request("add my tree", null, true), "tree": await Node.requestMulti("add my tree", db, null, true)};
});

export {exportFunc};