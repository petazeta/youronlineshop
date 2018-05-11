function user() {
	NodeMale.call(this);
}
user.prototype=Object.create(NodeMale.prototype);
user.prototype.constructor=user;

user.prototype.logoff=function(){
  var myform=document.getElementById("formgeneric").cloneNode(true);
  myform.action="dblogin.php";
  var jsonparameters={action: "logout"};
  myform.elements.parameters.value=JSON.stringify(jsonparameters);
  this.loadfromhttp(myform, function() {
    if (this.extra && this.extra.logout) {
      this.loadfromhttp("sesload.php?sesname=user", function() {
	this.extra.logout=true;
	this.dispatchEvent("log");
      });
    }
    else this.dispatchEvent("log");
  });
};
user.prototype.loginproto=function(action, name, password, reqlistener){
  var myform=document.getElementById("formgeneric").cloneNode(true);
  myform.action="dblogin.php";
  myform.elements.parameters.value=JSON.stringify({action: action});
  //create inputs for name and password
  var nameInput=document.createElement("INPUT");
  nameInput.name="user_name";
  nameInput.value=name;
  var passwordInput=document.createElement("INPUT");
  passwordInput.name="user_password";
  passwordInput.value=password;
  myform.appendChild(nameInput);
  myform.appendChild(passwordInput);
  this.loadfromhttp(myform, function(){
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
  this.loginproto("login", name, password, reqlistener);
}

user.prototype.create=function(name, password, reqlistener){
  this.loginproto("create", name, password, reqlistener);
}

user.prototype.isWebAdmin=function(){
  if (this.getUserType()=="web administrator") {
    return true;
  }
  else return false;
}

user.prototype.getUserType=function(){
  if (webuser.getRelationship({name:"userstypes"}) && webuser.getRelationship({name:"userstypes"}).children[0]) return webuser.getRelationship({name:"userstypes"}).children[0].properties.type;
}

user.prototype.checklogindata=function(uname, upass){
  if (typeof uname == "string" & typeof upass == "string") {
    if (uname.length >= 4 && uname.length <= 8 && upass.length >= 4 && upass.length <= 8) return true;
  }
  return false;
}