// Arguments from other modules: Linker, getLangParent, webuser, getCurrentLanguage
import {observerMixin, observableMixin} from './observermixin.mjs'
import {replaceLangData} from '../shared/utils.mjs'

export class Content{
  constructor(db_collection, deepLevel=-1){
    this.treeRoot=null
    // class settings
    this.db_collection = db_collection
    this.deepLevel = deepLevel // Initial load tree deep level
  }
  async initData(Linker, getLangParent, webuser, getCurrentLanguage){
    this.treeRoot = (await new Linker(this.db_collection).loadRequest("get my tree", {deepLevel: 2})).getChild() // level 2: needed for extraParent
    //if no root means that table domelements doesn't exist or has no elements
    if (!this.treeRoot)
      throw new Error('Database Content Error'); // esto convendría explicarlo
    await this.loadInitContent(this.treeRoot, getLangParent(this.treeRoot)) // *** getLangParent doesent work
    this.setReactions(webuser, getCurrentLanguage, getLangParent)
    return this.treeRoot
  }
  async loadInitContent(treeRoot, langParent) {
    return treeRoot.loadRequest("get my tree", {extraParents:langParent, deepLevel: this.deepLevel})
  }
  // These reactions are only to notify subnodes
  setReactions(webuser, getCurrentLanguage, getLangParent){
    // add observer and observable prototype (class)
    Object.setPrototypeOf(this.treeRoot, observerMixin(observableMixin(this.treeRoot.constructor)).prototype) // adding methods
    observerMixin(Object).prototype.initObserver.call(this.treeRoot)
    observableMixin(Object).prototype.initObservable.call(this.treeRoot)
    if (getCurrentLanguage)
      this.setLangChangeReaction(getCurrentLanguage, getLangParent)
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