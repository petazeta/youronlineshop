import {Node, NodeMale, NodeFemale} from './nodesfront.js';
import {arrayUnpacking, detectGender} from './../../shared/modules/utils.js';
import {getCurrentLanguage} from './languages.js';

// Copy original lang data after adding a new lang
async function populateLang(newLangNode) {
  // We have to get all the lang data and duplicate it
  const newLangId=newLangNode.props.id;
  newLangNode.props.id=getCurrentLanguage().props.id;
  await newLangNode.loadRequest("get my tree");
  newLangNode.props.id=newLangId;
  const langDataArray=[];
  for (const rel of newLangNode.relationships) {
    for (const child of rel.children) {
      langDataArray.push(child);
    }
    rel.children=[]; //removing children nodes from new lang root, so we just needed in it for loading purposes
  }
  // Now the easy way is, for each node, to load the parent - partner (from its structure tree) and then insert the node to the data base through that parent and adding the extraParent for the lang.
  let parentList = await Node.requestMulti("get my tree up", langDataArray, {deepLevel: 2});
  parentList=parentList.map((value, key)=>arrayUnpacking(value));
  const insertDatas=[], parameters=[], parentListKeys=parentList.keys();
  for (const i of parentListKeys) {
    insertDatas[i]=new NodeMale();
    Node.copyProperties(insertDatas[i], langDataArray[i]);
    for (const pNode of parentList[i]) {
      if (pNode.props.parenttablename!="TABLE_LANGUAGES") {
        insertDatas[i].parentNode=new NodeFemale().load(pNode);
        parameters[i]={extraParents: newLangNode.getRelationship(pNode.props.name)};
        break;
      }
    }
  }
  await Node.requestMulti("add myself", insertDatas, parameters);
};
export {populateLang}