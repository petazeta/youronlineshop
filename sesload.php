<?php
session_start();
require('includes/config.php');
require('includes/database_tables.php');
require('includes/phpclasses/nodes.php');
require('includes/phpclasses/user.php');

if (isset($_GET["sesname"])) $sesname=$_GET["sesname"];
else if (isset($_POST["sesname"])) $sesname=$_POST["sesname"];

if (isset($_SESSION[$sesname])) {
	$originaluser=unserialize($_SESSION[$sesname]);
	$myreturn=unserialize($_SESSION[$sesname]);
	$myreturn->avoidrecursion();
	$myreturn->loadasc($originaluser);
}
else {
	$myreturn=new NodeMale();
	$myreturn->extra=new stdClass();
	$myreturn->extra->nosesname=true;
}
header("Content-type: application/json");
echo json_encode($myreturn);
?>

