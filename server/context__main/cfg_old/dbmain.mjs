import defaultConfig from './dbdefault.mjs';
import customConfig from './dbcustom.mjs';

export const dbConfig = {...defaultConfig, ...customConfig}