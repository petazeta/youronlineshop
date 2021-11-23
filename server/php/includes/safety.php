<?php
class Safety {
  private $privateTables, $catalogTables, $itemsTables, $adminUserTypes;
  
  function __construct(){
    $this->privateTables=["TABLE_USERS", "TABLE_USERSDATA", "TABLE_ADDRESSES", "TABLE_ORDERS", "TABLE_ORDERITEMS", "TABLE_ORDERSHIPPINGTYPES", "TABLE_ORDERPAYMENTTYPES"];
    $this->catalogTables=["TABLE_ITEMS", "TABLE_ITEMSDATA", "TABLE_ITEMCATEGORIES", "TABLE_ITEMCATEGORIESDATA"];
    $this->itemTables=["TABLE_ITEMS", "TABLE_ITEMSDATA"];
    $this->adminUserTypes=["web administrator", "orders administrator", "system administrator", "product administrator"];
  }
  private function gettablename($myelement){
    if (gettype($myelement)=="string") return $myelement; //It is the table name
    if (Node::detectGender($myelement)=="NodeFemale") {
      return $myelement->props->childtablename;
    }
    else if (Node::detectGender($myelement)=="NodeMale") {
      return $myelement->parentNode->props->childtablename;
    }
    else {
      if (Node::detectGender($myelement)=="NodeFemale") {
        return $myelement->props->childtablename;
      }
      else return $myelement->parentNode->props->childtablename;
    }
  }
  private function getusertype($user){
    if (isset($user->parentNode) && isset($user->parentNode->partnerNode)) return $user->parentNode->partnerNode->props->type;
  }
  private function is_confidentialtable($tablename){
    if (array_search($tablename, $this->privateTables)!==false) return true;
  }
  private function is_catalogtable($tablename){
    if (array_search($tablename, $this->catalogTables)!==false) return true;
  }
  private function is_itemtable($tablename){
    if (array_search($tablename, $this->itemTables)!==false) return true;
  }
  private function is_admin($user) {
    $usertype=$this->getusertype($user);
    if ($usertype && array_search($usertype, $this->adminUserTypes)!==false) return true;
  }
  private function is_owner($myelement, $user_id) {
    //user relationship case
    if (Node::detectGender($myelement)=="NodeFemale") {
      if ($myelement->props->parenttablename=="TABLE_USERS") {
        if ($myelement->partnerNode && $myelement->partnerNode->props->id == $user_id) return true;
      }
    }
    else {
      //user case
      if ($myelement->parentNode && $myelement->parentNode->props->childtablename=="TABLE_USERS") {
        if  ($myelement->props->id==$user_id) return true;
      }
    }
    //User Descendants case
    $nodeCopy=$myelement->cloneNode();
    $nodeCopy->db_loadmytreeup();
    $myUser=$nodeCopy->getrootnode("TABLE_USERS");
    if ($myUser && $myUser->props->id==$user_id) {
      return true;
    }
  }
  function is_allowedtoread($user, $myelement){
    if (!$this->is_confidentialtable($this->gettablename($myelement))) {
      return true;
    }
    else {
      if ($this->is_admin($user)) {
        return true;
      }
      else {
        if ($this->is_owner($myelement, $user->props->id)) {
          return true;
        }
      }
    }
    return false;
  }
  function is_allowedtoinsert($user, $myelement){
    if ($this->is_admin($user)) {
      return true;
    }
    if (!$this->is_confidentialtable($this->gettablename($myelement))) {
      if ($this->getusertype($user)=="product seller" &&
        $this->is_itemtable($this->gettablename($myelement))
        && $this->is_owner($myelement, $user->props->id)) {
        return true;
      }
    }
    else if ($this->is_confidentialtable($this->gettablename($myelement)) && isset($user->props->id) && $user->props->id) return true;
    return false;
  }
  function is_allowedtomodify($user, $myelement){
    if ($this->is_admin($user)) {
      return true;
    }
    if (!$this->is_confidentialtable($this->gettablename($myelement))) {
      if ($this->getusertype($user)=="product seller" && $this->is_itemtable($this->gettablename($myelement)) && $this->is_owner($myelement, $user->props->id)) {
        return true;
      }
    }
    else if ($this->is_owner($myelement, $user->props->id)) {
      return true;
    }
    return false;
  }
}
?>