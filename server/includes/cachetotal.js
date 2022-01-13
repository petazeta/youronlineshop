import {getSiteName} from './site-path.js';
import {SiteCache} from './cache.js';

const caches=new Map();

export function cacheRequest(user, action, parameters) {
  if (!caches.get(getSiteName() || 'default')) {
    caches.set(getSiteName() || 'default', new SiteCache());
  }
  return caches.get(getSiteName() || 'default').cacheRequest(user, action, parameters);
}

export function cacheResponse(data, user, action, parameters) {
  if (!caches.get(getSiteName() || 'default')) {
    caches.set(getSiteName() || 'default', new SiteCache());
  }
  return caches.get(getSiteName() || 'default').cacheResponse(data, user, action, parameters);
}