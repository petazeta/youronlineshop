import {dbGetTables} from './dbgateway.js';

const tableList=new Map();

if (tableList.entries.length==0) {
  const tables = await dbGetTables();
  for (const table of tables) {
    tableList.set('TABLE_' + table.toUpperCase(), table);
  }
}

export default tableList;