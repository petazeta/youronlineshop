// Arguments from other modules: Linker, getLangParent, webuser, getCurrentLanguage
import {observerMixin, observableMixin} from './observermixin.mjs'
import {replaceLangData} from '../shared/utils.mjs'

export class Content{
  constructor(db_collection, deepLevel=-1, db_lang_collection){
    this.treeRoot=null
    // class settings
    this.db_collection = db_collection
    this.db_lang_collection =  db_lang_collection
    this.deepLevel = deepLevel // Initial load tree deep level
  }
  async initData(Linker, getLangParent, webuser, getCurrentLanguage){
    if (!this.db_lang_collection) {
      this.treeRoot=(await new Linker(this.db_collection).loadRequest("get my tree", {deepLevel: 2})).getChild() // level 2: needed for extraParent
      //if no root means that table domelements doesn't exist or has no elements
      if (!this.treeRoot) throw new Error('Database Content Error'); // esto convendría explicarlo
      await this.loadInitContent(this.treeRoot, getLangParent(this.treeRoot))
    }
    else {
      const deepLevel = this.deepLevel > 0 ? this.deepLevel + 1 : this.deepLevel
      this.treeRoot=(await new Linker(this.db_collection).loadRequest("get my tree", {extraParents:getLangParent(this.db_lang_collection), deepLevel: deepLevel})).getChild() // level 2: needed for extraParent
    }
    this.setReactions(webuser, getCurrentLanguage)
    return this.treeRoot
  }
  async loadInitContent(treeRoot, langParent) {
    return treeRoot.loadRequest("get my tree", {extraParents:langParent, deepLevel: this.deepLevel})
  }
  // These reactions are only to notify subnodes
  setReactions(webuser, getCurrentLanguage){
    // add observer and observable prototype (class)
    Object.setPrototypeOf(this.treeRoot, observerMixin(observableMixin(this.treeRoot.constructor)).prototype) // adding methods
    observerMixin(Object).prototype.initObserver.call(this.treeRoot)
    observableMixin(Object).prototype.initObservable.call(this.treeRoot)
    this.setLangChangeReaction(getCurrentLanguage)
    this.setLogReaction(webuser)
  }
  setLangChangeReaction(getCurrentLanguage, getLangParent){
    getCurrentLanguage().getParent().getPartner().attachObserver("language change", this.treeRoot)
    this.treeRoot.setReaction("language change", async params=>{
      if (params.lastLanguage==getCurrentLanguage()) return
      await this.reloadInitLangData(getCurrentLanguage, getLangParent(this.treeRoot)) // Refresh site text data
      this.treeRoot.notifyObservers("language change") // some elements on the tree will be refreshed
    })
  }
  // usually for refreshing tree when log
  setLogReaction(webuser){
    webuser.attachObserver("log", this.treeRoot)
    this.treeRoot.setReaction("log", params=>{
      console.log("LogReaction", params)
      if (params.lastType==params.currentType) return
      this.treeRoot.notifyObservers("usertype change") // some elements on the tree will be refreshed
    })
  }
  async reloadInitLangData(getCurrentLanguage, langParent){
    // instead of loading diretly to replace all data, we replace just the datatext node and let the sitelements nodes the same.
    // this way the behaviour attached to those nodes is not removed
    const newRoot=this.treeRoot.clone()
    await this.loadInitContent(newRoot, langParent)
    replaceLangData(this.treeRoot, newRoot, getCurrentLanguage().getParent().props.childTableName)
  }
}

// It needs the HTML element attribute data-edit, data-butedit, ... (data-id="butedit" deprecated)
// searchParamsKeys = we need the whole path of search params to reproduce the view state. It will be settled in extended classes
// ***** DEPRECATED
/*
export class ContentView{
  constructor(){
    this.searchParamsKeys=null
  }
  // quizas mejor No user este método dejarlos por separado en lugar de hacerlo todo junto:
  // poner logreaction para establecer edition por un lado
  // otro logreaction para establecer modification por otro
  // y langreaction por otro.
  // No utilizar estas funciones y para comprobar que tiene observer, ver si tiene setReaction)
  // if the node is editable some more reactions will be activated
  setUserEventsReactions(myNode, langChangeReaction, logChangeReaction, editable=true){
    // add observer and observable prototype
    Object.setPrototypeOf(myNode, observerMixin(myNode.constructor).prototype) // adding methods 
    observerMixin(Object).prototype.initObserver.call(myNode) // adding properties : calling constructor
    this.setLangChangeReaction(myNode, langChangeReaction)
    if (editable) this.setLogChangeReaction(myNode, logChangeReaction)
  }
  // the procedure in a language change is to reload the tree lang nodes. A refreshing of the view content should be performed and for this reason is this method.
  setLangChangeReaction(myNode, langChangeReaction){
    const rootNode = myNode.getRoot().getChild()
    rootNode.attachObserver("language change", myNode)
    myNode.setReaction("language change", ()=>{
      console.log(`node id=${myNode.props.id} said "change language" `)
      langChangeReaction(myNode)
    })
  }
  setLogChangeReaction(myNode, logChangeReaction){
    const rootNode = myNode.getRoot().getChild()
    rootNode.attachObserver("usertype change", myNode)
    myNode.setReaction("usertype change", ()=>{
      console.log(`node id=${myNode.props.id} said "webuser log change" `)
      logChangeReaction(myNode)
    })
  }
}
*/