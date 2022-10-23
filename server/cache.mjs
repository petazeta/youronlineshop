/*
Cache rules
2 maps:

- memory map
mem_id ; memory: usually object

- query map
mem_id ; function(query)
*/

import {unpacking, arrayUnpacking} from './../shared/utils.mjs';

const isCacheFunc=new Map();
const inCacheFunc=new Map();
const pushCacheFunc=new Map();

isCacheFunc.set('siteText', (user, action, parameters) => {
  if (action!="get my tree") return false;
  const myNode=unpacking(parameters.nodeData);
  if (myNode && myNode.parent && myNode.parent.props.childTableName=="TABLE_SITEELEMENTS") {
    return true;
  }
  return false;
});

inCacheFunc.set('siteText', (cacheMem, user, action, parameters) => {
  const extraParents=arrayUnpacking(parameters.extraParents);
  const myLangId = extraParents && extraParents[0] && extraParents[0].partner && extraParents[0].partner.props.id;
  if (!cacheMem.get('siteText')) return false;
  if (myLangId!=cacheMem.get('lang_id')) return false;
  return true;
});

pushCacheFunc.set('siteText', (cacheMem, result, user, action, parameters) => {
  // there are options like error result that should be cache free! still not implemented
  cacheMem.set('siteText', result);
  const extraParents=arrayUnpacking(parameters.extraParents);
  const myLangId = extraParents && extraParents[0] && extraParents[0].partner && extraParents[0].partner.props.id;
  cacheMem.set('lang_id', myLangId);
});

isCacheFunc.set('siteTextReset', (user, action, parameters) => {
  // Other options like when importing that shoud reset are still not implemented
  if (action!="edit my props") return false; // we always keep requesting
  const myNode=unpacking(parameters.nodeData);
  if (myNode && myNode.parent && myNode.parent.props.childTableName=="TABLE_SITEELEMENTSDATA") {
    return true;
  }
  return false; // we always keep requesting
});

inCacheFunc.set('siteTextReset', (cacheMem, user, action, parameters) => {
  return false; // we always keep requesting
});

pushCacheFunc.set('siteTextReset', (cacheMem, data, user, action, parameters) => {
  // Other options like when importing that shoud reset are still not implemented
  if (action!="edit my props") return false; // we always keep requesting
  const myNode=unpacking(parameters.nodeData);
  if (myNode && myNode.parent && myNode.parent.props.childTableName=="TABLE_SITEELEMENTSDATA") {
    cacheMem.set('siteText', null);
  }
});

class SiteCache{
  constructor(){
    this.cacheMem=new Map();
  }
  
  request(user, action, parameters) {
    const myKeys=isCacheFunc.keys();
    for (const myKey of myKeys) {
      if (isCacheFunc.get(myKey)(user, action, parameters) && inCacheFunc.get(myKey)(this.cacheMem, user, action, parameters)) {
        console.log(`${action} comes from cache`);
        return this.cacheMem.get(myKey);
      }
    }
    return false;
  }

  response(data, user, action, parameters) {
    const myKeys=isCacheFunc.keys();
    for (const myKey of myKeys) {
      // it only push when the cache is empty to avoid refreshing every time
      if (isCacheFunc.get(myKey)(user, action, parameters) && !inCacheFunc.get(myKey)(this.cacheMem, user, action, parameters)) {
        pushCacheFunc.get(myKey)(this.cacheMem, data, user, action, parameters);
      }
    }
  }
}

const cache=new SiteCache();

export function cacheRequest(user, action, parameters) {
  return cache.request(user, action, parameters);
}

export function cacheResponse(data, user, action, parameters) {
  return cache.response(data, user, action, parameters);
}