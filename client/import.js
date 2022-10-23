import {getSiteText} from './sitecontent.js';
import {DataNode, LinkerNode} from './nodes.js';
import {arrayUnpacking, unpacking} from '../../shared/utils.mjs';
import {languages, getCurrentLanguage, loadLanguages} from './languages.js';
import {impData} from './utils.js';
import {detectLinker} from './../shared/linkermixin.mjs';
import {copyProps} from './../shared/basicmixin.mjs';

function dataToNode(source){
  if (detectLinker(source)) {
    return new LinkerNode.load(source);
  }
  return new DataNode.load(source);
}

const importFunc = new Map();

importFunc.set("menus", async (data)=>{
  const {getPageText} = await import('./pagescontent.js')
  return await impData(arrayUnpacking(data.languages), "pageelementsdata",  new LinkerNode().load(unpacking(data.tree)), languages.children, getPageText().getRelationship("pageelements"));
});

importFunc.set("catalog", async (data)=>{
  const {getCategoriesRoot} = await import('./categories.js')
  return await impData(arrayUnpacking(data.languages), "itemcategoriesdata", new DataNode().load(unpacking(data.tree)), languages.children, getCategoriesRoot());
  // falta algo aqui para actualizar (reload catalogs)*****************
});

importFunc.set("checkout", async (data)=>{
  await impData(arrayUnpacking(data.languages), "shippingtypesdata", new LinkerNode().load(unpacking(data.tree[0])), languages.children, new LinkerNode("TABLE_SHIPPINGTYPES"));
  await impData(arrayUnpacking(data.languages), "paymenttypesdata", new LinkerNode().load(unpacking(data.tree[1])), languages.children, new LinkerNode("TABLE_PAYMENTTYPES"));
});

importFunc.set("lang", async (importedDataTrees, importedDataLangs)=>{
  const iterationAddLangs=[];
  for (let i=0; i<importedDataTrees.length; i++) {
    iterationAddLangs.push(insertLang(importedDataTrees[i], importedDataLangs[i]));
  }
  return Promise.all(iterationAddLangs);

  async function insertLang(importedDataTree, importedDataLang) {
    // For each new lang we must get a list of all text nodes to insert and its relationship with-in their tree structure
    // This list is composed by the sitetextdata to import and the other text data not imported bu that should be present
    // The steps are therefore:
    // 1- get the current lang siteText tree and replace siteelementsdata values with the imported data values
    // 2 - make a serial list of the textdata nodes
    // 3 - get the current lang text content
    // 4 - get a list of the langs texts nodes except the sitetextdata ones
    // 5 - join the text content to insert: point 2 plus point 4
    // 6 - insert a new lang with the same code as the imported lang
    // 7 - insert all data nodes related with their trees (tree structure: "get my tree up" => parent) and with the newLang (=> extraParents)
    
    const siteTextClone = getSiteText().clone();
    const replaceMyTreeLangData=(originalLangNode, candidatesMother)=>{
      const equivNode=candidatesMother.getChild(originalLangNode.props.name);
      if (equivNode) {
        originalLangNode.getRelationship("siteelementsdata").getChild().props.value=equivNode.getRelationship("siteelementsdata").getChild().props.value;
        for (const child of originalLangNode.getRelationship("siteelements").children) {
          replaceMyTreeLangData(child, equivNode.getRelationship("siteelements"));
        }
      }
      return originalLangNode;
    }
    replaceMyTreeLangData(siteTextClone, importedDataTree.parent);
    
    function getSiteDataArray(myRoot) {
      const treeArray=myRoot.arrayFromTree();
      const resultArray=[];
      for (const myNode of treeArray) {
        if (!detectLinker(myNode)) {
          if (myNode.parent.props.name=="siteelementsdata") {
            resultArray.push(myNode);
          }
        }
      }
      return resultArray;
    }
    
    const siteTextDataArray = getSiteDataArray(siteTextClone);
    
    const langClone = languages.createInstanceChild();
    langClone.props.id=getCurrentLanguage().props.id;
    langClone.props.code=importedDataLang.props.code;
    await langClone.loadRequest("get my tree");
    
    const langDataArray=[...siteTextDataArray];
    for (const rel of langClone.relationships) {
      for (const child of rel.children) {
        if (child.parent.props.name!="siteelementsdata")
        langDataArray.push(child);
      }
    }
    await langClone.loadRequest("add myself");
    
    const parentList = await DataNoderequestMulti("get my tree up", langDataArray, {deepLevel: 2});
    const insertDatas=[], parameters=[];
    for (let i=0; i<parentList.length; i++) {
      insertDatas[i]=new DataNode();
      copyProps(insertDatas[i], langDataArray[i]);
      for (const pNode of arrayUnpacking(parentList[i])) {
        if (pNode.props.parentTableName!="TABLE_LANGUAGES") {
          insertDatas[i].parent=new LinkerNode().load(pNode);
          parameters[i]={extraParents: langClone.getRelationship(pNode.props.name)};
          break;
        }
      }
    }
    return DataNoderequestMulti("add myself", insertDatas, parameters);
  }
});

importFunc.set("users", async (data)=>{
  //First we add the remove tree request
  const usertypemother=await new LinkerNode("TABLE_USERSTYPES").loadRequest("get all my children", {filterProps: {type: "customer"}});
  await usertypemother.getChild().request("delete myself"); //deleting the root will delete every children
  await usertypemother.getChild().loadRequest("add myself");
  const newusersmother=new LinkerNode().load(unpacking(data));
  newusersmother.partner.props.id=usertypemother.getChild().props.id;
  return await newusersmother.request("add my children");
});

importFunc.set("db", async (data)=>{
  for (const child of languages.children) {
    await child.request("delete myself");
  }
  const newLangs=arrayUnpacking(data.languages).map(lang=>new DataNode().load(lang));
  await DataNoderequestMulti("add my tree", newLangs);
  await loadLanguages();
  const usersTypes =  await new LinkerNode("TABLE_USERSTYPES").loadRequest("get all my children");
  const newUsers=new LinkerNode().load(unpacking(data.tree.shift()));
  // we can not remove the current user without eliminate the auth (login) and then produce safety error
  if (webuser && webuser.isSystemAdmin()) {
    usersTypes.removeChild(usersTypes.children.find(child=>child.props.type=="system administrator"));
    newUsers.removeChild(newUsers.children.find(child=>child.props.type=="system administrator"));
  }
  await DataNoderequestMulti("delete my tree", usersTypes.children);
  await DataNoderequestMulti("add my tree", newUsers.children);
  const {getPageText} = await import('./pagescontent.js')
  await impData(newLangs, "pageelementsdata",  dataToNode(unpacking(data.tree.shift())), languages.children, getPageText());
  debugger;
  await impData(newLangs, "siteelementsdata",  dataToNode(unpacking(data.tree.shift())), languages.children, getSiteText());
  const {getCategoriesRoot} = await import('./categories.js')
  await impData(newLangs, "itemcategoriesdata",  dataToNode(unpacking(data.tree.shift())), languages.children, getCategoriesRoot());
  await impData(newLangs, "shippingtypesdata",  dataToNode(unpacking(data.tree.shift())), languages.children, new LinkerNode("TABLE_SHIPPINGTYPES"));
  await impData(newLangs, "paymenttypesdata",  dataToNode(unpacking(data.tree.shift())), languages.children, new LinkerNode("TABLE_PAYMENTTYPES"));
});

export {importFunc};