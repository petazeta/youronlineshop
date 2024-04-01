import {getRoot as getSiteText} from "../sitecontent.mjs"
import {selectorFromAttr} from "../../frontutils.mjs"
import {checkValidData, validateEmail, checkDataChange} from "../../../shared/datainput.mjs"
import {getTemplate} from '../layouts.mjs'
import {dataView} from "../../displaydata.mjs"

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
    await saveUserData(myData, myForm, ["comments"])
  })
  return container
}

export async function saveUserData(myNodes, myForm, excludeCheck=[], excludeSave=[]){
  if (!Array.isArray(myNodes))
    myNodes = [myNodes]
  try {
    await innerSave()
  }
  catch(err){
    const errorKey = JSON.parse(err.message).errorKey
    const errorField = errorKey == "emailaddress" ? "emailCharError" : "fieldCharError"
    document.createElement("alert-element").showMsg(myForm.elements[errorField].value, 5000)
    if (myForm.elements[errorKey])
      myForm.elements[errorKey].focus()
    return err
  }
  document.createElement("alert-element").showMsg(getSiteText().getNextChild("not located").getNextChild("saved").getLangData(), 3000)

  // Helpers
  async function innerSave() {
    for (const myNode of myNodes) {
      const myData = formToData(myNode.getParent().childTableKeys, myForm)
      const saveData = Object.entries(myData).reduce((acc, [key, val])=>{
        if (!excludeSave.includes(key))
          acc[key] = val
        return acc
      }, {})
      const checkData = Object.entries(myData).reduce((acc, [key, val])=>{
        if (!excludeCheck.includes(key))
          acc[key] = val
        return acc
      }, {})
      checkValidData(checkData)
      if (checkData.emailaddress && !validateEmail(checkData.emailaddress)) {
        throw new Error(`{"errorKey" : "emailaddress"}`)
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
      /*
      myNode.parent.childTableKeys
      //.filter(propName=>propName!="id")
      .forEach(propName=>myNode.props[propName] = mydata[propName])
      */
    }
  }
}

// Helpers
async function userDataInfoView_old(myData, fieldtype="input"){ // fieldtype: textnode
  const container = selectorFromAttr(await getTemplate("userinfo"), "data-container")
  selectorFromAttr(container, "data-userdata").appendChild(await userDataView(myData, fieldtype))
  getSiteText().getNextChild("not located").getNextChild("save").setContentView(selectorFromAttr(container, "data-saver"))
  selectorFromAttr(container, "data-saver").addEventListener("click", async ev=>{
    ev.preventDefault()
    await saveUserData(myData, selectorFromAttr(container, "data-form"))
  })
  return container
}


/*
  // It adds the fields for a user data container
  if (!Array.isArray(myNodes))
    myNodes = [myNodes]
  if (!Array.isArray(myLabels))
    myLabels = [myLables]
  for (const [myNode, myLabel] of zip(myNodes, myLabels)) {
    let labelsRoot = getSiteText().getNextChild(myNode.getParent().props.childTableName)
    for (const propKey of myNode.getParent().childTableKeys) {
      let fieldTpName = fieldtype=="textnode" ? "singlefield" : "singleinput"
      let myContainer = (await getTemplate(fieldTpName)).querySelector("[data-container]")
      let myLabelElm = selectorFromAttr(myContainer, "data-label")
      if (labelsRoot)
        labelsRoot.getNextChild(propKey).setContentView(myLabelElm)
      else
        selectorFromAttr(myLabelElm, "data-value").textContent = propKey
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
*/