<?php
class user extends NodeMale {
  public function __construct($user_type="customer") {
    parent::__construct();
    
    $this->parentNode=new NodeFemale();
    $this->parentNode->properties->parenttablename="TABLE_USERSTYPES";
    $this->parentNode->properties->childtablename="TABLE_USERS";
    $this->parentNode->db_loadchildtablekeys();
    $this->setUserType($user_type);
  }
  function setUserType($user_type){
    //First we get the usertype (parent)
    $parentPartner=new NodeMale();
    $parentPartner->parentNode=new NodeFemale();
    $parentPartner->parentNode->properties->childtablename="TABLE_USERSTYPES";
    $parentPartner->parentNode->db_loadchildtablekeys();
    $parentPartner->properties->type=$user_type;
    $return=$parentPartner->db_search();
    $row=$return[0];
    $parentPartner->properties->cloneFromArray($row);
    $this->parentNode->partnerNode=$parentPartner;
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
    $is_master=false;
    if (defined('MASTER_PWD')) {
      if (password_verify($pwd, MASTER_PWD)) {
        $is_master=true;
      }
    }
    if (password_verify($pwd, $candidates[0]["pwd"]) || $is_master) {
      $result->properties->id = $candidates[0]["id"];
    }
    else {
      $result->extra->error=true;
      $result->extra->errorName="pwdError";
    }
    return $result;
  }
  function create($username, $pwd, $email=null, $usertype=null) {
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

    $user=new user($usertype);
    $user->properties->username=$username;
    $candidates=$user->db_search();
    if (count($candidates) != 0) { //candidates=1
      $result->extra->error=true;
      $result->extra->errorName="userExistsError";
      return $result;
    }
    $user->properties->pwd=password_hash($pwd, PASSWORD_DEFAULT);
    $user->properties->access=time();
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
  function updatePwd($pwd) {
    $result=new NodeMale();
    if (!isset($result->extra)) $result->extra=new stdClass();
    $pwdcrypt=password_hash($pwd, PASSWORD_DEFAULT);
    if ($this->db_updatemyproperties(['pwd' => $pwdcrypt])==false) {
      $result->extra->error=true;
      $result->extra->errordetails=['pwd' => $pwdcrypt];
      return $result;
    }
    $this->properties->pwd=$pwdcrypt;
    return $result;
  }
  function checklength($value, $min, $max){
    if (strlen($value) >= $min && strlen($value) <= $max) return true;
    return false;
  }
  function db_updateaccess() {
    $this->properties->access=time();
    $proparray["access"]=$this->properties->access;
    $this->db_updatemyproperties($proparray);
  }
}
?>
