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
  case "load myself":
    $myexecfunction="db_loadmyself";
    $callback="cutUp";
    break;
  case "load my children":
    $myexecfunction="db_loadmychildren";
    $filter=null; $order=null; $limit = null;
    if (isset($parameters->filter)) $filter=$parameters->filter;
    if (isset($parameters->order)) $order=$parameters->order;
    if (isset($parameters->limit)) $limit=$parameters->limit;
    if ($filter || $order || $limit) $argument=[$filter, $order, $limit];
    $callback="cutUp";
    break;
  case "load my relationships":
    $myexecfunction="db_loadmyrelationships";
    $callback="cutUp";
    break;
  case "load my tree":
    $myexecfunction="db_loadmytree";
    if (isset($myelement->extra->level)) $argument=$myelement->extra->level;
    $callback="cutUp";
    break;
  case "load my partner":
    $myexecfunction="db_loadmypartner";
    $callback="cutDown";
    break;
    
  case "load my childtablekeys":
    $myexecfunction="db_loadchildtablekeys";
    break;
  case "load root":
    $myexecfunction="db_loadroot";
    break;
    
  case "load my parent":
    $myexecfunction="db_loadmyparent";
    $callback="cutDown";
    break;
  case "load my tree up":
    $myexecfunction="db_loadmytreeup";
    if (isset($myelement->extra->level)) $argument=$myelement->extra->level;
    $callback="cutDown";
    break;
  case "add myself":
    $myexecfunction="db_insertmyself";
    $callback=["cutDown", "cutUp"];
    break;
  case "add my tree":
    $myexecfunction="db_insertmytree";
    $callback=["cutDown", "cutUp"];
    break;
  case "add my link":
    $myexecfunction="db_insertmylink";
    $callback=["cutDown", "cutUp"];
    break;
  case "delete myself":
    $myexecfunction="db_deletemyself";
    $callback=["cutDown", "cutUp"];
    break;
  case "delete my tree":
    $myexecfunction="db_deletemytree";
    $callback=["cutDown", "cutUp"];
    break;
  case "delete my link":
    $myexecfunction="db_deletemylink";
    $callback=["cutDown", "cutUp"];
    break;
  case "edit my sort_order":
    $myexecfunction="db_updatemysort_order";
    if (isset($parameters->newsort_order)) $argument=$parameters->newsort_order;
    $callback=["cutDown", "cutUp"];
    break;
  case "edit my properties":
    $myexecfunction="db_updatemyproperties";
    $callback=["cutDown", "cutUp"];
    break;
  case "replace myself":
    $myexecfunction="db_replacemyself";
    $argument=$myelement->properties->newid;
    unset($myelement->properties->newid);
    $callback=["cutDown", "cutUp"];
    break;
  default: $myexecfunction=null;
}
if (isset($argument)) {
  if (gettype($argument)=="array") $executed=call_user_func_array([$myelement, $myexecfunction], $argument);
  else $executed=$myelement->$myexecfunction($argument);
}
else $executed=$myelement->$myexecfunction();
if ($executed===false) {
  $myelement->extra=new stdClass();
  $myelement->extra->error=true;
  $myelement->extra->errorinfo=new stdClass();
  $myelement->extra->errorinfo->type="database";
}
$myelement->avoidrecursion(); //needed when insert
if (isset($callback)) {
  if (gettype($callback)=="array") {
    foreach($callback as $value) {
      $myelement->$value();
    }
  }
  else $myelement->$callback();
}
header("Content-type: application/json");
echo json_encode($myelement);
?>