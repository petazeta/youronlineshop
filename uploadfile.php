<?php
/* 
 * Upload a single file at the destination folder
*/
header("Content-type: application/json");

$result=new stdclass();
$result->extra=new stdClass();

$base_dir = "catalog/images/";
if (isset($_POST["folder"])) $target_dir=$base_dir . $_POST["folder"] . "/";
else $target_dir=$base_dir;

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
  if(isset($_POST["submit"])) {
      $check = getimagesize($myfile["tmp_name"]);
      if($check !== false) {
          $result->extra->img= "File is an image - " . $check["mime"] . ".";
          $uploadOk = 1;
      } else {
          $result->extra->img= "File is not an image.";
          $uploadOk = 0;
      }
  }
  // Check file size
  if ($myfile["size"] > 500000) {
      $result->extra->error=true;
      $result->extra->errormsg="Sorry, your file is too large.";
      $uploadOk = 0;
  }
  // Allow certain file formats
  if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
  && $imageFileType != "gif" ) {
      $result->extra->error=true;
      $result->extra->errormsg= "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
      $uploadOk = 0;
  }
  // Check if $uploadOk is set to 0 by an error
  if ($uploadOk == 0) {
      $result->extra->error=true;
      $result->extra->errormsg += " Sorry, your file was not uploaded.";
  // if everything is ok, try to upload file
  } else {
      if (move_uploaded_file($myfile["tmp_name"], $target_file)) {
          $result->msg= "The file ". basename( $myfile["name"]). " has been uploaded. $target_file";
      } else {
        $result->extra->error=true;
        $result->extra->errormsg = "Sorry, there was an error uploading your file.";
      }
  }
}

$serelement=json_encode($result);
echo $serelement;
?>

