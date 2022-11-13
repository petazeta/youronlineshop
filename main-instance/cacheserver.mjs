import SiteCache from '../server/cache.mjs' ;

const cache=new SiteCache();

export function cacheRequest(user, action, parameters) {
  return cache.request(user, action, parameters);
}

export function cacheResponse(data, user, action, parameters) {
  return cache.response(data, user, action, parameters);
}