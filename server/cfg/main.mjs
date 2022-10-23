import defaultConfig from './default.mjs';
import customConfig from './custom.mjs';
import sharedDefaultConfig from './../../shared/cfg/default.mjs';
import sharedCustomConfig from './../../shared/cfg/custom.mjs';

function SiteConfig () {
  Object.assign(this, {...sharedDefaultConfig, ...sharedCustomConfig, ...defaultConfig, ...customConfig});
}

export default SiteConfig;