<?php
require('includes/config.php');
require('includes/default.php');
require('includes/phpclasses/nodes.php');
require_once('includes/phpclasses/user.php');
require_once('includes/database_tables.php');

//keep sessions on
session_start();

if (isset($_SESSION["user"])) {
  $user=unserialize($_SESSION["user"]);
}
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
    if (get_class($myelement)==NodeFemale) {
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

function makerequest($parameters, $json) {
  global $user;

  if (array_key_exists("partnerNode", $json)) $myelement=new NodeFemale();
  else $myelement=new NodeMale();

  $myelement->load($json);

  //unset($fields["json"]);
  //unset($fields["parameters"]);
  //$myelement->properties->cloneFromArray($fields);  //For the case when some data comes from a form
  
  $allowed=false;
  switch ($parameters->action) {
    case "check db link":
      $myexecfunction="checkdblink";
      $callback="cutUp";
      $allowed=true;
      break;
    case "check php version":
      $myexecfunction="checkphpversion";
      $callback="cutUp";
      $allowed=true;
      break;
    case "load myself":
      $myexecfunction="db_loadmyself";
      $callback="cutUp";
      $allowed=is_allowedtoread($user, $myelement);
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
      $allowed=is_allowedtoread($user, $myelement);
      break;
    case "load children":
      $myexecfunction="db_loadchildren";
      $filter=null; $order=null; $limit = null;
      $reqnodes=$parameters->reqnodes;
      if (isset($parameters->filter)) $filter=$parameters->filter;
      if (isset($parameters->language)) {
        if (!$filter) $filter=[];
        $filter['_languages'] = $parameters->language;
      }
      if (isset($parameters->order)) $order=$parameters->order;
      if (isset($parameters->limit)) $limit=$parameters->limit;
      $argument=[$reqnodes, $filter, $order, $limit];
      $callback="cutUp";
      $allowed=is_allowedtoread($user, $myelement);
      break;
    case "load my relationships":
      $myexecfunction="db_loadmyrelationships";
      $callback="cutUp";
      $allowed=true;
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
      $allowed=is_allowedtoread($user, $myelement);
      break;
    case "load my partner":
      $myexecfunction="db_loadmypartner";
      if (isset($parameters->child_id)) $argument=$parameters->child_id;
      $callback="cutDown";
      $allowed=is_allowedtoread($user, $myelement);
      break;
    case "load my childtablekeys":
      $myexecfunction="db_loadchildtablekeys";
      $allowed=true;
      break;
    case "load root":
      $myexecfunction="db_loadroot";
      $allowed=true;
      break;
    case "load my parent":
      $myexecfunction="db_loadmyparent";
      $callback="cutDown";
      $allowed=true;
      break;
    case "load my tree up":
      $myexecfunction="db_loadmytreeup";
      if (isset($myelement->extra->level)) $argument=$myelement->extra->level;
      $callback="cutDown";
      $allowed=is_allowedtoread($user, $myelement);
      break;
    case "add myself":
      $myexecfunction="db_insertmyself";
      if (isset($parameters->language) || isset($parameters->keepid)) {
        $extra=null; $keepid=null;
        if (isset($parameters->language)) $extra=['_languages' => $parameters->language];
        if (isset($parameters->keepid)) $keepid=$parameters->keepid;
        $argument=[$extra, $keepid];
      }
      $callback=["cutDown", "cutUp"];
      $allowed=is_allowedtoinsert($user, $myelement);
      break;
    case "add my children":
      $myexecfunction="db_insertmychildren";
      if (isset($parameters->language) || isset($parameters->keepid)) {
        $extra=null; $keepid=null;
        if (isset($parameters->language)) $extra=['_languages' => $parameters->language];
        if (isset($parameters->keepid)) $keepid=$parameters->keepid;
        $argument=[$extra, $keepid];
      }
      $callback=["cutDown", "cutUp"];
      $allowed=is_allowedtoinsert($user, $myelement);
      break;
    case "add my tree":
      $myexecfunction="db_insertmytree";
      if (isset($parameters->deepLevel) || isset($parameters->language) || isset($parameters->keepid) || isset($parameters->justlangcontent)) {
        $deepLevel=null; $extra=null; $keepid=null; $justlangcontent=null;
        if (isset($parameters->deepLevel)) $deepLevel=$parameters->deepLevel;
        if (isset($parameters->language)) $extra=['_languages' => $parameters->language];
        if (isset($parameters->keepid)) $keepid=$parameters->keepid;
        if (isset($parameters->justlangcontent)) $justlangcontent=$parameters->justlangcontent;
        $argument=[$deepLevel, $extra, $keepid, $justlangcontent];
      }
      $callback=["cutUp"];
      $allowed=is_allowedtoinsert($user, $myelement);
      break;
    case "add my link":
      $myexecfunction="db_insertmylink";
      $callback=["cutDown", "cutUp"];
      break;
    case "delete myself":
      $myexecfunction="db_deletemyself";
      $callback=["cutDown", "cutUp"];
      $allowed=is_allowedtomodify($user, $myelement);
      break;
    case "delete my tree":
      $myexecfunction="db_deletemytree";
      $callback=["cutDown", "cutUp"];
      $allowed=is_allowedtomodify($user, $myelement);
      break;
    case "delete my children":
      $myexecfunction="db_deletemychildren";
      $callback=["cutDown", "cutUp"];
      $allowed=is_allowedtomodfy($user, $myelement);
      break;
    case "delete my link":
      $myexecfunction="db_deletemylink";
      $callback=["cutDown", "cutUp"];
      $allowed=is_allowedtomodify($user, $myelement);
      break;
    case "edit my sort_order":
      $myexecfunction="db_updatemysort_order";
      if (isset($parameters->newsort_order)) $argument=$parameters->newsort_order;
      $callback=["cutDown", "cutUp"];
      $allowed=is_allowedtomodify($user, $myelement);
      break;
    case "edit my properties":
      $myexecfunction="db_updatemyproperties";
      if (isset($parameters->properties)) $argument=$parameters->properties;
      $callback=["cutDown", "cutUp"];
      $allowed=is_allowedtomodify($user, $myelement);
      break;
    case "replace myself":
      $myexecfunction="db_replacemyself";
      if (isset($parameters->newid)) $argument=$parameters->newid;
      $callback=["cutDown", "cutUp"];
      $allowed=is_allowedtomodify($user, $myelement);
      break;
    case "load unlinked":
      $myexecfunction="db_loadunlinked";
      $callback="cutUp";
      $allowed=is_allowedtoread($user, $myelement);
      break;
    case "load my children not":
      $myexecfunction="db_loadmychildrennot";
      $callback="cutUp";
      $allowed=is_allowedtoread($user, $myelement);
      break;
    case "load all":
      $myexecfunction="db_loadall";
      $filter=null; $order=null; $limit = null;
      if (isset($parameters->filter)) $filter=$parameters->filter;
      if (isset($parameters->order)) $order=$parameters->order;
      if (isset($parameters->limit)) $limit=$parameters->limit;
      if ($filter || $order || $limit) $argument=[$filter, $order, $limit];
      $callback="cutUp";
      $allowed=is_allowedtoread($user, $myelement);
      break;
    case "remove all":
      $myexecfunction="db_removeall";
      $filter=null; $limit = null;
      if (isset($parameters->filter)) $filter=$parameters->filter;
      if (isset($parameters->limit)) $limit=$parameters->limit;
      if ($filter || $limit) $argument=[$filter, $limit];
      $callback="cutUp";
      $allowed=is_allowedtomodify($user, $myelement);
      break;
    case "load this relationship":
      $myexecfunction="db_loadthisrel";
      $allowed=true;
      break;
    case "load tables":
      $myexecfunction="db_loadtables";
      if (isset($parameters->prefix)) $argument=$parameters->prefix;
      $allowed=true;
      break;
    case "init database":
      $myexecfunction="db_initdb";
      if (isset($parameters->prefix)) $argument=$parameters->prefix;
      $allowed=true;
      break;
    case "load session":
      $myexecfunction="session";
      $argument=[$parameters->sesname, "load"];
      $allowed=true;
      break;
    case "write session":
      $myexecfunction="session";
      $argument=[$parameters->sesname, "write"];
      $allowed=true;
      break;
    default: $myexecfunction=null;
  }
  if (!$allowed) {
    $myelement->extra=new stdClass();
    $myelement->extra->error=true;
    $myelement->extra->errorinfo=new stdClass();
    $myelement->extra->errorinfo->type="database safety";
    $myelement->avoidrecursion(); //needed when insert
    header("Content-type: application/json");
    echo json_encode($myelement);
    exit();
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
  return $myelement;
}
if (is_array($json)) { //Multy request
  $myelements=array();
  for ($i=0; $i<count($json); $i++) {
    array_push($myelements, makerequest($parameters[$i], $json[$i]));
  }
  $myelement=new Node();
  $myelement->nodelist=$myelements;
}
else $myelement=makerequest($parameters, $json);
header("Content-type: application/json");
echo json_encode($myelement);
?>
