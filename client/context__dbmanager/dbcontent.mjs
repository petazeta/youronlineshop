/*
  It loads the initial content (first node/s) of a collection
  Using Content class helps for transferring events from root to children
  At this current stage we are not having any actual useful benefit from using the content class
*/

import {Content} from '../contentbase.mjs'
import {Pagination} from "../pagination.mjs"

export class DBContent extends Content{
  constructor(db_collection){ // reduced args=> super.deepLevel: undefined, super.db_collection: 'TABLE_SITEELEMENTS'
    super(db_collection, 0)
  }
  async initData(Linker, getLangParent, webuser, getCurrentLanguage, pageView, pageSize){
    // When is it autorelated then collection must have a single root element, that would be the tree root
    if (await isAutoRelatedCollection(Linker, this.db_collection)) {
      // aqui hay que hacer load get my childtablekeys para poder poner bien el root
      const rootMother = await new Linker(this.db_collection, this.db_collection).loadRequest("get my childtablekeys")
      this.treeRoot = (await rootMother.loadRequest("get my root")).getChild()
    }
    // No aoutrelated then it shows a list of nodes/elements
    else {
      this.treeRoot = new Linker().addChild(new Linker.nodeConstructor()) // tree root is a fake element
      const rootBranch = this.treeRoot.addRelationship(await new Linker(this.db_collection).loadRequest("get my childtablekeys"))
      rootBranch.pagination = new Pagination(rootBranch, async (index)=>await pageView(rootBranch, index), pageSize)
      await rootBranch.pagination.init() // => pagination.totalParent. It counts total results
    }
    this.setReactions(webuser, getCurrentLanguage)
    return this.treeRoot
  }
}

async function isAutoRelatedCollection(Linker, colName){
  const parent = await new Linker(colName).loadRequest("get my childtablekeys")
  if (!parent.props.childTableName || !parent.sysChildTableKeysInfo)
    throw new Error("no valid parent")
  return parent.sysChildTableKeysInfo.some(syskey=>syskey.type=="foreignkey" && syskey.parentTableName==parent.props.childTableName)
}