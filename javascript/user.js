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
  this.loadfromhttp(FD, function() {
    this.extra.language=language;
    if (this.extra && this.extra.error) {
      alert("log out error");
    }
    else {
      this.parentNode=null;
      this.relationships=[];
      this.properties=new Properties();
    }
    this.dispatchEvent("log");
  });
};
user.prototype.loginproto=function(action, name, password, email, reqlistener){
  if (this.extra && this.extra.error) delete(this.extra.error); //remove previous error
  if (this.extra && this.extra.language) var language=this.extra.language;
  var FD  = new FormData();
  FD.append("parameters", JSON.stringify({action: action}));
  FD.append("user_name", name);
  FD.append("user_password", password);
  if (email) {
    FD.append("user_email", email);
  }
  FD.action="dblogin.php";
  this.loadfromhttp(FD, function(){
    if (!this.extra) this.extra={};
    this.extra.language=language;
    this.dispatchEvent("log");
    if (typeof reqlistener=="function") reqlistener.call(this);
  });
};
  
user.prototype.login=function(name, password, reqlistener){
  this.loginproto("login", name, password, null, reqlistener);
}

user.prototype.create=function(name, password, email, reqlistener){
  this.loginproto("create", name, password, email, reqlistener);
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

user.prototype.getUserType=function(){
  if (this.parentNode && this.parentNode.partnerNode) return this.parentNode.partnerNode.properties.type;
}
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
