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

  const langDataArray=getChildrenArray(newLangNode); // copying the children array
  newLangNode.relationships.forEach(rel=>rel.children=[]); //removing children nodes from new lang root, so we just needed in it for loading purposes

  // Now the easy way is, for each node, to load the parent - partner (from its structure tree) and then insert the node to the data base through that parent and adding the extraParent for the lang.
  const parentList = await Node.requestMulti("get my tree up", langDataArray, {deepLevel: 2});

  const insertDatas=langDataArray.map(langData=>Node.copyProps(new Node(), langData));
  insertDatas.forEach(langData=>delete langData.props.id);
  insertDatas.forEach((insertData, i)=>new Linker().load(arrayUnpacking(parentList[i]).find(pNode=>pNode.props.parentTableName!=languages.props.childTableName)).addChild(insertData));
  const parameters=insertDatas.map(insertData=>new Object({extraParents: newLangNode.getRelationship(insertData.parent.props.name)}));

  await Node.requestMulti("add myself", insertDatas, parameters);
};
export {populateLang}