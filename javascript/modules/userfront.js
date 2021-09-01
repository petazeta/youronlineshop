import {Node, NodeFemale, NodeMale} from './nodesfront.js';
import UserBasic from './user.js'
import {authorizationToken, setAuthorization} from './authorizationfront.js'

class User extends UserBasic{
  async logout(){
    const result=await Node.makeRequest("logout");
    if (result!==true) throw new Error(result);
    //remove session and user data
    setAuthorization(); //reset authorization
    this.parentNode=null;
    this.relationships=[];
    this.props={};
    this.dispatchEvent("log");
    return this;
  }
  async login(name, password){
    const result= await Node.makeRequest("login", {"user_name": name, "user_password": password});
    if (typeof result=="object") {
      this.load(result);
      setAuthorization(name , password);
      this.dispatchEvent("log");
      return this;
    }
    else throw new Error(result); //not successful login message
  }
  static async create(name, password, email){
    const result=await Node.makeRequest("create user", {"user_name": name, "user_password": password, "user_email": email});
    if (typeof result!="number") {
      throw new Error(result);
    }
    return result;
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

export default User;