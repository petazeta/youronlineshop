<?php
include('includes/config.php');
include('includes/default.php');
if (defined('DB_PREFIX')) { $tablePrefix=DB_PREFIX;}
?>
<!DOCTYPE html>
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <script src="javascript/default.js?lastmod=<?php echo filemtime('javascript/default.js') ?>"></script>
    <script src="javascript/config.js?lastmod=<?php echo filemtime('javascript/config.js') ?>"></script>
    <script src="javascript/iesp.js?lastmod=<?php echo filemtime('javascript/iesp.js') ?>"></script>
    <script src="javascript/nodes.js?lastmod=<?php echo filemtime('javascript/nodes.js') ?>"></script>
    <script src="javascript/nodesconfig.js?lastmod=<?php echo filemtime('javascript/nodesconfig.js') ?>"></script>
    <script src="javascript/dommethods.js?lastmod=<?php echo filemtime('javascript/dommethods.js') ?>"></script>
    <script src="javascript/cart.js?lastmod=<?php echo filemtime('javascript/cart.js') ?>"></script>
    <script src="javascript/user.js?lastmod=<?php echo filemtime('javascript/user.js') ?>"></script>
    <script async src="javascript/stats.js.php"></script>
    <link rel="stylesheet" type="text/css" href="css/main.css">
<?php if (defined('THEME')) { ?>
    <link rel="stylesheet" type="text/css" href="css/themes/<?php echo THEME; ?>/main.css">
<?PHP } ?>    
    <link rel="icon" href="favicon.ico">
  </head>
  <body>
    <script>
      var textEditorSaved=''; //This var saves the textEditor data to not be deteleted each time
      //history facility
      window.onpopstate = function(event) {
        if (!event.state) return;
        var link=document.querySelector("a[href='" + event.state.url + "']");
        if (link) link.click();
      };
      function loadTemplates(callback) {
        //We load all the templates at once
        var tpLoader=new Node();
        tpLoader.appendThis(document.body, "templates.php", function(){
          if (callback) callback();
        });
      }
      function loadLabels(callback) {
        var myLanguage=webuser.extra.language.properties.id;
        domelementsrootmother.children[0].getNextChild({name: "labels"}).loadfromhttp({action:"load my tree", language: myLanguage}, function(){
          if (!Config.onEmptyValueText) Config.onEmptyValueText=this.getNextChild({name: "not located"}).getNextChild({name: "emptyvallabel"}).getRelationship({name: "domelementsdata"}).children[0].properties.value;
          if (callback) callback();
        });
      }
      var webuser=new user();
      //we load the alert template and create alert object
      var myalert=new Alert();
      myalert.properties.alertclass="alertmsg";

      //We load the dom elements text that will be included in some parts of the document
      var domelementsroot=null;
      var languages=null;
      domelementsrootmother=new NodeFemale();
      //We show a message if the php version is not compatible
      (new Node()).loadfromhttp({action:"check php version"}, function(){
        if (this.extra && this.extra.error) {
          myalert.properties.alertmsg='PHP version is lower than required, plese update PHP';
          myalert.showalert().then(function(){throw 'PHP version error';});
        }
      });
      //First of all we check that the database connection is ok
      domelementsrootmother.loadfromhttp({action:"check db link"}, function(){
        if (this.extra && this.extra.error) {
          myalert.properties.alertmsg='<p><b>Database Connection Failed</b></p><p>Please check includes/config.php file.</p>';
          myalert.showalert().then(function(){throw 'Database Connection Failed';});
        }
        else {
          var mytables=new NodeFemale();
          mytables.loadfromhttp({action:"load tables"<?php if ($tablePrefix) echo ', prefix:"' . $tablePrefix . '"'; ?>}, function(){
            if (mytables.children.length==0) {
              myalert.properties.alertmsg='No Database Tables.';
              myalert.showalert().then(function(){throw 'No Database Tables';});
            }
          });
        }
        domelementsrootmother.properties.childtablename="TABLE_DOMELEMENTS";
        domelementsrootmother.properties.parenttablename="TABLE_DOMELEMENTS";
        domelementsrootmother.loadfromhttp({action:"load root"}, function(){
          //if no root means that table domelements doesn't exist or has no elements
          if (this.children.length==0) {
            myalert.properties.alertmsg='<p><b>Database Content Error</b></p><p>Please import includes/database.sql file.</p>';
            myalert.showalert().then(function(){throw 'Database Content Failed';});
          }
          domelementsroot=this.children[0];
          domelementsroot.loadfromhttp({action:"load my tree", deepLevel: 2}, function(){
            webuser.loadfromhttp({action: "load session", sesname: "user"}, function(){
              if (!webuser.extra) webuser.extra={};
              if (!webuser.extra.language) {
                var languagesmother=new NodeFemale();
                languagesmother.properties.childtablename="TABLE_LANGUAGES";
                languagesmother.properties.parenttablename="TABLE_LANGUAGES";
                languagesmother.loadfromhttp({action:"load root"}, function(){
                  var langsroot=this.children[0];
                  langsroot.loadfromhttp({action:"load my relationships"}, function(){
                    var langrelkey=0;
                    for (var i=0; i<langsroot.relationships.length; i++) {
                      if (this.relationships[i].properties.childtablename=="TABLE_LANGUAGES") {
                          langrelkey=i;
                          break;
                      }
                    }
                    languages=langsroot.relationships[langrelkey];
                    languages.loadfromhttp({action:"load my children"}, function(){
                      var webLanguages=[];
                      languages.children.forEach(function (child){
                        webLanguages.push(child.properties.code);
                      });
                      for (var i=0; i<window.navigator.languages.length; i++) {
                        window.navigator.languages[i]=window.navigator.languages[i].replace(/-.+/, "");
                        if (webLanguages.indexOf(window.navigator.languages[i]) >= 0) {
                          webuser.extra.language=this.getChild({code: window.navigator.languages[i]});
                          break;
                        }
                      }
                      if (!webuser.extra.language) webuser.extra.language=this.getChild();
                      loadLabels(function(){
                        if (Config.loadTemplatesAtOnce!==false) {
                          loadTemplates(function(){
                            domelementsrootmother.dispatchEvent("loadLabels");
                          });
                        }
                        else {
                          domelementsrootmother.dispatchEvent("loadLabels");
                        }
                      });
                    });
                  });
                });
              }
              else {
                loadLabels(function(){
                  if (supportsTemplate() && Config.loadTemplatesAtOnce!==false) {
                    loadTemplates(function(){
                      domelementsrootmother.dispatchEvent("loadLabels");
                    });
                  }
                  else {
                    domelementsrootmother.dispatchEvent("loadLabels");
                  }
                });
              }
            });
          });
        });
      });
    </script>
    <div class="backgroundimage">
      <div class="backgroundspace">
        <img id="initloader" src="css/images/loader-1.gif" style="position: absolute; top: 30%; left: 50%; transform: translateX(-50%); z-index:100;">
        <div class="mainblock">
          <?php include('includes/documentparts/top.php'); ?>
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
  </body>
</html>
