import {checkValidData} from "../../../shared/datainput.mjs"
import {observerMixin} from "../../observermixin.mjs"
import {selectorFromAttr} from "../../frontutils.mjs" // (elm, attName, attValue)
import {getRoot as getSiteText} from "../sitecontent.mjs"
import {getLangBranch} from "../languages/languages.mjs"
import {webuser} from "../webuser/webuser.mjs"
import {setNav, initialNavSearch} from "../navhistory.mjs"
import {getTemplate} from "../layouts.mjs"
import {userMenuView} from "./usermenu.mjs"
import {rmBoxView} from "../../rmbox.mjs"

export async function setLogIcon(logContainer) {
  const logText = getSiteText().getNextChild("logbox")
  // add observer prototype
  Object.setPrototypeOf(logText, observerMixin(logText.constructor).prototype) // adding methods 
  observerMixin(Object).prototype.initObserver.call(logText) // adding properties : calling constructor
  // set log label text depending on webuser log status
  const setLogLabel = () => webuser.props.id ? logText.getNextChild("logboxin").getNextChild("title").write(logContainer) : logText.getNextChild("logboxout").getNextChild("title").write(logContainer)
  const showUserMenu = ()=>{
    document.getElementById("dashmenu").style.visibility="visible"
    document.getElementById("dashmenu").style.transform="translateY(15px)"
  }
  const hideUserMenu=()=>{
    document.getElementById("dashmenu").style.transform="translateY(-15px)"
    document.getElementById("dashmenu").style.visibility="hidden"
  }
  const switchUserMenu=()=>{
    if (document.getElementById("dashmenu").style.visibility=="visible") {
      hideUserMenu()
      return
    }
    showUserMenu()
  }
  setLogLabel()
  if (webuser.props.id) {
    document.getElementById("dashmenu").innerHTML = ""
    document.getElementById("dashmenu").appendChild(await userMenuView(hideUserMenu))
  }
  async function logAction(){
    if (webuser.props.id) {
      switchUserMenu()
      return
    }
    const loginFrame = await getTemplate("loginframe")
    selectorFromAttr(loginFrame, "data-card-body").appendChild(await rmBoxView(getTemplate, await loginFormView(), selectorFromAttr(loginFrame, "data-container")))
    document.body.appendChild(loginFrame)
  }
  // We set an entrance for a login view *** ??? no se si utiliza el id, hay que revisar
  setNav(logText, "login", ["login"], logAction)
  initialNavSearch(logText, "login", ["login"], logAction)
  //setNavUrl(logText, "?login=login", logAction)
  selectorFromAttr(logContainer, "data-log-icon-button").addEventListener("click", function(event){
    event.preventDefault()
    logAction()
  })
  webuser.attachObserver("log", logText)
  logText.setReaction("log", async ()=>{
    console.log(`logicon node id=${logText.props.id} said "webuser log ${webuser.props.id}"`)
    setLogLabel()

    if (webuser.props.id) {
      document.getElementById("dashmenu").innerHTML = ""
      document.getElementById("dashmenu").appendChild(await userMenuView(hideUserMenu))
      showUserMenu()
    }
    else hideUserMenu()
  })
}

export async function loginFormView() {
  const logTp = await getTemplate("loginform")
  const logContainer = selectorFromAttr(logTp, "data-container")
  const logformTxt = getSiteText().getNextChild("logform")
  logformTxt.getNextChild("userName").setContentView(selectorFromAttr(logContainer, "data-username-label"))
  logformTxt.getNextChild("userName").write(selectorFromAttr(logContainer, "data-username-input"), undefined, undefined, "placeholder")
  logformTxt.getNextChild("password").setContentView(selectorFromAttr(logContainer, "data-password-label"))
  logformTxt.getNextChild("password").write(selectorFromAttr(logContainer, "data-password-input"), undefined, undefined, "placeholder")
  logformTxt.getNextChild("rememberme").setContentView(selectorFromAttr(logContainer, "data-rememberme"))
  if (localStorage.getItem("user_name"))
    selectorFromAttr(selectorFromAttr(logContainer, "data-rememberme"), "data-checkbox").checked = true
  logformTxt.getNextChild("login").setContentView(selectorFromAttr(logContainer, "data-login-button"))
  logformTxt.getNextChild("userCharError").setContentView(selectorFromAttr(logContainer, "data-usercharerror"))
  logformTxt.getNextChild("pwdCharError").setContentView(selectorFromAttr(logContainer, "data-pwdcharerror"))
  logformTxt.getNextChild("loginOk").setContentView(selectorFromAttr(logContainer, "data-loginok"))
  logformTxt.getNextChild("userError").setContentView(selectorFromAttr(logContainer, "data-usererror"))
  logformTxt.getNextChild("pwdError").setContentView(selectorFromAttr(logContainer, "data-pwderror"))
  logformTxt.getNextChild("newuserbt").setContentView(selectorFromAttr(logContainer, "data-newuser"))
  selectorFromAttr(selectorFromAttr(logContainer, "data-newuser"), "data-btn").addEventListener("click", (ev)=>{
    ev.preventDefault()
    //thisNode.setView(document.getElementById("login-card").querySelector("[data-id=rm-body]"), "newform")
  });
  selectorFromAttr(logContainer, "data-form").addEventListener("submit", async function(event) {
    event.preventDefault()
    loginFormSubm(this)
  })
  return logTp
}
async function newFormView() {}

export async function loginFormSubm(formElement) {
  const logFormTxt = getSiteText().getNextChild("logform")
  const checkData = checkValidData({props: {user_name: formElement.elements.user_name.value, user_password: formElement.elements.user_password.value}});
  if (checkData!==true) {
    //Errors in characters
    let errorMessage;
    if (checkData.errorKey=="user_name")
      errorMessage = getLangBranch(logFormTxt.getNextChild("userCharError")).getChild().props.value
    else if (checkData.errorKey=="user_password")
      errorMessage = getLangBranch(logFormTxt.getNextChild("pwdCharError")).getChild().props.value
    if (formElement.elements[checkData.errorKey])
      formElement.elements[checkData.errorKey].focus()
    document.createElement("alert-element").showMsg(errorMessage, 3000)
    return
  }
  const storeChecked = formElement.elements.rememberme.checked
  const uname = formElement.elements.user_name.value
  const upass = formElement.elements.user_password.value
  webuser.login(uname, upass)
  .then(async ()=> {
    const loginOkMsg = getLangBranch(logFormTxt.getNextChild("loginOk")).getChild().props.value.replace("${user_name}", uname)
    document.createElement("alert-element").showMsg(loginOkMsg, 3000)
    if (storeChecked) {
      localStorage.setItem("user_name", uname)
      localStorage.setItem("user_password", upass)
    }
    else {
      if (localStorage.getItem("user_name"))
        localStorage.removeItem("user_name")
    }
    await loginDashboard()
  })
  .catch(error => { //error is Error object
    const errorMessage = formElement.elements[error.message]?.value || error.message
    document.createElement("alert-element").showMsg(errorMessage, 3000)
  })
}
export async function signUpFormSubm(formElement) {
  const logFormTxt=getSiteText().getNextChild("logform")
  const checkData=checkValidData({props: {user_name: formElement.elements.user_name.value, user_password: formElement.elements.user_password.value}});
  if (checkData!==true) {
    //Errors in characters
    let errorMessage;
    if (checkData.errorKey=="user_name") errorMessage=getLangBranch(logFormTxt.getNextChild("userCharError")).getChild().props.value
    else if (checkData.errorKey=="user_password") errorMessage=getLangBranch(logFormTxt.getNextChild("pwdCharError")).getChild().props.value
    if (formElement.elements[checkData.errorKey]) formElement.elements[checkData.errorKey].focus()
    document.createElement("alert-element").showMsg(errorMessage, 3000)
    return
  }
  // pwd and repaet pwd
  if (formElement.elements.user_password.value!=formElement.elements.repeat_password.value) {
    document.createElement("alert-element").showMsg(getLangBranch(logFormTxt.getNextChild("pwdDoubleError")).getChild().props.value, 3000)
    formElement.elements.user_password.focus()
    return
  }
  const uname=formElement.elements.user_name.value
  const upass=formElement.elements.user_password.value
  webuser.constructor.create(uname, thisElement.elements.user_password.value)
  .then(result =>{
    webuser.login(uname, upass, result)
    .then( ()=>{
      document.createElement("alert-element").showMsg(getLangBranch(logFormTxt.getNextChild("signedIn")).getChild().props.value, 3000)
      loginDashboard()
    })
  })
  .catch(error=>{
    const errorMessage=thisElement.elements[error.message]?.value || error.message;
    document.createElement("alert-element").showMsg(errorMessage, 3000);
  })
}

async function loginDashboard(){
  // close login card
  const loginCard = document.getElementById("login-card")
  loginCard.parentElement.removeChild(loginCard)
  if (webuser.isAdmin()) {
    async function blink(domElement){
      let isMouseOver = false, blinkTimes = 0, intervalId
      function innerBlink(){
        if (isMouseOver) {
          domElement.dispatchEvent(new Event("mouseout"))
          isMouseOver = false
          if (blinkTimes >= 2) {
            clearInterval(intervalId)
          }
        }
        else {
          domElement.dispatchEvent(new Event("mouseover"))
          isMouseOver = true
          ++blinkTimes
        }
      }
      innerBlink()
      intervalId = setInterval(innerBlink, 1 * 1000)
    }
    if (webuser.isProductAdmin()) {
      const {getRoot} = await import("../catalog/categories.mjs")
      for (const cat of getRoot().getMainBranch().children) {
        blink((cat.firstElement))
      }
    }
    if (webuser.isWebAdmin()) {
      const {getRoot} = await import("../pages/pages.mjs")
      for (const menu of getRoot().getMainBranch().children) {
        blink((menu.firstElement))
      }
      blink(window.document.querySelector(".pgtitle h1 div"))
    }
    return // No dashboard screen no need to do anything
  }
  // if cart it is not empty -> redirect to checkout
  const {myCart} = await import("./cart.mjs")
  const {setActiveInGroup} = await import("./activeingroup.mjs")
  if (myCart.getRelationship().children.length>0) {
    new getSiteText().constructor.nodeConstructor().setView(document.getElementById("centralcontent"), "chktmain")
  }
  else {
    new getSiteText().constructor.nodeConstructor().setView(document.getElementById("centralcontent"), "showuserinfo")
  }
}