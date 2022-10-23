import defaultConfig from './default.js';
import customConfig from './config.js';
import sharedDefaultConfig from './../../shared/cfg/default.mjs';
import sharedCustomConfig from './../../shared/cfg/custom.mjs';

const config={...sharedDefaultConfig, ...sharedCustomConfig, ...defaultConfig};

export const setConfig = (newConfig = customConfig) => Object.assign(config, newConfig);

export default config;
