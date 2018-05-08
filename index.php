<?php
//Includes
require('includes/database_tables.php');
?>
<!DOCTYPE html>
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Online Shop</title>
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
    <script type="text/javascript">
document.body.appendChild(document.getElementById("formgenerictp").content.querySelector("form").cloneNode(true));
document.body.appendChild(document.getElementById("formgenerictreetp").content.querySelector("form").cloneNode(true));
//We load the dom elements text that will be included in some parts of the document
var labelsRoot=null;
var websectionsroot= new NodeMale();
websectionsrootmother=new NodeFemale();
websectionsrootmother.properties.childtablename="<?php echo TABLE_DOMELEMENTS; ?>";
websectionsrootmother.properties.parenttablename="<?php echo TABLE_DOMELEMENTS; ?>";
var myForm=document.getElementById("formgeneric").cloneNode(true);
myForm.elements.parameters.value=JSON.stringify({action:"load root"});
websectionsrootmother.setView(myForm);
websectionsrootmother.loadfromhttp(myForm, function(){
  var myForm=document.getElementById("formgeneric").cloneNode(true);
  var jsonparameters={action: "load my relationships"};
  myForm.elements.parameters.value=JSON.stringify(jsonparameters);
  websectionsroot.load(websectionsrootmother.children[0]);
  websectionsroot.loadasc(websectionsrootmother.children[0]);
  websectionsroot.setView(myForm);
  websectionsroot.loadfromhttp(myForm, function(){
    var myForm=document.getElementById("formgeneric").cloneNode(true);
    var jsonparameters={action: "load my children"};
    myForm.elements.parameters.value=JSON.stringify(jsonparameters);
    this.relationships[0].setView(myForm);
    this.relationships[0].loadfromhttp(myForm, function(){
      var myForm=document.getElementById("formgeneric").cloneNode(true);
      var jsonparameters={action: "load my tree"};
      myForm.elements.parameters.value=JSON.stringify(jsonparameters);
      this.getChild({name: "labels"}).setView(myForm);
      this.getChild({name: "labels"}).loadfromhttp(myForm, function(){
	labelsRoot=this;
	websectionsroot.dispatchEvent("loadtree");
      });
    });
  });
});
var myalert=new Alert();
myalert.myTp=document.getElementById("alerttp").content; //For error alerts
myalert.properties.alertmsg="<p>Retrieving data ...</p><p>Please wait</p>";
myalert.showalert();
websectionsroot.addEventListener("loadtree", function(){
  myalert.hidealert();
});

var webuser=new user();
//More about webuser at logbox.php
websectionsroot.addEventListener("loadtree", function(){
  webuser.loadfromhttp('sesload.php?sesname=user', function(){
    this.dispatchEvent("loadses");
  });
});
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