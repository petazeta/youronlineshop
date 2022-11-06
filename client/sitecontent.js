import {Linker} from './nodes.js'
import {observerMixin, observableMixin} from './observermixin.js'
import {languages, getCurrentLanguage} from './languages.js';
import {replaceData} from './utils.js';

let siteText;
const SiteTextMumClass=observableMixin(observerMixin(Linker));
const siteTextMum = new SiteTextMumClass("TABLE_SITEELEMENTS");


async function loadRoot() {
  siteTextMum.children=[];
  await siteTextMum.loadRequest("get my root");
  //if no root means that table domelements doesn't exist or has no elements
  siteText=siteTextMum.getChild();
  if (!siteText) throw new Error('Database Content Error');
  return siteText;
}

async function loadText() {
  if (!siteText) {
    await loadRoot();
    return await siteText.loadRequest("get my tree", {extraParents: getCurrentLanguage().getRelationship("siteelementsdata")});
  }
  // instead of loading diretly to replace all data, we replace just the datatext node and let the sitelements nodes the same.
  // this way the behaviour attached to those nodes is not removed
  const newSiteText=siteText.clone();
  await newSiteText.loadRequest("get my tree", {extraParents: getCurrentLanguage().getRelationship("siteelementsdata")});

  replaceData(newSiteText, siteText, 'siteelements', 'siteelementsdata');

  languages.attachObserver("language change", siteTextMum);
  siteTextMum.setReaction("language change", async (params)=>{
    await loadText(); // Refresh site text data
    siteTextMum.notifyObservers("language change"); // some elements on the tree will be refreshed
  });

  return siteText;
}

const getSiteText=()=>siteText;

export {loadText, getSiteText};