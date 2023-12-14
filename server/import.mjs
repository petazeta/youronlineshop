import fs from 'fs';
import {join as pathJoin} from 'path';
import {unpacking, arrayUnpacking, replaceLangData, splitLangTree, getLangDataBranches} from '../shared/utils.mjs'

export async function populateDb(Node, importPath) {
  const data = JSON.parse(fs.readFileSync(pathJoin(importPath, 'db.json'), 'utf8'))
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
  return true
}

async function impData(langsRoot, treeRoot) {
  const langsCollectionName = langsRoot.parent.props.childTableName
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

  const langrelname = newTree.getYBranch("TABLE_LANGUAGES").props.name
  
  await newTree.dbInsertMyTree(null, currentLangs[0].getRelationship(langrelname))

  //Now we add the new language content, just lang content
  if (newLangs.length > 1) {
    for (let i=1; i<newLangs.length; i++) {
      await replaceLangData(newTree, singleTrees[i]).clone().dbInsertMyTreeTableContent("TABLE_LANGUAGES", null, currentLangs[i].getRelationship(langrelname));
    }
    return true;
  }
}

/*
***Esto sería mejor hacerlo de otra manera:
Se podrían insertar directamente todo el arbol y de alguna manera guardar una referencia a los elementos que tengan lenguaje par después en un segunda fase
insertar esas relaciones de esos elementos con el lenguage correspondiente

*/

