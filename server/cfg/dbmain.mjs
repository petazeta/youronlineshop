import defaultConfig from './dbdefault.mjs';
import customConfig from './dbcustom.mjs';

function SiteConfig () {
  Object.assign(this, {...defaultConfig, ...customConfig});
}

export default SiteConfig;