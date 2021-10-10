import mysql from 'mysql';
import {createRequire} from "module";

let dbLink;
const require = createRequire(import.meta.url);

const config=require('./generalcfg.json');
const dbConfig=require('./dbcfg.json');

export function dbQuery(dbConnection, sql) {
  return new Promise((resolve, reject) => {
    dbConnection.query(sql, (err, result, fields) => {
      if (err) {
        reject(err.sqlMessage);
        return;
      }
      resolve(result);
    });
  });
}

export function dbEscape(str, singleQuotes=false) {
  const escaped=mysql.escape(str);
  if (!singleQuotes && escaped.indexOf("'")==0) return escaped.slice(1, -1);
  return escaped;
}

export function dbGetDbLink(getNew, myCfg) {
  return new Promise((resolve, reject) => {
    if (!myCfg) myCfg=dbConfig;
    if (!dbLink || getNew) {
      dbLink = mysql.createConnection(myCfg);
      dbLink.connect(err => {
        if (err) {
          reject(err.sqlMessage);
        }
        else resolve(dbLink);
      });
    }
    else resolve(dbLink);
  });
}

export function dbGetTables()  {
  const sql="SHOW TABLES";
  return dbGetDbLink()
  .then(db =>{
    return dbQuery(db, sql)
    .then(result => result.map(elm=>elm[Object.keys(elm)[0]]));
  });
}

export async function dbInitDb(){
  if ((await dbGetTables()).length > 0) {
    return "Database tables already present. Import file manually";
  }
  const fs = await import('fs');
  const sql=fs.readFileSync("./../utils/database.sql", 'utf8');
  const db = await dbGetDbLink(true, {multipleStatements: true, ...dbConfig});
  const result = await dbQuery(db, sql);
  return result.length;
}