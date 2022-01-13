import defaultConfig from './default.js';
import customConfig from './config.js';

const config=Object.assign({}, defaultConfig);

export const setConfig = (newConfig = customConfig) => Object.assign(config, newConfig);

export default config;
