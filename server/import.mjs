import fs from 'fs';
import {unpacking, arrayUnpacking, replaceLangData, splitLangTree, getLangDataBranches, walkThrough} from '../shared/utils.mjs'

export async function populateDb(Node, importFilePath) {
  const defaultInsert = Node.dbGateway.mode.directInsert // set db directInsert, no need to update sibblings??
  //const defaultCache = Node.dbGateway.mode.cache
  Node.dbGateway.mode.directInsert = true //updateSiblingsOrder is false by default, not need???
  //Node.dbGateway.mode.cache = [] // *** temporal porque aun no esta bien el insert, luego revisar si hace falta
  const data = JSON.parse(fs.readFileSync(importFilePath, 'utf8'))
  const langsRoot = new Node().load(unpacking(data.languages))
  const langs = langsRoot.getRelationship()
  await langsRoot.dbInsertMyTree()
  //const newLangs = langs.children
  const usersRoot = new Node().load(unpacking(data.tree.shift()))
  await usersRoot.dbInsertMyTree()
  await langsRoot.dbLoadMyTree() // We need to load the langs relationships for impData performance
  while(data.tree.length) {
    //await impData(newLangs, Node.clone(unpacking(data.tree.shift())))
    await impData(langsRoot, Node.clone(unpacking(data.tree.shift())))
  }
  Node.dbGateway.mode.directInsert = defaultInsert //we don't need cause by default is deactivated updatesiblingsoninsert
  //Node.dbGateway.mode.cache = defaultCache // *** temporal
  return true
}

async function impData(langsRoot, treeRoot) {
  const langsCollectionName = langsRoot.parent.props.childTableName
  fixPositioning(treeRoot)
  await treeRoot.dbInsertMyTree()
  for (const langDataBranch of getLangDataBranches(treeRoot, langsCollectionName)) {
    // Adding the lang foreign key langParent for each node containing lang data
    for (let i=0; i<langDataBranch.children.length; i++) {
      let langData = langDataBranch.children[i]
      let dataClon = langData.clone(0, 0)
      // each node belongs to a languages
      dataClon.parent = langsRoot.getMainBranch().children[i].relationships.find(rel=>rel.props.childTableName==langDataBranch.props.childTableName)
      // add lang link
      await dataClon.dbInsertMyLink()
    }
  }
}

function fixPositioning(rootElement){
  for (const _iter of walkThrough(rootElement, undefined, fixPosChildren)) continue
  function fixPosChildren(elm) {
    if (!elm.detectLinker())
      return
    // lets fix any problem with positioning before inserting
    const skey = elm.getSysKey('sort_order')
    if (skey) {
      elm.children.sort((a,b)=>a.props[skey]-b.props[skey])
      for (let i = 0; i < elm.children.length; i++)
        elm.children[i].props[skey] = i + 1
    }
  }
}

// import tree that contains lang data
// Creo que podríamos eliminar la necesidad de usar dbInsertMyTreeTableContent y reemplazarla por un algoritmo que use walkthrough para seleccionar en el arbol lo que
// es de esa tabla
// De igual manera se podría eliminar el parametro extraparents y detectar en cliente los nodos que necesitan extra parent y hacer la consulta de insercción a parte
export async function impData_old(newLangs, datatree, currentLangs, rootelement) {
  if (!currentLangs) currentLangs = newLangs
  if (rootelement)
    await rootelement.dbDeleteMyTree()
  const singleTrees = splitLangTree(datatree, newLangs.length)
  const newTree = singleTrees[0]

  const langrelname = newTree.getYBranch("Languages").props.name
  
  await newTree.dbInsertMyTree(null, currentLangs[0].getRelationship(langrelname))

  //Now we add the new language content, just lang content
  if (newLangs.length > 1) {
    for (let i=1; i<newLangs.length; i++) {
      await replaceLangData(newTree, singleTrees[i]).clone().dbInsertMyTreeTableContent("Languages", null, currentLangs[i].getRelationship(langrelname));
    }
    return true;
  }
}

/*
***Esto sería mejor hacerlo de otra manera:
Se podrían insertar directamente todo el arbol y de alguna manera guardar una referencia a los elementos que tengan lenguaje par después en un segunda fase
insertar esas relaciones de esos elementos con el lenguage correspondiente

*/

