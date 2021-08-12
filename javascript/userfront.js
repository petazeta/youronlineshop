{
  class UserFront{
    async logout(){
      const result=await Node.makeRequest("logout");
      if (result!==true) throw new Error(result);
      //remove session and user data
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
        this.reqHeaders= {'Authorization': 'Basic ' + btoa(name + ':' + password)};
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
  }
  //To extend the class Node to NodeFront
  function extendNode(source, target, avoid) {
    Object.getOwnPropertyNames(source).forEach(mymethod => {
      if (!avoid || !avoid.includes(mymethod)) {
        target[mymethod]=source[mymethod];
      }
    });
  }
  //We add methods
  extendNode(UserFront, User, ["length", "prototype", "name"]);
  extendNode(UserFront.prototype, User.prototype, ["constructor"]);
}
class WebUser extends User {
  constructor() {
    super();
    this.language;
  }
}