import {Node, Linker} from './nodes.js';
import {arrayUnpacking, getChildrenArray} from './../shared/utils.mjs';
import {languages, getCurrentLanguage} from './languages.js';

// Copy original lang data after adding a new lang
async function populateLang(newLangNode) {
  // We have to get all the lang data and duplicate it
  const newLangId=newLangNode.props.id;
  newLangNode.props.id=getCurrentLanguage().props.id;
  await newLangNode.loadRequest("get my tree");
  newLangNode.props.id=newLangId;

  const langDataArray=getChildrenArray(newLangNode);
  newLangNode.relationships.forEach(rel=>rel.children=[]); //removing children nodes from new lang root, so we just needed in it for loading purposes

  // Now the easy way is, for each node, to load the parent - partner (from its structure tree) and then insert the node to the data base through that parent and adding the extraParent for the lang.
  let parentList = await Node.requestMulti("get my tree up", langDataArray, {deepLevel: 2});
  const parameters=[],  insertDatas=[];
  parentList.map(value=>arrayUnpacking(value)).forEach((myParent, key)=>{
    const insertData=new Node();
    Node.copyProps(insertData, langDataArray[key]);
    const langParent=myParent.find(pNode=>pNode.props.parentTableName!=languages.props.childTableName);
    if (langParent) {
      insertData.parent=new Linker().load(langParent);
      parameters[key]={extraParents: newLangNode.getRelationship(langParent.props.name)};
    }
    insertDatas[key]=insertData;
  });
  await Node.requestMulti("add myself", insertDatas, parameters);
};
export {populateLang}