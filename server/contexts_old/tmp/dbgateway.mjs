import SiteDbGateway from '../../dbgateway.mjs'

const dbGateway = new SiteDbGateway()

export async function initDb(url, setDbSchema){
  await dbGateway.connect(url, setDbSchema)
}

export function getTableList() {
  return dbGateway.tableList
}

export function getTableRef() {
  return dbGateway.tableRef
}

export {dbGateway}