<?php
require('includes/config.php');
require('includes/default.php');
require('includes/nodes.php');
require_once('includes/user.php');
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

function gettablename($myelement){
  $tablename=null;
  if (get_class($myelement)=="NodeFemale") {
    $tablename=$myelement->properties->childtablename;
  }
  else if (get_class($myelement)=="NodeMale") {
    $tablename=$myelement->parentNode->properties->childtablename;
  }
  return $tablename;
}
function getusertype($user){
  $usertype=null;
  if (isset($user->parentNode) && isset($user->parentNode->partnerNode)) $usertype=$user->parentNode->partnerNode->properties->type;
  return $usertype;
}
function is_confitable($tablename){
  $confidata=false;
  $privatetables=["TABLE_USERS", "TABLE_USERSDATA", "TABLE_ADDRESSES", "TABLE_ORDERS", "TABLE_ORDERITEMS", "TABLE_ORDERSHIPPINGTYPES", "TABLE_ORDERPAYMENTTYPES"];
  if (array_search($tablename, $privatetables)!==false) {
    $confidata=true;
  }
  return $confidata;
}
function is_forbidentable($tablename){
  $confidata=false;
  $privatetables=[];
  if (array_search($tablename, $privatetables)!==false) {
    $confidata=true;
  }
  return $confidata;
}
function is_catalogtable($tablename){
  $confidata=false;
  $catalogtables=["TABLE_ITEMS", "TABLE_ITEMSDATA", "TABLE_ITEMCATEGORIES", "TABLE_ITEMCATEGORIESDATA"];
  if (array_search($tablename, $catalogtables)!==false) {
    $confidata=true;
  }
  return $confidata;
}
function is_itemtable($tablename){
  $confidata=false;
  $catalogtables=["TABLE_ITEMS", "TABLE_ITEMSDATA"];
  if (array_search($tablename, $catalogtables)!==false) {
    $confidata=true;
  }
  return $confidata;
}
function is_admin($user) {
  $admin_users=["web administrator", "orders administrator", "system administrator", "product administrator"];
  $usertype=getusertype($user);
  if ($usertype && array_search($usertype, $admin_users)!==false) {
    return true;
  }
  return false;
}
function is_owner($myelement, $user_id) {
  if (get_class($myelement)=="NodeFemale") {
    //getting elements direct children of user
    if ($myelement->properties->parenttablename=="TABLE_USERS") {
      if ($myelement->partnerNode->properties->id == $user_id) return true;
    }
  }
  else {
    //modifing user table data
    if ($myelement->parentNode && $myelement->parentNode->properties->childtablename=="TABLE_USERS") {
      if  ($myelement->properties->id==$user_id) return true;
    }
  }
  //element is some data from user tree
  $nodeCopy=$myelement->cloneNode();
  $nodeCopy->db_loadmytreeup();
  $nodeRoot=$nodeCopy->getrootnode();
    //When loading ascendants it gets untill usertype root
    $nodeRoot=$nodeRoot->relationships[0]->children[0];
    if ($nodeRoot->parentNode->properties->childtablename=='TABLE_USERS' && $nodeRoot->properties->id==$user_id) {
      return true;
    }
  return false;
}
function is_allowedtoread($user, $myelement){
  if (is_forbidentable(gettablename($myelement)) && !is_admin($user)) {
    return false;
  }
  if (!is_confitable(gettablename($myelement))) {
    return true;
  }
  else {
    if (is_admin($user)) {
      return true;
    }
    else {
      if (is_owner($myelement, $user->properties->id)) {
        return true;
      }
    }
  }
  return false;
}
function is_allowedtoinsert($user, $myelement){
  if (is_forbidentable(gettablename($myelement)) && !is_admin($user)) {
    return false;
  }
  if (is_admin($user)) {
    return true;
  }
  if (!is_confitable(gettablename($myelement))) {
    if (getusertype($user)=="product seller" && is_itemtable(gettablename($myelement)) && is_owner($myelement, $user->properties->id)) {
      return true;
    }
  }
  else {
    $nodeRoot=$myelement->getrootnode();
    if ($nodeRoot->parentNode->properties->childtablename=='TABLE_USERS') {
      if ($nodeRoot->properties->id==$user->properties->id) return true;
    }
    else if (is_owner($nodeRoot, $user->properties->id)) return true;
  }
  return false;
}
function is_allowedtomodify($user, $myelement){
  if (is_forbidentable(gettablename($myelement)) && !is_admin($user)) {
    return false;
  }
  if (is_admin($user)) {
    return true;
  }
  if (!is_confitable(gettablename($myelement))) {
    if (getusertype($user)=="product seller" && is_itemtable(gettablename($myelement)) && is_owner($myelement, $user->properties->id)) {
      return true;
    }
  }
  else if (is_owner($myelement, $user->properties->id)) {
    return true;
  }
  return false;
}

function makerequest($action, $nodeData=null, $parameters=null) {
  global $user;
  $safetyError="Database safety";
  $resultError=new stdClass();
  $resultError->error=true;
  $resultError->errorMessage="Request"; //Default
  switch ($action) {
    case "check db link":
      $result=new stdClass();
      if (Node::checkdblink($resultError)===false) {
        $result=$resultError;
      }
      break;
    case "check php version":
      $result=new stdClass();
      if (Node::checkphpversion($resultError)===false) {
        $result=$resultError;
      }
      break;
    case "load myself":
      $result=new NodeMale();
      $result->load($nodeData);
      if (!is_allowedtoread($user, $result)) {
        $result=$resultError;
        $result->errorMessage=$safetyError;
      }
      else if ($result->db_loadmyself()===false) {
        $result=$resultError;
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
      if (!is_allowedtoread($user, $result)) {
        $result=$resultError;
        $result->errorMessage=$safetyError;
      }
      else if ($result->db_loadmychildren($filter, $order, $limit)===false) {
        $result=$resultError;
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
      if (!is_allowedtoread($user, $result)) {
        $result=$resultError;
        $result->errorMessage=$safetyError;
      }
      else if ($result->db_loadchildren($parentArg, $filter, $order, $limit)===false) {
        $result=$resultError;
      }
      else $result->cutUp();
      break;
    case "load my relationships":
      $result=new NodeMale();
      $result->load($nodeData);
      if ($result->db_loadmyrelationships()===false) {
        $result=$resultError;
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
      if (!is_allowedtoread($user, $result)) {
        $result=$resultError;
        $result->errorMessage=$safetyError;
      }
      else if ($result->db_loadmytree($deepLevel, $filter, $order, $limit)===false) {
        $result=$resultError;
      }
      else $result->cutUp();
      break;
    case "load my partner":
      $result=new NodeFemale();
      $result->load($nodeData);
      if (isset($parameters->child_id)) $argument=$parameters->child_id;
      if (!is_allowedtoread($user, $result)) {
        $result=$resultError;
        $result->errorMessage=$safetyError;
      }
      else if ($result->db_loadmypartner($argument)===false) {
        $result=$resultError;
      }
      else $result->cutDown();
      break;
    case "load my childtablekeys":
      $result=new NodeFemale();
      $result->load($nodeData);
      if (!$result->db_loadchildtablekeys()) {
        $result=$resultError;
      }
      break;
    case "load root":
      $result=new NodeFemale();
      $result->load($nodeData);
      if ($result->db_loadroot()===false) {
        $result=$resultError;
      }
      break;
    case "load my parent":
      $result=new NodeMale();
      $result->load($nodeData);
      if ($result->db_loadmyparent()===false) {
        $result=$resultError;
      }
      else $result->cutDown();
      break;
    case "load my tree up":
      $deepLevel=null;
      if (isset($parameters->$deepLevel)) $deepLevel=$parameters->deepLevel;
      if (isset($nodeData->partnerNode)) $result=new NodeFemale();
      else $result=new NodeMale();
      $result->load($nodeData);
      if (!is_allowedtoread($user, $result)) {
        $result=$resultError;
        $result->errorMessage=$safetyError;
      }
      else if ($result->db_loadmytreeup($deepLevel)===false) {
        $result=$resultError;
      }
      else $result->cutDown();
      break;
    case "add myself":
      $extra=null; $keepid=false;
      if (isset($parameters->language)) $extra=['_languages' => $parameters->language];
      if (isset($parameters->$keepid)) $keepid=$parameters->keepid;
      $result=new NodeMale();
      $result->load($nodeData);
      if (!is_allowedtoinsert($user, $result)) {
        $result=$resultError;
        $result->errorMessage=$safetyError;
      }
      else if ($result->db_insertmyself($extra, $keepid)===false) {
        $result=$resultError;
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
      if (!is_allowedtoinsert($user, $result)) {
        $result=$resultError;
        $result->errorMessage=$safetyError;
      }
      else if ($result->db_insertmychildren($extra, $keepid)===false) {
        $result=$resultError;
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
      if (!is_allowedtoinsert($user, $result)) {
        $result=$resultError;
        $result->errorMessage=$safetyError;
      }
      else if ($result->db_insertmytree($deepLevel, $extra, $keepid, $justlangcontent)===false) {
        $result=$resultError;
      }
      else {
        $result->cutUp();
      }
      break;
    case "add my link":
      $result=new NodeMale();
      $result->load($nodeData);
      if (!is_allowedtomodify($user, $result)) {
        $result=$resultError;
        $result->errorMessage=$safetyError;
      }
      else if ($result->db_insertmylink()===false) {
        $result=$resultError;
      }
      else $result->cutUp();
      break;
    case "delete myself":
      $result=new NodeMale();
      $result->load($nodeData);
      if (!is_allowedtomodify($user, $result)) {
        $result=$resultError;
        $result->errorMessage=$safetyError;
      }
      else if ($result->db_deletemyself()===false) {
        $result=$resultError;
      }
      else $result->cutUp();
      break;
    case "delete my tree":
      if (isset($nodeData->partnerNode)) $result=new NodeFemale();
      else $result=new NodeMale();
      $result->load($nodeData);
      if (!is_allowedtomodify($user, $result)) {
        $result=$resultError;
        $result->errorMessage=$safetyError;
      }
      else if ($result->db_deletemytree()===false) {
        $result=$resultError;
      }
      else $result->cutUp();
      break;
    case "delete my children":
      $result=new NodeFemale();
      $result->load($nodeData);
      if (!is_allowedtomodify($user, $result)) {
        $result=$resultError;
        $result->errorMessage=$safetyError;
      }
      else if ($result->db_deletemychildren()===false) {
        $result=$resultError;
      }
      else {
        $result->cutUp();
        $result->cutDown();
      }
      break;
    case "delete my link":
      $result=new NodeMale();
      $result->load($nodeData);
      if (!is_allowedtomodify($user, $result)) {
        $result=$resultError;
        $result->errorMessage=$safetyError;
      }
      else if ($result->db_deletemylink()===false) {
        $result=$resultError;
      }
      else $result->cutUp();
      break;
    case "edit my sort_order":
      $result=new NodeMale();
      $result->load($nodeData);
      if (!is_allowedtomodify($user, $result)) {
        $result=$resultError;
        $result->errorMessage=$safetyError;
      }
      else if ($result->db_updatemysort_order($parameters->newsort_order)===false) {
        $result=$resultError;
      }
      else $result->cutUp();
      break;
    case "edit my properties":
      $result=new NodeMale();
      $result->load($nodeData);
      if (!is_allowedtomodify($user, $result)) {
        $result=$resultError;
        $result->errorMessage=$safetyError;
      }
      else if ($result->db_updatemyproperties($parameters->properties)===false) {
        $result=$resultError;
      }
      else $result->cutUp();
      break;
    case "replace myself":
      $result=new NodeMale();
      $result->load($nodeData);
      if (!is_allowedtomodify($user, $result)) {
        $result=$resultError;
        $result->errorMessage=$safetyError;
      }
      else if ($result->db_replacemyself($parameters->newid)===false) {
        $result=$resultError;
      }
      else $result->cutUp();
      break;
    case "load unlinked":
      $result=new NodeFemale();
      $result->load($nodeData);
      if (!is_allowedtoread($user, $result)) {
        $result=$resultError;
        $result->errorMessage=$safetyError;
      }
      else if ($result->db_loadunlinked()===false) {
        $result=$resultError;
      }
      break;
    case "load my children not":
      $result=new NodeFemale();
      $result->load($nodeData);
      if (!is_allowedtoread($user, $result)) {
        $result=$resultError;
        $result->errorMessage=$safetyError;
      }
      else if ($result->db_loadmychildrennot()===false) {
        $result=$resultError;
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
      if (!is_allowedtoread($user, $result)) {
        $result=$resultError;
        $result->errorMessage=$safetyError;
      }
      else if ($result->db_loadall($filter, $order, $limit)===false) {
        $result=$resultError;
      }
      break;
    case "remove all":
      $filter=null; $limit=null;
      if (isset($parameters->filter)) $filter=$parameters->filter;
      if (isset($parameters->limit)) $limit=$parameters->limit;
      $result=new NodeFemale();
      $result->load($nodeData);
      if (!is_allowedtomodify($user, $result)) {
        $result=$resultError;
        $result->errorMessage=$safetyError;
      }
      else if ($result->db_removeall($filter, $limit)===false) {
        $result=$resultError;
      }
      break;
    case "load this relationship":
      $result=new NodeFemale();
      $result->load($nodeData);
      if ($result->db_loadthisrel()===false) {
        $result=$resultError;
      }
      break;
    case "load tables":
      $prefix=null;
      if (isset($parameters->prefix)) $prefix=$parameters->prefrix;
      $result=new NodeFemale();
      $result->load($nodeData);
      if ($result->db_loadtables($prefix)===false) {
        $result=$resultError;
      }
      break;
    case "init database":
      $prefix=null;
      if (isset($parameters->prefix)) $prefix=$parameters->prefrix;
      $result=new NodeFemale();
      if ($result->db_initdb($prefix)===false) {
        $result=$resultError;
      }
      break;
    case "load session":
      $sesname=null;
      if (isset($parameters->sesname)) $sesname=$parameters->sesname;
      $result=new NodeMale();
      $result->load($nodeData);
      if ($result->session($sesname, 'load')===false) {
        $result=$resultError;
      }
      break;
    case "write session":
      $sesname=null;
      if (isset($parameters->sesname)) $sesname=$parameters->sesname;
      $result=new NodeMale();
      $result->load($nodeData);
      if ($result->session($sesname, 'write')===false) {
        $result=$resultError;
      }
      break;
    case "load themes tree":
      $theme=new Theme();
      $result=$theme->getThemesTree();
      if (!$result) {
        $result=$resultError;
      }
      break;
    default: $myexecfunction=null;
  }
  if ($result) {
    return $result;
  }
  return false;
}

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
?>
