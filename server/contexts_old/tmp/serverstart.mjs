import {config} from './cfg/main.mjs'
import {dbConfig} from './cfg/dbmain.mjs'
import {dbGateway, initDb} from './dbgateway.mjs'
import {startLayouts} from './layouts.mjs'
import {createClient} from 'redis'
import {setDbSchema} from './dbschema.mjs'

export default async function initServer(){
  console.log("initalizing server")
  await initDb(dbConfig.url, setDbSchema); // Ver si produce errores y mostrar errores
  // removing cache data
  if (config.cache=='mongodb') await dbGateway.dbLink.model('Cache').deleteMany({});
  if (config.cache=='redis') {
    //const redisClient = createClient({prefix: dbConfig.redisPrefix});
    const redisClient = createClient({prefix: dbConfig.redisPrefix});
    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    await redisClient.connect();
    const removeKeys=await redisClient.keys('*');
    if (removeKeys && removeKeys.length) await redisClient.del(removeKeys);
    //await redisClient.flushAll(); borra cualquier prefijo
    await redisClient.disconnect();
  }
  startLayouts()
  process.env.TZ = config.timeZone
}