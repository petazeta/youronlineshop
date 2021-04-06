<?php
class Safety {
  private $privateTables, $catalogTables, $itemsTables, $adminUserTypes;
  
  function __construct(){
    $this->privateTables=["TABLE_USERS", "TABLE_USERSDATA", "TABLE_ADDRESSES", "TABLE_ORDERS", "TABLE_ORDERITEMS", "TABLE_ORDERSHIPPINGTYPES", "TABLE_ORDERPAYMENTTYPES"];
    $this->catalogTables=["TABLE_ITEMS", "TABLE_ITEMSDATA", "TABLE_ITEMCATEGORIES", "TABLE_ITEMCATEGORIESDATA"];
    $this->itemTables=["TABLE_ITEMS", "TABLE_ITEMSDATA"];
    $this->forbidenTables=[];
    $this->adminUserTypes=["web administrator", "orders administrator", "system administrator", "product administrator"];
  }
  private function gettablename($myelement){
    if (get_class($myelement)=="NodeFemale") {
      return $myelement->properties->childtablename;
    }
    if (get_class($myelement)=="NodeMale") {
      return $myelement->parentNode->properties->childtablename;
    }
  }
  private function getusertype($user){
    if (isset($user->parentNode) && isset($user->parentNode->partnerNode)) return $user->parentNode->partnerNode->properties->type;
  }
  private function is_confidentialtable($tablename){
    if (array_search($tablename, $this->privateTables)!==false) return true;
  }
  private function is_forbidentable($tablename){
    if (array_search($tablename, $this->forbidenTables)!==false) return true;
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
    if (get_class($myelement)=="NodeFemale") {
      if ($myelement->properties->parenttablename=="TABLE_USERS") {
        if ($myelement->partnerNode && $myelement->partnerNode->properties->id == $user_id) return true;
      }
    }
    else {
      //user case
      if ($myelement->parentNode && $myelement->parentNode->properties->childtablename=="TABLE_USERS") {
        if  ($myelement->properties->id==$user_id) return true;
      }
    }
    //User Descendants case
    $nodeCopy=$myelement->cloneNode();
    $nodeCopy->db_loadmytreeup();
    $myUser=$nodeCopy->getrootnode("TABLE_USERS");
    if ($myUser && $myUser->properties->id==$user_id) {
      return true;
    }
  }
  function is_allowedtoread($user, $myelement){
    if ($this->is_forbidentable($this->gettablename($myelement)) && !$this->is_admin($user)) {
      return false;
    }
    if (!$this->is_confidentialtable($this->gettablename($myelement))) {
      return true;
    }
    else {
      if ($this->is_admin($user)) {
        return true;
      }
      else {
        if ($this->is_owner($myelement, $user->properties->id)) {
          return true;
        }
      }
    }
    return false;
  }
  function is_allowedtoinsert($user, $myelement){
    if ($this->is_forbidentable($this->gettablename($myelement)) && !$this->is_admin($user)) {
      return false;
    }
    if ($this->is_admin($user)) {
      return true;
    }
    if (!$this->is_confidentialtable($this->gettablename($myelement))) {
      if ($this->getusertype($user)=="product seller" &&
        $this->is_itemtable($this->gettablename($myelement))
        && $this->is_owner($myelement, $user->properties->id)) {
        return true;
      }
    }
    else if ($this->is_owner($myelement, $user->properties->id)) return true;
  }
  function is_allowedtomodify($user, $myelement){
    if ($this->is_forbidentable($this->gettablename($myelement)) && !$this->is_admin($user)) {
      return false;
    }
    if ($this->is_admin($user)) {
      return true;
    }
    if (!$this->is_confidentialtable($this->gettablename($myelement))) {
      if ($this->getusertype($user)=="product seller" && $this->is_itemtable($this->gettablename($myelement)) && $this->is_owner($myelement, $user->properties->id)) {
        return true;
      }
    }
    else if ($this->is_owner($myelement, $user->properties->id)) {
      return true;
    }
    return false;
  }
}
?>