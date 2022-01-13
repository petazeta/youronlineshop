import defaultConfig from './dbdefault.js';
import customConfigList from './dbcfg.js';

const config=Object.assign({}, defaultConfig);

const setConfig = newConfig => Object.assign(config, newConfig);

export const setDbSiteConfig = site=>setConfig(customConfigList.get(site) || customConfigList.values().next().value);

export default config;