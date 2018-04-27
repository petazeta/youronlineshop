<?php
session_start();
require('includes/config.php');
require('includes/database_tables.php');
require('includes/phpclasses/nodes.php');
require('includes/phpclasses/user.php');

$myreturn=new NodeFemale();

//we will get the $sql from the include file
include('includes/sqlrequests.php');

if (($result = $myreturn->getdblink()->query($sql))===false) {
  $myreturn->extra=new stdClass();
  $myreturn->extra->error=true;
  $myreturn->extra->errorinfo=new stdClass();
  $myreturn->extra->errorinfo->type="database error";
}
else {
  for ($i=0; $i<$result->num_rows; $i++) {
    $row=$result->fetch_array(MYSQLI_ASSOC);
    $element=new NodeMale();
    $element->properties->cloneFromArray($row);
    $myreturn->addChild($element);
  }
}
header("Content-type: application/json");
$myreturn->avoidrecursion();
echo json_encode($myreturn);
?>