import {Content} from '../contentbase.mjs'

export class BaseContent extends Content{
  constructor(db_collection){ // reduced args=> super.deepLevel: undefined, super.db_collection: 'TABLE_SITEELEMENTS'
    super(db_collection, 0)
  }
  async initData(Linker, getLangParent, webuser, getCurrentLanguage){
    if (await isAutoRelatedCollection(Linker, this.db_collection)) {
      // aqui hay que hacer load get my childtablekeys para poder poner bien el root
      const rootMother = await new Linker(this.db_collection, this.db_collection).loadRequest("get my childtablekeys")
      this.treeRoot = (await rootMother.loadRequest("get my root")).getChild() // level 2: needed for extraParent
    }
    else {
      this.treeRoot = new Linker().addChild(new Linker.nodeConstructor())
      this.treeRoot.addRelationship(await new Linker(this.db_collection).loadRequest("get all my children"))
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