<?php
session_start();
require('includes/phpclasses/nodes.php');
require('includes/phpclasses/user.php');
if (isset($_SESSION["user"])) {
  $user=unserialize($_SESSION["user"]);
  $userid=$user->properties->id;
}
if (!$userid) exit("safety cut request");
/* 
 * Upload a single file at the destination folder
*/
header("Content-type: application/json");

$result=new stdclass();
$result->extra=new stdClass();

$base_dir = "catalog/images/";
$target_dir=$base_dir . "small" . "/";

if (count($_FILES)!=1) {
  $result->extra->error=true;
  $result->extra->errormsg="Error number of files > 1 or no file";
}
else {
  foreach ($_FILES as $key => $value) {
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
      $result->extra->img= "File is an image - " . $check["mime"] . ".";
  } else {
      $result->extra->img= "File is not an image.";
      return;
  }

  // Check file size
  if ($myfile["size"] > 500000) {
      $result->extra->error=true;
      $result->extra->errormsg="Sorry, your file is too large. " . $myfile["size"];
      return;
  }
  // Allow certain file formats
  if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
  && $imageFileType != "gif" ) {
      $result->extra->error=true;
      $result->extra->errormsg= "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
      return;
  }
  //chmod($target_dir,0777);
  if (move_uploaded_file($myfile["tmp_name"], $target_file)) {
      $result->extra->filename=basename( $myfile["name"]);
  } else {
    $result->extra->error=true;
    $result->extra->errormsg = "Sorry, there was an error uploading your file.";
  }
}

$serelement=json_encode($result);
echo $serelement;

?>

