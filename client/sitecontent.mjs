import {Content, ContentView} from './contentbase.mjs'

export class SiteContent extends Content{
  constructor(){ // reduced args=> super.deepLevel: undefined, super.db_collection: 'TABLE_SITEELEMENTS'
    super('TABLE_SITEELEMENTS', -1, "TABLE_SITEELEMENTSDATA")
  }
}

export class SiteContentView extends ContentView{}