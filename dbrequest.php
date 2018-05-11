<?php
session_start();
require('includes/config.php');
require('includes/phpclasses/nodes.php');
require('includes/database_tables.php');
require('includes/phpclasses/user.php');

if (isset($_GET["json"])) {
  $json=json_decode($_GET["json"]);
  $fields=$_GET;
}
else if (isset($_POST["json"])) {
  $json=json_decode($_POST["json"]);
  $fields=$_POST;
}
if (isset($_GET["parameters"])) $parameters=json_decode($_GET["parameters"]);
else if (isset($_POST["parameters"])) $parameters=json_decode($_POST["parameters"]);

if (array_key_exists("partnerNode", $json)) $myelement=new NodeFemale();
else $myelement=new NodeMale();

$myelement->load($json);
$myelement->loadasc($json);

unset($fields["json"]);
unset($fields["parameters"]);
$myelement->properties->cloneFromArray($fields);  //For the case when some data comes from a form
require('includes/safety.php');
switch ($parameters->action) {
  case "load myself": $myexecfunction="db_loadmyself"; break;
  case "load my children": $myexecfunction="db_loadmychildren"; break;
  case "load my relationships": $myexecfunction="db_loadmyrelationships"; break;  
  case "load my childtablekeys": $myexecfunction="db_loadchildtablekeys"; break;
  case "load my tree": $myexecfunction="db_loadmytree"; if (isset($myelement->extra->level)) $argument=$myelement->extra->level; break;
  case "load root": $myexecfunction="db_loadroot"; break;
  case "add myself": $myexecfunction="db_insertmyself"; break;
  case "add my tree": $myexecfunction="db_insertmytree"; break;
  case "add my link": $myexecfunction="db_insertmylink"; break;
  case "delete myself": $myexecfunction="db_deletemyself"; break;
  case "delete my tree": $myexecfunction="db_deletemytree"; break;
  case "delete my link": $myexecfunction="db_deletemylink"; break;
  case "edit my sort_order": $myexecfunction="db_updatemysort_order"; $argument=$myelement->properties->oldsort_order; unset($myelement->properties->oldsort_order); break;
  case "edit my properties": $myexecfunction="db_updatemyproperties"; break;
  case "replace myself": $myexecfunction="db_replacemyself"; $argument=$myelement->properties->newid; unset($myelement->properties->newid); break;
  default: $myexecfunction=null;
}
if (isset($argument)) $executed=$myelement->$myexecfunction($argument);
else $executed=$myelement->$myexecfunction();
if ($executed===false) {
  $myelement->extra=new stdClass();
  $myelement->extra->error=true;
  $myelement->extra->errorinfo=new stdClass();
  $myelement->extra->errorinfo->type="database";
}
$myelement->avoidrecursion(); //needed when insert

header("Content-type: application/json");
echo json_encode($myelement);
?>