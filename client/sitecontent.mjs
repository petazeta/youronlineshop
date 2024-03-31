import {Content} from './contentbase.mjs'

export class SiteContent extends Content{
  constructor(){ // reduced args=> super.deepLevel: undefined, super.db_collection: 'TABLE_SITEELEMENTS'
    super('TABLE_SITEELEMENTS')
  }
}