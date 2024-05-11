import {Content} from '../contentbase.mjs'

export class PagesContent extends Content{
  constructor(){ // reduced args=> super.deepLevel: undefined, super.db_collection: 'SiteElements'
    super('PageElements', 3, "PageElementsData")
  }
  async loadInitExtraContent(getLangBranch, treeRoot, langParent) {
    // ** quizas mejor cargar al principio con deepLevel 5 aunque carge los paragraphs (solo ids) y pasar de esto
    // Pages load has a specific load to avoid loading the paragraphs at init:
    // It loads untill the menu node relationships depth. And then for each lang related relationship it makes a load
    const menuLangRels = treeRoot.getMainBranch().children.map(child=>getLangBranch(child))
    //old: const menuLangRels=this.treeRoot.getBranch('main').children.reduce((acc, rootChild)=>[...acc, ...rootChild.getBranch('main').children.map(child=>child.getBranch("Languages"))], []);
    const langDataResult = await treeRoot.constructor.nodeConstructor.requestMulti("get my children", menuLangRels, {extraParents: langParent})
    langDataResult.forEach((value, key)=>menuLangRels[key].addChild(new treeRoot.constructor.nodeConstructor().load(value.data[0])))
  }
  async initData(Linker, getLangParent, webuser, getCurrentLanguage, getLangBranch){
    await super.initData(Linker, getLangParent, webuser, getCurrentLanguage)
    await this.loadInitExtraContent(getLangBranch, this.treeRoot, getLangParent(this.treeRoot))
  }
  async reloadInitLangData(getCurrentLanguage, langParent){
    await super.reloadInitLangData(getCurrentLanguage, langParent)
    const menuLangRels=treeRoot.getMainBranch().children.map(child=>getLangBranch(child))
    for (const menuRel of menuLangRels) {
      let newMenuRel=menuRel.clone()
      await this.loadInitExtraContent(getLangBranch, newMenuRel, getLangParent(this.treeRoot))
      replaceLangData(menuRel, newMenuRel, getCurrentLanguage().getParent().props.childTableName)
    }
  }
  async loadDoc(menuNode, langParent){
    await menuNode.getMainBranch().loadRequest('get my tree', {extraParents: langParent}) // loading data
  }
}