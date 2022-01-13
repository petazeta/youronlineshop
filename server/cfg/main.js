import defaultConfig from './default.js';
import customConfigList from './config.js';

const config=Object.assign({}, defaultConfig);

const setConfig = newConfig => Object.assign(config, newConfig);

export const setSiteConfig = site=>setConfig(customConfigList.get(site) || customConfigList.values().next().value);

export default config;

//export default getConfig=()=>config;