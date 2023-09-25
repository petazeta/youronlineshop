import {Linker} from './nodes.mjs';
import {languages, getCurrentLanguage} from './languages.mjs';
import {observerMixin} from './observermixin.mjs';
import {replaceLangData} from './shared/utils.mjs';

export let pageText;
const pageMotherClass=observerMixin(Linker);
const pageMother=new pageMotherClass("TABLE_PAGEELEMENTS");
languages.attachObserver("language change", pageMother);
pageMother.setReaction("language change", async (params)=>{
  console.log(`pageMother said "change language" `);
  await loadText(); // Refresh site text data
  pageText.getRelationship("pageelements").setChildrenView();
});
// Event for refreshing categories when log
webuser.attachObserver("log", pageMother);
pageMother.setReaction("log", (params)=>{
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
  //We load menus and its relationships. We want to load menus elementsdata children but not elements children to keep the childContainers vars etc..
  const newPageText=pageText.clone();
  await newPageText.loadRequest("get my tree", {extraParents: getCurrentLanguage().getRelationship("pageelementsdata"), deepLevel: 4});

  replaceLangData(pageText, newPageText);
  return pageText;
}

const getPageText=()=>pageText;

export {loadText, getPageText};