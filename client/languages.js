import {Linker} from './nodes.js';
import {observableMixin} from './observermixin.js';

//load languages
const ObsLanguages=observableMixin(Linker);

const languages=new ObsLanguages("TABLE_LANGUAGES");

let currentLanguage;

export function loadLanguages() {
  return languages.loadRequest("get my tree", {deepLevel: 2});
}

export async function selectMyLanguage(langParent=languages){
  if (langParent.children.length==0) await loadLanguages();
  //we are taking care when code is null, maybe better avoid this situtation when addin new lang
  const webLangCodes=langParent.children.filter(child => child.props.code).map(child => child.props.code.toUpperCase());
  const winLangCodes=window.navigator.languages.map(langCode=>{
    if (langCode.includes('-')) {
      return langCode.split('-')[0].toUpperCase();
    }
    return langCode.toUpperCase();
  });
  const findLangCode=winLangCodes.find(langCode=>webLangCodes.includes(langCode));
  if (findLangCode) {
    return currentLanguage=langParent.children.find(child=>child.props.code.toUpperCase()==findLangCode);
  }
  return currentLanguage=langParent.getChild(); //if no lang found we select first one
}
//Set language directly
export function setCurrentLanguage(langOrIndex) {
  if (Number.isInteger(langOrIndex)) return currentLanguage = languages.children[langOrIndex];
  else {
    if (!languages.children.includes(langOrIndex)) return currentLanguage;
    if (langOrIndex!=currentLanguage) {
      languages.notifyObservers("language change", {lastLanguage: currentLanguage});
      return currentLanguage=langOrIndex;
    }
  }
}

export function createInstanceChildText(parentNode, position=1){
  const newNode=parentNode.createInstanceChild(position);
  return newNode.loadRequest("get my relationships")
  .then(newNode=>{
    //We search for a relationship about language so we have to add then a data language node child
    const datarel = newNode.relationships.find(rel => rel.sysChildTableKeysInfo.some( syskey => syskey.type=='foreignkey' && syskey.parentTableName==languages.props.childTableName) );
    if (datarel)  datarel.addChild(new newNode.constructor);
    return newNode;
  });
}

const getCurrentLanguage=()=>currentLanguage; // It could be useful in some cases to ensure currentLanguage will not be modified

export {languages, currentLanguage, getCurrentLanguage};