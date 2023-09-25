import {Content, ContentView} from '../contentbase.mjs'
import {getMainBranchDataNodes} from '../../shared/utils.mjs'
import {selectorFromAttr} from '../frontutils.mjs'

export class Categories extends Content{
  constructor(){ // reduced args=> super.deepLevel: 5, super.db_collection: 'TABLE_ITEMCATEGORIES'
    super('TABLE_ITEMCATEGORIES', 5, 'TABLE_ITEMCATEGORIESDATA')
  }
  async initData(Linker, getLangParent, getLangBranch, webuser, getCurrentLanguage){
    await super.initData(Linker, getLangParent, webuser, getCurrentLanguage)
    await this.setExtraContent(getLangParent, getLangBranch, Linker.getNodeConstructor())
  }
  async setExtraContent(getLangParent, getLangBranch, Node){
    // Categories load has a specific load to avoid loading the categories items at init:
    // It loads untill the subcategory node relationships depth. And then for each lang related relationship it makes a load
    const subCatLangRels=getMainBranchDataNodes(this.treeRoot, 2).map(child=>getLangBranch(child))
    //old: const subCatLangRels=this.treeRoot.getBranch('main').children.reduce((acc, rootChild)=>[...acc, ...rootChild.getBranch('main').children.map(child=>child.getBranch("TABLE_LANGUAGES"))], []);
    const langDataResult=await Node.requestMulti("get my children", subCatLangRels, {extraParents: getLangParent(this.treeRoot)})
    langDataResult.forEach((value, key)=>subCatLangRels[key].addChild(new Node().load(value.data[0])))
  }
  async reloadInitLangData(getCurrentLanguage, getLangParent, getLangBranch, Node){
    await this.reloadInitLangData(getCurrentLanguage, getLangParent)
    await this.setExtraContent(getLangParent, getLangBranch, Node)
  }
}
export class CategoriesView extends ContentView{
}