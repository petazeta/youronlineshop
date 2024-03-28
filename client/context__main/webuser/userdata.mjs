import {getRoot as getSiteText} from "../sitecontent.mjs"
import {selectorFromAttr} from "../../frontutils.mjs"
import {checkValidData, validateEmail, checkDataChange} from "../../../shared/datainput.mjs"
import {getTemplate} from '../layouts.mjs'
import {dataView} from "../../displaydata.mjs"
import {zip} from "../../../shared/utils.mjs"

export async function userInfoView(myUser){
  const container = selectorFromAttr(await getTemplate("showuserinfo"), "data-container")
  getSiteText().getNextChild("dashboard").getNextChild("dashboardtit").setContentView(selectorFromAttr(container, "data-dash-tit"))
  myUser.writeProp(selectorFromAttr(container, "data-username"))

  const userDataContainer = selectorFromAttr(await getTemplate("userdata"), "data-container")
  selectorFromAttr(container, "data-userdataform").appendChild(userDataContainer)

  const myForm =  selectorFromAttr(userDataContainer, "data-form")
  //Cancelation of submit is important because there could be enter keyboard pressing in fields
  myForm.addEventListener("submit", (event)=>{
    event.preventDefault()
  })
  const myData = myUser.getRelationship("usersdata").getChild()
  const myLabel = getSiteText().getNextChild(myData.getParent().props.childTableName)
  await dataView(await getTemplate("singleinput"), myData, selectorFromAttr(myForm, "data-userdata"), myLabel)
  getSiteText().getNextChild("userdataform").getNextChild("fieldCharError").setContentView(selectorFromAttr(myForm, "data-fieldcharerror"))
  getSiteText().getNextChild("userdataform").getNextChild("emailCharError").setContentView(selectorFromAttr(myForm, "data-fieldemailerror"))

  getSiteText().getNextChild("not located").getNextChild("save").setContentView(selectorFromAttr(container, "data-saver"))
  selectorFromAttr(container, "data-saver").addEventListener("click", async ev=>{
    ev.preventDefault()
    await saveUserData(myData, myForm)
  })
  return container
}

export async function userAddressView(myUser){
  const container = selectorFromAttr(await getTemplate("showaddress"), "data-container")
  getSiteText().getNextChild("dashboard").getNextChild("addresstt").setContentView(selectorFromAttr(container, "data-addresstt"))

  const userDataContainer = selectorFromAttr(await getTemplate("userdata"), "data-container")
  selectorFromAttr(container, "data-addressform").appendChild(userDataContainer)

  const myForm =  selectorFromAttr(userDataContainer, "data-form")
  //Cancelation of submit is important because there could be enter keyboard pressing in fields
  myForm.addEventListener("submit", (event)=>{
    event.preventDefault()
  })
  const myData = myUser.getRelationship("addresses").getChild()
  const myLabel = getSiteText().getNextChild(myData.getParent().props.childTableName)
  await dataView(await getTemplate("singleinput"), myData, selectorFromAttr(myForm, "data-userdata"), myLabel)
  getSiteText().getNextChild("userdataform").getNextChild("fieldCharError").setContentView(selectorFromAttr(myForm, "data-fieldcharerror"))
  getSiteText().getNextChild("userdataform").getNextChild("emailCharError").setContentView(selectorFromAttr(myForm, "data-fieldemailerror"))

  getSiteText().getNextChild("not located").getNextChild("save").setContentView(selectorFromAttr(container, "data-saver"))
  selectorFromAttr(container, "data-saver").addEventListener("click", async ev=>{
    ev.preventDefault()
    await saveUserData(myData, myForm, "comments")
  })
  return container
}

// returns true if successful
export async function saveUserData(myNodes, myForm, checkExcludeds, saveExcludeds){
  if (!Array.isArray(myNodes))
    myNodes = [myNodes]
  if (!Array.isArray(checkExcludeds))
    checkExcludeds = new Array(myNodes.length).fill(checkExcludeds)
  if (!Array.isArray(saveExcludeds))
    saveExcludeds = new Array(myNodes.length).fill(saveExcludeds)
  try {
    await innerSave()
  }
  catch(err){
    if (err.cause != "human")
      throw err
    const errorKey = JSON.parse(err.message).errorKey
    const errorField = errorKey == "emailaddress" ? "emailCharError" : "fieldCharError"
    document.createElement("alert-element").showMsg(myForm.elements[errorField].value, 5000)
    if (myForm.elements[errorKey])
      myForm.elements[errorKey].focus()
    return false
  }
  document.createElement("alert-element").showMsg(getSiteText().getNextChild("not located").getNextChild("saved").getLangData(), 3000)
  return true

  // Helpers
  async function innerSave() {
    for (let [myNode, checkExcluded, saveExcluded] of zip(myNodes, checkExcludeds, saveExcludeds)) {
      if (!Array.isArray(checkExcluded))
        checkExcluded = [checkExcluded]
      if (!Array.isArray(saveExcluded))
        saveExcluded = [saveExcluded]
      const myData = formToData(myNode.getParent().childTableKeys, myForm)
      const saveData = Object.entries(myData).reduce((acc, [key, val])=>{
        if (!saveExcluded.includes(key))
          acc[key] = val
        return acc
      }, {})
      const checkData = Object.entries(myData).reduce((acc, [key, val])=>{
        if (!checkExcluded.includes(key))
          acc[key] = val
        return acc
      }, {})
      checkValidData(checkData)
      if (checkData.emailaddress && !validateEmail(checkData.emailaddress)) {
        throw new Error(`{"errorKey" : "emailaddress"}`, {cause: "human"})
      }
      await updateProps(myNode, saveData)
    }

    // Helpers
    //Turn input values to element props
    function formToData(formKeys, myform) {
      return formKeys
      .reduce((data, propName)=>{
        if (!myform.elements[propName])
          return data
        data[propName] = myform.elements[propName].value
        return data
      }, {})
    }
    async function updateProps(myNode, mydata) {
      if (!checkDataChange(myNode, mydata))
        return
      await myNode.loadRequest("edit my props", {values: mydata})
    }
  }
}

export async function changePwdView(myUser){
  const container = selectorFromAttr(await getTemplate("changepwd"), "data-container")
  const textBase = getSiteText().getNextChild("dashboard").getNextChild("changepwd")
  textBase.getNextChild("titmsg").setContentView(selectorFromAttr(container, "data-titmsg"))

  textBase.getNextChild("newpwd").setContentView(selectorFromAttr(selectorFromAttr(container, "data-password"), "data-label"))
  textBase.getNextChild("newpwd").write(selectorFromAttr(container, "data-password"), undefined, "text", "placeholder")
  textBase.getNextChild("repeatpwd").setContentView(selectorFromAttr(selectorFromAttr(container, "data-repeat-password"), "data-label"))
  textBase.getNextChild("repeatpwd").write(selectorFromAttr(container, "data-repeat-password"), undefined, "text", "placeholder")
  textBase.getNextChild("btsmt").setContentView(selectorFromAttr(container, "data-save"))

  const logformTxt = getSiteText().getNextChild("logform")
  logformTxt.getNextChild("pwdCharError").setContentView(selectorFromAttr(container, "data-pwdcharerror"))
  textBase.getNextChild("pwdChangeOk").setContentView(selectorFromAttr(container, "data-pwdok"))
  textBase.getNextChild("pwdChangeError").setContentView(selectorFromAttr(container, "data-pwd-error"))
  textBase.getNextChild("pwdDoubleError").setContentView(selectorFromAttr(container, "data-pwd-double-error"))

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

