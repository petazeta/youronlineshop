import {Node, NodeFemale, NodeMale} from './nodesfront.js';
import UserMixing from './../../shared/modules/usermixing.js'
import {authorizationToken, setAuthorization} from './authorizationfront.js'
import {unpacking} from './../../shared/modules/utils.js';

const UserFrontMixing=Sup => class extends Sup {
  async logout(){
    const result=await Node.makeRequest("logout");
    if (result!==true) throw new Error(result);
    const lastUserType=this.getUserType(); 
    //remove session and user data
    setAuthorization(); //reset authorization
    this.resetData();
    this.dispatchEvent("log", lastUserType);
    this.notifyObservers("log", {lastType: lastUserType, currentType: this.getUserType()});
    return this;
  }
  resetData(){
    this.parentNode=null;
    this.relationships=[];
    this.props={};
  }
  async login(name, password, user=null){
    const lastUserType=this.getUserType(); // save last user state to detect change
    if (!user) {
      const result = await Node.makeRequest("login", {"user_name": name, "user_password": password});
      if (typeof result=="object" && result.logError) throw new Error(result.code); //not successful login message
      this.load(unpacking(result));
    }
    else{
      this.load(user); // login by user data
    }
    setAuthorization(name , password);
    this.dispatchEvent("log", lastUserType);
    this.notifyObservers("log", {lastType: lastUserType, currentType: this.getUserType()});
    return this;
  }
  static async create(name, password, email){
    const result=await Node.makeRequest("create user", {"user_name": name, "user_password": password, "user_email": email});
    if (typeof result=="object" && result.logError) throw new Error(result.code); //not successful create message
    return unpacking(result);
  }
  async updatePwd(username, password){
    const result = await Node.makeRequest("update user pwd", {"user_name": username, "user_password": password});
    if (result!==true) throw new Error(result); //not successful
    return result;
  }
  async updateMyPwd(password){
    const result = await Node.makeRequest("update my user pwd", {"user_password": password});
    if (result!==true) throw new Error(result); //not successful
    return result;
  }
  sendmail(to, subject, message, from){
    return Node.makeRequest("send mail", {to: to, subject: subject, message: message, from: from});
  }
  getAuthorizationToken(){
    return authorizationToken;
  }
}

const User = UserFrontMixing(UserMixing(NodeMale));

export default User;

export async function loginDashboard(textNode){
  // close login card
  document.body.removeChild(document.getElementById("login-card"));
  // if cart it is not empty -> redirect to checkout
  const {myCart} = await import('./cart.js')
  if (myCart.getRelationship("cartitem").children.length>0) {
    textNode.parentNode.getChild("checkout").setView(document.getElementById("centralcontent"), 'chktmain');
  }
  else {
    // esto sería mejor hacerlo mediante patron observer
    //Come back to the previous page (before login)
    const url=webuser.referrer;
    const {getPopStateAction} = await import('./availablestates.js');
    const action=url && !url.includes("login") && getPopStateAction(url);
    if (action) {
      webuser.referrer=null; //reset referrer
      action();
      if (!(history.state && history.state.url==url)) {
        history.pushState({url:url}, null, url);
      }
    }
    else {
      const basicPath=textNode.parentNode.getChild("dashboard");
      basicPath.setView(document.getElementById("centralcontent"), "showuserinfo");
    }
  }
}