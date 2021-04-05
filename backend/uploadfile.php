<?php
require('includes/config.php');
require('includes/default.php');
require('includes/nodes.php');
require('includes/database_tables.php');
require('includes/user.php');

session_start();

/* 
 * Upload a single file at the destination folder
*/
header("Content-type: application/json");

$result=new stdclass();

if (isset($_SESSION["user"])) {
  $user=unserialize($_SESSION["user"]);
  $userid=$user->properties->id;
}
if (!$userid) {
  $result->error=true;
  $result->errorMessage="Safety error";
  exit(json_encode($result));
}
$base_dir = "../catalog/images/";
if  (isset($_POST['catalogPath'])) {
  $base_dir = "../" . $_POST['catalogPath'] . "/";
}

$target_dir_small=$base_dir . "small" . "/";
$target_dir_big=$base_dir . "big" . "/";

if (count($_FILES)!=1) {
  $result->error=true;
  $result->errorMessage="Error number of files > 1 or no file";
}
else {
  foreach ($_FILES as $key => $value) {
    $target_dir=$target_dir_small;
    if  ($_POST['fileSize']=='big') $target_dir=$target_dir_big;
    uploadfile($_FILES[$key], $target_dir, $result);
  }
}

function uploadfile($myfile, $target_dir, $result){

  $target_file = $target_dir . basename($myfile["name"]);
  $uploadOk = 1;
  $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
  
  // Check if image file is a actual image or fake image
  $check = getimagesize($myfile["tmp_name"]);
  if($check !== false) {
      $result->img= "File is an image - " . $check["mime"] . ".";
  } else {
      $result->img= "File is not an image.";
      return;
  }

  // Check file size
  if ($myfile["size"] > 2000000) {
      $result->error=true;
      $result->errorMessage="Sorry, your file is too large. " . $myfile["size"];
      return;
  }

  if (move_uploaded_file($myfile["tmp_name"], $target_file)) {
      $result->filename=basename( $myfile["name"]);
  }
  else {
    $result->error=true;
    $result->errorMessage = "Sorry, there was an error uploading your file.";
  }
}

echo json_encode($result);

?>

