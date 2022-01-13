import {NodeFemale} from './nodesfront.js'
import {ObserverMixing, ObservableMixing, getObservers, replaceObserver} from './observermixing.js'
import {languages, getCurrentLanguage} from './languages.js';
import {replaceData} from './utils.js';

let siteText;
const siteTextMumClass=ObservableMixing(ObserverMixing(NodeFemale));
const siteTextMum = new siteTextMumClass("TABLE_SITEELEMENTS", "TABLE_SITEELEMENTS");
languages.attachObserver(siteTextMum, "language change");
siteTextMum.noticeReactions.set("language change", async (params)=>{
  console.log(`siteTextMum said "change language" `);
  await loadText(); // Refresh site text data
  siteTextMum.notifyObservers("language change"); // some elements on the tree will be refreshed
});


async function loadRoot() {
  siteTextMum.children=[];
  await siteTextMum.loadRequest("get my root");
  //if no root means that table domelements doesn't exist or has no elements
  siteText=siteTextMum.getChild();
  if (!siteText) throw new Error('Database Content Error');
  return siteText;
}

async function loadText() {
  const currentLanguage = getCurrentLanguage();
  if (!siteText) {
    await loadRoot();
    return await siteText.loadRequest("get my tree", {extraParents: currentLanguage.getRelationship("siteelementsdata")});
  }
  // instead of loading diretly to replace all data, we replace just the datatext node and let the sitelements nodes the same.
  // this way the behaviour attached to those nodes is not removed
  const newSiteText=siteText.cloneNode();
  await newSiteText.loadRequest("get my tree", {extraParents: currentLanguage.getRelationship("siteelementsdata")});

  replaceData(newSiteText, siteText, 'siteelements', 'siteelementsdata');
  return siteText;

}

// It changes the data 
// *********** deprecated
// dettach the nodes that contain text data. It is used to remove this connection when changing language
function replaceDataObservers() {
  let observers=getObservers();
  for (const myOb of observers) {
    if (myOb.observer.parentNode.props.childtablename=='TABLE_SITEELEMENTSDATA') {
      // replace new lang data
      const newObserver=myOb.observer.parentNode.getChild();
      replaceObserver(myOb.observer, newObserver);
    }
  }
}

const getSiteText=()=>siteText;

export {loadText, replaceDataObservers, getSiteText};