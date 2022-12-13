import {Node, Linker} from './nodes.js';
import sharedUserMixin from './../shared/usermixin.mjs'
import {authorizationToken, setAuthorization} from './authorization.js'
import {unpacking} from './../shared/utils.mjs';
import {setActiveInGroup} from './activelauncher.js';
import makeReport from './reports.js';


const userMixin=Sup => class extends Sup {
  logout(){
    const lastUserType=this.getUserType(); 
    //remove session and user data
    setAuthorization(); //reset authorization
    this.resetData(); // Webuser resetData method is async so await could be useful but not awaiting is ok
    this.dispatchEvent("log", lastUserType);
    this.notifyObservers("log", {lastType: lastUserType, currentType: this.getUserType()});
    return makeReport("logout");
  }
  resetData(){
    this.parent=null;
    this.relationships=[];
    this.props={};
  }
  async login(name, password, user=null){
    // const histUrl=window.history.state && window.history.state.url;
    // if (histUrl?.includes('category') || histUrl.includes('menu')) webuser.perviousLoginHistorySate=window.history.state;
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
  static async updatePwd(username, password){
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

const User = userMixin(sharedUserMixin(Node));

export default User;

export async function loginDashboard(textNode){
  // close login card
  document.body.removeChild(document.getElementById("login-card"));
  if (webuser.isAdmin()) {
    async function blink(domElement){
      function innerBlink(){
        domElement.dispatchEvent(new Event('mouseover'));
        setTimeout(()=>domElement.dispatchEvent(new Event('mouseout')), 500);
      }
      innerBlink();
      const intervalActive=setInterval(innerBlink, 1000);
      setTimeout(()=>clearInterval(intervalActive), 2000);
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    if (webuser.isProductAdmin()) {
      const {getCategoriesRoot} = await import('./categories.js');
      for (const cat of getCategoriesRoot().getRelationship('itemcategories').children) {
        blink(cat.highLightElement.parentElement);
      }
    }
    if (webuser.isWebAdmin()) {
      const {getPageText} = await import('./pagescontent.js');
      for (const menu of getPageText().getRelationship('pageelements').children) {
        blink(menu.highLightElement.querySelector('a.menu'));
      }
      console.log(window.document.querySelector('.pgtitle h1 div'));
      blink(window.document.querySelector('.pgtitle h1 div'));
    }
    return; // No dashboard screen no need to do anything
  }
  // if cart it is not empty -> redirect to checkout
  const {myCart} = await import('./cart.js')
  if (myCart.getRelationship().children.length>0) {
    setActiveInGroup('central content', textNode.parent.getChild("checkout"));
    textNode.parent.getChild("checkout").setView(document.getElementById("centralcontent"), 'chktmain');
  }
  else {
    setActiveInGroup('central content', textNode.parent.getChild("dashboard"));
    textNode.parent.getChild("dashboard").setView(document.getElementById("centralcontent"), "showuserinfo");
  }
}

