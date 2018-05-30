<!DOCTYPE html>
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Online Shop</title>
    <script type="text/javascript" src="includes/javascript/config.js"></script>
    <script type="text/javascript" src="includes/javascript/nodes.js"></script>
    <script type="text/javascript" src="includes/javascript/dommethods.js"></script>
    <script type="text/javascript" src="includes/javascript/cart.js"></script>
    <script type="text/javascript" src="includes/javascript/setactive.js"></script>
    <script type="text/javascript" src="includes/javascript/user.js"></script>
    <script type="text/javascript" src="includes/javascript/alert.js"></script>
    <link rel="stylesheet" type="text/css" href="includes/css/main.css">
    <link rel="icon" href="favicon.ico">
    <?php include("includes/templates.php"); ?>
  </head>
  <body>
    <script>
//We load the dom elements text that will be included in some parts of the document
var labelsRoot=null;
var domelementsroot=null;
domelementsrootmother=new NodeFemale();
domelementsrootmother.properties.childtablename="TABLE_DOMELEMENTS";
domelementsrootmother.properties.parenttablename="TABLE_DOMELEMENTS";
domelementsrootmother.loadfromhttp({action:"load root"}, function(){
  domelementsroot=domelementsrootmother.children[0];
  domelementsroot.addEventListener("loadtree", function(){
    webuser.loadfromhttp('sesload.php?sesname=user', function(){
      this.dispatchEvent("loadses");
    });
  });
  domelementsroot.addEventListener("loadtree", function(){
    myalert.hidealert();
  });
  domelementsroot.loadfromhttp({action:"load my relationships"}, function(){
    this.relationships[0].loadfromhttp({action:"load my children"}, function(){
      this.getChild({name: "labels"}).loadfromhttp({action:"load my tree"}, function(){
	labelsRoot=this;
	domelementsroot.dispatchEvent("loadtree");
      });
    });
  });
});
var myalert=new Alert();
myalert.myTp=document.getElementById("alerttp").content; //For error alerts
myalert.properties.alertmsg="<p>Retrieving data ...</p><p>Please wait</p>";
myalert.showalert();

var webuser=new user();
//More about webuser at logbox.php
    </script>
    <table class="backgroundspace">
      <tr>
	<td class="topmargin">
	</td>
      </tr>
      <tr>
	<td>
	  <table class="mainblock" id="mainblock">
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
	</td>
      </tr>
      <tr>
	<td class="bottommargin">
	</td>
      </tr>
    </table>
  </body>
</html>