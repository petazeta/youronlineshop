<?php
class Recorder{
  function __construct() {
    $this->fileNamePath="./logs/logs.txt";
    $this->urlExternalRecorder="https://youronlineshop.net/reprecord.php";
    $this->maxSize=50000;
  }
  function reset($maxSize=0){
    if (!file_exists($this->fileNamePath) || filesize($this->fileNamePath) > $maxSize) {
      if (file_exists($this->fileNamePath)) rename($this->fileNamePath, $this->fileNamePath . '.old.txt');
      file_put_contents($this->fileNamePath, 'new file ' . "\n", FILE_APPEND | LOCK_EX);
      chmod($this->fileNamePath, 0777);
    }
  }
  function addRecord($dataRow, $location){
    $myreturn=true;
    $row=[];
    date_default_timezone_set("Europe/Madrid");
    $row['date']=date('Y/m/d H:i:s');
    $row=array_merge($row, $dataRow);
    if (strpos($location , "internal")!==false) {
      $this->reset($this->maxSize);
      if (!file_put_contents($this->fileNamePath, implode(' ', $row) . "\n", FILE_APPEND | LOCK_EX)) {
        $myreturn=false;
      }
    }
    if (strpos($location , "external")!==false) {
      $row['IPhost']=$_SERVER['SERVER_ADDR'];
      $row['host']=$_SERVER['SERVER_NAME'];
      $sentences=[];
      foreach ($row as $key => $value) {
        array_push($sentences, $key . '=' . urlencode($value));
      }
      file_get_contents($this->urlExternalRecorder . '?' . implode('&', $sentences));
    }
    return $myreturn;
  }
}
class Reporter extends Recorder{
  function __construct() {
    parent::__construct();
  }
  function makeReport($data, $location="internal/external") {
    $rowData=[];
    if (gettype($data)=="string") {
      $rowData["data"]=$data;
    }
    else if (gettype($data)=="array") {
      $rowData=$data;
    }
    return $this->addRecord($rowData, $location);
  }
}
?>