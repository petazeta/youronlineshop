import userMixin from '../../webuser/usermixin.mjs'
import sharedUserMixin from '../../../shared/usermixin.mjs'
import {observableMixin} from '../../observermixin.mjs'
import webUserMixin from '../../webuser/webusermixin.mjs'
import {Node} from '../nodes.mjs'

const Webuser=observableMixin(webUserMixin(userMixin(sharedUserMixin(Node))))

export const webuser = new Webuser()

export async function init(){
  await webuser.initUser()
  await webuser.loginSaved()
}