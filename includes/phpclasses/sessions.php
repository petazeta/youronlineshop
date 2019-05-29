<?php
class session extends NodeMale {
  public function __construct() {
    parent::__construct();
    $this->parentNode=new NodeFemale();
    if (defined('DB_SESSIONS') && DB_SESSIONS==true) {
      $this->parentNode->properties->childtablename="TABLE_SESSIONS";
      $this->parentNode->db_loadchildtablekeys();
    }
  }
  function open() {
    return true;
  }

  function close() {
    $this->gc(get_cfg_var("session.gc_maxlifetime")); // ubuntu and debian php needs this sentence
    return true;
  }

  function read($sesid) {
    $this->properties->sesid=$sesid;
    $searcharray['sesid']=$sesid;
    $candidates=$this->db_search(null, $searcharray);
    
    if (count($candidates)) {
        $this->properties->data = $candidates[0]["data"];
        $this->properties->id = $candidates[0]["id"];
        $this->properties->access=time();
        $proparray["access"]=$this->properties->access;
        $this->db_updatemyproperties($proparray);
        return (string)$this->properties->data;
    }
    return false;
  }

  function write($sesid, $data) {
    if ($data) {
      $this->properties->data = (string) $data;
      $proparray["data"]=$this->properties->data;
    }
    $this->properties->sesid = $sesid;
    $searcharray['sesid']=$sesid;
    $candidates=$this->db_search(null, $searcharray);
    
    $this->properties->access = time();
    if (count($candidates)) {
        $this->properties->id = $candidates[0]["id"];
        $proparray["access"]=$this->properties->access;
        $this->db_updatemyproperties($proparray);
    }else{
        $this->db_insertmyself();
    }

    return true;
  }

  function destroy($sesid) {
    $this->properties->sesid=$sesid;
    $searcharray['sesid']=$sesid;
    $candidates=$this->db_search(null, $searcharray);
    
    if (count($candidates)) {
        $this->properties->id = $candidates[0]["id"];
        $this->db_deletemyself();
        return true;
    }
    return false;
  }

  function gc($maxlifetime) {
    $proparray['access'] = time() - $maxlifetime;
    $condarray['access']='<=?';
    
    $candidates=$this->db_search(null, $proparray, $condarray);
    
    if (count($candidates)) {
      $removalNode=new NodeMale();
      $removalNode->loadasc($this);
      foreach ($candidates as $key => $value) {
        $removalNode->properties->id = $candidates[0]["id"];
        $removalNode->db_deletemyself();
      }
    }
    return true;
  }
  function session_none() {
    if ( php_sapi_name() !== 'cli' ) {
      if ( version_compare(phpversion(), '5.4.0', '>=') ) {
          return session_status() === PHP_SESSION_NONE ? TRUE : FALSE;
      } else {
          return session_id() === '' ? TRUE : FALSE;
      }
    }
    return FALSE;
  }
  function set_session_to_db() {
    //set the session save handler to use our custom functions
    session_set_save_handler(
      array($this, 'open'),
      array($this, 'close'),
      array($this, 'read'),
      array($this, 'write'),
      array($this, 'destroy'),
      array($this, 'gc')
    );
    // the following prevents unexpected effects when using objects as save handlers
    register_shutdown_function('session_write_close');
  }
  
  function readall($count=false, $sys=false) {
    //It returns a list of users logged in, it returns only users ids and names.
    $candidates=new NodeFemale();
    $candidates->load($this->parentNode);
    $candidates->db_loadall();
    if ($count) return count($candidates->children);
    if ($sys) return $candidates->children;
    $onlineUsers=[];
    if (count($candidates->children)) {
      // store our current session
      $my_sess = $_SESSION;
      foreach ($candidates->children as $key => $value) {
        session_decode($value->properties->data); // decode $data >> $_SESSION
        $sesUser=unserialize($_SESSION['user']);
        $loadedUser=new user();
        $loadedUser->load($sesUser, 0, 0, ['username']);
        array_push($onlineUsers, $loadedUser); 
      }
      // restore our current session
      $_SESSION=$my_sess;
    }
    return $onlineUsers;
  }
}
?>
