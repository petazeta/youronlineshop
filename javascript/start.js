if (!window.location.search && Config.initUrl && Config.initUrl.indexOf('?')!=-1) {
  history.pushState({url:Config.initUrl}, null, Config.initUrl);
}
var textEditorSaved=''; //This var saves the textEditor data to not be deteleted each time
//history facility to work forward and backward
window.onpopstate = function(event) {
  if (!event.state) return;
  var link=document.querySelector("a[href='" + event.state.url + "']");
  if (link) link.click();
  console.log(event.state.url);
};

var webuser=new WebUser();
//we load the alert template and create alert object
var myalert=new Alert();
myalert.properties.alertclass="alertmsg";

//We load the dom elements text that will be included in some parts of the document
var domelementsroot=null;
var languages=null;
var domelementsrootmother=new NodeFemale();
var mycart= new cart();
var theme=null;
const myRecorder=new StatsRecorder();

//We show a message if the php version is not compatible
Node.makeRequest("check php version")
.then(()=>{
  //First of all we check that the database connection is ok
  Node.makeRequest("check db link")
  .then(()=>{
    Theme.load()
    .then(treeMother => {
      theme=new Theme(treeMother);
      theme.siteLoad=()=>{
        Node.makeRequest("load tables")
        .then(myNode => {
          if (myNode.length==0) {
            //Ask for the option of importing database
            var dbImporter=new Alert();
            dbImporter.showalert(null, "dbalert");
            myRecorder.logEvent("Error: " + "No database tables");
            return false;
          }
          domelementsrootmother.properties.childtablename="TABLE_DOMELEMENTS";
          domelementsrootmother.properties.parenttablename="TABLE_DOMELEMENTS";
          domelementsrootmother.loadRequest("load root")
          .then(myNode => {
            //if no root means that table domelements doesn't exist or has no elements
            if (myNode.children.length==0) {
              alert('Database Content Error');
              myRecorder.logEvent("Error: " + "Db data No root");
              return false;
            }
            domelementsroot=myNode.getChild();
            domelementsroot.loadRequest("load my tree", {deepLevel: 2})
            .then(myNode => {
              webuser.loadRequest("load session",{sesname: "user"})
              .then(() => {
                if (!webuser.extra) webuser.extra={};
                //load languages
                var languagesmother=new NodeFemale();
                languagesmother.properties.childtablename="TABLE_LANGUAGES";
                languagesmother.properties.parenttablename="TABLE_LANGUAGES";
                languagesmother.loadRequest("load root")
                .then(myNode => {
                  var langsroot=myNode.getChild();
                  langsroot.loadRequest("load my relationships")
                  .then(myNode => {
                    var langrelkey=0;
                    for (var i=0; i<langsroot.relationships.length; i++) {
                      if (myNode.relationships[i].properties.childtablename=="TABLE_LANGUAGES") {
                          langrelkey=i;
                          break;
                      }
                    }
                    languages=langsroot.relationships[langrelkey];
                    languages.loadRequest("load my children")
                    .then(myNode => {
                      var webLanguages=[];
                      languages.children.forEach(child => {
                        webLanguages.push(child.properties.code);
                      });
                      for (var i=0; i<window.navigator.languages.length; i++) {
                        window.navigator.languages[i]=window.navigator.languages[i].replace(/-.+/, "");
                        if (webLanguages.indexOf(window.navigator.languages[i]) >= 0) {
                          webuser.language=myNode.getChild({code: window.navigator.languages[i]});
                          break;
                        }
                      }
                      if (!webuser.language) webuser.language=myNode.getChild();
                      domelementsrootmother.getChild().getNextChild({name: "labels"}).loadRequest("load my tree", {language: webuser.language.properties.id})
                      .then(myNode=>{
                        Node.onEmptyValueText=myNode.getNextChild({name: "not located"}).getNextChild({name: "emptyvallabel"}).getRelationship({name: "domelementsdata"}).getChild().properties.value;
                        //reload when change language event listener
                        domelementsrootmother.addEventListener("changeLanguage", myNode => myNode.setView(document.body, "body"));
                        //we keep noticing last node active.
                        theme.lastNodeActive=domelementsrootmother;
                        theme.addEventListener("setTp", (themeNode, launcher)=>{
                          let central=document.getElementById("centralcontent") ;
                          if (launcher.myContainer==central || launcher.childContainer==central || launcher.propertiesContainer==central) {
                            if (theme.lastNodeActive && theme.lastNodeActive!=launcher) {
                              if (theme.lastNodeActive.selected) Node.dom.unsetActiveChild(theme.lastNodeActive); //To remove highlight for the anchor
                              theme.lastNodeActive=launcher; //add new button also uses this statement
                            }
                          }
                        });
                        function loadPage(){
                          //We start the templates and its scripts
                          domelementsrootmother.setView(document.body, "body")
                          .then(()=>{
                            myRecorder.logEvent("page loaded");
                            Node.appendViewNew(document.body, "extra");
                          });
                        }
                        //Now we check for automatic login
                        if (localStorage.getItem("user_name") && typeof webuser.properties.id=="undefined") {
                          webuser.login(localStorage.getItem("user_name"), localStorage.getItem("user_password"))
                          .then(()=>{})
                          .catch(e=>{});
                        }
                        loadPage();
                        theme.addEventListener("loaded", loadPage); //Changing theme will refresh page view
                        webuser.addEventListener("log", loadPage); //login will refresh page view
                      });
                    });
                  });
                });
              });
            });
          });
        });
      };
      theme.start(Config.themeId)
      .then(()=>
      theme.siteLoad());
    })
    .catch(myError=>{
      alert('Themes loading failed');
      myRecorder.logEvent("Error: " + 'Themes loading failed');
    });
  })
  .catch(myError=>{
    alert('Database Connection Failed' +
    '\n' + myError.errorMessage + '\n' +
    'Please check backend/includes/config.php file.');
    myRecorder.logEvent("Error: " + myError.errorMessage);
  });
})
.catch(myError=>{
  alert('PHP version is lower than required, plese update PHP' +
  '\n' + myError.errorMessage);
  myRecorder.logEvent("Error: " + myError.errorMessage);
});
