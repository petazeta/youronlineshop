<?php
require_once('nodes.php');

class Theme extends Node{
  function __construct($id=null) {
    parent::__construct();
    $this->path=THEME_PATH;
    if ($id) {
      $mum=$this->getThemesTree();
      $this->active=$this->findTheme($id, $mum->children[0]);
      if (!$this->active) $this->active=$mum->children[0]; //Default
    }
  }
  function getThemesTree() {
    function readFolderDirectory($dir){
      $listDir = array();
      if($handler = opendir($dir)) {
        while (($sub = readdir($handler)) !== FALSE) {
          if ($sub != "." && $sub != "..") {
            if(is_file($dir."/".$sub)) {
              $listDir[] = $sub;
            }elseif(is_dir($dir."/".$sub)) {
              $listDir[$sub] = readFolderDirectory($dir."/".$sub); 
            } 
          }
        }    
        closedir($handler); 
      }
      return $listDir;
    }
    function createTree($data){
      //The tree has a root and then there could be children (at children folder)
      function createBranch($folderTree, $myBranch, $folderName, $subfolders=false) {
        //branch content is the component files or the css files
        if (isset($folderTree[$folderName])) {
          foreach ($folderTree[$folderName] as $key => $value) {
            if (gettype($value)=="string") {
              $myNode=new NodeMale();
              $myNode->props->fileName=$value;
              $myNode->props->id=preg_replace('/\.[^.\/]+$/', '', $myNode->props->fileName);
              $myNode->props->relPath=$folderName;
              if ($myBranch->partnerNode) $myNode->props->path=$myBranch->partnerNode->props->path . '/' . $myNode->props->relPath;
              else $myNode->props->path=$myNode->props->relPath;
              $myBranch->addChild($myNode);
            }
            //sometimes for subfolders also get content
            else if ($subfolders && gettype($value)=="array") {
              foreach ($value as $subkey => $subvalue) {
                if (gettype($subvalue)=="string") {
                  $myNode=new NodeMale();
                  $myNode->props->fileName=$subvalue;
                  $myNode->props->id=preg_replace('/\.[^.\/]+$/', '', $myNode->props->fileName);
                  $myNode->props->relPath=$folderName . '/' . $key;
                  if ($myBranch->partnerNode) $myNode->props->path=$myBranch->partnerNode->props->path . '/' . $myNode->props->relPath;
                  else $myNode->props->path=$myNode->props->relPath;
                  $myBranch->addChild($myNode);
                }
              }
            }
          }
        }
        return $myBranch;
      }
      function innerCreateTree($themes, $parent) {
        //each subfolder is a theme (child)
        foreach ($themes as $key => $value) {
          $myChild=new NodeMale();
          $parent->addChild($myChild);
          $myChild->props->id=$key;
          $myChild->props->relPath=$key;
          if ($parent->partnerNode) $myChild->props->path=$parent->partnerNode->props->path . '/children/' . $key;
          else $myChild->props->path=$key; //is root
          
          $myBranch=new NodeFemale();
          $myBranch->props->name="descendants";
          $myChild->addRelationship($myBranch);
          
          $stylesBranch=new NodeFemale();
          $stylesBranch->props->name="styles";
          $myChild->addRelationship($stylesBranch);
          createBranch($themes[$key], $stylesBranch, 'css');
          
          $componentsBranch=new NodeFemale();
          $componentsBranch->props->name=VIEWS_FOLDER;
          $myChild->addRelationship($componentsBranch);
          createBranch($themes[$key], $componentsBranch, VIEWS_FOLDER, true);
          
          if (array_key_exists("children", $themes[$key])) {
            innerCreateTree($themes[$key]["children"], $myBranch);
          }
        }
      }
      $treeMother=new NodeFemale();
      $treeMother->props->name="descendants";
      innerCreateTree($data, $treeMother);
      return $treeMother;
    }
    return createTree(readFolderDirectory($this->path));
  }
  //creates a list of views files with paths from the theme tree
  //It uses inheritance at views not present at child themes
  function getTpFilesList($myTheme=null, $includeSubs=false){
    if (!$myTheme) $myTheme=$this->active;
    $totTps=array(); 
    $result=array();
    while($myTheme) {
      $themeTps=array();
      $themePaths=array();
      foreach ($myTheme->getRelationship(VIEWS_FOLDER)->children as $key => $value) {
        if (!$includeSubs && strrpos($value->props->relPath, '/')!== false) continue; //exclude files in subfolders from the tplist
        array_push($themeTps, $value->props->id);
        $themePaths[$value->props->id]=$this->path . '/' . $value->props->path . '/' . $value->props->fileName;
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
  function findTheme($id=null, $themeData=null){
    if (!$themeData) return false;
    if ($themeData->props->id==$id) return $themeData;
    $i=count($themeData->getRelationship("descendants")->children);
    while ($i--) {
      $result=$this->findTheme($id, $themeData>getRelationship("descendants")->children[$i]);
      if ($result) return $result;
    }
    return false;
  }
}
?>