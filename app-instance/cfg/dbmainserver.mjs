import SiteConfig from './dbmain.mjs';

const siteConfig = new SiteConfig();
export default siteConfig;

/*
With this method we could return a new instance everytime
export function getSiteConfig() {
  return new SiteConfig();
}
*/