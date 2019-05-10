<?php
require('includes/config.php');
$tablePrefix=DB_PREFIX;
?>
<!DOCTYPE html>
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <script src="javascript/config.js?<?=time()?>"></script>
    <script src="javascript/iesp.js?<?=time()?>"></script>
    <script src="javascript/nodes.js?<?=time()?>"></script>
    <script src="javascript/dommethods.js?<?=time()?>"></script>
    <script src="javascript/cart.js?<?=time()?>"></script>
    <script src="javascript/user.js?<?=time()?>"></script>
    <script async src="javascript/stats.js.php"></script>
    <link rel="stylesheet" type="text/css" href="css/main.css">
    <link rel="icon" href="favicon.ico">
  </head>
  <body>
    <script>
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
      var myalert=new Alert();
      myalert.getTp("templates/alert.php", function(){
        this.myTp=this.xmlTp;
        this.properties.alertmsg="<p>Retrieving data ...</p><p>Please wait</p>";
        this.showalert();
        if (window.screen.width<700) {
          myalert.myContainer.querySelector(".alert").className+=" alerttopleft";
        }
      });

      //We load the dom elements text that will be included in some parts of the document
      var domelementsroot=null;
      var languages=null;
      domelementsrootmother=new NodeFemale();
      //First of all we check that the database connection is ok
      domelementsrootmother.loadfromhttp({action:"check db link"}, function(){
        if (this.extra && this.extra.error) {
          myalert.properties.alertmsg='<p><b>Database Connection Failed</b></p><p>Please check includes/config.php file.</p>';
          myalert.showalert(null, (function(){throw 'Database Connection Failed';}));
        }
        else {
          var mytables=new NodeFemale();
          mytables.loadfromhttp({action:"load tables"<?php if ($tablePrefix) echo ', prefix:"' . $tablePrefix . '"'; ?>}, function(){
            if (mytables.children.length==0) {
              myalert.properties.alertmsg='<p><b>No Database Tables.</p>';
              myalert.showalert(null, (function(){throw 'No Database Tables';}));
            }
          });
        }
        domelementsrootmother.properties.childtablename="TABLE_DOMELEMENTS";
        domelementsrootmother.properties.parenttablename="TABLE_DOMELEMENTS";
        domelementsrootmother.loadfromhttp({action:"load root"}, function(){
          domelementsroot=domelementsrootmother.children[0];
          domelementsroot.loadfromhttp({action:"load my tree", deepLevel: 2}, function(){
            webuser.loadfromhttp({action: "load session", sesname: "user"}, function(){
              if (!webuser.extra) webuser.extra={};
              if (!webuser.extra.language) {
                languages=new NodeFemale();
                languages.properties.childtablename="TABLE_LANGUAGES";
                languages.properties.parenttablename="TABLE_LANGUAGES";
                languages.loadfromhttp({action:"load all"}, function(){
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
                        myalert.hidealert();
                      });
                    }
                    else {
                      domelementsrootmother.dispatchEvent("loadLabels");
                      myalert.hidealert();
                    }
                  });
                });
              }
              else {
                loadLabels(function(){
                  if (supportsTemplate() && Config.loadTemplatesAtOnce!==false) {
                    loadTemplates(function(){
                      domelementsrootmother.dispatchEvent("loadLabels");
                      myalert.hidealert();
                    });
                  }
                  else {
                    domelementsrootmother.dispatchEvent("loadLabels");
                    myalert.hidealert();
                  }
                });
              }
            });
          });
        });
      });
    </script>
    <div class="backgroundspace">
      <table class="mainblock">
	<tr>
	  <td>
	    <?php include('includes/documentparts/top.php'); ?>
	  </td>
	</tr>
	<tr>
	  <td class="headermiddletransition">
	  </td>
	</tr>
	<tr>
	  <td>
	    <?php include("includes/documentparts/middle.php"); ?>
	  </td>
	</tr>
	<tr>
	  <td class="middlebottomtransition">
	  </td>
	</tr>
	<tr>
	  <td>
	    <?php include("includes/documentparts/bottom.php"); ?>
	  </td>
	</tr>
      </table>
    </div>
  </body>
</html>
