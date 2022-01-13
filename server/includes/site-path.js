import url from 'url';
import customConfigList from '../cfg/config.js';

let siteName; // cache for the site name

export const setSiteFromRequest = (request)=>{
  const siteUrl = url.parse(request.url, true).pathname;
  Array.from(customConfigList.keys()).some(key=>{
    if (customConfigList.get(key).siteMethod=='slash') {
      const siteMatch=siteUrl.match(/^\/([\w-]+)\//);
      if (siteMatch && key==siteMatch[1]) return siteName=key;
      return false;
    }
    if (customConfigList.get(key).siteMethod=='host') {
      if (key==request.headers.host) return siteName=key;
      return false;
    }
  });
  return siteName;
}

export const getSiteName=()=>siteName;