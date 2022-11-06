import {getSiteText} from './sitecontent.js';
import {Node, Linker} from './nodes.js';
import {arrayUnpacking, unpacking} from '../../shared/utils.mjs';
import {languages, getCurrentLanguage, loadLanguages} from './languages.js';
import {impData} from './utils.js';

function dataToNode(source){
  if (Node.detectLinker(source)) {
    return new Linker.load(source);
  }
  return new Node.load(source);
}

const importFunc = new Map();

importFunc.set("menus", async (data)=>{
  const {pageText} = await import('./pagescontent.js')
  await impData(arrayUnpacking(data.languages), "pageelementsdata",  new Linker().load(unpacking(data.tree)), languages.children, pageText.getRelationship("pageelements"));
  pageText.parent.reactNotice("language change");
});

importFunc.set("catalog", async (data)=>{
  const {getCategoriesRoot} = await import('./categories.js')
  await impData(arrayUnpacking(data.languages), "itemcategoriesdata", new Linker().load(unpacking(data.tree)), languages.children, getCategoriesRoot().getRelationship("itemcategories"));
  getCategoriesRoot().parent.reactNotice("language change");
});

importFunc.set("checkout", async (data)=>{
  await impData(arrayUnpacking(data.languages), "shippingtypesdata", new Linker().load(unpacking(data.tree[0])), languages.children, new Linker("TABLE_SHIPPINGTYPES"));
  await impData(arrayUnpacking(data.languages), "paymenttypesdata", new Linker().load(unpacking(data.tree[1])), languages.children, new Linker("TABLE_PAYMENTTYPES"));
});

importFunc.set("lang", async (importedDataTrees, importedDataLangs)=>{
  const iterationAddLangs=[];
  for (const i of importedDataTrees.keys()) {
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
      /*
      const treeArray=myRoot.arrayFromTree();
      const resultArray=[];
      for (const myNode of treeArray) {
        if (!Node.detectLinker(myNode)) {
          if (myNode.parent.props.name=="siteelementsdata") {
            resultArray.push(myNode);
          }
        }
      }
      return resultArray;
      */
      return myRoot.arrayFromTree().filter(myNode=>!Node.detectLinker(myNode) && myNode.parent.props.name=="siteelementsdata");
    }
    
    const siteTextDataArray = getSiteDataArray(siteTextClone);
    
    const langClone = languages.createInstanceChild();
    langClone.props.id=getCurrentLanguage().props.id;
    langClone.props.code=importedDataLang.props.code;
    await langClone.loadRequest("get my tree");
    /*
    const langDataArray=[...siteTextDataArray];
    for (const rel of langClone.relationships) {
      for (const child of rel.children) {
        if (child.parent.props.name!="siteelementsdata")
        langDataArray.push(child);
      }
    }
    */
    const langDataArray=langClone.relationships.reduce((total, rel)=>total.concat(rel.children.filter(child.parent.props.name!="siteelementsdata")), [...siteTextDataArray]);
    await langClone.loadRequest("add myself");
    
    const parentList = await NoderequestMulti("get my tree up", langDataArray, {deepLevel: 2});
    /*
    const insertDatas=[], parameters=[];
    for (let i=0; i<parentList.length; i++) {
      insertDatas[i]=new Node();
      Node.copyProps(insertDatas[i], langDataArray[i]);
      for (const pNode of arrayUnpacking(parentList[i])) {
        if (pNode.props.parentTableName!="TABLE_LANGUAGES") {
          insertDatas[i].parent=new Linker().load(pNode);
          parameters[i]={extraParents: langClone.getRelationship(pNode.props.name)};
          break;
        }
      }
    }
    */

    const insertDatas=langDataArray.map(langData=>Node.copyProps(new Node(), langData));
    insertDatas.forEach((insertData, i)=>new Linker().load(arrayUnpacking(parentList[i]).find(pNode=>pNode.props.parentTableName!=languages.props.childTableName)).addChild(insertData));
    const parameters=insertDatas.map(insertData=>new Object({extraParents: langClone.getRelationship(insertData.parent.props.name)}));

    return NoderequestMulti("add myself", insertDatas, parameters);
  }
});

importFunc.set("users", async (data)=>{
  //First we add the remove tree request
  const usertypemother=await new Linker("TABLE_USERSTYPES").loadRequest("get all my children", {filterProps: {type: "customer"}});
  // quiza seria interesante una acción delete all my children y así no tener que borrar el pripio tipo customer.
  await usertypemother.getChild().request("delete myself"); //deleting the root will delete every children
  await usertypemother.getChild().loadRequest("add myself");
  const newusersmother=new Linker().load(unpacking(data));
  newusersmother.partner.props.id=usertypemother.getChild().props.id;
  return await newusersmother.request("add my children");
});

importFunc.set("db", async (data)=>{
  for (const lang of languages.children) {
    await lang.request("delete myself");
  }
  const newLangsRoot=new Node().load(unpacking(data.languages));
  const newLangs=newLangsRoot.getRelationship().children;
  languages.children=[];
  newLangs.forEach(newLang=>languages.addChild(newLang));
  await languages.request("add my tree");
  await loadLanguages();
  const usersTypes =  await new Linker("TABLE_USERSTYPES").loadRequest("get all my children");
  const newUsers=new Linker().load(unpacking(data.tree.shift()));
  // we can not remove the current user without eliminate the auth (login) and then produce safety error
  if (webuser?.isSystemAdmin()) {
    usersTypes.removeChild(usersTypes.children.find(child=>child.props.type=="system administrator"));
    newUsers.removeChild(newUsers.children.find(child=>child.props.type=="system administrator"));
  }
  await NoderequestMulti("delete my tree", usersTypes.children);
  await NoderequestMulti("add my tree", newUsers.children);
  const {getPageText} = await import('./pagescontent.js')
  await impData(newLangs, "pageelementsdata",  dataToNode(unpacking(data.tree.shift())), languages.children, getPageText());
  await impData(newLangs, "siteelementsdata",  dataToNode(unpacking(data.tree.shift())), languages.children, getSiteText());
  const {getCategoriesRoot} = await import('./categories.js')
  await impData(newLangs, "itemcategoriesdata",  dataToNode(unpacking(data.tree.shift())), languages.children, getCategoriesRoot());
  await impData(newLangs, "shippingtypesdata",  dataToNode(unpacking(data.tree.shift())), languages.children, new Linker("TABLE_SHIPPINGTYPES"));
  await impData(newLangs, "paymenttypesdata",  dataToNode(unpacking(data.tree.shift())), languages.children, new Linker("TABLE_PAYMENTTYPES"));

  // En lugar de utilizar newLangs para impData, sería mejor utilizar quizás ya los languages ya insertados: loadLanguages() => languages ?
});

export {importFunc};