
if (!window.location.search && Config.initUrl && Config.initUrl.includes('?')) { //For special starting window
  history.pushState({url:Config.initUrl}, null, Config.initUrl);
}
var textEditorSaved=''; //This var saves the textEditor data to not be deteleted each time
window.onpopstate = function(event) { //history facility to work forward and backward
  if (!event.state) return;
  /*
  let link=document.querySelector("a[href='" + event.state.url + "']");
  if (!link) link=document.querySelector("*[data-href='" + event.state.url + "']");
  if (link) link.click();
  */
  const regex = /&page=\d+/;
  const unpaginatedUrl=event.state.url.replace(regex, '');
  const action=Theme.getPopStateAction(unpaginatedUrl);
  console.log(action, event.state.url);
  if (typeof action=="function")  {
    const regex = /&page=(\d+)/;
    const pageMatch=window.location.search.match(regex);
    if (pageMatch) {
      action(pageMatch[1]);
    }
    else {
      action();
    }
  }
};

var webuser=new WebUser();
var domelementsroot=null;
var languages=null;
const mycart= new cart();
const theme=new Theme();
const myRecorder=new StatsRecorder();

//We check if they try to exec the app directly throw the file
if (window.location.protocol=="file:") {
  window.addEventListener ("load", ()=>(new AlertMessage()).showAlert('You are trying to launch the app straight through your web browser.<BR><p><B>This is Not the correct way to execute the app.</B></p>Check README.txt file.', document.getElementById('syserror')));
}

Node.makeRequest("get tables")
.then(async (tables)=>{
  await theme.loadTree();
  await theme.start(Config.themeId);
  if (tables.length==0) {
    //Ask for the option of importing database
    (new NodeMale()).setView(document.body, "dbsqlimport");
    return;
  }
  const domelmtsmum=await (new NodeFemale("TABLE_DOMELEMENTS", "TABLE_DOMELEMENTS")).loadRequest("get my root");
  //if no root means that table domelements doesn't exist or has no elements
  if (domelmtsmum.children.length==0) {
    throw new Error('Database Content Error');
  }
  domelementsroot=domelmtsmum.getChild();
  await domelementsroot.loadRequest("get my tree", {deepLevel: 2});
  //load languages
  const languagesmother=await (new NodeFemale("TABLE_LANGUAGES", "TABLE_LANGUAGES")).loadRequest("get my root");
  const langroot=await languagesmother.getChild().loadRequest("get my relationships");
  languages = await langroot.getRelationship("languages").loadRequest("get my tree", {deepLevel: 2});
  webuser.language=Node.dom.selectLanguage(languages);
  if (!webuser.language) webuser.language=languages.getChild();

  const labels = await domelementsroot.parentNode.getChild().getNextChild("labels").loadRequest("get my tree", {extraParents: webuser.language.getRelationship("domelementsdata")});
  Node.onEmptyValueText=labels.getNextChild("not located").getNextChild("emptyvallabel").getRelationship("domelementsdata").getChild().props.value;
  //reload when change language event listener
  domelementsroot.addEventListener("changeLanguage", function() { this.setView(document.body, "body")});
  //we keep noticing last node active.
  theme.lastNodeActive=domelementsroot.parentNode;
  theme.addEventListener("setTp", function(launcher) {
    let central=document.getElementById("centralcontent") ;
    if (launcher.myContainer==central || launcher.childContainer==central || launcher.propsContainer==central) {
      if (theme.lastNodeActive && theme.lastNodeActive!=launcher) {
        if (theme.lastNodeActive.selected) Node.dom.unsetActiveChild(theme.lastNodeActive); //To remove highlight for the anchor
        theme.lastNodeActive=launcher; //add new button also uses this statement
      }
    }
  });
  //Now we check for automatic login
  if (localStorage.getItem("user_name") && typeof webuser.props.id=="undefined") {
    webuser.login(localStorage.getItem("user_name"), localStorage.getItem("user_password"));
  }
  async function loadPage(){
    //We start the templates and its scripts
    await domelementsroot.setView(document.body, "body");
    myRecorder.logEvent("page loaded");
    return (new NodeMale()).appendView(document.body, "extra");
  }
  theme.addEventListener("loaded", loadPage); //Changing theme will refresh page view
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
  (new Alert()).showAlert(myError, document.getElementById('syserror'));
  myRecorder.logEvent(myError);
});
