import {setConfig} from './cfg/main.js';
import {Node, NodeFemale, NodeMale} from './modules/nodesfront.js';
import {startTheme} from './modules/themesfront.js';
import myWebuser from './modules/webuser.js';
import {loadLanguages, selectMyLanguage} from './modules/languages.js';
import {loadText, replaceDataObservers} from './modules/sitecontent.js';
import {Alert, AlertMessage} from './modules/alert.js';
import makeReport, {setReports} from './modules/reports.js';

/*
// dev configuration
import devConfig from './cfg/devconfig.js';
const config=setConfig(devConfig);
*/

const config=setConfig();
webuser=myWebuser;

if (!window.location.search && config.initUrl && config.initUrl.includes('?')) { //For special starting window
  history.pushState({url:config.initUrl}, null, config.initUrl);
}
window.textEditorSaved=''; //This var saves the textEditor data to not be deteleted each time

import('./modules/availablestates.js')
.then(({execUrlAction})=>{
  window.onpopstate= (event) => {
    if (!event.state) return;
    execUrlAction(event.state.url);
  };
});

setReports();

import {setInitUrl} from './modules/initurl.js'
//For init url set facility
if (window.location.search) {
  setInitUrl(window.location.search);
}

//We check if they try to exec the app directly throw the file
if (window.location.protocol=="file:") {
  window.addEventListener ("load", ()=>new AlertMessage().showAlert('You are trying to launch the app straight through your web browser.<BR><p><B>This is Not the correct way to execute the app.</B></p>Check README.txt file.', document.getElementById('syserror')));
}

Node.makeRequest("get tables")
.then(async (tables)=>{
  const themeActive=await startTheme(config.themeId);
  if (tables.length==0) {
    //Ask for the option of importing database
    new NodeMale().setView(document.body, "dbsqlimport");
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
  const siteText= await loadText();
  
  import('./modules/textforempty.js')
  .then(({setEmptyText})=>setEmptyText(siteText.getNextChild("not located").getNextChild("emptyvallabel").getRelationship("siteelementsdata").getChild().props.value));

  //Now we check for automatic login
  if (localStorage.getItem("user_name") && typeof webuser.props.id=="undefined") {
    webuser.login(localStorage.getItem("user_name"), localStorage.getItem("user_password"));
  }
  async function loadPage(){
    //We start the templates and its scripts
    await siteText.setView(document.body, "body");
    return siteText.appendView(document.body, "extra");
  }
  themeActive.addEventListener("loaded", loadPage); //Changing theme will refresh page view

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
  new Alert(myError).showAlert(document.getElementById('syserror'));
  makeReport(myError);
});
