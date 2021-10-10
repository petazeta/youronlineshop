import config from './modules/config.js'
import {Node, NodeFemale, NodeMale} from './modules/nodesfront.js';
import {startTheme} from './modules/themesfront.js';
import myWebuser from './modules/webuser.js';
import StatsRecorder from './modules/statistics.js';
import {loadLanguages, selectMyLanguage} from './modules/languages.js';
import {textContent} from './modules/textcontent.js';
import {Alert, AlertMessage} from './modules/alert.js';

webuser=myWebuser;

if (!window.location.search && config.initUrl && config.initUrl.includes('?')) { //For special starting window
  history.pushState({url:config.initUrl}, null, config.initUrl);
}
window.textEditorSaved=''; //This var saves the textEditor data to not be deteleted each time

import('./modules/availablestates.js')
.then(({onPopState})=>{
  window.onpopstate=onPopState;
});



const myRecorder=new StatsRecorder();


//window.domelementsroot=null;
//window.languages=null; //deprecated
//window.theme=theme;

//Node=myNode;
//NodeFemale=myNodeFemale;
//NodeMale=myNodeMale;
//window.Alert=Alert; //deprecated
//window.AlertMessage=AlertMessage; //deprecated
//window.Theme=Theme;
//window.Config=config;

import {setInitUrl} from './modules/initurl.js'
//For init url set facility
if (window.location.search) {
  setInitUrl(window.location.search);
}

//We check if they try to exec the app directly throw the file
if (window.location.protocol=="file:") {
  window.addEventListener ("load", ()=>(new AlertMessage()).showAlert('You are trying to launch the app straight through your web browser.<BR><p><B>This is Not the correct way to execute the app.</B></p>Check README.txt file.', document.getElementById('syserror')));
}

Node.makeRequest("get tables")
.then(async (tables)=>{
  const themeActive=await startTheme(config.themeId);
  if (tables.length==0) {
    //Ask for the option of importing database
    (new NodeMale()).setView(document.body, "dbsqlimport");
    return;
  }
  
  //Load languages and select my language
  const languages= await loadLanguages();
  //if no root means that table domelements doesn't exist or has no elements
  if (languages.children.length==0) {
    throw new Error('Database Content Error');
  }
  selectMyLanguage(); //set currentLanguage
  
  //Load web site text content
  const textContentRoot=await textContent.initRoot();
  const siteText= await textContent.loadSiteText();
  
  import('./modules/textforempty.js')
  .then(({setEmptyText})=>setEmptyText(siteText.getNextChild("not located").getNextChild("emptyvallabel").getRelationship("domelementsdata").getChild().props.value));

  //reload when change language event listener
  textContentRoot.addEventListener("changeLanguage", function() { textContentRoot.setView(document.body, "body")});

  //Now we check for automatic login
  if (localStorage.getItem("user_name") && typeof webuser.props.id=="undefined") {
    webuser.login(localStorage.getItem("user_name"), localStorage.getItem("user_password"));
  }
  async function loadPage(){
    //We start the templates and its scripts
    await textContentRoot.setView(document.body, "body");
    myRecorder.logEvent("page loaded");
    return textContentRoot.appendView(document.body, "extra");
  }
  themeActive.addEventListener("loaded", loadPage); //Changing theme will refresh page view
  webuser.addEventListener("log", loadPage); //login will refresh page view
  return loadPage();
})
.catch(async (myError)=>{
  //Check if db error
  if (myError instanceof Error && myError.message.indexOf('get tables')==0) {
    const checkRqmts=await Node.makeRequest("check requirements");
    if (checkRqmts!==true) {
      throw new Error(checkRqmts);
    }
    //First of all we check that the database connection is ok
    const checkDb=await Node.makeRequest("check db link");
    if (checkDb!==true) {
      throw new Error('Database Connection Failed' + '\n' + checkDb + '\n' + 'Please check your database config file.');
    }
  }
  throw myError;
})
.catch(myError=>{
  //Error Output Messange
  if (!myError) return; //error already managed ???This I dont understand well ... maybe better supress it
  console.error(myError);
  if (myError.stack) myError=myError.stack; //js errors it shows error line
  (new Alert(myError)).showAlert(document.getElementById('syserror'));
  myRecorder.logEvent(myError);
});
