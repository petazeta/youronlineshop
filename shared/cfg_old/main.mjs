import defaultConfig from './default.mjs';
import customConfig from './custom.mjs';

const config=Object.assign({}, defaultConfig);

export const setConfig = (newConfig = customConfig) => Object.assign(config, newConfig);

export default config;
