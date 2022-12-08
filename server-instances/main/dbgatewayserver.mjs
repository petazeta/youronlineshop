import SiteDbGateway from '../../server/dbgateway.mjs'
import dbConfig from './cfg/dbmainserver.mjs';
import path from 'path';

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
  if (total===0) return await dataBase.resetDb(path.join(dbConfig.importPath, 'mongodb_dtbs.json'));
  throw new Error('The database is not empty');
}

export default dataBase;