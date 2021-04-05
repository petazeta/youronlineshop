<?php
require_once('nodes.php');

class Theme extends Node{

  function __construct($id=null) {
    if ($id) {
      $mum=$this->getThemesTree();
      $this->active=$this->find($id, $mum->children[0]);
      if (!$this->active) $this->active=$mum->children[0]; //Default
    }
  }
  function getThemesTree() {
    return $this->createTree($this->readFolderDirectory('../themes'));
  }
  function readFolderDirectory($dir){
    $listDir = array();
    if($handler = opendir($dir)) {
      while (($sub = readdir($handler)) !== FALSE) {
        if ($sub != "." && $sub != ".." && $sub != "Thumb.db") {
          if(is_file($dir."/".$sub)) {
            $listDir[] = $sub;
          }elseif(is_dir($dir."/".$sub)) {
            $listDir[$sub] = $this->readFolderDirectory($dir."/".$sub); 
          } 
        }
      }    
      closedir($handler); 
    }
    return $listDir;
  }
  static function createBranch($folderTree, $myBranch, $folderName, $subfolders=false) {
    if (isset($folderTree[$folderName])) {
      foreach ($folderTree[$folderName] as $key => $value) {
        if (gettype($value)=="string") {
          $myNode=new NodeMale();
          $myNode->properties->fileName=$value;
          $dot=strrpos($myNode->properties->fileName, '.');
          if ($dot!==false) $myNode->properties->id=substr($myNode->properties->fileName, 0, $dot);
          $myNode->properties->relPath=$folderName;
          if ($myBranch->partnerNode) $myNode->properties->path=$myBranch->partnerNode->properties->path . '/' . $myNode->properties->relPath;
          $myBranch->addChild($myNode);
        }
        //sometimes for subfolders
        else if ($subfolders && gettype($value)=="array") {
          foreach ($value as $subkey => $subvalue) {
            if (gettype($subvalue)=="string") {
              $myNode=new NodeMale();
              $myNode->properties->fileName=$subvalue;
              $dot=strrpos($myNode->properties->fileName, '.');
              if ($dot!==false) $myNode->properties->id=substr($myNode->properties->fileName, 0, $dot);
              $myNode->properties->relPath=$folderName . '/' . $key;
              if ($myBranch->partnerNode) $myNode->properties->path=$myBranch->partnerNode->properties->path . '/' . $myNode->properties->relPath;
              $myBranch->addChild($myNode);
            }
          }
        }
      }
    }
    return $myBranch;
  }
  function createTree($data){
    $treeMother=new NodeFemale();
    $treeMother->properties->name="descendants";
    $this->innerCreateTree($data, $treeMother);
    return $treeMother;
  }
  function innerCreateTree($themes, $parent) {
    foreach ($themes as $key => $value) {
      $myChild=new NodeMale();
      $parent->addChild($myChild);
      $myChild->properties->id=$key;
      $myChild->properties->relPath=$key;
      if ($parent->partnerNode) $myChild->properties->path=$parent->partnerNode->properties->path . '/children/' . $key;
      else $myChild->properties->path=$key; //is root
      
      $myBranch=new NodeFemale();
      $myBranch->properties->name="descendants";
      $myChild->addRelationship($myBranch);
      
      $stylesBranch=new NodeFemale();
      $stylesBranch->properties->name="styles";
      $myChild->addRelationship($stylesBranch);
      $this->createBranch($themes[$key], $stylesBranch, 'css');
      
      
      $templatesBranch=new NodeFemale();
      $templatesBranch->properties->name="templates";
      $myChild->addRelationship($templatesBranch);
      $this->createBranch($themes[$key], $templatesBranch, 'templates', true);
      
      if (array_key_exists("children", $themes[$key])) {
        $this->innerCreateTree($themes[$key]["children"], $myBranch);
      }
    }
  }
  function getTpFilesList($myTheme, $params=null){
    $totTps=array(); 
    $result=array();
    while($myTheme) {
      $themeTps=array();
      $themePaths=array();
      foreach ($myTheme->getRelationship("templates")->children as $key => $value) {
        if (strrpos($value->properties->relPath, '/')!== false) continue; //exclude files in subfolders from the tplist
        array_push($themeTps, $value->properties->id);
        $themePaths[$value->properties->id]='../themes/' . $value->properties->path . '/' . $value->properties->fileName;
      }
      $newOnes=array_diff($themeTps, $totTps);
      $totTps=array_merge($newOnes, $totTps);

      foreach ($newOnes as $key => $value) {
        $result[$value]=$themePaths[$value];
      }
      $myTheme=$myTheme->parentNode->partnerNode;
    }
    return $result;
  }
  function getParentsPathOld($myTheme){
    $myTheme=$myTheme->parentNode->partnerNode;
    $path="-";
    while ($myTheme) {
      $path=$myTheme->properties->path . '/children/' . $path;
      $myTheme=$myTheme->parentNode->partnerNode;
    }
    return $path;
  }
  function find($id=null, $themeData=null){
    if (!$themeData) return false;
    if ($themeData->properties->id==$id) return $themeData;
      $i=count($themeData->getRelationship("descendants")->children);
      while ($i--) {
        $result=$this->find($id, $themeData>getRelationship("descendants")->children[$i]);
        if ($result) return $result;
      }
    return false;
  }
}
?>