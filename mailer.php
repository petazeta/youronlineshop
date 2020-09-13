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

$mailresult=new NodeMale();
$mailresult->extra=new stdClass();
$to=$_POST["mail_to"]; //username
$subject=$_POST["mail_subject"];
$message=$_POST["mail_message"];
$from=$_POST["mail_from"];

if (isset($_SESSION["user"])) {
  $user=unserialize($_SESSION["user"]);
}

if (!isset($_POST["mail_from"])) {
  $mailresult->extra->error=true;
  $mailresult->extra->errorName='replay from required';
  exit(json_encode($mailresult));
}

if (!isset($_POST["mail_to"]) || !isset($_POST["mail_message"])) {
  $mailresult->extra->error=true;
  $mailresult->extra->errorName='message and recipient required';
  exit(json_encode($mailresult));
}

//Exit if not commit rules
if (!isset($user) && !$user->properties->username) {
  $mailresult->extra->error=true;
  $mailresult->extra->errorName='not user logged in';
  exit(json_encode($mailresult));
}

//Get user data from user name
function get_emailaddress($recipient) {
  global $user;
  if ($user->properties->username==$recipient) {
    $myuser=$user;
    $myuser->getRelationship("usersdata")->db_loadmychildren();
  }
  else if ('USER_ORDERSADMIN'==$recipient || 'USER_SYSTEMADMIN'==$recipient) {
    //We get the admin user
    if ('USER_ORDERSADMIN'==$recipient) {
      $user_type='orders administrator';
    }
    else $user_type='system administrator';
    $userstypesmother=new NodeFemale();
    $userstypesmother->properties->childtablename='TABLE_USERSTYPES';
    $userstypesmother->properties->parenttablename='TABLE_USERSTYPES';
    $userstypesmother->db_loadchildtablekeys();
    $userstypesmother->db_loadall('type=\'' . $user_type . '\'');
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
  if (!$myuser) return false;
  //Only send email from user account to himself ... or to admin and from admin to users
  if (!($myuser->properties->id==$user->properties->id) && !($myuser->parentNode->partnerNode->properties->type=="system administrator" || $myuser->parentNode->partnerNode->properties->type=="orders administrator")
    && !($myuser->parentNode->partnerNode->properties->type=="system administrator" || $myuser->parentNode->partnerNode->properties->type=="orders administrator")
    && !($user->parentNode->partnerNode->properties->type=="system administrator" || $user->parentNode->partnerNode->properties->type=="orders administrator")
  ) {
    return false;
  }
  //Get mail address from user name
  $mailaddress=$myuser->getRelationship("usersdata")->children[0]->properties->email;
  return $mailaddress;
}

$to_mailaddress = get_emailaddress($to);
if (!$to_mailaddress || !filter_var($to_mailaddress, FILTER_VALIDATE_EMAIL)) {
  $mailresult->extra->error=true;
  $mailresult->extra->errorName="email Format Error";
  exit(json_encode($mailresult));
}
$from_mailaddress = get_emailaddress($from);
$headers = 'From: ' . $from_mailaddress . "\r\n" .
    'Reply-To: ' . $from_mailaddress . "\r\n" .
    'X-Mailer: PHP/' . phpversion();


if (mail($to_mailaddress,$subject,$message,$headers)==false) {
  $mailresult->extra->error=true;
  $mailresult->extra->errorName="send email Error: " . $to_mailaddress . $headers;
  exit(json_encode($mailresult));
}

$mailresult->avoidrecursion();

$serelement=json_encode($mailresult);
echo $serelement;
?>

