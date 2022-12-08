import config from './cfg/mainserver.mjs';
import dbConfig from './cfg/dbmainserver.mjs';
import dbGateway, {initDb} from './dbgatewayserver.mjs';
import {startThemes} from './themesserver.mjs';
import {createClient} from 'redis';

export default async function initServer(){
  console.log("initalizing server");
  await initDb(); // Ver si produce errores y mostrar errores
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
  startThemes(config.defaultThemeId);
  process.env.TZ = config.timeZone;
}