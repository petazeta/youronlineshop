<?php
require('includes/config.php');
require('includes/default.php');
require('includes/nodes.php');
require('includes/database_tables.php');
require('includes/user.php');

session_start();

$content = json_decode(trim(file_get_contents("php://input")));

$uname=null; $upwd=null; $email=null; $action="login";

if (isset($content->user_name)) $uname=$content->user_name;
if (isset($content->user_password)) $upwd=$content->user_password;
if (isset($content->email)) $email=$content->email;
if (isset($content->action)) $action=$content->action;

$loginresult=new stdClass();

header("Content-type: application/json");

if ($action=="logout") {
  // remove all session variables
  session_unset();
  // destroy the session
  session_destroy();
  exit(json_encode($loginresult));
}
if ($action=="checksesactive") {
  if (isset($_SESSION["user"])) {
    $loginresult->sesactive=true;
  }
  else {
    $loginresult->sesactive=false;
  }
  exit(json_encode($loginresult));
}
else if ($action=="pwdupdate") {
  if (isset($_SESSION["user"])) {
    $user=unserialize($_SESSION["user"]);
    $loginresult=$user->updatePwd($upwd);
  }
  exit(json_encode($loginresult));
}

if (!$uname || !$upwd) {
  $loginresult->error=true;
  $loginresult->errorMessage="Not enoght data";
  exit(json_encode($loginresult));
}
$user=new user();
$user->properties->username=$uname;
$user->properties->password=$upwd;

if ($action=="create") {
  $loginresult=$user->create($uname, $upwd, $email);
}
else {
  $loginresult=$user->usercheck($uname, $upwd);
}
if (!isset($loginresult->error)) {
  $user->properties->id=$loginresult->id;
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

