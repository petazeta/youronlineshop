import {dbGetTables} from './dbgateway.js';

const tableList=new Map();

export async function getTableList() {
  if (tableList.entries.length==0) {
    const tables = await dbGetTables();
    for (const table of tables) {
      tableList.set('TABLE_' + table.toUpperCase(), table);
    }
  }
  return tableList;
}

export default getTableList;