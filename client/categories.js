import {Node, Linker} from './nodes.js';
import {languages, getCurrentLanguage} from './languages.js';
import {observerMixin} from './observermixin.js';
import {replaceData} from './utils.js';

// load languages
let categoriesRoot;
const CatMotherClass=observerMixin(Linker);
const catMother=new CatMotherClass("TABLE_ITEMCATEGORIES");
languages.attachObserver("language change", catMother);
catMother.setReaction("language change", async (params)=>{
  console.log(`catMother said "change language" `);
  await load(); // Refresh site text data
  categoriesRoot.getRelationship("itemcategories").setChildrenView();
});
// Event for refreshing categories when log
webuser.attachObserver("log", catMother);
catMother.setReaction("log", params=>{
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
    /* Old way of doing it
    const subCatData=[]
    for (const myCat of categoriesRoot.getRelationship().children) {
      for (const child of myCat.getRelationship().children) {
        subCatData.push(child.getRelationship("itemcategoriesdata"));
      }
    }
    */
    const subCatData=categoriesRoot.getRelationship().children.reduce((acc, rootChild)=>[...acc, ...rootChild.getRelationship().children.map(child=>child.getRelationship("itemcategoriesdata"))], []);
    const result = await Node.requestMulti("get my children", subCatData, {extraParents: langParent});
    result.forEach((value, key)=>subCatData[key].addChild(new Node().load(value.data[0])))
    return categoriesRoot;
  }
  if (!categoriesRoot) {
    await loadRoot();
    return await innerLoad(categoriesRoot);
  }
  // to keep the childContainers vars etc..
  const rootClon=categoriesRoot.clone();
  await innerLoad(rootClon);
  replaceData(rootClon, categoriesRoot, "itemcategories", "itemcategoriesdata");
  return categoriesRoot;
}
const getCategoriesRoot = () =>categoriesRoot;

export {load, getCategoriesRoot};