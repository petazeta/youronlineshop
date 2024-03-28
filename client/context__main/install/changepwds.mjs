import {getTemplate} from "../layouts.mjs"
import {webuser} from '../webuser/webuser.mjs'
import {getRoot as getSiteText} from "../sitecontent.mjs"
import {selectorFromAttr} from "../../frontutils.mjs"
import {checkValidData} from "../../../shared/datainput.mjs"


export async function chagePwdsView() {
  await webuser.login("systemadmin", "systemadmin")
  const myTp = await getTemplate("chgadmnpwd")
  const container = selectorFromAttr(myTp, "data-container")
  //We load administration users
  const usersTypes = await new webuser.constructor.linkerConstructor('TABLE_USERSTYPES').loadRequest("get all my children")

  for (const userType of usersTypes.children) {
    await userType.loadRequest("get my relationships")
    userType.getRelationship("users").addChild(new webuser.constructor()) // just for checking if userType has admin privileges
  }

  for (const adminType of usersTypes.children.filter(usersType=>usersType.getRelationship("users").getChild().isAdmin())) {
    adminType.getRelationship("users").removeChild(adminType.getRelationship("users").getChild()) // remove the temporal child
    let myUser = (await adminType.getRelationship("users").loadRequest("get my children")).getChild()
    Object.setPrototypeOf(myUser, webuser.constructor.prototype) // adding methods
    selectorFromAttr(container, "data-wrapper").appendChild(await singlePwdView(myUser, selectorFromAttr(selectorFromAttr(myTp, "data-single-pwd").content, "data-form").cloneNode(true)))
  }
  const myBut = selectorFromAttr(container, "data-finish-btn")
  // falta setContentView myBut
  myBut.addEventListener("click", (event)=>{
    webuser.logout()
    .then(()=>location.reload())
  })
  return container
}
async function singlePwdView(myUser, container){
  const textBase = getSiteText().getNextChild("dashboard").getNextChild("changepwd")
  const logformTxt = getSiteText().getNextChild("logform")
  textBase.getNextChild("titmsg").setContentView(selectorFromAttr(container, "data-titmsg"))
  myUser.writeProp(selectorFromAttr(selectorFromAttr(container, "data-titmsg"), "data-username"), "username")

  textBase.getNextChild("newpwd").setContentView(selectorFromAttr(selectorFromAttr(container, "data-password"), "data-label"))
  textBase.getNextChild("newpwd").write(selectorFromAttr(container, "data-password"), undefined, "text", "placeholder")
  textBase.getNextChild("repeatpwd").setContentView(selectorFromAttr(selectorFromAttr(container, "data-repeat-password"), "data-label"))
  textBase.getNextChild("repeatpwd").write(selectorFromAttr(container, "data-repeat-password"), undefined, "text", "placeholder")
  textBase.getNextChild("btsmt").setContentView(selectorFromAttr(container, "data-save"))

  selectorFromAttr(container, "data-form").addEventListener("submit", async function(ev){
    ev.preventDefault()
    try {
      checkValidData({new_password: this.elements.new_password.value})
    }
    catch(err){
      if (err.cause!="human")
        throw err
      dataError(err, this)
      return
    }
    // pwd and repaet pwd
    if (this.elements.new_password.value!=this.elements.repeat_password.value) {
      document.createElement("alert-element").showMsg(textBase.getNextChild("pwdDoubleError").getLangData(), 3000)
      this.elements.new_password.focus()
      return
    }
    myUser.updateMyPwd(this.elements.new_password.value)
    .then( async ()=>{
      document.createElement("alert-element").showMsg(textBase.getNextChild("pwdChangeOk").getLangData(), 3000)
    })
    .catch(error=>{
      document.createElement("alert-element").showMsg(textBase.getNextChild("pwdChangeError").getLangData(), 3000)
      throw error
    })
  })
  return container
  function dataError(err, formElement) {
    const errorKey = JSON.parse(err.message).errorKey
    if (errorKey=="new_password")
      document.createElement("alert-element").showMsg(logformTxt.getNextChild("pwdCharError").getLangData(), 3000)
    else if (errorKey=="repeat_password")
      document.createElement("alert-element").showMsg(textBase.getNextChild("pwdDoubleCharError").getLangData(), 3000)
    if (formElement.elements[errorKey])
      formElement.elements[errorKey].focus()
  }
}