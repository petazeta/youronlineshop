import {observerMixin, observableMixin} from '../observermixin.mjs'

export default class Languages{
  constructor(){
    this.currentLanguage
    this.treeRoot
    this.db_collection='TABLE_LANGUAGES'
  }

  async init(Linker){
    // It loads languages and its relationships (we would need these relationships for the getLangParent method performance)
    this.treeRoot=(await new Linker(this.db_collection).loadRequest("get my tree", {deepLevel: 4})).getChild()
    //if no root means that table domelements doesn't exist or has no elements
    if (!this.treeRoot) throw new Error('Database Content Error'); // esto convendría explicarlo
    // add observer and observable prototype
    Object.setPrototypeOf(this.treeRoot, observerMixin(observableMixin(this.treeRoot.constructor)).prototype) // adding methods
    observerMixin(Object).prototype.initObserver.call(this.treeRoot)
    observableMixin(Object).prototype.initObservable.call(this.treeRoot)
  }

  selectMyLanguage(langParent){
    if (!langParent) langParent=this.treeRoot.getMainBranch()
    // we are taking care when code is null, maybe better avoid this situtation when adding new lang
    const webLangCodes=langParent.children.filter(child => child.props.code).map(child => child.props.code.toUpperCase())
    const winLangCodes=window.navigator.languages.map(langCode=>{
      if (langCode.includes('-')) {
        return langCode.split('-')[0].toUpperCase()
      }
      return langCode.toUpperCase()
    })
    const findLangCode=winLangCodes.find(langCode=>webLangCodes.includes(langCode))
    if (findLangCode) {
      return this.currentLanguage=langParent.children.find(child=>child.props.code.toUpperCase()==findLangCode)
    }
    return this.currentLanguage=langParent.getChild(); //if no lang found we select first one
  }
  //Set language directly
  // AQUI FALTARIA TODO EL PROCEDIMIENTO DE CARGA DEL NUEVO IDIOMA
  setCurrentLanguage(lang) {
    if (!this.treeRoot.getMainBranch().children.includes(lang)) return this.currentLanguage
    if (lang!=this.currentLanguage) {
      const lastLanguage=this.currentLanguage
      this.currentLanguage=lang
      this.treeRoot.notifyObservers("language change", {lastLanguage: lastLanguage})
    }
  }
  getLangBranch(myNode){
    return myNode.getYBranch(this.db_collection)
  }
  getLangParent(myNode){
    if (typeof myNode == "string") // it can be just the data collection name
      return this.currentLanguage.relationships.find(langRel=>langRel.props.childTableName==myNode)
    // it calculates the collection name from the relationship
    return this.currentLanguage.relationships.find(langRel=>langRel.props.childTableName==this.getLangBranch(myNode)?.props.childTableName)
  }
  async createInstanceChildText(parentNode, position=1, everyLang=true){
    const newNode=parentNode.createInstanceChild(position)
    await newNode.loadRequest("get my relationships")
    if (!this.getLangBranch(newNode)) return newNode
    // We get the relationship about language to add a data language node child
    let langs=1
    if (everyLang) langs = this.treeRoot.getMainBranch().children.length
    for (let i=0; i<langs; i++) this.getLangBranch(newNode).addChild(new newNode.constructor)
    return newNode
  }
}