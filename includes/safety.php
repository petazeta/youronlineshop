<?php
require('includes/phpclasses/user.php');
function is_actionpermited($parameters, $myelement){
  if (preg_match('/session/',$parameters->action)) return true;
  if (preg_match('/check db link/',$parameters->action)) return true;
  if (get_class($myelement)=="NodeFemale") {
    $tablename=$myelement->properties->childtablename;
  }
  else if (get_class($myelement)=="NodeMale") {
    $tablename=$myelement->parentNode->properties->childtablename;
  }

  if (preg_match('/^load/',$parameters->action)) $action="read";
  if (preg_match('/^add/',$parameters->action) || preg_match('/^delete/',$parameters->action) || preg_match('/^edit/',$parameters->action) || preg_match('/^replace/',$parameters->action)) $action="write";

  $usertype=null;
  $user=null;
  $myuserid=null;
  if (isset($_SESSION["user"])) {
    $user=unserialize($_SESSION["user"]);
    if (isset($user->parentNode) && isset($user->parentNode->partnerNode)) $usertype=$user->parentNode->partnerNode->properties->type;
  }
  $privatetables=["TABLE_USERS", "TABLE_USERSDATA", "TABLE_ADDRESSES", "TABLE_ORDERS", "TABLE_ORDERITEMS"];
  if (!array_search($tablename, $privatetables)) {
    if ($action=="write") {
      if ($usertype=="web administrator") return true;
    }
    else if ($action=="read") return true;  //action is read
    return false;
  }
  else {
    if ($tablename=="TABLE_USERS") {
      if ($usertype=="web administrator")  return true;
      else return false;
    }
    if ($tablename=="TABLE_ADDRESSES" || $tablename=="TABLE_USERSDATA" || $tablename=="TABLE_ORDERS" || $tablename=="TABLE_ORDERITEMS") {
      if ($usertype=="orders administrator") return true;
      //we must check the user owner of the table
      if (isset($parameters->user_id)) {
        if ($user->properties->id==$parameters->user_id) return true;
      }
    }
  }
  return false;
}

if (!is_actionpermited($parameters, $myelement)) {
  $myelement->extra=new stdClass();
  $myelement->extra->error=true;
  $myelement->extra->errorinfo=new stdClass();
  $myelement->extra->errorinfo->type="database safety";
  $myelement->avoidrecursion(); //needed when insert
  header("Content-type: application/json");
  echo json_encode($myelement);
  exit();
}
?>