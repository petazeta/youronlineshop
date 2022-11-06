import {languages, currentLanguage, createInstanceChildText} from './languages.js';

export default async function addition(currentNode, myParams, noLangs) {
  const newNode= await addNewNode(currentNode, noLangs);
  if (myParams.onAdded) await myParams.onAdded(newNode); // ****** DEPRECATED por qué no usar el event solamente? por qué onAdded en params?
  else if (newNode.parent.children.length<=1) await newNode.parent.setChildrenView(null, null, myParams); //to remove the single addition button
  else await newNode.parent.appendChildView(newNode, myParams);
  newNode.parent.dispatchEvent("addNewNode", newNode);
  return newNode;
}
//currentNode can be previousSibling (then it contains id) or the actual newNode
async function addNewNode(currentNode, noLangs) {
  const parentNode=currentNode.parent;
  let parameters={updateSiblingsOrder: true};
  const datarel = currentNode.relationships.find(rel => rel.sysChildTableKeysInfo.some( syskey => syskey.type=='foreignkey' && syskey.parentTableName==languages.props.childTableName) );
  if (!noLangs && datarel) Object.assign(parameters, {extraParents: currentLanguage.getRelationship(datarel.props.name)});
  const skey=parentNode.getSysKey('sort_order');
  if (currentNode.props.id) { // we are getting the previous sibling so we got to get the actual new node
    let position;
    if (skey && parentNode.children.length) {
      position=currentNode.props[skey]+1;
    }
    if (!noLangs) currentNode=await createInstanceChildText(parentNode, position);
    else currentNode=parentNode.createInstanceChild(position);
  }
  await currentNode.loadRequest("add my tree", parameters);
  //We copy the data row to any language
  if (!noLangs && languages.children.length>1) {
    const restLanguages=languages.children.filter(lang => lang.props.id!=currentLanguage.props.id);
    const relLangCandidates=currentNode.arrayFromTree();
    const relLangs=relLangCandidates.filter(relLang=>{
      if (!relLang.detectLinker()) return false;
      const findLangKey=relLang.sysChildTableKeysInfo.find(syskey=>syskey.parentTableName==languages.props.parentTableName && syskey.type=='foreignkey');
      if (findLangKey) return true;
    });
    restLanguages.forEach(lang=>relLangs.forEach(relLang=>relLang.request("add my children", {extraParents: lang.getRelationship(relLang.props.name)})));
  }

  // we must update the siblings sort_order because we can add the child at any position
  if (currentNode.props[skey]<=parentNode.children.length) {
    parentNode.children=parentNode.children.sort((a,b)=>a.props[skey]-b.props[skey]);
    parentNode.children.filter(child=>child.props[skey] >= currentNode.props[skey]).forEach(child=>child.props[skey]++);
  }
  parentNode.addChild(currentNode);
  parentNode.children=parentNode.children.sort((a,b)=>a.props[skey]-b.props[skey]); // just to make the array order fit the position value
  return currentNode;
}