<?php
include('includes/config.php');
include('includes/default.php');
if (defined('DB_PREFIX')) { $tablePrefix=DB_PREFIX;}
?>
<!DOCTYPE html>
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta property="og:image" content="images/logo.png">
    <title></title>
    <script src="javascript/default.js"></script>
    <script src="javascript/config.js"></script>
    <script src="javascript/seturl.js"></script>
    <script src="javascript/iesp.js"></script>
    <script src="javascript/nodes.js"></script>
    <script src="javascript/dommethods.js"></script>
    <script src="javascript/cart.js"></script>
    <script src="javascript/user.js"></script>
    <script async src="javascript/stats.js.php"></script>
    <link rel="stylesheet" type="text/css" href="css/default.css">
<?php if (defined('THEME')) { ?>
    <link rel="stylesheet" type="text/css" href="css/themes/<?php echo THEME; ?>/main.css">
<?PHP } ?>    
    <link rel="icon" href="favicon.ico">
    <?php if (defined('LOAD_TP_AT_ONCE') && LOAD_TP_AT_ONCE==true) { include('includes/templates.php'); } ?>
  </head>
  <body>
    <template>
      <div class="alert alertmsg">
        <div>
          <h1 style="font-size:1.5em" style="display:block;">
            <p>No Database Tables!</p>
            <p>Select some option:</p>
          </h1>
        </div>
        <div>
          <button class="btn" type="button">Initialize Database</button>
          <script>
            thisElement.addEventListener("click", function(ev) {
              ev.preventDefault();
              myalert.properties.alertmsg='<p><b>Importing database content ... It will take some time, please be patient.</b></p><div class="circleloader"></div>';
              myalert.showalert();
              (new NodeFemale).loadfromhttp({action:"init database"<?php if ($tablePrefix) echo ', prefix:"' . $tablePrefix . '"'; ?>}).then(function(myNode){
                console.log(myNode.properties);
                if (myNode.extra && myNode.extra.error) {
                  throw '<p><b>Database Connection Failed</b></p><p>Please check includes/config.php file.</p>';
                }
                myalert.hidealert();
                myalert.properties.alertmsg='<p><b>Page will be reloaded in 2 seconds...</b></p>'; 
                myalert.showalert();
                window.setTimeout(function(){window.location.reload();}, 2000);
              });
              thisNode.hidealert();
            });
          </script>
          <button class="btn" type="button">Skip</button>
          <script>
            thisElement.onclick=function(){
              thisNode.hidealert();
            }
          </script>
        </div>
      </div>
    </template>
    <script>
      var textEditorSaved=''; //This var saves the textEditor data to not be deteleted each time
      //history facility to work forward and backward
      window.onpopstate = function(event) {
        if (!event.state) return;
        var link=document.querySelector("a[href='" + event.state.url + "']");
        if (link) link.click();
        console.log(event.state.url);
      };
      function loadLabels() {
        return new Promise((resolve, reject) => {
          var myLanguage=webuser.extra.language.properties.id;
          domelementsrootmother.getChild().getNextChild({name: "labels"}).loadfromhttp({action:"load my tree", language: myLanguage}).then(function(myNode){
            if (Config.onEmptyValueText===null) Config.onEmptyValueText=myNode.getNextChild({name: "not located"}).getNextChild({name: "emptyvallabel"}).getRelationship({name: "domelementsdata"}).getChild().properties.value;
            resolve();
          });
        });
      }
      var webuser=new user();
      //we load the alert template and create alert object
      var myalert=new Alert();
      myalert.properties.alertclass="alertmsg";

      //We load the dom elements text that will be included in some parts of the document
      var domelementsroot=null;
      var languages=null;
      var domelementsrootmother=new NodeFemale();

      //We show a message if the php version is not compatible
      (new Node()).loadfromhttp({action:"check php version"}).then((myNode) => {
        if (myNode.extra && myNode.extra.error) {
          throw 'PHP version is lower than required, plese update PHP';
        }
      }).catch((err) => {
      myalert.properties.alertmsg=err;
      myalert.showalert();
      });
      //First of all we check that the database connection is ok
      (new Node()).loadfromhttp({action:"check db link"}).then((myNode) => {
        if (myNode.extra && myNode.extra.error) {
          throw '<p><b>Database Connection Failed</b></p><p>Please check includes/config.php file.</p>';
        }
        else {
          var mytables=new NodeFemale();
          mytables.loadfromhttp({action:"load tables"<?php if ($tablePrefix) echo ', prefix:"' . $tablePrefix . '"'; ?>}).then((myNode) => {
            if (myNode.extra && myNode.extra.error) {
              throw '<p><b>Database Import Failed</b></p><p>Please try to import file includes/database.sql manually.</p>';
            }
            if (myNode.children.length==0) {
              //Ask for the option of importing database
              var dbImporter=new Alert();
              dbImporter.showalert(null, document.body.querySelector("template"));
            }
            else {
              domelementsrootmother.properties.childtablename="TABLE_DOMELEMENTS";
              domelementsrootmother.properties.parenttablename="TABLE_DOMELEMENTS";
              domelementsrootmother.loadfromhttp({action:"load root"}).then((myNode) => {
                //if no root means that table domelements doesn't exist or has no elements
                if (myNode.children.length==0) {
                  throw '<p><b>Database Content Error.</b></p>';
                }
                domelementsroot=myNode.getChild();
                domelementsroot.loadfromhttp({action:"load my tree", deepLevel: 2}).then((myNode) => {
                  webuser.loadfromhttp({action: "load session", sesname: "user"}).then(() => {
                    if (!webuser.extra) webuser.extra={};
                    if (!webuser.extra.language) {
                      var languagesmother=new NodeFemale();
                      languagesmother.properties.childtablename="TABLE_LANGUAGES";
                      languagesmother.properties.parenttablename="TABLE_LANGUAGES";
                      languagesmother.loadfromhttp({action:"load root"}).then((myNode) => {
                        var langsroot=myNode.getChild();
                        langsroot.loadfromhttp({action:"load my relationships"}).then((myNode) => {
                          var langrelkey=0;
                          for (var i=0; i<langsroot.relationships.length; i++) {
                            if (myNode.relationships[i].properties.childtablename=="TABLE_LANGUAGES") {
                                langrelkey=i;
                                break;
                            }
                          }
                          languages=langsroot.relationships[langrelkey];
                          languages.loadfromhttp({action:"load my children"}).then((myNode) => {
                            var webLanguages=[];
                            languages.children.forEach((child) => {
                              webLanguages.push(child.properties.code);
                            });
                            for (var i=0; i<window.navigator.languages.length; i++) {
                              window.navigator.languages[i]=window.navigator.languages[i].replace(/-.+/, "");
                              if (webLanguages.indexOf(window.navigator.languages[i]) >= 0) {
                                webuser.extra.language=myNode.getChild({code: window.navigator.languages[i]});
                                break;
                              }
                            }
                            if (!webuser.extra.language) webuser.extra.language=myNode.getChild();
                            loadLabels().then(() => domelementsrootmother.dispatchEvent("loadLabels"));
                          });
                        });
                      });
                    }
                    else {
                      domelementsrootmother.dispatchEvent("loadLabels");
                    }
                  });
                });
              }).catch((err) => {
                myalert.properties.alertmsg=err;
                myalert.showalert();
              });
            }
          }).catch((err) => {
            myalert.properties.alertmsg=err;
            myalert.showalert();
          });
        }
      }).catch((err) => {
        myalert.properties.alertmsg=err;
        myalert.showalert();
      });
    </script>
    <div class="backgroundimage">
      <div class="backgroundspace">
        <div id="initloader"></div>
        <script>
          DomMethods.setSizeFromStyle(document.getElementById('initloader'));
        </script>
        <div class="mainblock">
          <?php include('includes/documentparts/top.php'); ?>
          <nav>
            <div class="menuscontainer">
              <?php include("includes/documentparts/menus.php"); ?>
            </div>
          </nav>
          <div class="maincolumns">
            <nav class="categories">
              <?php include("includes/documentparts/left.php"); ?>
            </nav>
            <main>
              <?php include("includes/documentparts/center.php"); ?>
            </main>
            <footer>
              <?php include("includes/documentparts/bottom.php"); ?>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
