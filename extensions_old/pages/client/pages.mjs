import {Content, ContentView} from '../client/contentbase.mjs'

export default class SitePages extends Content{
  constructor(){ // reduced args=> super.deepLevel: undefined, super.db_collection: 'TABLE_SITEELEMENTS'
    super('TABLE_PAGEELEMENTS', 3)
  }
  async initData(Linker, getLangParent, webuser, getCurrentLanguage, getLangBranch, setAltInitNavSearch){ // falta getLangBranch en server
    await super.initData(Linker, getLangParent, webuser, getCurrentLanguage)
    await this.setExtraContent(getLangParent, getLangBranch, Linker.getNodeConstructor())
    this.setMenusInitNavSearch(setAltInitNavSearch) // Starting web point first menu
  }
  async setExtraContent(getLangParent, getLangBranch, Node){
    // Pages load has a specific load to avoid loading the paragraphs at init:
    // It loads untill the menu node relationships depth. And then for each lang related relationship it makes a load
    const menuLangRels=this.treeRoot.getMainBranch().children.map(child=>getLangBranch(child))
    //old: const menuLangRels=this.treeRoot.getBranch('main').children.reduce((acc, rootChild)=>[...acc, ...rootChild.getBranch('main').children.map(child=>child.getBranch("TABLE_LANGUAGES"))], []);
    const langDataResult=await Node.requestMulti("get my children", menuLangRels, {extraParents: getLangParent(this.treeRoot)})
    langDataResult.forEach((value, key)=>menuLangRels[key].addChild(new Node().load(value.data[0])))
  }
  // It sets a the menus view default initial search params in case no other searchs or config search has been defined
  setMenusInitNavSearch(setAltInitNavSearch) {
    if (this.treeRoot.getMainBranch().children.length>0)
      setAltInitNavSearch('?menu=' + this.treeRoot.getMainBranch().getChild().props.id)
  }
  async reloadInitLangData(getCurrentLanguage, getLangParent, getLangBranch, Node){ // falta revisar esto
    await this.reloadInitLangData(getCurrentLanguage, getLangParent)
    await this.setExtraContent(getLangParent, getLangBranch, Node)
  }
  async loadDoc(getLangParent, myNode){
    await myNode.getMainBranch().loadRequest('get my tree', {extraParents: getLangParent(myNode)}) // loading data
  }
}

export class PagesView extends ContentView{
  constructor(){
    super()
    this.searchParamsKeys=["menu"]
  }
  // Set the toggle button [=] to produce the menus expansion on click.
  // Navigation menu is reduced to a toggle [=] on phone screens and set to extended version in pc screens by a css directive at common.css file.
  setOnClickNavToggle(){
    // display toggle menu switch
    window.document.querySelector('[data-id=navtoggle]').addEventListener("click", (event)=>{
      event.preventDefault()
      const menusContainer=window.document.querySelector('[data-id=menus]')
      if (menusContainer.style.transform=="scale(1, 1)") {
        menusContainer.style.transform="scale(1, 0)" // Another option is style.display="none"/"block"
        return
      }
      menusContainer.style.transform="scale(1, 1)"
    })
  }
  setNavUrlMenu(setNavUrl, menuNode, myAction){
    return super.setNavUrl(setNavUrl, menuNode, myAction, 'menu')
  }
  pushNavUrlMenu(pushNavUrl, menuNode){
    return super.pushNavUrl(pushNavUrl, menuNode, 'menu')
  }
  // Menus Edition buttons
  setMenuChgButs(webuser, myNode, langDataNode){
    super.setActionButtons(myNode, ()=>webuser.isWebAdmin(), 'horizontal')
    super.setEditionButton(langDataNode, ()=>webuser.isWebAdmin())
  }
  // Menus Edition buttons
  setPargChgButs(webuser, myNode, langDataNode){
    super.setActionButtons(myNode, ()=>webuser.isWebAdmin(), 'vertical')
    super.setEditionButton(langDataNode, ()=>webuser.isWebAdmin(), undefined, "innerHTML")
    super.setEditionButton(langDataNode, ()=>webuser.isWebAdmin(), undefined, "value", undefined, "buteditcode", undefined, "edit-text", undefined, false, undefined, "code")
  }
}