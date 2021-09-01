<?php
class User extends NodeMale {
  public function __construct($user_type="customer") {
    parent::__construct();
    
    $this->parentNode=new NodeFemale("TABLE_USERS", "TABLE_USERSTYPES");
    $this->parentNode->db_loadmychildtablekeys();
    $this->setUserType($user_type);
  }
  function setUserType($user_type){
    //First we get the usertype (parent)
    $parentPartner=new NodeMale();
    $parentPartner->parentNode=new NodeFemale("TABLE_USERSTYPES");
    $parentPartner->parentNode->db_loadmychildtablekeys();
    $parentPartner->props->type=$user_type;
    $result=NodeFemale::db_getallchildren($parentPartner->parentNode, $parentPartner->props);
    if ($result->total==0) return false;
    $this->parentNode->partnerNode=$parentPartner;
  }
  
  static function userCheck($username, $pwd) {
    $prop=new stdClass();
    $prop->username=$username;
    $result=NodeFemale::db_getallchildren(new NodeFemale("TABLE_USERS"), $prop);
    $candidates=$result->data;
    if ($result->total != 1) { //candidates=0
      return "userError";
    }
    $is_master=false;
    if (defined('MASTER_PWD')) {
      if (password_verify($pwd, MASTER_PWD)) {
        $is_master=true;
      }
    }
    if (password_verify($pwd, $candidates[0]->props->pwd) || $is_master) {
      return $candidates[0]->props->id;
    }
    else {
      return "pwdError";
    }
  }
  static function create($username, $pwd, $email=null, $usertype="customer") {
    if (!User::checklength($username, 4, 20)) {
      return "userCharError";
    }
    if (!User::checklength($pwd, 4, 20)) {
      return "pwdCharError";
    }
    if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
      return "emailError";
    }
    $user=new User($usertype);
    $user->props->username=$username;
    $result=NodeFemale::db_getallchildren($user->parentNode, $user->props);
    if ($result->total != 0) { //candidates=1
      return "userExistsError";
    }
    $user->props->pwd=password_hash($pwd, PASSWORD_DEFAULT);
    $user->props->access=time();
    $user->db_insertmyself();
    $user->db_loadmyrelationships();
    $userdatarel=$user->getRelationship("usersdata");
    $defaultdata=new NodeMale();
    $userdatarel->children[0]=$defaultdata;
    $defaultdata->parentNode=$userdatarel;
    if ($email) $userdatarel->children[0]->props->email=$email;
    $userdatarel->children[0]->db_insertmyself();
    $addressrel=$user->getRelationship("addresses");
    $newaddress=new NodeMale();
    $addressrel->children[0]=$newaddress;
    $newaddress->parentNode=$addressrel;
    $addressrel->children[0]->db_insertmyself();
    return $user;
  }
  function db_updateMyPwd($pwd) {
    if (!User::checklength($pwd, 4, 20)) {
      return "pwdCharError";
    }
    $pwdcrypt=password_hash($pwd, PASSWORD_DEFAULT);
    if ($this->db_updatemyprops(['pwd' => $pwdcrypt])==1) {
      $this->props->pwd=$pwdcrypt;
      return true;
    }
  }
  function db_updatePwd($username, $pwd) {
    if (!User::checklength($username, 4, 20)) {
      return "userCharError";
    }
    if ($this->parentNode->partnerNode->props->type!="system administrator") return false;
    $prop=new stdClass();
    $prop->username=$username;
    $result=NodeFemale::db_getallchildren($this->parentNode, $prop);
    if ($result->total == 1) {
      $myuser=new user();
      $myuser->props->id=$result->data[0]->props->id;
      $myuser->db_loadmyrelationships();
      $myuser->getRelationship("usersdata")->db_loadmychildren();
      $myuser->db_loadmytreeup();
    }
    return $myuser->db_updateMyPwd($pwd);
  }
  static function checklength($value, $min, $max){
    if (strlen($value) >= $min && strlen($value) <= $max) return true;
    return false;
  }
  function db_updateaccess() {
    $this->props->access=time();
    $proparray["access"]=$this->props->access;
    $this->db_updatemyprops($proparray);
  }
  static function logout(){
    return true;
  }
  static function login($uname, $upwd){
    if (!$uname || !$upwd) {
      return "Not enoght data";
    }
    $userCheck=User::usercheck($uname, $upwd);
    if (is_numeric($userCheck)) {
      $user=new User();
      $user->props->username=$uname;
      $user->props->password=$upwd;
      $user->props->id=$userCheck;
      $user->db_loadmyrelationships(); //myabe load childtablekeys??
      $user->db_loadmytreeup();
      //$_SESSION["user"]=serialize($user);
      $user->db_updateaccess(); //We update the access time
      return $user;
    }
    else return $userCheck;
  }
  //Get some user data from user name or userAdminType
  function getEmailAddress($recipient) {
    if ($this->props->username==$recipient) {
      $myuser=$this;
      $myuser->getRelationship("usersdata")->db_loadmychildren();
    }
    else if ('USER_ORDERSADMIN'==$recipient || 'USER_SYSTEMADMIN'==$recipient) {
      //We get the admin user
      if ('USER_ORDERSADMIN'==$recipient) {
        $user_type='orders administrator';
      }
      else $user_type='system administrator';
      $prop=new StdClass();
      $prop->type=$user_type;
      $parent=new NodeFemale("TABLE_USERSTYPES");
      $result=NodeFemale::db_getallchildren($parent, $prop);
      if ($result->total > 0) {
        $parent->addChild($result->data[0]);
        $parent->children[0]->db_loadmytree();
        if (count($parent->children[0]->getRelationship('users')->children) > 0) {
          $myuser=$parent->children[0]->getRelationship('users')->children[0];
        }
      }
    }
    else {
      $prop=new stdClass();
      $prop->username=$recipient;
      $result=NodeFemale::db_getallchildren($this->parentNode, $prop);
      if ($result->total > 0) {
        $parent=new NodeFemale("TABLE_USERS");
        $myuser=new user();
        $parent->addChild($myuser);
        $myuser->props->id=$result->data[0]->props->id;
        $myuser->db_loadmyrelationships();
        $myuser->getRelationship("usersdata")->db_loadmychildren();
        $myuser->db_loadmytreeup();
      }
    }
    if (!isset($myuser)) return false;
    //Only send email from user account to himself ... or to admin and from admin to users
    if (!($myuser->props->id==$this->props->id) && !($myuser->parentNode->partnerNode->props->type=="system administrator" || $myuser->parentNode->partnerNode->props->type=="orders administrator")
      && !($myuser->parentNode->partnerNode->props->type=="system administrator" || $myuser->parentNode->partnerNode->props->type=="orders administrator")
      && !($this->parentNode->partnerNode->props->type=="system administrator" || $this->parentNode->partnerNode->props->type=="orders administrator")
    ) {
      return false;
    }
    //Get mail address from user name
    return $myuser->getRelationship("usersdata")->children[0]->props->emailaddress;
  }
  function sendMail($to, $subject, $message, $from){
    $to_mailaddress = $this->getEmailAddress($to);
    if (!$to_mailaddress || !filter_var($to_mailaddress, FILTER_VALIDATE_EMAIL)) {
      return false;
    }
    $from_mailaddress = $this->getEmailAddress($from);
    $headers = 'From: ' . $from_mailaddress . "\r\n" .
        'Reply-To: ' . $from_mailaddress . "\r\n" .
        'X-Mailer: PHP/' . phpversion();
    return mail($to_mailaddress,$subject,$message,$headers);
  }
}
?>
