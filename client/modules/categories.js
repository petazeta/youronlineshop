import {Node, NodeFemale, NodeMale} from './nodesfront.js';
import {languages, getCurrentLanguage} from './languages.js';
import {ObserverMixing} from './observermixing.js';
import {replaceData} from './utils.js';

// load languages
let categoriesRoot;
const catMotherClass=ObserverMixing(NodeFemale);
const catMother=new catMotherClass("TABLE_ITEMCATEGORIES", "TABLE_ITEMCATEGORIES");
languages.attachObserver(catMother, "language change");
catMother.noticeReactions.set("language change", async (params)=>{
  console.log(`catMother said "change language" `);
  await load(); // Refresh site text data
  categoriesRoot.getRelationship("itemcategories").setChildrenView();
});
// Event for refreshing categories when log
webuser.attachObserver(catMother, "log");
catMother.noticeReactions.set("log", params=>{
  console.log(`categoriesMother said "webuser log ${params.lastType + '=>' + params.currentType}"`);
  if (params.lastType!=params.currentType) categoriesRoot.getRelationship("itemcategories").setChildrenView();
});

async function loadRoot() {
  // We load the tree categories avoiding to load last part with products
  await catMother.loadRequest("get my root");
  return categoriesRoot=catMother.getChild();
}

async function load() {
  async function innerLoad(categoriesRoot){
    const langParent=getCurrentLanguage().getRelationship("itemcategoriesdata");
    // It load categories since subcategories -> relationships. It doesn't load further to avoid loading items children
    await categoriesRoot.loadRequest("get my tree", {deepLevel: 5, extraParents: langParent});

    // Now we load subcat lang data : subcategories itemcategoriesdata rel - child
    const subCatData=[]
    for (const myCat of categoriesRoot.getRelationship().children) {
      for (const child of myCat.getRelationship().children) {
        subCatData.push(child.getRelationship("itemcategoriesdata"));
      }
    }
    const result = await Node.requestMulti("get my children", subCatData, {extraParents: langParent});
    const resultKeys=result.keys();
    for (const i of resultKeys) {
      subCatData[i].addChild(new NodeMale().load(result[i].data[0]));
    }
    return categoriesRoot;
  }
  if (!categoriesRoot) {
    await loadRoot();
    return await innerLoad(categoriesRoot);
  }
  const rootClon=categoriesRoot.cloneNode();
  await innerLoad(rootClon);
  replaceData(rootClon, categoriesRoot, "itemcategories", "itemcategoriesdata");
  return categoriesRoot;
}
const getCategoriesRoot = () =>categoriesRoot;

export {load, getCategoriesRoot};