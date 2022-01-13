import {getSiteText} from './sitecontent.js';
import {Node, NodeMale, NodeFemale} from './nodesfront.js';
import {arrayUnpacking, unpacking, detectGender} from './../../shared/modules/utils.js';
import {languages, getCurrentLanguage} from './languages.js';

const importFunc = new Map();

async function impData(datalang, langrelname, rootelement, datatree) {
  const requestResultData=[]; //Complet final request container
  const requestResultActions=[];
  const requestResultParams=[];
  // checking lang consistency
  if (datalang.length!=languages.children.length)  return false;
  for (let i=0; i<datalang.length; i++) {
    if (datalang[i].props.id!=languages.children[i].props.id) {
      return false;
    }
  }

  //We split the languages in one array of langdata for each language
  const treearray=datatree.arrayFromTree();
  const langnodes=[];
  let langarray;
  for (let i=0; i<datalang.length; i++) {
    if (Node.detectGender(datatree)=="female") langnodes[i]=new NodeFemale();
    else langnodes[i]=new NodeMale();
    langnodes[i].load(datatree);
    langarray=langnodes[i].arrayFromTree();
    for (let j=0; j< treearray.length; j++) {
      if (Node.detectGender(treearray[j])=="female" && treearray[j].props.language) {
        //The children are the lang conent
        langarray[j].children=[treearray[j].children[i]];
      }
    }
  }
  
  if (!langarray || langarray.length==0) return false;
  //then we insert the tree with just first lang content and for the others
  //First we add the remove tree request
  requestResultData.push(rootelement);
  let delAction="delete myself";
  if (Node.detectGender(rootelement)=="female") delAction="delete my tree";
  requestResultActions.push(delAction);
  requestResultParams.push(null);
  requestResultData.push(langnodes[0]);
  requestResultActions.push("add my tree");
  requestResultParams.push({extraParents: languages.getChild().getRelationship(langrelname)});
  const myResult=await Node.requestMulti(requestResultActions, requestResultData, requestResultParams);
  if (datalang.length<2) {
    return myResult;
  }
  
  const myNode=new NodeMale();
  myNode.load(unpacking(myResult[1]));
  //The resulting tree then we will swap the lang content for each language, then insert again but just the lang content
  //We get to the list of nodes
  const newtreearray=myNode.arrayFromTree();
  //console.log(newtreearray, treearray);
  //For each language we swap content
  //Now we add the new language content but now just lang content
  const requestData=[];
  const requestParams=[];
  for (let i=1; i<datalang.length; i++) {
    for (let j=0; j<newtreearray.length; j++) {
      let langarray=langnodes[i].arrayFromTree();
      if (Node.detectGender(newtreearray[j])=="female" && newtreearray[j].props.language) {
        //console.log(newtreearray[j], langarray[j]);
        //Swap the other langs content
        newtreearray[j].children[0].props=langarray[j].children[0].props;
      }
    }
    requestData.push(myNode);
    requestParams.push({extraParents: languages.children[i].getRelationship(langrelname), tableName: "TABLE_LANGUAGES"});
  }
  return await Node.requestMulti("add my tree table content", requestData, requestParams);
}

importFunc.set("general", async (data)=>{
  const myLangs=arrayUnpacking(data.languages);
  await impData(myLangs, "siteelementsdata", getSiteText().getNextChild("page_head_title"),  new NodeMale().load(unpacking(data.tree[0])));
  await impData(myLangs, "siteelementsdata", getSiteText().getNextChild("page_head_subtitle"),  new NodeMale().load(unpacking(data.tree[1])));
  const {loadText} = await import('./pagescontent.js')
  const pagesText=await loadText();
  return await impData(myLangs, "pageelementsdata", pagesText,  new NodeMale().load(unpacking(data.tree[2])));
});

importFunc.set("catalog", async (data)=>{
  const categoriesrootmother=await new NodeFemale("TABLE_ITEMCATEGORIES", "TABLE_ITEMCATEGORIES").loadRequest("get my root");
  const myLangs=arrayUnpacking(data.languages);
  return await impData(myLangs, "itemcategoriesdata", categoriesrootmother.getChild(), new NodeMale().load(unpacking(data.tree)));
  // falta algo aqui para actualizar (reload catalogs)*****************
});

importFunc.set("checkout", async (data)=>{
  const shippingsrootmother=new NodeFemale("TABLE_SHIPPINGTYPES");
  const paymentsrootmother=new NodeFemale("TABLE_PAYMENTTYPES");
  const myLangs=arrayUnpacking(data.languages);
  await impData(myLangs, "shippingtypesdata", shippingsrootmother, new NodeFemale().load(unpacking(data.tree[0])));
  await impData(myLangs, "paymenttypesdata", paymentsrootmother, new NodeFemale().load(unpacking(data.tree[1])));
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
    // 7 - insert all data nodes related with their trees (tree structure: "get my tree up" => parentNode) and with the newLang (=> extraParents)
    
    const siteTextClone = getSiteText().cloneNode();
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
    replaceMyTreeLangData(siteTextClone, importedDataTree.parentNode);
    
    function getSiteDataArray(myRoot) {
      const treeArray=myRoot.arrayFromTree();
      const resultArray=[];
      for (const myNode of treeArray) {
        if (Node.detectGender(myNode)=="male") {
          if (myNode.parentNode.props.name=="siteelementsdata") {
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
        if (child.parentNode.props.name!="siteelementsdata")
        langDataArray.push(child);
      }
    }
    await langClone.loadRequest("add myself");
    
    const parentList = await Node.requestMulti("get my tree up", langDataArray, {deepLevel: 2});
    const insertDatas=[], parameters=[];
    for (let i=0; i<parentList.length; i++) {
      insertDatas[i]=new NodeMale();
      Node.copyProperties(insertDatas[i], langDataArray[i]);
      for (const pNode of arrayUnpacking(parentList[i])) {
        if (pNode.props.parenttablename!="TABLE_LANGUAGES") {
          insertDatas[i].parentNode=new NodeFemale().load(pNode);
          parameters[i]={extraParents: langClone.getRelationship(pNode.props.name)};
          break;
        }
      }
    }
    return Node.requestMulti("add myself", insertDatas, parameters);
  }
});

importFunc.set("users", async (data)=>{
  //First we add the remove tree request
  const usertypemother=await new NodeFemale("TABLE_USERSTYPES").loadRequest("get all my children", {filterProps: {type: "customer"}});
  await usertypemother.getChild().request("delete myself"); //deleting the root will delete every children
  await usertypemother.getChild().loadRequest("add myself");
  const newusersmother=new NodeFemale().load(unpacking(data));
  newusersmother.partnerNode.props.id=usertypemother.getChild().props.id;
  return await newusersmother.request("add my children");
});

export {importFunc};