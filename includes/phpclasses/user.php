<?php
class user extends NodeMale {
  public function __construct() {
    parent::__construct();
    $this->parentNode=new NodeFemale();
    $this->parentNode->properties->childtablename="TABLE_USERS";
    $this->parentNode->db_loadchildtablekeys();
  }
  function usercheck($username, $pwd) {
    $result=new NodeMale();
    $result->extra=new stdClass();
    $user=new user();
    $user->properties->username=$username;
    $candidates=$user->db_search();
    if (!(count($candidates) == 1)) { //candidates=0
      $result->extra->error=true;
      $result->extra->errorName="userError";
      return $result;
    }
    if ( version_compare(phpversion(),'5.6')<0) {
      //patch for php 5.4 password_verify
      if (hash_equals($candidates[0]["pwd"], crypt($pwd, $candidates[0]["pwd"]))) {
	$result->properties->id = $candidates[0]["id"];
      }
      else {
	$result->extra->error=true;
	$result->extra->errorName="pwdError";
      }
      //patch for php 5.4 password_verify
    }
    else {
      if (password_verify($pwd, $candidates[0]["pwd"]) ) {
	$result->properties->id = $candidates[0]["id"];
      }
      else {
	$result->extra->error=true;
	$result->extra->errorName="pwdError";
      }
    }
    return $result;
  }
  function create($username, $pwd, $email=null) {
    $result=new NodeMale();
    if (!isset($result->extra)) $result->extra=new stdClass();
    
    if (!$this->checklength($username, 4, 20)) {
      $result->extra->error=true;
      $result->extra->errorName="userCharError";
      return $result;
    }
    if (!$this->checklength($pwd, 4, 20)) {
      $result->extra->error=true;
      $result->extra->errorName="pwdCharError";
      return $result;
    }
    if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
      $result->extra->error=true;
      $result->extra->errorName="emailError";
      return $result;
    }

    $user=new user();
    $user->properties->username=$username;
    $candidates=$user->db_search();
    if (count($candidates) != 0) { //candidates=1
      $result->extra->error=true;
      $result->extra->errorName="userExistsError";
      return $result;
    }
    if (version_compare(phpversion(),'5.6')<0) {
      //patch for php 5.4 password_hash
      $user->properties->pwd=crypt($pwd);
      //patch for php 5.4 password_hash
    }
    else {
      $user->properties->pwd=password_hash($pwd, PASSWORD_DEFAULT);
    }
    
    if ($user->db_insertmyself()==true) {
      $result->properties->id=$user->properties->id;
      $user->db_loadmyrelationships();
      $userdatarel=$user->getRelationship(array("name"=>"usersdata"));
      $defaultdata=new NodeMale();
      $userdatarel->children[0]=$defaultdata;
      $defaultdata->parentNode=$userdatarel;
      if ($email) $userdatarel->children[0]->properties->email=$email;
      if ($userdatarel->children[0]->db_insertmyself()==false) {
	$result->extra->error=false;
	return $result;
      }
      $addressrel=$user->getRelationship(array("name"=>"addresses"));
      $newaddress=new NodeMale();
      $addressrel->children[0]=$newaddress;
      $newaddress->parentNode=$addressrel;
      if ($addressrel->children[0]->db_insertmyself()==false) {
	$result->extra->error=true;
	return $result;
      }
    }
    return $result;
  }
  function checklength($value, $min, $max){
    if (strlen($value) >= $min && strlen($value) <= $max) return true;
    return false;
  }
}
?>
