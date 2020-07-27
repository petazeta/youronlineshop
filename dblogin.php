<?php
require('includes/config.php');
require('includes/default.php');
require('includes/phpclasses/nodes.php');
require('includes/database_tables.php');
require('includes/phpclasses/sessions.php');
require('includes/phpclasses/user.php');
$mysession = new session();
if ($mysession->session_none()) {
  if (defined('DB_SESSIONS') && DB_SESSIONS==true) {
    $mysession->set_session_to_db();
  }
  session_start();
}

header("Content-type: application/json");
if (isset($_POST["parameters"])) {
  $parameters=json_decode($_POST["parameters"]);
}
else $parameters=new stdClass();
if (!isset($parameters->action)) $parameters->action="login";
$loginresult=new NodeMale();
$loginresult->extra=new stdClass();
$uname=$_POST["user_name"];
$upwd=$_POST["user_password"];
if ($parameters->action=="logout") {
  $_SESSION["user"]=null;
  exit(json_encode($loginresult));
}
else if ($parameters->action=="pwdupdate") {
  if (isset($_SESSION["user"])) {
    $user=unserialize($_SESSION["user"]);
    $loginresult=$user->updatePwd($upwd);
  }
  exit(json_encode($loginresult));
}

if (!isset($_POST["user_name"]) || !isset($_POST["user_password"])) {
  $loginresult->extra->error=true;
  exit(json_encode($loginresult));
}
$user=new user();
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
  $user->session("user", "write");
  $user->db_updateaccess(); //We update the access time
  $loginresult=$user;
  $loginresult->avoidrecursion();
}
$serelement=json_encode($loginresult);
echo $serelement;
?>

