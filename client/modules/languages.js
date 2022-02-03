import {Node, NodeFemale, NodeMale} from './nodesfront.js';
import {ObservableMixing} from './observermixing.js';

//load languages
const LanguagesClass=ObservableMixing(NodeFemale);
const languages=new LanguagesClass("TABLE_LANGUAGES", "TABLE_LANGUAGES");
let currentLanguage;

async function loadLanguages() {
  //await languages.loadRequest("get my childtablekeys", {deepLevel: 2});
  return await languages.loadRequest("get my tree", {deepLevel: 2});
}
function selectMyLanguage(langParent=languages){
  //we are taking care when code is null, maybe better avoid this situtation when addin new lang
  let webLangs=langParent.children.filter(child => child.props.code).map(child => child.props.code.toUpperCase());
  let winLangs=window.navigator.languages.map(lang=>{
    if (lang.includes('-')) {
      return lang.split('-')[0].toUpperCase();
    }
    return lang.toUpperCase();
  });
  for (const lang of winLangs) {
    const pos=webLangs.indexOf(lang);
    if (pos !=-1) {
      return currentLanguage=langParent.children[pos];
    }
  }
  return currentLanguage=langParent.getChild(); //if no lang found we select first one
}
//Set language directly
function setCurrentLanguage(index) {
  let myLang;
  if (Number.isInteger(index)) myLang = languages.children[index];
  else myLang=index;
  if (myLang instanceof Node && myLang!=currentLanguage) {
    const oldLang=currentLanguage;
    currentLanguage=myLang;
    if (oldLang) languages.notifyObservers("language change", {lastLanguage: oldLang});
  }
  return currentLanguage;
}
function getCurrentLanguage() {
  return currentLanguage;
}
export {loadLanguages, languages, selectMyLanguage, currentLanguage, setCurrentLanguage, getCurrentLanguage};