import User from './user.js';
import {observableMixin} from './observermixin.js'
import {LinkerNode} from './nodes.js';

const ObservableUser= observableMixin(User);

class WebUser extends ObservableUser {
  constructor(...args) {
    super(...args);
  }
  async init(){
    // It loads the user type data for customer type
    const typesMother=new LinkerNode("TABLE_USERSTYPES");
    const userType=(await typesMother.loadRequest('get all my children')).getChild({type: 'customer'});
    await userType.loadRequest('get my relationships');
    userType.getRelationship('users').addChild(this);
    return this;
  }
  resetData() {
    super.resetData();
    this.init();
  }
  loginSaved(){
    if (window.localStorage.getItem("user_name") && typeof this.props.id=="undefined") {
      return this.login(window.localStorage.getItem("user_name"), window.localStorage.getItem("user_password"));
    }
  }
}

webuser=new WebUser();

export default function initWebUser(){
  webuser.init()
  .then(()=>webuser.loginSaved())
}