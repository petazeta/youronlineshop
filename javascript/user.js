function user() {
  NodeMale.call(this);
}
user.prototype=Object.create(NodeMale.prototype);
user.prototype.constructor=user;

user.prototype.logoff=function(){
  //remove session and user data
  if (this.extra && this.extra.error) delete(this.extra.error); //remove previous error
  if (this.extra && this.extra.language) var language=this.extra.language;
  var FD  = new FormData();
  FD.append("parameters", JSON.stringify({action: "logout"}));
  FD.action="dblogin.php";
  this.loadfromhttp(FD).then((myNode) => {
    myNode.extra.language=language;
    if (myNode.extra && myNode.extra.error) {
      alert("log out error");
    }
    else {
      myNode.parentNode=null;
      myNode.relationships=[];
      myNode.properties=new Properties();
    }
    myNode.dispatchEvent("log");
  });
};
user.prototype.loginproto=function(action, name, password, email, reqlistener){
  return new Promise((resolve, reject) => {
    if (this.extra && this.extra.error) delete(this.extra.error); //remove previous error
    if (this.extra && this.extra.language) var language=this.extra.language; //keep the language from user after login
    var FD  = new FormData();
    FD.append("parameters", JSON.stringify({action: action}));
    if (name) {
      FD.append("user_name", name);
    }
    if (password) {
      FD.append("user_password", password);
    }
    if (email) {
      FD.append("user_email", email);
    }
    FD.action="dblogin.php";
    this.loadfromhttp(FD).then((myNode) => {
      if (!myNode.extra) myNode.extra={};
      myNode.extra.language=language;
      myNode.dispatchEvent("log");
      if (typeof reqlistener=="function") reqlistener.call(myNode);
      resolve(myNode);
    });
  });
};
  
user.prototype.login=function(name, password, reqlistener){
  return this.loginproto("login", name, password, null, reqlistener);
}

user.prototype.create=function(name, password, email, reqlistener){
  return this.loginproto("create", name, password, email, reqlistener);
}

user.prototype.updatePwd=function(password, reqlistener){
  return this.loginproto("pwdupdate", null, password, null, reqlistener);
}


user.prototype.isUserType=function(utype){
  if (this.getUserType()==utype) {
    return true;
  }
  else return false;
};

user.prototype.isAdmin=function(myNode){
  //web admin is superuser, it is just an idea so to centralize admin whenever is posible for a dterminated node
  return false;
}

user.prototype.isWebAdmin=function(){
  return (this.isUserType("web administrator"));
}

user.prototype.isProductAdmin=function(){
  return (this.isUserType("product administrator"));
}

user.prototype.isProductSeller=function(){
  return (this.isUserType("product seller"));
}

user.prototype.isUserAdmin=function(){
  return (this.isUserType("user administrator"));
}

user.prototype.isSystemAdmin=function(){
  return (this.isUserType("system administrator"));
}

user.prototype.getUserType=function(){
  if (this.parentNode && this.parentNode.partnerNode) return this.parentNode.partnerNode.properties.type;
}

user.prototype.sendmail=function(to, subject, message, from){
  return new Promise((resolve, reject) => {
    if (this.extra && this.extra.error) delete(this.extra.error); //remove previous error
    var FD  = new FormData();
    if (to) {
      FD.append("mail_to", to);
    }
    if (subject) {
      FD.append("mail_subject", subject);
    }
    if (message) {
      FD.append("mail_message", message);
    }
    if (from) {
      FD.append("mail_from", from);
    }
    FD.action="mailer.php";
    this.loadfromhttp(FD).then((myNode) => {
      if (!myNode.extra) myNode.extra={};
      myNode.dispatchEvent("mail");
      console.log(myNode);
      resolve(myNode);
    });
  });
};

function get_liveusers(){
  var FD  = new FormData();
  FD.action="liveusers.php";
  var loadNode=new NodeMale();
  loadNode.loadfromhttp(FD, function(){
    if (!webuser.extra) webuser.extra={};
    webuser.extra.liveusersnum=this.properties.num;
    webuser.dispatchEvent("getliveusers");
  });
}
