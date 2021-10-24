<?php
require('includes/config.php');
require('includes/default.php');
require('includes/nodes.php');
require('includes/reports.php');
require('includes/user.php');
require('includes/safety.php');
require('includes/themes.php');
require('includes/filemanager.php');

$parameters=isset($_POST["parameters"]) ? json_decode(trim($_POST["parameters"])) : null;


error_reporting(E_ERROR | E_WARNING | E_PARSE);

set_error_handler(function ($errno, $errstr, $errfile, $errline ) {
  if (error_reporting()) {
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
  }
});

try {
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
  $safetyErrorMessage="Database safety";
  $safety=new Safety();
  $req=new NodeMale();
  $req->load($parameters->nodeData);
  if (!$safety->is_allowedtomodify($user, $req)) {
    throw new Exception($safetyErrorMessage);
  }
  $fileManager=new FileManager();
  $myresult=true;
  foreach ($_FILES as $key => $value) {
    $destinationFolder=$fileManager->smallPath;
    if  ($parameters->fileSize=='big') $destinationFolder=$fileManager->bigPath;
    if ($fileManager->uploadfile($_FILES[$key], $destinationFolder)!==true) {
      $myresult=false;
      break;
    }
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

?>
