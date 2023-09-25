import defaultConfig from './default.mjs';
import customConfig from './custom.mjs';

const config={...defaultConfig};

// Set config is used when we want to apply an alternative settings
export const setConfig = (newConfig = customConfig) => Object.assign(config, newConfig);

export default config;
