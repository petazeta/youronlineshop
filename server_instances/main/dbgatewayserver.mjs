import SiteDbGateway from '../../server/dbgateway.mjs'
import dbConfig from './cfg/dbmainserver.mjs';
import * as path from 'path';

const dataBase=new SiteDbGateway();

export async function initDb(){
  await dataBase.connect(dbConfig.url);
  dataBase.setTableList();
}

export function getTableList() {
  return dataBase.tableList;
}

export function getTableRef() {
  return dataBase.tableRef;
}

export async function resetDb(){
  //await dataBase.connect(dbConfig.url);
  const {total} = await dataBase.elementsFromTable({props: {childTableName: "TABLE_LANGUAGES"}});
  if (total!==0) throw new Error('The database is not empty');
  const importJsonFilePath=path.join(dbConfig.importPath, 'mongodb_dtbs.json');
  const fs = await import('fs');
  const {unpacking, arrayUnpacking} = await import('../../shared/utils.mjs');
  const {impData} = await import('../../server/utils.mjs');
  const data=JSON.parse(fs.readFileSync(importJsonFilePath, 'utf8'));
  const {Node, Linker} = await import('./nodesserver.mjs');
  const langsRoot=new Node().load(unpacking(data.languages));
  const langs=langsRoot.getRelationship();
  await langsRoot.dbInsertMyTree();
  const newLangs=langs.children;
  const usersMo=new Linker().load(unpacking(data.tree.shift()));
  await usersMo.dbInsertMyTree();
  await impData(newLangs, "pageelementsdata", Node.clone(unpacking(data.tree.shift())));
  await impData(newLangs, "siteelementsdata", Node.clone(unpacking(data.tree.shift())));
  await impData(newLangs, "itemcategoriesdata", Node.clone(unpacking(data.tree.shift())));
  await impData(newLangs, "shippingtypesdata", Node.clone(unpacking(data.tree.shift())));
  await impData(newLangs, "paymenttypesdata", Node.clone(unpacking(data.tree.shift())));
  return true;
}

export default dataBase;