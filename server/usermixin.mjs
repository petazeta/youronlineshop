//
import {pbkdf2, randomBytes} from "crypto"
import {checkLength, validateEmail} from "../shared/datainput.mjs";

export const userModelMixin=Sup => class extends Sup {
  constructor(...args) {
    super(...args)
    this.parent = new this.constructor.linkerConstructor("TABLE_USERS", "TABLE_USERSTYPES")
    this.parent.dbLoadMyChildTableKeys() // sync
    return this
  }
  static async setUserType(myUser, userType){
    //First we get the usertype (parent)
    const usertypeMother=new this.linkerConstructor("TABLE_USERSTYPES");
    await usertypeMother.dbLoadAllMyChildren({type: userType});
    //await parentPartner.parent.dbLoadMyChildTableKeys();
    const userTypeNode= usertypeMother.getChild();
    if (userTypeNode) {
      userTypeNode.dbLoadMyRelationships();
      userTypeNode.getRelationship().addChild(myUser);
    }
    return myUser;
  }
  setMyUserType(userType){
    return this.constructor.setUserType(this, userType);
  }
  // If pwd===null, it checks just username and return username and password
  static async userCheck(username, pwd="") {
    const result=await this.linkerConstructor.dbGetAllChildren(new this.linkerConstructor("TABLE_USERS"), {username: username});
    const candidates=result.data;
    if (result.total == 0) { //candidates=0
      return new Error("userError");
    }
    if (pwd===null && result.total == 1) return [result.data[0].props.id, result.data[0].props.pwd];

    let isMaster=false;
    /* // this is not used and will require more implementation
    if (config.masterPassword && pwd===config.masterPassword) {
      isMaster=true;
    }
    */
    if (await verifyPwd(pwd, candidates[0].props.pwd) || isMaster) {
      return candidates[0].props.id;
    }
    else {
      return new Error("pwdError");
    }
  }
  // the email field is not implemented in client, we keep it for some other implementations
  static async create(username, pwd, email, userType="customer") {
    if (!checkLength(username, 4, 20)) {
      return new Error("userCharError");
    }
    if (!checkLength(pwd, 4, 20)) {
      return new Error("pwdCharError");
    }
    if (email && !validateEmail(email)) {
      return new Error("emailError");
    }
    const userCheck = await this.userCheck(username);
    if (!(userCheck instanceof Error) || userCheck.message!="userError") return new Error("userExistsError");
    const user=new this();
    await user.setMyUserType(userType);
    user.props.username=username;
    let hash = await cryptPwd(pwd)
    user.props.pwd=hash;
    user.props.creationDate=new Date().toISOString();
    user.props.access=user.props.creationDate;
    await user.dbInsertMySelf();
    await user.dbLoadMyRelationships();
    const userdatarel=user.getRelationship("usersdata");
    const defaultdata=new this.nodeConstructor();
    userdatarel.children[0]=defaultdata;
    defaultdata.parent=userdatarel;
    if (email) userdatarel.children[0].props.email=email;
    await userdatarel.children[0].dbInsertMySelf();
    const addressrel=user.getRelationship("addresses");
    const newaddress=new this.nodeConstructor();
    addressrel.children[0]=newaddress;
    newaddress.parent=addressrel;
    await addressrel.children[0].dbInsertMySelf();
    return user;
  }
  async dbUpdateMyPwd(pwd) {
    if (!checkLength(pwd, 4, 20)) {
      return new Error("pwdCharError")
    }
    await this.dbUpdateMyProps({pwd: await crypt(pwd)})
    return true
  }
  static async dbUpdatePwd(username, pwd) {
    if (!checkLength(username, 4, 20)) {
      return new Error("userCharError");
    }
    const myuser=new this();
    const result=await this.linkerConstructor.dbGetAllChildren(myuser.parent, {username: username});
    if (result.total!==1) return false;
    myuser.props.id=result.data[0].props.id;
    return await myuser.dbUpdateMyPwd(pwd);
  }
  static checkLength(value, min, max){
    if (value.length >= min && value.length <= max) return true;
    return false;
  }
  async dbUpdateAccess() {
    await this.dbUpdateMyProps({access: (new Date()).toISOString()});
  }
  static async login(uname, upwd){
    if (!uname || !upwd) {
      return new Error("Not enoght data");
    }
    const userCheck = await this.userCheck(uname, upwd)
    if (userCheck instanceof Error)
      return userCheck
    const user = new this()
    user.props.username = uname
    user.props.password = upwd
    user.props.id = userCheck
    await user.dbLoadMyRelationships()
    await user.dbLoadMyTreeUp(); // ¿Por qué cargar esto, si ya el constructor de user crea la parte de typeuser???
    //await user.dbUpdateAccess(); //Every conexion we make server login so we are not updating the access time
    return user;
  }
  static async autoLogin(uname){
    const userCheck=await this.userCheck(uname, null);
    if (userCheck instanceof Error) return userCheck;
    return this.login(userCheck[0], userCheck[1]);
  }
  
  //**********
  //Get some user data from user name or userAdminType
  static async getEmailAddress(recipient) {
    let myUser;
    if (typeof recipient=="object") {
      myUser=recipient;
      await myUser.getRelationship("usersdata").dbLoadMyChildren();
    }
    else if ("USER_ORDERSADMIN"==recipient || "USER_SYSTEMADMIN"==recipient) {
      //We get the admin user
      let userType="system administrator";
      if ("USER_ORDERSADMIN"==recipient) {
        userType="orders administrator";
      }
      const parent=new this.linkerConstructor("TABLE_USERSTYPES");
      const result=await this.linkerConstructor.dbGetAllChildren(parent, {type: userType});
      if (result.total > 0) {
        parent.addChild(result.data[0]);
        await parent.children[0].dbLoadMyTree();
        if (parent.children[0].getRelationship("users").children.length > 0) {
          myUser=parent.children[0].getRelationship("users").children[0];
        }
      }
    }
    else {
      const result=await this.linkerConstructor.dbGetAllChildren(this.parent, {username: recipient});
      if (result.total > 0) {
        const parent=new this.linkerConstructor("TABLE_USERS");
        myUser=new this();
        parent.addChild(myUser);
        myUser.props.id=result.data[0].props.id;
        await myUser.dbLoadMyRelationships();
        await myUser.getRelationship("usersdata").dbLoadMyChildren();
        await myUser.dbLoadMyTreeUp();
      }
    }
    if (!isset(myUser)) return false;
    //Only send email from user account to himself ... or to admin and from admin to users ??????????
    if (!(myUser.props.id==this.props.id) && !(myUser.parent.partner.props.type=="system administrator" || myUser.parent.partner.props.type=="orders administrator")
      && !(myUser.parent.partner.props.type=="system administrator" || myUser.parent.partner.props.type=="orders administrator")
      && !(this.parent.partner.props.type=="system administrator" || this.parent.partner.props.type=="orders administrator")
    ) {
      return false;
    }
    //Get mail address from user name
    return myUser.getRelationship("usersdata").children[0].props.emailaddress;
  }
  //*********
  async sendMail(to, subject, message, from){
    const nodeMailer = await import("nodemailer");
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: "youremail@gmail.com",
        pass: "yourpassword"
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

// --- helpers

// It creates a seccure crypted key from pwd.
// The result is combination of the crypted key plus the configuration parameters for the encryption
async function cryptPwd(pwd){
  const rdmBytes = 16, iters = 10000, hashBytes = 32, digest = "sha512"
  return await new Promise((resolve, reject)=>{
    randomBytes(16, function(err, salt) {
      if (err) {
        throw err
      }
      pbkdf2(pwd, salt, iters, hashBytes, digest, (err, derivedKey) => {
        if (err)
          throw err
        let combined = Buffer.alloc(2 + 4 + salt.length + derivedKey.length)
        combined.writeUInt16BE(salt.length) // storing salt.length. Bytes [0,1]
        combined.writeUInt32BE(iters, 2) // storing iters. Bytes [2,3,4,5]
        salt.copy(combined, 2 + 4)
        derivedKey.copy(combined, 2 + 4 + salt.length)
        resolve(combined.toString("hex"))
      })
    })
  })
}
async function verifyPwd(pwd, encryptedData){
  const combined = Buffer.from(encryptedData, "hex")
  const digest = "sha512"
  const saltLength = combined.readUInt16BE(0)
  const iters = combined.readUInt32BE(2)
  const salt = combined.slice(2 + 4, 2 + 4 + saltLength)
  const hash = combined.slice(2 + 4 + saltLength)
  return await new Promise((resolve, reject)=>{
    pbkdf2(pwd, salt, iters, hash.length, digest, (err, derivedKey) => {
      if (err)
        throw err
      resolve(derivedKey.toString('hex') == hash.toString('hex'))
    })
  })
}