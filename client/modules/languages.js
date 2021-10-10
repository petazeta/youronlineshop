import {Node, NodeFemale, NodeMale} from './nodesfront.js';

//load languages
let languages, currentLanguage;

async function loadLanguages() {
  const languagesmother=await (new NodeFemale("TABLE_LANGUAGES", "TABLE_LANGUAGES")).loadRequest("get my root");
  const langroot=await languagesmother.getChild().loadRequest("get my relationships");
  return languages = await langroot.getRelationship("languages").loadRequest("get my tree", {deepLevel: 2});
}
function selectMyLanguage(langParent=languages){
  //we are taking care when code is null, maybe better avoid this situtation when addin new lang
  let webLangs=langParent.children.map(child => child.props.code.toUpperCase());
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
//Set languge directly
function setCurrentLanguage(index) {
  if (Number.isInteger(index)) return currentLanguage=languages.children[index];
  else return currentLanguage=index;
}
export {loadLanguages, languages, selectMyLanguage, currentLanguage, setCurrentLanguage};