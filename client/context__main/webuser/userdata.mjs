import {getRoot as getSiteText} from "../sitecontent.mjs"
import {webuser} from "../webuser/webuser.mjs"
import {selectorFromAttr} from "../../frontutils.mjs"
import {checkValidData, validateEmail, checkDataChange} from "../../../shared/datainput.mjs"
import {getLangBranch} from "../languages/languages.mjs"
import {setActiveInSite} from "../activeingroup.mjs"
import {getTemplate} from '../layouts.mjs'
import config from "../cfg/main.mjs"

export async function userInfoView(){
  const dashPath = getSiteText().getNextChild("dashboard")
  const showuserinfoTp = await getTemplate("showuserinfo")
  dashPath.getNextChild("dashboardtit").setContentView(selectorFromAttr(showuserinfoTp, "data-dash-tit"))
  webuser.writeProp(selectorFromAttr(showuserinfoTp, "data-username"))

  selectorFromAttr(showuserinfoTp, "data-userview").appendChild(await userView())

  setActiveInSite(webuser)
  return showuserinfoTp
}

export async function addressView(){
  const dashPath = getSiteText().getNextChild("dashboard")
  const showaddressTp = await getTemplate("showaddress")
  dashPath.getNextChild("addresstt").setContentView(selectorFromAttr(showaddressTp, "data-addresstt"))
  const userView = await userView(true)
  selectorFromAttr(showaddressTp, "data-userview").appendChild(userView)
  document.getElementById("centralcontent").innerHTML=""
  document.getElementById("centralcontent").appendChild(showaddressTp)
  setActiveInSite(webuser)
}

async function userView(showAddress=false, fieldtype="input"){
  const userviewTp= await getTemplate("userview")
  await setUserData(selectorFromAttr(userviewTp, "data-user-data"))
  getSiteText().getNextChild("not located").getNextChild("save").setContentView(selectorFromAttr(userviewTp, "data-saver"))
  getSiteText().getNextChild("userdataform").getNextChild("fieldCharError").setContentView(selectorFromAttr(userviewTp, "data-fieldcharerror"))
  getSiteText().getNextChild("userdataform").getNextChild("emailCharError").setContentView(selectorFromAttr(userviewTp, "data-fieldemailerror"))
  await setUserDataSaver(userviewTp)
  return userviewTp
}

async function setUserData(myContainer, showAddress=false, fieldtype="input"){
  async function setField(myNode, fieldTpName, labelsRoot, fieldsContainer){
    console.log(myNode.props, myNode.parent.childTableKeys)
    for (const propKey of myNode.parent.childTableKeys) {
      let inputTp = await getTemplate(fieldTpName)
      let inputLabelElm = selectorFromAttr(inputTp, "data-label")
      labelsRoot.getNextChild(propKey).setContentView(inputLabelElm)
      selectorFromAttr(inputLabelElm, "data-value").attributes.for.value = propKey
      let inputElm = selectorFromAttr(inputTp, "data-input")
      if (myNode.props[propKey]!==undefined)
        inputElm.value = myNode.props[propKey]
      inputElm.attributes.name.value = propKey
      inputElm.attributes.placeholder.value = propKey
      fieldsContainer.appendChild(inputTp)
    }
  }
  const fieldTpName = fieldtype=="textnode" ? "singlefield" : "singleinput"
  const userDataLabels = getSiteText().getNextChild(webuser.getRelationship("usersdata").props.childTableName)
  await setField(webuser.getRelationship("usersdata").getChild(), fieldTpName, userDataLabels, myContainer)
  if (showAddress) {
    const addressLabels = getSiteText().getNextChild(webuser.getRelationship("addresses").props.childTableName)
    await setField(webuser.getRelationship("addresses").getChild(), fieldTpName, addressLabels, myContainer)
  }
}
// falta revisar
export function setUserDataSaver(viewContainer, showAddress=false){
  const myForm = selectorFromAttr(viewContainer, "data-form")
  //Cancelation of submit is important because there could be enter keyboard pressing in fields
  myForm.addEventListener("submit", (event)=>{
    event.preventDefault()
  })

  // return true if saved
  async function saveUserData(myForm) {
    async function updateProps(myNode, mydata) {
      if (!checkDataChange(myNode, mydata))
        return
      await myNode.request("edit my props", {values: mydata})
      myNode.parent.childTableKeys
      .filter(propName=>propName!="id")
      .forEach(propName=>myNode.props[propName] = mydata[propName])
    }
    const userdata = formToData(webuser.getRelationship("usersdata").childTableKeys, myForm)
    if (checkValidData(userdata) instanceof Error) {
      return checkValidData(userdata)
    }
    if (!validateEmail(userdata.emailaddress)) {
      return new Error(`{"errorKey" : "emailaddress"}`)
    }
    if (showAddress) {
      const addressdata = formToData(webuser.getRelationship("addresses").childTableKeys, myForm)
      if (checkValidData(addressdata) instanceof Error) {
        return checkValidData(addressdata)
      }
      await updateProps(webuser.getRelationship("addresses").getChild(), addressdata)
    }
    await updateProps(webuser.getRelationship("usersdata").getChild(), userdata)

    // Helpers
    //Turn input values to element props
    function formToData(formKeys, myform) {
      return formKeys
      .reduce((data, propName)=>{
        if (propName=="id")
          return data
        data[propName] = myform.elements[propName].value
        return data
      }, {})
    }
  }
  myForm.addEventListener("submit", async function(event) {
    event.preventDefault()
    const saveReturn = await saveUserData(this)
    if (saveReturn instanceof Error) {
      const errorKey = JSON.parse(saveReturn.message).errorKey
      const errorField = errorKey == "emailaddress" ? "emailCharError" : "fieldCharError"
      document.createElement("alert-element").showMsg(myForm.elements[errorField].value, 5000)
      if (myForm.elements[errorKey])
        myForm.elements[errorKey].focus()
      return
    }
    document.createElement("alert-element").showMsg(getSiteText().getNextChild("not located").getNextChild("saved").getLangData(), 3000)
  })
}