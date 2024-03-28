import {authorizationToken, setAuthorization} from './authorization.mjs'
import {unpacking} from '../../shared/utils.mjs';

// static makeReport must be defined on userserver version
const userMixin=Sup => class extends Sup {
  async logout(){
    const lastUserType=this.getUserType(); 
    //remove session and user data
    setAuthorization(); //reset authorization
    console.log("log out", this)
    await this.resetData()
    console.log("log out", this)

    this.dispatchEvent("log", lastUserType)

    this.notifyObservers("log", {lastType: lastUserType, currentType: this.getUserType()})
  }
  async resetData(){
    this.parent=null;
    this.relationships=[];
    this.props={};
  }
  async login(name, password, user=null){
    // const histUrl=window.history.state && window.history.state.url;
    // if (histUrl?.includes('category') || histUrl.includes('menu')) webuser.perviousLoginHistorySate=window.history.state;
    // *** should we reset user data??
    const lastUserType = this.getUserType() // save last user state to detect change
    if (!user) {
      const result = await this.constructor.makeRequest("login", {"user_name": name, "user_password": password})
      if (typeof result=="object" && result.logError)
        throw new Error(result.code) //not successful login message
      this.load(unpacking(result))
    }
    else{
      this.load(user) // login by user data
    }
    setAuthorization(name , password)
    this.dispatchEvent("log", lastUserType)
    this.notifyObservers("log", {lastType: lastUserType, currentType: this.getUserType()})
    return this
  }
  static async create(name, password, email){
    const result = await this.makeRequest("create user", {"user_name": name, "user_password": password, "user_email": email})
    if (typeof result=="object" && result.logError)
      throw new Error(result.code) //not successful create message
    return unpacking(result)
  }
  static async updatePwd(username, password){
    const result = await this.makeRequest("update user pwd", {"user_name": username, "user_password": password})
    if (result!==true)
      throw new Error(result) //not successful
    return result
  }
  async updateMyPwd(password){
    const result = await this.constructor.makeRequest("update user pwd", {"user_name": this.props.username, "user_password": password})
    if (result!==true)
      throw new Error(result) //not successful
    return result
  }
  sendmail(to, subject, message, from){
    return this.constructor.makeRequest("send mail", {to: to, subject: subject, message: message, from: from});
  }
  getAuthorizationToken(){
    return authorizationToken;
  }
}

export default userMixin