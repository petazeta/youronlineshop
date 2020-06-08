<?php
require_once('includes/phpclasses/user.php');
function is_actionpermited($parameters, $myelement){
  if (preg_match('/session/',$parameters->action)) return true;
  if (preg_match('/check db link/',$parameters->action)) return true;
  if (preg_match('/check php version/',$parameters->action)) return true;
  if (preg_match('/load tables/',$parameters->action)) return true;
  if (get_class($myelement)=="NodeFemale") {
    $tablename=$myelement->properties->childtablename;
  }
  else if (get_class($myelement)=="NodeMale") {
    $tablename=$myelement->parentNode->properties->childtablename;
  }

  if (preg_match('/^load/',$parameters->action)) $action="read";
  if (preg_match('/^add/',$parameters->action) || preg_match('/^delete/',$parameters->action) || preg_match('/^edit/',$parameters->action) || preg_match('/^replace/',$parameters->action)) $action="write";
  
  //Avoid HTML Tags for normal user insertions
  if ($action=="write" && $usertype!="web administrator") {
    $elementClone=$myelement->CloneNode();
    $elementClone->avoidrecursion();
    $elementJson=json_encode($elementClone);
    if($elementJson != strip_tags($elementJson)) {
      return false;
    }
  }

  

  $usertype=null;
  $user=null;
  $myuserid=null;
  if (isset($_SESSION["user"])) {
    $user=unserialize($_SESSION["user"]);
    if (isset($user->parentNode) && isset($user->parentNode->partnerNode)) $usertype=$user->parentNode->partnerNode->properties->type;
  }
  //Tables that can be accessed by users and that contain private data = private tables
  $privatetables=["TABLE_USERS", "TABLE_USERSDATA", "TABLE_ADDRESSES", "TABLE_ORDERS", "TABLE_ORDERITEMS", "TABLE_ORDERSHIPPINGTYPES", "TABLE_ORDERPAYMENTTYPES", "TABLE_LOGS"];
  if (array_search($tablename, $privatetables)===false) {
    //Table doesn't contain private data
    if ($action=="write") {
      if ($usertype=="web administrator" || $usertype=="orders administrator") return true;
      if ($usertype=="product administrator") {
        if ($tablename=="TABLE_ITEMS" || $tablename=="TABLE_ITEMSDATA") {
          return true;
        }
      }
      if ($usertype=="product seller") {
        if ($tablename=="TABLE_ITEMS" || $tablename=="TABLE_ITEMSDATA") {
          if (isset($parameters->user_id)) {
            if ($user->properties->id==$parameters->user_id) return true;
          }
          return false;
        }
      }
    }
    else if ($action=="read") return true;  //action is read
    return false;
  }
  else {
    //user can read its data from table users but not write
    if ($tablename=="TABLE_USERS") {
      if ($usertype=="orders administrator" || $usertype=="user administrator") {
        return true;
      }
      else if ($action=="read") {
        //we must check that the user is the owner of the table
        if (isset($parameters->user_id)) {
          if ($user->properties->id==$parameters->user_id) return true;
        }
        return false;
      }
    }
    if ($tablename=="TABLE_ADDRESSES" || $tablename=="TABLE_USERSDATA" || $tablename=="TABLE_ORDERS" || $tablename=="TABLE_ORDERITEMS" || $tablename=="TABLE_ORDERSHIPPINGTYPES" || $tablename=="TABLE_ORDERPAYMENTTYPES") {
      if ($usertype=="orders administrator" || $usertype=="user administrator") {
        return true;
      }
      //we must check the user owner of the table
      else if (isset($parameters->user_id)) {
        if ($user->properties->id==$parameters->user_id) return true;
      }
    }
  }
  return false;
}
?>
