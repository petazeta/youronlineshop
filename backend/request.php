<?php
require('includes/config.php');
require('includes/default.php');
require('includes/nodes.php');
require_once('includes/user.php');
require('includes/safety.php');
require_once('includes/themes.php');

//keep sessions on
session_start();

if (isset($_SESSION["user"])) {
  $user=unserialize($_SESSION["user"]);
}

$content = json_decode(trim(file_get_contents("php://input")));

if (!isset($content->action)) exit("Error no action passed");
$nodeData=null;
$parameters=null;
$multy=null;

if (isset($content->nodeData)) $nodeData=$content->nodeData;
if (isset($content->parameters)) $parameters=$content->parameters;
if (isset($content->multy)) $multy=$content->multy;
$action=$content->action;

$safety=new Safety();

switch ($action) {
  case "check db link":
  case "check php version":
  case "init database":
  case "load session":
  case "write session":
  case "load themes tree":
  break;
  default:
    require('includes/database_tables.php');
}

if (isset($multy) && $multy) { //Multy request
  $myresult=array();
  for ($i=0; $i<count($action); $i++) {
    $myelement=makerequest($action[$i], $nodeData[$i], $parameters[$i]);
    if (method_exists($myelement, 'avoidrecursion')) $myelement->avoidrecursion();
    array_push($myresult, $myelement);
  }
}
else {
  $myresult=makerequest($action, $nodeData, $parameters);
  if (method_exists($myresult, 'avoidrecursion')) $myresult->avoidrecursion();
}
header("Content-type: application/json");
echo json_encode($myresult);

function makerequest($action, $nodeData=null, $parameters=null) {
  global $user, $safety;
  $safetyErrorMessage="Database safety";
  $evError=new stdClass();
  $evError->error=true;
  $evError->errorMessage="Request"; //Default
  switch ($action) {
    case "check php version":
      if (Node::checkphpversion($evError)===false) {
        return $evError;
      }
      return new stdClass();
    case "load session":
      $sesname=null;
      if (isset($parameters->sesname)) $sesname=$parameters->sesname;
      $result=new NodeMale();
      $result->load($nodeData);
      if ($result->session($sesname, 'load')===false) {
        $result=$evError;
      }
      break;
    case "write session":
      $sesname=null;
      if (isset($parameters->sesname)) $sesname=$parameters->sesname;
      $result=new NodeMale();
      $result->load($nodeData);
      if ($result->session($sesname, 'write')===false) {
        $result=$evError;
      }
      break;
    case "load themes tree":
      $theme=new Theme();
      $result=$theme->getThemesTree();
      if (!$result) {
        $result=$evError;
      }
      break;
    case "check db link":
      $result=new stdClass();
      if (Node::checkdblink($evError)===false) {
        $result=$evError;
      }
      break;
    case "init database":
      $prefix=null;
      if (isset($parameters->prefix)) $prefix=$parameters->prefrix;
      if (($result=Node::db_initdb($prefix, $evError))===false) {
        $result=$evError;
      }
      break;
    case "load myself":
      $result=new NodeMale();
      $result->load($nodeData);
      if (!$safety->is_allowedtoread($user, $result)) {
        $result=$evError;
        $result->errorMessage=$safetyErrorMessage;
      }
      else if ($result->db_loadmyself()===false) {
        $result=$evError;
      }
      else $result->cutUp();
      break;
    case "load my children":      
      $filter=null; $order=null; $limit=null;
      if (isset($parameters->filter)) $filter=$parameters->filter;
      if (isset($parameters->language)) {
        if (!$filter) $filter=[];
        $filter['_languages'] = $parameters->language;
      }
      if (isset($parameters->order)) $order=$parameters->order;
      if (isset($parameters->limit)) $limit=$parameters->limit;
      $result=new NodeFemale();
      $result->load($nodeData);
      if (!$safety->is_allowedtoread($user, $result)) {
        $result=$evError;
        $result->errorMessage=$safetyErrorMessage;
      }
      else if ($result->db_loadmychildren($filter, $order, $limit)===false) {
        $result=$evError;
      }
      else $result->cutUp();
      break;
    case "load children":
      if (is_array($parameters->reqnodes)) {
        $parentArg=[];
        foreach ($parameters->reqnodes as $reqnode) {
          $myParent=new NodeFemale();
          $myParent->load($reqnode);
          array_push($parentArg, $myParent);
        }
      }
      else {
        $parentArg=new NodeFemale();
        $parentArg->load($parameters->reqnodes);
      }
      $filter=null; $order=null; $limit=null;
      if (isset($parameters->filter)) $filter=$parameters->filter;
      if (isset($parameters->language)) {
        if (!$filter) $filter=[];
        $filter['_languages'] = $parameters->language;
      }
      if (isset($parameters->order)) $order=$parameters->order;
      if (isset($parameters->limit)) $limit=$parameters->limit;
      $result=new NodeFemale();
      $result->load($nodeData);
      if (!$safety->is_allowedtoread($user, $result)) {
        $result=$evError;
        $result->errorMessage=$safetyErrorMessage;
      }
      else if ($result->db_loadchildren($parentArg, $filter, $order, $limit)===false) {
        $result=$evError;
      }
      else $result->cutUp();
      break;
    case "load my relationships":
      $result=new NodeMale();
      $result->load($nodeData);
      if ($result->db_loadmyrelationships()===false) {
        $result=$evError;
      }
      else $result->cutUp();
      break;
    case "load my tree":
      $deepLevel=null; $filter=null; $order=null; $limit=null;
      if (isset($parameters->deepLevel)) $deepLevel=$parameters->deepLevel;
      if (isset($parameters->filter)) $filter=$parameters->filter;
      if (isset($parameters->language)) {
        if (!$filter) $filter=[];
        $filter['_languages'] = $parameters->language;
      }
      if (isset($parameters->order)) $order=$parameters->order;
      if (isset($parameters->limit)) $limit=$parameters->limit;
      if (isset($nodeData->partnerNode)) $result=new NodeFemale();
      else $result=new NodeMale();
      $result->load($nodeData);
      if (!$safety->is_allowedtoread($user, $result)) {
        $result=$evError;
        $result->errorMessage=$safetyErrorMessage;
      }
      else if ($result->db_loadmytree($deepLevel, $filter, $order, $limit)===false) {
        $result=$evError;
      }
      else $result->cutUp();
      break;
    case "load my partner":
      $result=new NodeFemale();
      $result->load($nodeData);
      if (isset($parameters->child_id)) $argument=$parameters->child_id;
      if (!$safety->is_allowedtoread($user, $result)) {
        $result=$evError;
        $result->errorMessage=$safetyErrorMessage;
      }
      else if ($result->db_loadmypartner($argument)===false) {
        $result=$evError;
      }
      else $result->cutDown();
      break;
    case "load my childtablekeys":
      $result=new NodeFemale();
      $result->load($nodeData);
      if (!$result->db_loadchildtablekeys()) {
        $result=$evError;
      }
      break;
    case "load root":
      $result=new NodeFemale();
      $result->load($nodeData);
      if ($result->db_loadroot()===false) {
        $result=$evError;
      }
      break;
    case "load my parent":
      $result=new NodeMale();
      $result->load($nodeData);
      if ($result->db_loadmyparent()===false) {
        $result=$evError;
      }
      else $result->cutDown();
      break;
    case "load my tree up":
      $deepLevel=null;
      if (isset($parameters->$deepLevel)) $deepLevel=$parameters->deepLevel;
      if (isset($nodeData->partnerNode)) $result=new NodeFemale();
      else $result=new NodeMale();
      $result->load($nodeData);
      if (!$safety->is_allowedtoread($user, $result)) {
        $result=$evError;
        $result->errorMessage=$safetyErrorMessage;
      }
      else if ($result->db_loadmytreeup($deepLevel)===false) {
        $result=$evError;
      }
      else $result->cutDown();
      break;
    case "add myself":
      $extra=null; $keepid=false;
      if (isset($parameters->language)) $extra=['_languages' => $parameters->language];
      if (isset($parameters->$keepid)) $keepid=$parameters->keepid;
      $result=new NodeMale();
      $result->load($nodeData);
      if (!$safety->is_allowedtoinsert($user, $result)) {
        $result=$evError;
        $result->errorMessage=$safetyErrorMessage;
      }
      else if ($result->db_insertmyself($extra, $keepid)===false) {
        $result=$evError;
      }
      else {
        $result->cutUp();
        $result->cutDown();
      }
      break;
    case "add my children":
      $extra=null; $keepid=false;
      if (isset($parameters->language)) $extra=['_languages' => $parameters->language];
      if (isset($parameters->$keepid)) $keepid=$parameters->keepid;
      $result=new NodeFemale();
      $result->load($nodeData);
      if (!$safety->is_allowedtoinsert($user, $result)) {
        $result=$evError;
        $result->errorMessage=$safetyErrorMessage;
      }
      else if ($result->db_insertmychildren($extra, $keepid)===false) {
        $result=$evError;
      }
      else {
        $result->cutUp();
      }
      break;
    case "add my tree":
      $deepLevel=null; $extra=null; $keepid=false; $justlangcontent=false;
      if (isset($parameters->deepLevel)) $deepLevel=$parameters->deepLevel;
      if (isset($parameters->language)) $extra=['_languages' => $parameters->language];
      if (isset($parameters->$keepid)) $keepid=$parameters->keepid;
      if (isset($parameters->justlangcontent)) $justlangcontent=$parameters->justlangcontent;
      if (isset($nodeData->partnerNode)) $result=new NodeFemale();
      else $result=new NodeMale();
      $result->load($nodeData);
      if (!$safety->is_allowedtoinsert($user, $result)) {
        $result=$evError;
        $result->errorMessage=$safetyErrorMessage;
      }
      else if ($result->db_insertmytree($deepLevel, $extra, $keepid, $justlangcontent)===false) {
        $result=$evError;
      }
      else {
        $result->cutUp();
      }
      break;
    case "add my link":
      $result=new NodeMale();
      $result->load($nodeData);
      if (!$safety->is_allowedtomodify($user, $result)) {
        $result=$evError;
        $result->errorMessage=$safetyErrorMessage;
      }
      else if ($result->db_insertmylink()===false) {
        $result=$evError;
      }
      else $result->cutUp();
      break;
    case "delete myself":
      $result=new NodeMale();
      $result->load($nodeData);
      if (!$safety->is_allowedtomodify($user, $result)) {
        $result=$evError;
        $result->errorMessage=$safetyErrorMessage;
      }
      else if ($result->db_deletemyself()===false) {
        $result=$evError;
      }
      else $result->cutUp();
      break;
    case "delete my tree":
      if (isset($nodeData->partnerNode)) $result=new NodeFemale();
      else $result=new NodeMale();
      $result->load($nodeData);
      if (!$safety->is_allowedtomodify($user, $result)) {
        $result=$evError;
        $result->errorMessage=$safetyErrorMessage;
      }
      else if ($result->db_deletemytree()===false) {
        $result=$evError;
      }
      else $result->cutUp();
      break;
    case "delete my children":
      $result=new NodeFemale();
      $result->load($nodeData);
      if (!$safety->is_allowedtomodify($user, $result)) {
        $result=$evError;
        $result->errorMessage=$safetyErrorMessage;
      }
      else if ($result->db_deletemychildren()===false) {
        $result=$evError;
      }
      else {
        $result->cutUp();
        $result->cutDown();
      }
      break;
    case "delete my link":
      $result=new NodeMale();
      $result->load($nodeData);
      if (!$safety->is_allowedtomodify($user, $result)) {
        $result=$evError;
        $result->errorMessage=$safetyErrorMessage;
      }
      else if ($result->db_deletemylink()===false) {
        $result=$evError;
      }
      else $result->cutUp();
      break;
    case "edit my sort_order":
      $result=new NodeMale();
      $result->load($nodeData);
      if (!$safety->is_allowedtomodify($user, $result)) {
        $result=$evError;
        $result->errorMessage=$safetyErrorMessage;
      }
      else if ($result->db_updatemysort_order($parameters->newsort_order)===false) {
        $result=$evError;
      }
      else $result->cutUp();
      break;
    case "edit my properties":
      $result=new NodeMale();
      $result->load($nodeData);
      if (!$safety->is_allowedtomodify($user, $result)) {
        $result=$evError;
        $result->errorMessage=$safetyErrorMessage;
      }
      else if ($result->db_updatemyproperties($parameters->properties)===false) {
        $result=$evError;
      }
      else $result->cutUp();
      break;
    case "replace myself":
      $result=new NodeMale();
      $result->load($nodeData);
      if (!$safety->is_allowedtomodify($user, $result)) {
        $result=$evError;
        $result->errorMessage=$safetyErrorMessage;
      }
      else if ($result->db_replacemyself($parameters->newid)===false) {
        $result=$evError;
      }
      else $result->cutUp();
      break;
    case "load unlinked":
      $result=new NodeFemale();
      $result->load($nodeData);
      if (!$safety->is_allowedtoread($user, $result)) {
        $result=$evError;
        $result->errorMessage=$safetyErrorMessage;
      }
      else if ($result->db_loadunlinked()===false) {
        $result=$evError;
      }
      break;
    case "load my children not":
      $result=new NodeFemale();
      $result->load($nodeData);
      if (!$safety->is_allowedtoread($user, $result)) {
        $result=$evError;
        $result->errorMessage=$safetyErrorMessage;
      }
      else if ($result->db_loadmychildrennot()===false) {
        $result=$evError;
      }
      else $result->cutUp();
      break;
    case "load all":
      $filter=null; $order=null; $limit=null;
      if (isset($parameters->filter)) $filter=$parameters->filter;
      if (isset($parameters->language)) {
        if (!$filter) $filter=[];
        $filter['_languages'] = $parameters->language;
      }
      if (isset($parameters->order)) $order=$parameters->order;
      if (isset($parameters->limit)) $limit=$parameters->limit;
      $result=new NodeFemale();
      $result->load($nodeData);
      if (!$safety->is_allowedtoread($user, $result)) {
        $result=$evError;
        $result->errorMessage=$safetyErrorMessage;
      }
      else if ($result->db_loadall($filter, $order, $limit)===false) {
        $result=$evError;
      }
      break;
    case "remove all":
      $filter=null; $limit=null;
      if (isset($parameters->filter)) $filter=$parameters->filter;
      if (isset($parameters->limit)) $limit=$parameters->limit;
      $result=new NodeFemale();
      $result->load($nodeData);
      if (!$safety->is_allowedtomodify($user, $result)) {
        $result=$evError;
        $result->errorMessage=$safetyErrorMessage;
      }
      else if ($result->db_removeall($filter, $limit)===false) {
        $result=$evError;
      }
      break;
    case "load this relationship":
      $result=new NodeFemale();
      $result->load($nodeData);
      if ($result->db_loadthisrel()===false) {
        $result=$evError;
      }
      break;
    case "load tables":
      $prefix=null;
      if (isset($parameters->prefix)) $prefix=$parameters->prefrix;
      if (($result=Node::db_loadtables($prefix))===false) {
        $result=$evError;
      }
      break;
    default: $myexecfunction=null;
  }
  if ($result) {
    return $result;
  }
  return false;
}
?>
