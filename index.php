<!DOCTYPE html>
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Online Shop</title>
    <script src="includes/javascript/config.js"></script>
    <script src="includes/javascript/nodes.js"></script>
    <script src="includes/javascript/dommethods.js"></script>
    <script src="includes/javascript/cart.js"></script>
    <script src="includes/javascript/user.js"></script>
    <script async src="includes/javascript/stats.js.php"></script>
    <link rel="stylesheet" type="text/css" href="includes/css/main.css">
    <link rel="icon" href="favicon.ico">
    <?php include("includes/templates.php"); ?>
  </head>
  <body>
    <script>
      var webuser=new user();
      var myalert=new Alert();
      myalert.myTp=document.getElementById("alerttp").content; //For error alerts
      myalert.properties.alertmsg="<p>Retrieving data ...</p><p>Please wait</p>";
      myalert.showalert();
      //We load the dom elements text that will be included in some parts of the document
      var domelementsroot=null;
      var languages=null;
      domelementsrootmother=new NodeFemale();
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
		for (var i=0; i<navigator.languages.length; i++) {
		  navigator.languages[i]=navigator.languages[i].replace(/-.+/, "");
		  if (webLanguages.indexOf(navigator.languages[i]) >= 0) {
		    webuser.extra.language=this.getChild({code: navigator.languages[i]});
		    break;
		  }
		}
		if (!webuser.extra.language) webuser.extra.language=this.getChild();
		loadLabels();
	      });
	    }
	    else loadLabels();
	    function loadLabels() {
	      var myLanguage=webuser.extra.language
	      domelementsroot.getNextChild({name: "labels"}).loadfromhttp({action:"load my tree", language: webuser.extra.language.avoidrecursion()}, function(){
		if (!Config.onEmptyValueText) Config.onEmptyValueText=this.getNextChild({name: "not located"}).getNextChild({name: "emptyvallabel"}).getRelationship({name: "domelementsdata"}).children[0].properties.value;
		domelementsrootmother.dispatchEvent("loadLabels");
		myalert.hidealert();
	      });
	    }
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