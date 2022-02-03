import {NodeFemale} from './nodesfront.js';
import {languages, getCurrentLanguage} from './languages.js';
import {ObserverMixing} from './observermixing.js';
import {replaceData} from './utils.js';

export let pageText;
const pageMotherClass=ObserverMixing(NodeFemale);
const pageMother=new pageMotherClass("TABLE_PAGEELEMENTS", "TABLE_PAGEELEMENTS");
languages.attachObserver(pageMother, "language change");
pageMother.noticeReactions.set("language change", async (params)=>{
  console.log(`pageMother said "change language" `);
  await loadText(); // Refresh site text data
  pageText.getRelationship("pageelements").setChildrenView();
});
// Event for refreshing categories when log
webuser.attachObserver(pageMother, "log");
pageMother.noticeReactions.set("log", (params)=>{
  console.log(`pageMother said "webuser log ${params.lastType + '=>' + params.currentType}"`);
  if (params.lastType!=params.currentType) pageText.getRelationship("pageelements").setChildrenView();
});

async function loadRoot() {
  await pageMother.loadRequest("get my root");
  //if no root means that table domelements doesn't exist or has no elements
  if (pageMother.children.length==0) {
    throw new Error('Database Content Error');
  }
  return pageText = pageMother.getChild();
}

async function loadText() {
  if (!pageText) {
    await loadRoot();
    return await pageText.loadRequest("get my tree", {extraParents: getCurrentLanguage().getRelationship("pageelementsdata"), deepLevel: 4});
  }
  //We load menus and its relationships. We want to load menus elementsdata children but not elements children
  const newPageText=pageText.cloneNode();
  await newPageText.loadRequest("get my tree", {extraParents: getCurrentLanguage().getRelationship("pageelementsdata"), deepLevel: 4});

  replaceData(newPageText, pageText, 'pageelements', 'pageelementsdata');
  return pageText;
}

const getPageText=()=>pageText;

export {loadText, getPageText};