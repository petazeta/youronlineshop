import {ReqCache} from '../../reqcache.mjs'
import {config} from './cfg/main.mjs'
import {dbConfig} from './cfg/dbmain.mjs'
import {dbGateway} from './dbgateway.mjs'
import {createClient} from 'redis'

let cache
//let httpResponse;

if (config.cache=='mongodb') { 
  const cacheDbDocument='Cache';
  const mongodbDriver={
    get: async (key)=>{
      const result = await dbGateway.dbLink.model(cacheDbDocument).findOne({key: key});
      if (!result) return false;
      if (result.isJSON) return JSON.parse(result.value);
      return result.value;
    },
    set: async (key, value)=>{
      let isJSON=false;
      if (typeof value == 'object') {
        value=JSON.stringify(value);
        isJSON=true;
      }
      let result = await dbGateway.dbLink.model(cacheDbDocument).findOneAndUpdate({key: key},  {value: value, isJSON: isJSON});
      if (!result) result = await dbGateway.dbLink.model(cacheDbDocument).create({key: key, value: value, isJSON: isJSON});
      return result;
    }
  }
  cache = new ReqCache(mongodbDriver);
}
else if (config.cache=='mem'){
  cache = new ReqCache(new Map()) // Maybe it is better to exclude here templates to be cached => cache = new ReqCache(new Map(), "templates")
}
else if (config.cache=='redis') {
  const redisClient = createClient({prefix: dbConfig.redisPrefix});
  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  await redisClient.connect();
  const redisDriver={
    get: async (key)=>{
      const result = await redisClient.get(key);
      if (result && typeof result=='string' && result.substring(0,6)=='[JSON]') {
        return JSON.parse(result.substring(6));
      }
      return result;
    },
    set: async (key, value)=>{
      if (typeof value == 'object') {
        value='[JSON]' + JSON.stringify(value);
      }
      const result=await redisClient.set(key, value);
      return result;
    }
  }
  cache = new ReqCache(redisDriver);
}

export function cacheRequest(action, parameters) {
  if (config.cache=='none') return false;
  return cache.request(action, parameters);
}

export function cacheResponse(action, parameters, data) {
  if (config.cache=='none') return;
  return cache.response(action, parameters, data)
}
/*
export function setHttpResponse(httpResponse) {
  httpResponse=httpResponse;
}
*/