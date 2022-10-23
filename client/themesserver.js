import SiteTheme from './themes.js';

const myTheme = new SiteTheme();

export function getTemplates(){
  return myTheme.getTemplates();
}

export function getTemplate(tpId){
  return myTheme.getTemplate(tpId);
}

export function getStyles(){
  return myTheme.getStyles();
}