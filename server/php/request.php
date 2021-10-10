<?php
require('includes/config.php');
require('includes/default.php');
require('includes/nodes.php');
require('includes/reports.php');
require('includes/user.php');
require('includes/safety.php');
require('includes/themes.php');

if (isset($_POST["action"])) { //image
  $action=$_POST["action"];
  $parameters=isset($_POST["parameters"]) ? json_decode(trim($_POST["parameters"])) : null;
}
else {
  $content = json_decode(trim(file_get_contents("php://input")));
  $action=$content->action;
  $parameters=isset($content->parameters) ? $content->parameters : null;
}

error_reporting(E_ERROR | E_WARNING | E_PARSE);

set_error_handler(function ($errno, $errstr, $errfile, $errline ) {
  if (error_reporting()) {
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
  }
});

try {
  if (gettype($action)=="array") { //Multy request
    $myresult=array();
    for ($i=0; $i<count($action); $i++) {
      if ($parameters) $myelement=makerequest($action[$i], $parameters[$i]);
      else $myelement=makerequest($action[$i]);
      array_push($myresult, $myelement);
    }
  }
  else {
    $myresult=makerequest($action, $parameters);
  }
}
catch (Exception $e){
  $myresult=new stdClass();
  $myresult->error=true;
  preg_match('/[^\/]+$/', $e->getFile(), $filename);
  $myresult->message=$e->getMessage() . " at ". $filename[0] . " : " . $e->getLine();
}

//This headers to try to allow api to used externals, it doesn't work the session
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
//header('Access-Control-Allow-Credentials: true'); // this is for sessions/cookies
header('Access-Control-Expose-Headers: Authorization');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

header("Content-type: application/json");
echo json_encode($myresult);

function makerequest($action, $parameters=null) {
  $safety=new Safety();
  switch ($action) {
    case "check requirements":
    case "check db link":
    case "init database":
    case "get tables":
    case "get themes tree":
    case "report":
    break;
    case "edit my image":
      require('includes/filemanager.php');
    default:
      require_once('includes/database_tables.php');
      $headers = apache_request_headers();
      if (isset($headers['Authorization']) || isset($headers['authorization'])){
        if (isset($headers['Authorization'])) $auth=$headers['Authorization'];
        else $auth=$headers['authorization'];
        $matches = array();
        preg_match('/Basic (.*)/', $auth, $matches);
        if (isset($matches[1])){
          $token = $matches[1];
          list ($username, $password)=explode(":", base64_decode($token));
          $user=User::login($username, $password);
        }
      }
      if (!isset($user)) $user=new User(); //??necesitamos $user tambien cuando no hay login?
  }
  $safetyErrorMessage="Database safety";
  $evError=new stdClass();
  $evError->error=true;
  $evError->errorMessage="Request"; //Default
  switch ($action) {
    case "check requirements":
      return Node::checkrequirements();
    case "check db link":
      return Node::checkdblink();
    case "get themes tree":
      $thT=(new Theme())->getThemesTree();
      if (gettype($thT)=="object") $thT->avoidrecursion();
      return $thT;
    case "init database":
      return Node::db_initdb();
    case "report":
      $reporter=new Reporter();
      return $reporter->makeReport($parameters->repData);
    //<-- User requests
    case "logout":
      return User::logout();
    case "login":
      $log=User::login($parameters->user_name, $parameters->user_password);
      if (gettype($log)=="object") $log->avoidrecursion();
      return $log;
    case "update user pwd":
      return $user->db_updatePwd($parameters->user_name, $parameters->user_password);
    case "update my user pwd":
      return $user->db_updateMyPwd($parameters->user_password);
    case "create user":
      $email=isset($parameters->user_email) ? $parameters->user_email : null;
      $result=User::create($parameters->user_name, $parameters->user_password, $email);
      if (gettype($result)=="object") return $result->props->id;
      else return $result;
    case "send mail":
      return $user->sendMail($parameters->to, $parameters->subject, $parameters->message, $parameters->from);
    //<-- Read requests
    case "get tables":
      return Node::db_gettables();
    case "get my childtablekeys":
      return NodeFemale::db_getchildtablekeys($parameters->nodeData);
    case "get my root":
      if (!$safety->is_allowedtoread($user, $parameters->nodeData)) {
        throw new Exception($safetyErrorMessage);
      }
      return NodeFemale::db_getroot($parameters->nodeData);
    case "get all my children":
      $filterProps=isset($parameters->filterProps) ? $parameters->filterProps : [];
      $limit=isset($parameters->limit) ? $parameters->limit : [];
      if (!$safety->is_allowedtoread($user, $parameters->nodeData)) {
        throw new Exception($safetyErrorMessage);
      }
      $result=NodeFemale::db_getallchildren($parameters->nodeData, $filterProps, $limit);
      foreach($result->data as $child) {
        $child->avoidrecursion();
      }
      return $result;
    case "get my children":
      $extraParents=isset($parameters->extraParents) ? $parameters->extraParents : null;
      $filterProps=isset($parameters->filterProps) ? $parameters->filterProps : [];
      $limit=isset($parameters->limit) ? $parameters->limit : [];
      if (!$safety->is_allowedtoread($user, $parameters->nodeData)) {
        throw new Exception($safetyErrorMessage);
      }
      $result=NodeFemale::db_getchildren($parameters->nodeData, $extraParents, $filterProps, $limit);
      foreach($result->data as $child) {
        $child->avoidrecursion();
      }
      return $result;
    case "get my tree":
      $deepLevel=isset($parameters->deepLevel) ? $parameters->deepLevel : null;
      $extraParents=isset($parameters->extraParents) ? $parameters->extraParents : null;
      $filterProps=isset($parameters->filterProps) ? $parameters->filterProps : [];
      $limit=isset($parameters->limit) ? $parameters->limit : [];
      $myself=isset($parameters->myself) ? $parameters->myself : false;
      $gender=Node::detectGender($parameters->nodeData);
      $req=new $gender();
      $req->load($parameters->nodeData);
      if (!$safety->is_allowedtoread($user, $req)) {
        throw new Exception($safetyErrorMessage);
      }
      $result=$req->db_getmytree($extraParents, $deepLevel, $filterProps, $limit, $myself);
      if ($gender=='NodeFemale') {
        $elements=$result->data;
      }
      else {
        if (!$myself) $elements=$result;
        else {
          $result->avoidrecursion();
          $elements=[];
        }
      }
      foreach ($elements as $element) {
        $element->avoidrecursion();
      }
      return $result;
    case "get my relationships":
      $relationships=NodeMale::db_getrelationships($parameters->nodeData);
      foreach($relationships as $rel) {
        $rel->avoidrecursion();
      }
      return $relationships;
    case "get my tree up":
      $deepLevel=isset($parameters->deepLevel) ? $parameters->deepLevel : null;
      $gender=Node::detectGender($parameters->nodeData);
      $req=new $gender();
      $req->load($parameters->nodeData);
      if (!$safety->is_allowedtoread($user, $req)) {
        throw new Exception($safetyErrorMessage);
      }
      $upElements=$req->db_getmytreeup($deepLevel);
      if (gettype($upElements)=='array') {
        foreach($upElements as $upNode) {
          $upNode->avoidrecursion();
        }
      }
      else $upElements->avoidrecursion();
      return $upElements;
    //<-- Insert requests
    case "add myself":
      $extraParents=isset($parameters->extraParents) ? $parameters->extraParents : null;
      $req=new NodeMale();
      $req->load($parameters->nodeData);
      if (!$safety->is_allowedtoinsert($user, $req)) {
        throw new Exception($safetyErrorMessage);
      }
      return $req->db_insertmyself($extraParents);
    case "add my children":
      $extraParents=isset($parameters->extraParents) ? $parameters->extraParents : null;
      $req=new NodeFemale();
      $req->load($parameters->nodeData);
      if (!$safety->is_allowedtoinsert($user, $req)) {
        throw new Exception($safetyErrorMessage);
      }
      return $req->db_insertmychildren($extraParents);
    case "add my tree":
      $extraParents=isset($parameters->extraParents) ? $parameters->extraParents : null;
      $deepLevel=isset($parameters->deepLevel) ? $parameters->deepLevel : null;
      $myself=isset($parameters->myself) ? $parameters->myself : null;
      $gender=Node::detectGender($parameters->nodeData);
      $req=new $gender();
      $req->load($parameters->nodeData);
      if (!$safety->is_allowedtoinsert($user, $req)) {
        throw new Exception($safetyErrorMessage);
      }
      return ($req->db_insertmytree($deepLevel, $extraParents, $myself))->avoidrecursion();
    case "add my tree table content":
      $tableName=$parameters->tableName;
      $extraParents=isset($parameters->extraParents) ? $parameters->extraParents : null;
      $deepLevel=isset($parameters->deepLevel) ? $parameters->deepLevel : null;
      $gender=Node::detectGender($parameters->nodeData);
      $req=new $gender();
      $req->load($parameters->nodeData);
      if (!$safety->is_allowedtoinsert($user, $req)) {
        throw new Exception($safetyErrorMessage);
      }
      $elements=$req->db_insertmytree_tablecontent($tableName, $deepLevel, $extraParents);
      $elementsIds=[];
      foreach ($elements as $elm)  {
        if (isset($elm->props->id)) array_push($elementsIds, $elm->props->id);
      }
      return $elementsIds;
    case "add my link":
      $extraParents=isset($parameters->extraParents) ? $parameters->extraParents : null;
      $req=new NodeMale();
      $req->load($parameters->nodeData);
      if (!$safety->is_allowedtoinsert($user, $req)) {
        throw new Exception($safetyErrorMessage);
      }
      return $req->db_insertmylink($extraParents);
    //<-- Delete queries
    case "delete myself":
      $req=new NodeMale();
      $req->load($parameters->nodeData);
      if (!$safety->is_allowedtomodify($user, $req)) {
        throw new Exception($safetyErrorMessage);
      }
      return $req->db_deletemyself();
    case "delete my tree":
      $gender=Node::detectGender($parameters->nodeData);
      $req=new $gender();
      $req->load($parameters->nodeData);
      if (!$safety->is_allowedtomodify($user, $req)) {
        throw new Exception($safetyErrorMessage);
      }
      return $req->db_deletemytree();
    case "delete my children":
      $req=new NodeFemale();
      $req->load($parameters->nodeData);
      if (!$safety->is_allowedtomodify($user, $req)) {
        throw new Exception($safetyErrorMessage);
      }
      return $req->db_deletemychildren();
    //<-- Update queries
    case "edit my sort_order":
      $req=new NodeMale();
      $req->load($parameters->nodeData);
      $req->db_loadmyself(); //For loading the actual position
      if (!$safety->is_allowedtomodify($user, $req)) {
        throw new Exception($safetyErrorMessage);
      }
      $afected=$req->db_updatemysort_order($parameters->newSortOrder);
      if ($afected==1) return $parameters->newSortOrder;
      else return false;
    case "edit my props":
      $req=new NodeMale();
      $req->load($parameters->nodeData);
      if (!$safety->is_allowedtomodify($user, $req)) {
        throw new Exception($safetyErrorMessage);
      }
      return $req->db_updatemyprops($parameters->props);
    case "edit my image":
      $req=new NodeMale();
      $req->load($parameters->nodeData);
      if (!$safety->is_allowedtomodify($user, $req)) {
        throw new Exception($safetyErrorMessage);
      }
      $fileManager=new FileManager();
      foreach ($_FILES as $key => $value) {
        $destinationFolder=$fileManager->smallPath;
        if  ($parameters->fileSize=='big') $destinationFolder=$fileManager->bigPath;
        if ($result=$fileManager->uploadfile($_FILES[$key], $destinationFolder)!==true) {
          return $result;
        }
      }
      return true;
    default:
      throw new Exception("no action recognised");
  }
  if (isset($result)) {
    return $result;
  }
  return false;
}
?>
