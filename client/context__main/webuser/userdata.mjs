import {getRoot as getSiteText} from "../sitecontent.mjs"
import {selectorFromAttr} from "../../frontutils.mjs"
import {checkValidData, validateEmail, checkDataChange} from "../../../shared/datainput.mjs"
import {getTemplate} from '../layouts.mjs'

export async function userInfoView(myUser){
  const dashPath = getSiteText().getNextChild("dashboard")
  const container = selectorFromAttr(await getTemplate("showuserinfo"), "data-container")
  dashPath.getNextChild("dashboardtit").setContentView(selectorFromAttr(container, "data-dash-tit"))
  myUser.writeProp(selectorFromAttr(container, "data-username"))
  const myData = [myUser.getRelationship("usersdata").getChild()]
  selectorFromAttr(container, "data-userinfo").appendChild(await userDataInfoView(myData))
  return container
}
export async function userAddressView(myUser){
  const dashPath = getSiteText().getNextChild("dashboard")
  const container = selectorFromAttr(await getTemplate("showaddress"), "data-container")
  dashPath.getNextChild("addresstt").setContentView(selectorFromAttr(container, "data-addresstt"))
  const myData = [myUser.getRelationship("usersdata").getChild(), myUser.getRelationship("addresses").getChild()]
  selectorFromAttr(container, "data-userinfo").appendChild(await userDataInfoView(myData))
  return container
}

export async function userDataView(myNodes, fieldtype="input"){ // myNodes: nodes with user data
  const container = selectorFromAttr(await getTemplate("userdata"), "data-container")
  const myForm =  selectorFromAttr(container, "data-form")
  //Cancelation of submit is important because there could be enter keyboard pressing in fields
  myForm.addEventListener("submit", (event)=>{
    event.preventDefault()
  })
  // It adds the fields for a user data container
  if (!Array.isArray(myNodes))
    myNodes = [myNodes]
  for (const myNode of myNodes) {
    let labelsRoot = getSiteText().getNextChild(myNode.getParent().props.childTableName)
    for (const propKey of myNode.getParent().childTableKeys) {
      let fieldTpName = fieldtype=="textnode" ? "singlefield" : "singleinput"
      let myContainer = (await getTemplate(fieldTpName)).querySelector("[data-container]")
      let myLabelElm = selectorFromAttr(myContainer, "data-label")
      if (labelsRoot)
        labelsRoot.getNextChild(propKey).setContentView(myLabelElm)
      selectorFromAttr(myLabelElm, "data-value").attributes.for.value = propKey
      let selector = fieldtype=="textnode" ? "data-text" : "data-input"
      let myElm = selectorFromAttr(myContainer, selector)
      if (myNode.props[propKey]!==undefined) {
        if (fieldtype=="textnode")
          myElm.textContent = myNode.props[propKey]
        else
          myElm.value = myNode.props[propKey]
      }
      if (fieldtype=="input") {
        myElm.attributes.name.value = propKey
        myElm.attributes.placeholder.value = propKey
      }
      selectorFromAttr(myForm, "data-userdata").appendChild(myContainer)
    }
  }
  getSiteText().getNextChild("userdataform").getNextChild("fieldCharError").setContentView(selectorFromAttr(myForm, "data-fieldcharerror"))
  getSiteText().getNextChild("userdataform").getNextChild("emailCharError").setContentView(selectorFromAttr(myForm, "data-fieldemailerror"))

  return container
}

export async function saveUserData(myNodes, myForm){
  if (!Array.isArray(myNodes))
    myNodes = [myNodes]
  const saveReturn = await innerSave()
  if (saveReturn instanceof Error) {
    const errorKey = JSON.parse(saveReturn.message).errorKey
    const errorField = errorKey == "emailaddress" ? "emailCharError" : "fieldCharError"
    document.createElement("alert-element").showMsg(myForm.elements[errorField].value, 5000)
    if (myForm.elements[errorKey])
      myForm.elements[errorKey].focus()
    return saveReturn
  }
  document.createElement("alert-element").showMsg(getSiteText().getNextChild("not located").getNextChild("saved").getLangData(), 3000)

  // Helpers
  // ****  quiza sería mejor hacer catch error y olvidarse de este lio de errores, entonces habria que cambiar tambien checkValidData
  async function innerSave() {
    for (const myNode of myNodes) {
      const myData = formToData(myNode.getParent().childTableKeys, myForm)
      if (checkValidData(myData) instanceof Error)
        return checkValidData(myData)
      if (myData.emailaddress && !validateEmail(myData.emailaddress)) {
        return new Error(`{"errorKey" : "emailaddress"}`)
      }
      await updateProps(myNode, myData)
    }

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
    async function updateProps(myNode, mydata) {
      if (!checkDataChange(myNode, mydata))
        return
      await myNode.request("edit my props", {values: mydata})
      myNode.parent.childTableKeys
      .filter(propName=>propName!="id")
      .forEach(propName=>myNode.props[propName] = mydata[propName])
    }
  }
}

// Helpers
async function userDataInfoView(myData, fieldtype="input"){ // fieldtype: textnode
  const container = selectorFromAttr(await getTemplate("userinfo"), "data-container")
  selectorFromAttr(container, "data-userdata").appendChild(await userDataView(myData, fieldtype))
  getSiteText().getNextChild("not located").getNextChild("save").setContentView(selectorFromAttr(container, "data-saver"))
  selectorFromAttr(container, "data-saver").addEventListener("click", async ev=>{
    ev.preventDefault()
    await saveUserData(myData, selectorFromAttr(container, "data-form"))
  })
  return container
}