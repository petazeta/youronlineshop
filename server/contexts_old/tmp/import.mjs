import {Node, Linker} from './nodes.mjs';
import fs from 'fs';
import {join as pathJoin} from 'path';
import {unpacking, arrayUnpacking} from '../../../shared/utils.mjs';
import {replaceLangData, splitLangTree} from '../../../shared/utils.mjs'
import dataBase from './dbgateway.mjs'
import {dbConfig} from './cfg/dbmain.mjs';

export default async function populateDb(){
  const {total} = await dataBase.elementsFromTable({props: {childTableName: "TABLE_LANGUAGES"}});
  if (total!==0) throw new Error('The database is not empty');
  const data=JSON.parse(fs.readFileSync(pathJoin(dbConfig.importPath, 'mongodb_dtbs.json'), 'utf8'));
  const langsRoot=new Node().load(unpacking(data.languages));
  const langs=langsRoot.getRelationship();
  await langsRoot.dbInsertMyTree();
  const newLangs=langs.children;
  const usersMo=new Linker().load(unpacking(data.tree.shift()));
  await usersMo.dbInsertMyTree();
  while(data.tree.length) {
    await impData(newLangs, Node.clone(unpacking(data.tree.shift())));
  }
  return true;
}

// import tree that contains lang data
export async function impData(newLangs, datatree, currentLangs, rootelement) {

  if (!currentLangs) currentLangs=newLangs;
  
  if (rootelement) await rootelement.dbDeleteMyTree();
  
  const singleTrees=splitLangTree(datatree, newLangs.length);

  const newTree=singleTrees[0];

  const langrelname=newTree.getYBranch("TABLE_LANGUAGES").props.name
  
  await newTree.dbInsertMyTree(null, currentLangs[0].getRelationship(langrelname));

  //Now we add the new language content, just lang content
  if (newLangs.length > 1) {
    for (let i=1; i<newLangs.length; i++) {
      await replaceLangData(newTree, singleTrees[i]).clone().dbInsertMyTreeTableContent("TABLE_LANGUAGES", null, currentLangs[i].getRelationship(langrelname));
    }
    return true;
  }
}
