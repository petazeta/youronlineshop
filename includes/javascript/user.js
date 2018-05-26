function user() {
	NodeMale.call(this);
}
user.prototype=Object.create(NodeMale.prototype);
user.prototype.constructor=user;

user.prototype.logoff=function(){
  var FD  = new FormData();
  FD.append("parameters", JSON.stringify({action: "logout"}));
  FD.action="dblogin.php";
  this.loadfromhttp(FD, function() {
    if (this.extra && this.extra.logout) {
      //clean the properties.
      var myThis=this;
      this.parentNode.childtablekeys.forEach(function(key){
	myThis.properties[key.Field]=null;
      });
      this.relationships.forEach(function(rel){
	rel.children=[];
      });
      this.loadfromhttp("sesload.php?sesname=user", function() {
	this.dispatchEvent("log");
      });
    }
    else this.dispatchEvent("log");
  });
};
user.prototype.loginproto=function(action, name, password, email, reqlistener){
  var FD  = new FormData();
  FD.append("parameters", JSON.stringify({action: action}));
  FD.append("user_name", name);
  FD.append("user_password", password);
  if (email) {
    FD.append("user_email", email);
  }
  FD.action="dblogin.php";
  this.loadfromhttp(FD, function(){
    if (this.extra.login==true) {
      this.loadfromhttp("sesload.php?sesname=user", function() {
	if (!this.extra) this.extra={};
	this.extra.login=true;
	this.dispatchEvent("log");
	if (typeof reqlistener=="function") reqlistener.call(this);
      });
    }
    else {
      this.dispatchEvent("log");
      if (typeof reqlistener=="function") reqlistener.call(this);
    }
  });
};
  
  
user.prototype.login=function(name, password, reqlistener){
  this.loginproto("login", name, password, null, reqlistener);
}

user.prototype.create=function(name, password, email, reqlistener){
  this.loginproto("create", name, password, email, reqlistener);
}

user.prototype.isWebAdmin=function(){
  if (this.getUserType()=="web administrator") {
    return true;
  }
  else return false;
}

user.prototype.getUserType=function(){
  if (this.parentNode && this.parentNode.partnerNode) return this.parentNode.partnerNode.properties.type;
}