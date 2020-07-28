<?php
//Send mail notifications and admin mail messenges:
//new order, order processed, customed mail
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
if (!isset($parameters->action)) $parameters->action="new order";
$mailresult=new NodeMale();
$mailresult->extra=new stdClass();
$to=$_POST["mail_to"]; //username
$subject=$_POST["mail_subject"];
$message=$_POST["mail_message"];
$headers=$_POST["mail_headers"];

if (isset($_SESSION["user"])) {
  $user=unserialize($_SESSION["user"]);
}

if (!isset($_POST["mail_to"]) || !isset($_POST["mail_message"])) {
  $mailresult->extra->error=true;
  $mailresult->extra->errorName='message and recipient required';
  exit(json_encode($mailresult));
}

//Get user data from user name
if ($user->properties->username==$to) {
  $myuser=$user;
  $myuser->getRelationship("usersdata")->db_loadmychildren();
  $myuser->db_loadmytreeup();
}
else if ('USER_ORDERSADMIN'==$to) {
  //We get the orders admin user
  $userstypesmother=new NodeFemale();
  $userstypesmother->properties->childtablename='TABLE_USERSTYPES';
  $userstypesmother->properties->parenttablename='TABLE_USERSTYPES';
  $userstypesmother->db_loadchildtablekeys();
  $userstypesmother->db_loadall("type='orders administrator'");
  if ($userstypesmother->children[0]) {
    $userstypesmother->children[0]->db_loadmytree();
    if ($userstypesmother->children[0]->getRelationship('users')->children[0]) {
      $myuser=$userstypesmother->children[0]->getRelationship('users')->children[0];
    }
  }
}
else if ('USER_SYSTEMADMIN'==$to) {
  //We get the orders admin user
  $userstypesmother=new NodeFemale();
  $userstypesmother->properties->childtablename='TABLE_USERSTYPES';
  $userstypesmother->properties->parenttablename='TABLE_USERSTYPES';
  $userstypesmother->db_loadchildtablekeys();
  $userstypesmother->db_loadall("type='system administrator'");
  if ($userstypesmother->children[0]) {
    $userstypesmother->children[0]->db_loadmytree();
    if ($userstypesmother->children[0]->getRelationship('users')->children[0]) {
      $myuser=$userstypesmother->children[0]->getRelationship('users')->children[0];
    }
  }
}
else {
  $node_search=new user();
  $node_search->properties->username=$to;
  $candidates=$node_search->db_search();
  if (count($candidates) == 1) {
    $myuser=new user();
    $myuser->properties->id=$candidates[0]["id"];
    $myuser->db_loadmyrelationships();
    $myuser->getRelationship("usersdata")->db_loadmychildren();
    $myuser->db_loadmytreeup();
  }
}
//Exit if not commit rules
if (!isset($user) && !$user->properties->username) {
  $mailresult->extra->error=true;
  $mailresult->extra->errorName='not user logged in';
  exit(json_encode($mailresult));
}

//Only send email from user account to himself ... or to admin and from admin to users
if (!($myuser->properties->id==$user->properties->id) && !($myuser->parentNode->partnerNode->properties->type=="system administrator" || $myuser->parentNode->partnerNode->properties->type=="orders administrator")
  && !($myuser->parentNode->partnerNode->properties->type=="system administrator" || $myuser->parentNode->partnerNode->properties->type=="orders administrator")
  && !($user->parentNode->partnerNode->properties->type=="system administrator" || $user->parentNode->partnerNode->properties->type=="orders administrator")
) {
  $mailresult->extra->error=true;
  $mailresult->extra->errorName='operation not allowed';
  exit(json_encode($mailresult));
}

//Get mail address from user name
$to_mailaddress=$myuser->getRelationship("usersdata")->children[0]->properties->email;
if (!$to_mailaddress || !filter_var($to_mailaddress, FILTER_VALIDATE_EMAIL)) {
  $mailresult->extra->error=true;
  $mailresult->extra->errorName="email Format Error";
  exit(json_encode($mailresult));
}

if (mail($to_mailaddress,$subject,$message,$headers)==false) {
  $mailresult->extra->error=true;
  $mailresult->extra->errorName="send email Error";
  exit(json_encode($mailresult));
}

if (!isset($mailresult->extra->error)) {
  $mailresult->avoidrecursion();
}
$serelement=json_encode($mailresult);
echo $serelement;
?>

