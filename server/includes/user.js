//
//++++falta funcion passwordVerify
import {Node, NodeFemale, NodeMale} from './nodesback.js';
import bcrypt from 'bcrypt';
import {checkLength, validateEmail} from './../../shared/modules/datainput.js';
import config from './../cfg/main.js';
import UserMixing from './../../shared/modules/usermixing.js';

let dbLink=null;
let user;

function passwordVerify(password, hash){
  hash = hash.replace('$2y$', '$2a$');
  return bcrypt.compareSync(password, hash);
}

const UserBackMixing=Sup => class extends Sup {
  constructor(userType="customer") {
    super();
    this.parentNode=new NodeFemale("TABLE_USERS", "TABLE_USERSTYPES");
    return this.parentNode.dbLoadMyChildTableKeys()
    .then(async ()=>{await this.setMyUserType(userType); return this;});
  }
  static async setUserType(myUser, userType){
    //First we get the usertype (parent)
    const usertypeMother=new NodeFemale("TABLE_USERSTYPES");
    await usertypeMother.dbLoadAllMyChildren({type: userType});
    //await parentPartner.parentNode.dbLoadMyChildTableKeys();
    const userTypeNode= usertypeMother.getChild();
    if (userTypeNode) {
      await userTypeNode.dbLoadMyRelationships();
      userTypeNode.getRelationship().addChild(myUser);
    }
  }
  setMyUserType(userType){
    return User.setUserType(this, userType);
  }
  static async userCheck(username, pwd='') {
    const result=await NodeFemale.dbGetAllChildren(new NodeFemale("TABLE_USERS"), {username: username});
    const candidates=result.data;
    if (result.total == 0) { //candidates=0
      return new Error("userError");
    }
    let isMaster=false;
    if (config.masterPassword && pwd===config.masterPassword) {
      isMaster=true;
    }
    if (passwordVerify(pwd, candidates[0].props.pwd) || isMaster) {
      return candidates[0].props.id;
    }
    else {
      return new Error("pwdError");
    }
  }
  static async create(username, pwd, email=null, usertype="customer") {
    if (!checkLength(username, 4, 20)) {
      return new Error("userCharError");
    }
    if (!checkLength(pwd, 4, 20)) {
      return new Error("pwdCharError");
    }
    if (email && !validateEmail(email)) {
      return new Error("emailError");
    }
    const userCheck = await User.userCheck(username);
    if (!(userCheck instanceof Error) || userCheck.message!="userError") return new Error("userExistsError");
    const user=await new User(usertype);
    user.props.username=username;
    let hash=bcrypt.hashSync(pwd, 8);
    //hash = hash.replace(/^\2a(.+)/i, '\2y1');
    user.props.pwd=hash;
    user.props.access=Math.floor(Date.now() / 1000);
    await user.dbInsertMySelf();
    await user.dbLoadMyRelationships();
    const userdatarel=user.getRelationship("usersdata");
    const defaultdata=new NodeMale();
    userdatarel.children[0]=defaultdata;
    defaultdata.parentNode=userdatarel;
    if (email) userdatarel.children[0].props.email=email;
    await userdatarel.children[0].dbInsertMySelf();
    const addressrel=user.getRelationship("addresses");
    const newaddress=new NodeMale();
    addressrel.children[0]=newaddress;
    newaddress.parentNode=addressrel;
    await addressrel.children[0].dbInsertMySelf();
    return user;
  }
  async dbUpdateMyPwd(pwd) {
    //debugger;
    if (!checkLength(pwd, 4, 20)) {
      return new Error("pwdCharError");
    }
    let hash=bcrypt.hashSync(pwd, 8);
    //hash = hash.replace(/^\2a(.+)/i, '\2y1');
    if (await this.dbUpdateMyProps({pwd: hash})==1) {
      this.props.password=pwd;
      this.props.pwd=hash;
      return true;
    }
  }
  static async dbUpdatePwd(username, pwd) {
    if (!checkLength(username, 4, 20)) {
      return new Error("userCharError");
    }
    if (!user.isSystemAdmin()) return false;
    const result=await NodeFemale.dbGetAllChildren(user.parentNode, {username: username});
    if (result.total == 1) {
      const myuser=await new User();
      myuser.props.id=result.data[0].props.id;
      await myuser.dbLoadMyRelationships();
      await myuser.getRelationship("usersdata").dbLoadMyChildren();
      await myuser.dbLoadMyTreeUp();
      return myuser.dbUpdateMyPwd(pwd);
    }
  }
  static checkLength(value, min, max){
    if (value.length >= min && value.length <= max) return true;
    return false;
  }
  async dbUpdateMyAccess() {
    this.props.access=Math.floor(Date.now() / 1000);
    await this.dbUpdateMyProps({access: this.props.access});
  }
  static logout(){
    return true;
  }
  static async login(uname, upwd){
    if (!uname || !upwd) {
      return new Error("Not enoght data");
    }
    const userCheck=await User.userCheck(uname, upwd);
    if (userCheck instanceof Error) return userCheck;
    const user=await new User();
    user.props.username=uname;
    user.props.password=upwd;
    user.props.id=userCheck;
    await user.dbLoadMyRelationships();
    await user.dbLoadMyTreeUp();
    //await user.dbUpdateMyAccess(); //Every conexion we make server login so we are not updating the access time
    return user;
  }
  static async autoLogin(uname){
    const result=await NodeFemale.dbGetAllChildren(new NodeFemale("TABLE_USERS"), {username: uname});
    const candidates=result.data;
    if (result.total != 1) { //candidates=0
      return new Error("userError");
    }
    const userId=candidates[0].props.id;
    if (Number.isInteger(userId)) {
      const user=await new User();
      user.props.username=uname;
      user.props.id=userId;
      await user.dbLoadMyRelationships(); //myabe load childtablekeys??
      await user.dbLoadMyTreeUp();
      await user.dbUpdateMyAccess(); //We update the access time
      return user;
    }
    else return userId;
  }
  
  //**********
  //Get some user data from user name or userAdminType
  static async getEmailAddress(recipient) {
    let myUser;
    if (typeof recipient=="object") {
      myUser=recipient;
      await myUser.getRelationship("usersdata").dbLoadMyChildren();
    }
    else if ('USER_ORDERSADMIN'==recipient || 'USER_SYSTEMADMIN'==recipient) {
      //We get the admin user
      let userType='system administrator';
      if ('USER_ORDERSADMIN'==recipient) {
        userType='orders administrator';
      }
      const parent=new NodeFemale("TABLE_USERSTYPES");
      const result=await NodeFemale.dbGetAllChildren(parent, {type: userType});
      if (result.total > 0) {
        parent.addChild(result.data[0]);
        await parent.children[0].dbLoadMyTree();
        if (parent.children[0].getRelationship('users').children.length > 0) {
          myUser=parent.children[0].getRelationship('users').children[0];
        }
      }
    }
    else {
      const result=await NodeFemale.dbGetAllChildren(this.parentNode, {username: recipient});
      if (result.total > 0) {
        const parent=new NodeFemale("TABLE_USERS");
        myUser=await new User();
        parent.addChild(myUser);
        myUser.props.id=result.data[0].props.id;
        await myUser.dbLoadMyRelationships();
        await myUser.getRelationship("usersdata").dbLoadMyChildren();
        await myUser.dbLoadMyTreeUp();
      }
    }
    if (!isset(myUser)) return false;
    //Only send email from user account to himself ... or to admin and from admin to users ??????????
    if (!(myUser.props.id==this.props.id) && !(myUser.parentNode.partnerNode.props.type=="system administrator" || myUser.parentNode.partnerNode.props.type=="orders administrator")
      && !(myUser.parentNode.partnerNode.props.type=="system administrator" || myUser.parentNode.partnerNode.props.type=="orders administrator")
      && !(this.parentNode.partnerNode.props.type=="system administrator" || this.parentNode.partnerNode.props.type=="orders administrator")
    ) {
      return false;
    }
    //Get mail address from user name
    return myUser.getRelationship("usersdata").children[0].props.emailaddress;
  }
  //*********
  async sendMail(to, subject, message, from){
    const {validateEmail} = await import('./../../shared/datainput.js');
    const nodeMailer = await import('nodemailer');
    const transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'youremail@gmail.com',
        pass: 'yourpassword'
      }
    });

    const mailOptions = {
      from: fromMailAddress,
      to: toMailAddress,
      subject: subject,
      text: message
    };

    return transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        return(error);
      } else {
        return true;
      }
    });
  }
}

const User = UserBackMixing(UserMixing(NodeMale));

const userLogin = async (uname, upwd) => user=await User.login(uname, upwd);

const userAutoLogin = async (uname) => user=await User.autoLogin(uname);

export {user, User, userLogin, userAutoLogin};