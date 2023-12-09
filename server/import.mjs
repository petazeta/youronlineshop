import fs from 'fs';
import {join as pathJoin} from 'path';
import {unpacking, arrayUnpacking, replaceLangData, splitLangTree} from '../shared/utils.mjs'

export async function populateDb(Node, importPath) {
  const data = JSON.parse(fs.readFileSync(pathJoin(importPath, 'mongodb_dtbs.json'), 'utf8'))
  const langsRoot = new Node().load(unpacking(data.languages))
  const langs = langsRoot.getRelationship()
  await langsRoot.dbInsertMyTree()
  const newLangs = langs.children
  const usersRoot = new Node.linkerConstructor("TABLE_USERSTYPES").addChild(new Node({type: "root"}))
  usersRoot.addRelationship(new Node.linkerConstructor().load(unpacking(data.tree.shift())))
  usersRoot.getRelationship().props.parentTableName = "TABLE_USERSTYPES"
  await usersRoot.dbInsertMyTree()
  while(data.tree.length) {
    await impData(newLangs, Node.clone(unpacking(data.tree.shift())))
  }
  return true
}

// import tree that contains lang data
// Creo que podríamos eliminar la necesidad de usar dbInsertMyTreeTableContent y reemplazarla por un algoritmo que use walkthrough para seleccionar en el arbol lo que
// es de esa tabla
// De igual manera se podría eliminar el parametro extraparents y detectar en cliente los nodos que necesitan extra parent y hacer la consulta de insercción a parte
export async function impData(newLangs, datatree, currentLangs, rootelement) {
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