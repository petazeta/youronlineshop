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

unset($fields["json"]);
unset($fields["parameters"]);
$myelement->properties->cloneFromArray($fields);  //For the case when some data comes from a form
require('includes/safety.php');
switch ($parameters->action) {
  case "load myself":
    $myexecfunction="db_loadmyself";
    $callback="cutUp";
    break;
  case "load tables":
    $myexecfunction="db_loadtables";
    $callback="cutUp";
    break;
  case "load my children":
    $myexecfunction="db_loadmychildren";
    $filter=null; $order=null; $limit = null;
    if (isset($parameters->filter)) $filter=$parameters->filter;
    if (isset($parameters->language)) {
      if (!$filter) $filter=[];
      $filter['_languages'] = $parameters->language;
    }
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
    $deepLevel=null; $filter=null;
    if (isset($parameters->deepLevel)) $deepLevel=$parameters->deepLevel;
    if (isset($parameters->language)) {
      $filter=['_languages' => $parameters->language];
    }
    if ($deepLevel || $filter) $argument=[$deepLevel, $filter];
    $callback="cutUp";
    break;
  case "load my partner":
    $myexecfunction="db_loadmypartner";
    if (isset($parameters->child_id)) $argument=$parameters->child_id;
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
    if (isset($parameters->language)) $argument=[ ['_languages' => $parameters->language] ];
    $callback=["cutDown", "cutUp"];
    break;
  case "add my children":
    $myexecfunction="db_insertmychildren";
    if (isset($parameters->language)) $argument=[ ['_languages' => $parameters->language] ];
    $callback=["cutDown", "cutUp"];
    break;
  case "add my tree":
    $myexecfunction="db_insertmytree";
    $deepLevel=null; $extra=null;
    if (isset($parameters->deepLevel)) $deepLevel=$parameters->deepLevel;
    if (isset($parameters->language)) {
      if (!$extra) $extra=[];
      $extra['_languages'] = $parameters->language;
    }
    if ($deepLevel || $extra) $argument=[$deepLevel, $extra];
    $callback=["cutUp"];
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
  case "delete my children":
    $myexecfunction="db_deletemychildren";
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
    if (isset($parameters->properties)) $argument=$parameters->properties;
    $callback=["cutDown", "cutUp"];
    break;
  case "replace myself":
    $myexecfunction="db_replacemyself";
    if (isset($parameters->newid)) $argument=$parameters->newid;
    $callback=["cutDown", "cutUp"];
    break;
  case "load unlinked":
    $myexecfunction="db_loadunlinked";
    $callback="cutUp";
    break;
  case "load my children not":
    $myexecfunction="db_loadmychildrennot";
    $callback="cutUp";
    break;
  case "load all":
    $myexecfunction="db_loadall";
    $filter=null; $order=null; $limit = null;
    if (isset($parameters->filter)) $filter=$parameters->filter;
    if (isset($parameters->order)) $order=$parameters->order;
    if (isset($parameters->limit)) $limit=$parameters->limit;
    if ($filter || $order || $limit) $argument=[$filter, $order, $limit];
    $callback="cutUp";
    break;
  case "load this relationship":
    $myexecfunction="db_loadthisrel";
    break;
  case "load tables":
    $myexecfunction="db_loadtables";
    break;
  case "load session":
    $myexecfunction="session";
    $argument=[$parameters->sesname, "load"];
    break;
  case "write session":
    $myexecfunction="session";
    $argument=[$parameters->sesname, "write"];
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
  $myelement->extra->errorinfo="request";
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