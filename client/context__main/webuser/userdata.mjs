import {getRoot as getSiteText} from "../sitecontent.mjs"
import {webuser} from "../webuser/webuser.mjs"
import {selectorFromAttr} from "../../frontutils.mjs"
import {AlertMessage} from "../alert.mjs"
import {checkValidData, validateEmail, checkDataChange} from "../../../shared/datainput.mjs"
import {getLangBranch} from "../languages/languages.mjs"

async function userView(showAddress=false, fieldtype="input"){
  const userviewTp= await getTemplate("userview")
  await setUserData(selectorFromAttr(userviewTp, "data-user-data"))
  getSiteText().getNextChild("not located").getNextChild("save").setContentView(selectorFromAttr(userviewTp, "data-saver"))
  getSiteText().getNextChild("userdataform").getNextChild("fieldCharError").setContentLangView(selectorFromAttr(userviewTp, "data-fieldcharerror"))
  getSiteText().getNextChild("userdataform").getNextChild("emailCharError").setContentLangView(selectorFromAttr(userviewTp, "data-fieldemailerror"))
  await setUserDataSaver(userviewTp)
  return userviewTp
}
export async function userInfoView(){
  const dashPath=getSiteText().getNextChild("dashboard")
  const showuserinfoTp = await getTemplate("showuserinfo")
  dashPath.getNextChild("dashboardtit").setContentView(selectorFromAttr(showuserinfoTp, "data-dash-tit"))
  webuser.writeProp(selectorFromAttr(showuserinfoTp, "data-username"))
  const userView = await userView()

  selectorFromAttr(showuserinfoTp, "data-userview").appendChild(userView)

  document.getElementById("centralcontent").innerHTML=""
  document.getElementById("centralcontent").appendChild(showuserinfoTp)
  setActiveInSite(webuser)
}

export async function addressView(){
  const dashPath=getSiteText().getNextChild("dashboard")
  const showaddressTp = await getTemplate("showaddress")
  dashPath.getNextChild("addresstt").setContentView(selectorFromAttr(showaddressTp, "data-addresstt"))
  const userView = await userView(true)
  selectorFromAttr(showaddressTp, "data-userview").appendChild(userView)
  document.getElementById("centralcontent").innerHTML=""
  document.getElementById("centralcontent").appendChild(showaddressTp)
  setActiveInSite(webuser)
}

async function setUserData(myContainer, showAddress=false, fieldtype="input"){
  async function setField(myNode, fieldTpName, labelsRoot, fieldsContainer){
    for (const propKey in myNode.props) {
      let inputTp = await getTemplate(fieldTpName)
      let inputLabelElm = selectorFromAttr(inputTp, "data-label")
      labelsRoot.getNextChild(propKey).setContentView(inputLabelElm)
      selectorFromAttr(inputLabelElm, "data-value").attributes.for.value=propKey

      let inputElm = selectorFromAttr(inputTp, "data-input")
      inputElm.value = myNode.props[propKey]
      inputElm.attributes.name.value=propKey
      inputElm.attributes.placeholder.value=propKey

      fieldsContainer.appendChild(inputTp)
    }
  }
  if (!webuser._userDataLoaded) {
    await webuser.getRelationship("usersdata").loadRequest("get my children")
    webuser._userDataLoaded=true
  }
  const fieldTpName = fieldtype=="textnode" ? "singlefield" : "singleinput"
  const userDataLabels = getSiteText().getNextChild(webuser.getRelationship("usersdata").props.childTableName)
  await setField(webuser.getRelationship("usersdata").getChild(), fieldTpName, userDataLabels, myContainer)
  if (showAddress) {
    if (!webuser._addressesLoaded) {
      await webuser.getRelationship("addresses").loadRequest("get my children")
      webuser._addressesLoaded=true
    }
    const addressLabels = getSiteText().getNextChild(webuser.getRelationship("addresses").props.childTableName)
    await setField(webuser.getRelationship("addresses").getChild(), fieldTpName, addressLabels, myContainer)
  }
}
// falta revisar
export function setUserDataSaver(viewContainer, externalSave=false){
  const myForm=selectorFromAttr(viewContainer, "data-form")
  //Cancelation of submit is important because there could be enter keyboard pressing in fields
  myForm.addEventListener("submit", (event)=>{
    event.preventDefault()
  })

  // return true if saved
  async function saveUserAddress() {
    //Turn input values to element props
    function formToData(relationship, myform) {
      const data=new relationship.partner.constructor();
      relationship.childTableKeys.filter(propName=>propName!="id" && myform.elements[propName])
      .forEach(key=>data.props[key]=myform.elements[key].value);
      return data;
    }
    async function myUpdateProp(myrel, mydata) {
      if (!checkDataChange(myrel, mydata)) return;
      await myrel.getChild().request("edit my props", {values: mydata.props});
      myrel.childTableKeys.filter(propName=>propName!="id")
      .forEach(propName=>myrel.getChild().props[propName]=userdata.props[propName]);
    }
    const userdata=formToData(webuser.getRelationship("usersdata"), myForm);
    let addressdata;
    if (thisParams.showAddress) {
      addressdata=formToData(webuser.getRelationship("addresses"), myForm);
    }
    let myReturn=checkValidData(userdata)
    if (myReturn!==true) {
      //Errors in characters
      if (myForm.elements[myReturn.errorKey]) myForm.elements[myReturn.errorKey].focus();
      new AlertMessage(myForm.elements.fieldCharError.value, 5000).showAlert();
      return;
    }
    if (addressdata) {
      let myReturn=checkValidData(addressdata);
      if (myReturn!==true) {
        //Errors in characters
        if (myForm.elements[myReturn.errorKey]) myForm.elements[myReturn.errorKey].focus();
        new AlertMessage(myForm.elements.fieldCharError.value, 5000).showAlert();
        return;
      }
    }
    if (!validateEmail(userdata.props.emailaddress)) {
      console.log(userdata, myForm.elements);
      //emal format error
      new AlertMessage(myForm.elements.emailCharError.value, 5000).showAlert();
      myForm.elements.emailaddress.focus();
      return;
    }

    await myUpdateProp(webuser.getRelationship("usersdata"), userdata);
    if (addressdata) {
      await myUpdateProp(webuser.getRelationship("addresses"), addressdata);
    }
    return true;
  }

  if (externalSave) {
    webuser.saveUserAddress=saveUserAddress; // revisarlo!!
  }

  myForm.addEventListener("submit", async function(event) {
    event.preventDefault()
    if (await saveUserAddress()) {
      const savedlabel=getSiteText().getNextChild("not located").getNextChild("saved")
      new AlertMessage(savedlabel.getLangData(), 3000).showAlert() // revisarlo esta mal
    }
  })
}