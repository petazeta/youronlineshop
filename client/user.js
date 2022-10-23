import {DataNode, LinkerNode} from './nodes.js';
import sharedUserMixin from './../shared/usermixin.mjs'
import {authorizationToken, setAuthorization} from './authorization.js'
import {unpacking} from './../shared/utils.mjs';

const userMixin=Sup => class extends Sup {
  async logout(){
    const result=await DataNode.makeRequest("logout");
    if (result!==true) throw new Error(result);
    const lastUserType=this.getUserType(); 
    //remove session and user data
    setAuthorization(); //reset authorization
    this.resetData(); // Webuser resetData method is async so await could be useful but not awaiting is ok
    this.dispatchEvent("log", lastUserType);
    this.notifyObservers("log", {lastType: lastUserType, currentType: this.getUserType()});
    return this;
  }
  resetData(){
    this.parent=null;
    this.relationships=[];
    this.props={};
  }
  async login(name, password, user=null){
    // const histUrl=window.history.state && window.history.state.url;
    // if (histUrl && histUrl.includes('category') || histUrl.includes('menu')) webuser.perviousLoginHistorySate=window.history.state;
    const lastUserType=this.getUserType(); // save last user state to detect change
    if (!user) {
      const result = await DataNode.makeRequest("login", {"user_name": name, "user_password": password});
      if (typeof result=="object" && result.logError) throw new Error(result.code); //not successful login message
      this.load(unpacking(result));
    }
    else{
      this.load(user); // login by user data
    }
    setAuthorization(name , password);
    this.dispatchEvent("log", lastUserType);
    this.notifyObservers("log", {lastType: lastUserType, currentType: this.getUserType()});
    console.log(this, this.getUserType())
    return this;
  }
  static async create(name, password, email){
    const result=await DataNode.makeRequest("create user", {"user_name": name, "user_password": password, "user_email": email});
    if (typeof result=="object" && result.logError) throw new Error(result.code); //not successful create message
    return unpacking(result);
  }
  static async updatePwd(username, password){
    const result = await DataNode.makeRequest("update user pwd", {"user_name": username, "user_password": password});
    if (result!==true) throw new Error(result); //not successful
    return result;
  }
  async updateMyPwd(password){
    const result = await DataNode.makeRequest("update my user pwd", {"user_password": password});
    if (result!==true) throw new Error(result); //not successful
    return result;
  }
  sendmail(to, subject, message, from){
    return DataNode.makeRequest("send mail", {to: to, subject: subject, message: message, from: from});
  }
  getAuthorizationToken(){
    return authorizationToken;
  }
}

const User = userMixin(sharedUserMixin(DataNode));

export default User;

export async function loginDashboard(textNode){
  // close login card
  document.body.removeChild(document.getElementById("login-card"));
  if (webuser.isAdmin()) {
    return; // No dashboard screen no need to do anything
    /*
    const {dispatchPopStateEvent} = await import('./navhistory.js')
    const url=webuser.perviousLoginHistorySate && webuser.perviousLoginHistorySate.url;
    if (!url) return;
    // go history back
    if (url.includes('category') || url.includes('menu')) dispatchPopStateEvent(url);
    // webuser.perviousLoginHistorySate=null; // reset previous state
    return; // No dashboard screen
    */
  }
  // if cart it is not empty -> redirect to checkout
  const {myCart} = await import('./cart.js')
  if (myCart.getRelationship().children.length>0) {
    textNode.parent.getChild("checkout").setView(document.getElementById("centralcontent"), 'chktmain');
  }
  else {
    textNode.parent.getChild("dashboard").setView(document.getElementById("centralcontent"), "showuserinfo");
  }
}