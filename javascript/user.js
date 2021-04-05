class user extends NodeMale {
  constructor() {
    super();
  }
  logRequest(action, data, url){
    if (!url) url=Config.loginFilePath;
    return new Promise((resolve, reject) => {
      var reqData={};
      if (action) reqData.action=action;
      if (data) {
        for (var property in data) {
          reqData[property]=data[property];
        }
      }
      fetch(url, {
        method: 'post',
        body: JSON.stringify(reqData),
      })
      .then(res => res.text())
      .then(resultTxt => {
        var result;
        try {
          result=JSON.parse(resultTxt);
        }
        catch(e){
          console.error('Text: ' + resultTxt);
          throw e;
        }
        if (result.error==true) {
          console.error('Error: ' + action, result.errorMessage);
          reject(result);
        }
        resolve(result);
      })
      .catch(error => console.error('Error: ' + action, error))
    });
  }
  logoff(){
    return new Promise((resolve, reject) => {
      this.logRequest("logout")
      .then(result => {
        //remove session and user data
        this.parentNode=null;
        this.relationships=[];
        this.properties={};
        this.dispatchEvent("log");
        resolve(result);
      })
      .catch(error => reject(error));
    });
  }
  login(name, password){
    return new Promise((resolve, reject) => {
      this.logRequest("login", {"user_name": name, "user_password": password})
      .then(result => {
        this.load(result);
        this.dispatchEvent("log");
        resolve(result);
      })
      .catch(error => reject(error));
    });
  }
  create(name, password, email){
    return new Promise((resolve, reject) => {
      this.logRequest("create", {"user_name": name, "user_password": password, "user_email": email})
      .then(result => {
        this.load(result);
        this.dispatchEvent("log");
        resolve(result);
      })
      .catch(error => reject(error));
    });
  }
  updatePwd(password){
    return new Promise((resolve, reject) => {
      this.logRequest("pwdupdate", {"user_password": password})
      .then(result => {
        this.load(result);
        resolve(result);
      })
      .catch(error => reject(error));
    });
  }

  checkSessionActive(){
    return new Promise((resolve, reject) => {
      this.logRequest("checksesactive")
      .then(result => {
        resolve(result.sesactive);
      })
      .catch(error => reject(error));
    });
  }

  isUserType(utype){
    if (this.getUserType()==utype) {
      return true;
    }
    else return false;
  }

  isAdmin(myNode){
    // Admin of anytype
    if (this.isWebAdmin() || this.isProductAdmin() || this.isSystemAdmin() || this.isOrdersAdmin()) {
      return true;
    }
    return false;
  }

  isWebAdmin(){
    return (this.isUserType("web administrator"));
  }

  isOrdersAdmin(){
    return (this.isUserType("orders administrator"));
  }

  isProductAdmin(){
    return (this.isUserType("product administrator"));
  }

  isProductSeller(){
    return (this.isUserType("product seller"));
  }

  isSystemAdmin(){
    return (this.isUserType("system administrator"));
  }

  isCustomer(){
    return (this.isUserType("customer"));
  }

  getUserType(){
    if (this.parentNode && this.parentNode.partnerNode) return this.parentNode.partnerNode.properties.type;
  }

  sendmail(to, subject, message, from, url){
      if (!url) url=Config.mailerFilePath;
      var data={};
      if (to) data["mail_to"]=to;
      if (subject)  data["mail_subject"]=subject;
      if (message) data["mail_message"]=message;
      if (from) reqData["mail_from"]=from;
      return this.logRequest("mail", data, "mailer.php");
  }
}
class WebUser extends user {
  constructor() {
    super();
    this.language;
  }
}