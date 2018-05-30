<?php
session_start();
require('includes/config.php');
require('includes/phpclasses/nodes.php');
require('includes/database_tables.php');
require('includes/phpclasses/user.php');

header("Content-type: application/json");
if (isset($_POST["parameters"])) {
  $parameters=json_decode($_POST["parameters"]);
}
else $parameters=new stdClass();
if (!isset($parameters->action)) $parameters->action="login";
$loginresult=new NodeMale();
$loginresult->extra=new stdClass();
if ($parameters->action=="logout") {
  $_SESSION["user"]=null;
  $loginresult->extra->logout=true;
  exit(json_encode($loginresult));
}
if (!isset($_POST["user_name"]) || !isset($_POST["user_password"])) {
  $loginresult->extra->errorlogin=true;
  exit(json_encode($loginresult));
}
$user=new user();
$uname=$_POST["user_name"];
$upwd=$_POST["user_password"];
$email=null;
if (isset($_POST["user_email"])) $email=$_POST["user_email"];
$user->properties->username=$uname;
$user->properties->password=$upwd;


if ($parameters->action=="create") {
  $loginresult=$user->create($uname, $upwd, $email);
}
else {
  $loginresult=$user->usercheck($uname, $upwd);
}
if (!isset($loginresult->extra->error)) {
  $user->properties->id=$loginresult->properties->id;
  $user->db_loadmyrelationships();
  $user->db_loadmytreeup();
  $_SESSION["user"]=serialize($user);
  $loginresult=$user;
  $loginresult->avoidrecursion();
}
$serelement=json_encode($loginresult);
echo $serelement;
?>

