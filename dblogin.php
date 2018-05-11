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
$user->properties->username=$uname;
$user->properties->password=$upwd;
if (!$user->checklogindata($uname, $upwd)) exit("error");
if ($parameters->action=="create") {
  $loginresult=$user->create($uname, $upwd);
}
else {
  $loginresult=$user->usercheck($uname, $upwd);
}
if ($loginresult->extra->usernameok==true && $loginresult->extra->passwordok ==true) {
  $user->properties->id=$loginresult->properties->id;
  $user->db_loadmyrelationships();
  foreach ($user->relationships as $key => $value) {
    if ($user->relationships[$key]->properties->name=="userstypes") {
      $user->relationships[$key]->db_loadmychildren();
    }
    if ($user->relationships[$key]->properties->name=="usersdata") {
      $user->relationships[$key]->db_loadmychildren();
    }
  }
  $_SESSION["user"]=serialize($user);
  $loginresult->extra->login=true;
}
$serelement=json_encode($loginresult);
echo $serelement;
?>

