<?php
class user extends NodeMale {
  public function __construct() {
    parent::__construct();
    $this->parentNode=new NodeFemale();
    $this->parentNode->properties->childtablename="TABLE_USERS";
    $this->parentNode->db_loadchildtablekeys();
  }
  function checklogindata($uname, $upass) {
    $ucharts=strlen(utf8_decode($uname));
    $pcharts=strlen(utf8_decode($upass));
    if ($ucharts >= 4 && $ucharts <= 8 && $pcharts >= 4 && $pcharts <= 8) return true;
    return false;
  }
  function usercheck($username, $pwd) {
    $result=new NodeMale();
    $result->extra=new stdClass();
    $user=new user();
    $user->properties->username=$username;
    $result->extra->usernameok=false;
    $result->extra->passwordok=false;
    $result->extra->error=true;
    $candidates=$user->db_search();
    if (!(count($candidates) == 1)) {
      return $result;
    }
    $result->extra->usernameok=true;
    $user->properties->pwd=$pwd;
    $candidates=$user->db_search();
    if (!(count($candidates) == 1)) {
      return $result;
    }
    $result->extra->passwordok=true;
    $result->extra->error=false;
    $result->properties->id = $candidates[0]["id"];
    return $result;
  }
  function create($username, $pwd) {
    $result=new NodeFemale();
    if (!isset($result->extra)) $result->extra=new stdClass();
    $result->extra->error=true;
    $result->extra->usernameok=false;
    $user=new user();
    //expiredata=get from license
    //expiredata->limit;
    //if ($user->db_num()->expiredata->limit) $this->expire();
    $user->properties->username=$username;
    $candidates=$user->db_search();
    if (count($candidates) == 0) {
      $result->extra->usernameok=true;
      $user->properties->pwd=$pwd;
      $result->extra->passwordok=true;
      
      if ($user->db_insertmyself()==true) {
        $result->properties->id=$user->properties->id;
        $user->db_loadmyrelationships();
        /* lets not set any usertype. There was also an error that the insertion was duplicated
        $usertyperel=$user->getRelationship(array("name"=>"userstypes"));
        $defaultusertype=new NodeMale();
        $defaultusertype->properties->id=2;
        $usertyperel->children[0]=$defaultusertype;
        $defaultusertype->parentNode=$usertyperel;
        if ($usertyperel->children[0]->db_setmylink()!=false) {
          $result->extra->error=false;
        }
        */
        $userdatarel=$user->getRelationship(array("name"=>"usersdata"));
        $defaulttype=new NodeMale();
        $userdatarel->children[0]=$defaulttype;
        $defaulttype->parentNode=$userdatarel;
        if ($userdatarel->children[0]->db_insertmyself()!=false) {
          $result->extra->error=false;
        }
        $addressrel=$user->getRelationship(array("name"=>"addresses"));
        $newaddress=new NodeMale();
        $addressrel->children[0]=$newaddress;
        $newaddress->parentNode=$addressrel;
        if ($addressrel->children[0]->db_insertmyself()!=false) {
          $result->extra->error=false;
        }
      }
    }
    return $result;
  }
  function expire(){
  //Check trial period
  //get relationships data
  //insert as text in a domelement named relationships
  //remove relationship register
  }
  function checkexpired(){
  //Check table relationships
  //If not return true

  }
}
?>
