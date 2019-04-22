<?php
require('includes/config.php');
require('includes/phpclasses/nodes.php');
require('includes/database_tables.php');
require('includes/phpclasses/user.php');
require('includes/phpclasses/sessions.php');

$mysession = new session();
if ($mysession->session_none()) {
  if (defined('DB_SESSIONS') && DB_SESSIONS==true) {
    $mysession->set_session_to_db();
  }
  session_start();
}
header("Content-type: application/json");
$liveresult=new NodeMale();
$liveresult->properties->num=$mysession->readall(true);
$serelement=json_encode($liveresult);
echo $serelement;
?>
