import {Linker} from './nodes.js';
import {observableMixin, observableMixinConstructorCallable} from './observermixin.js';

//load languages
let currentLanguage, languages;

async function loadRoot() {
  const languagesMum = new Linker("TABLE_LANGUAGES");
  await languagesMum.loadRequest("get my root");
  return languagesMum.getChild();
}

export async function loadLanguages() {
  const languagesRoot=await loadRoot();
  if (!languagesRoot) return;
  await languagesRoot.loadRequest("get my tree", {deepLevel: 3});
  languages=languagesRoot.getRelationship();
  // add observer prototype
  const MyLanguagesClass = observableMixin(languages.constructor);
  Object.setPrototypeOf(languages, MyLanguagesClass.prototype); // adding observers characteristics
  observableMixinConstructorCallable(languages);
  return languages;
}

export async function selectMyLanguage(langParent=languages){
  if (!langParent?.children.length) langParent = await loadLanguages();
  if (!langParent) return;
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
export function setCurrentLanguage(lang) {
  if (!languages.children.includes(lang)) return currentLanguage;
  if (lang!=currentLanguage) {
    const lastLanguage=currentLanguage;
    currentLanguage=lang;
    languages.notifyObservers("language change", {lastLanguage: lastLanguage});
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

export const onSelected= async (langNode)=>{
  const {AlertMessage}=await import('./alert.js');
  const {getSiteText, loadText} = await import('./sitecontent.js');
  const {setActive} = await import('./activelauncher.js');
  setActive(langNode);
  setCurrentLanguage(langNode);
  const myalert=new AlertMessage(getSiteText().getNextChild("langbox").getNextChild("changelangwait").getRelationship("siteelementsdata").getChild().props.value);
  myalert.showAlert();
  await loadText();
  //getSiteText().parent.dispatchEvent("language change"); mal
  myalert.props.timeout=3000;
  myalert.hideAlert();
}

export {languages, currentLanguage, getCurrentLanguage};