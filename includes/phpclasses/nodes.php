<?php
class Properties {
  function cloneFromArray($row) {
    foreach ($row as $rowKey => $rowValue) {
      if (gettype($rowValue)=="object") continue;
      if (gettype($rowValue)=="array") continue;
      $this->$rowKey=$rowValue;
    }
  }
}

class Node {
  public $properties;
  //optional variable: $extra
  function __construct() {
    $this->properties=new Properties();
  }
  function getdblink(){
    global $dblink;
    if (!$dblink) {
      $dblink=new mysqli(DB_HOST, DB_USERNAME, DB_USERPWD, DB_DATABASENAME);
      $dblink->set_charset(DB_CHARSET);
      $dblink->query("SET character_set_results='" . DB_CHARSET . "'");
    }
    return $dblink;
  }
  function load($source){
    if (gettype($source)=="string") $source=json_decode($source);
    if (isset($source->properties))
      $this->properties->cloneFromArray($source->properties);
    if (isset($source->extra)) $this->extra=$source->extra;
  }
  function loadasc($source){
    if (gettype($source)=="string") $source=json_decode($source);
    if (isset($source->properties))
      $this->properties->cloneFromArray($source->properties);
    if (isset($source->extra)) $this->extra=$source->extra;
  }
  function db_search($tablename=null, $proparray=null) {
    if (!$tablename) $tablename=$this->parentNode->properties->childtablename;
    if (!$proparray) {
      $proparray=$this->properties;
    }
    $searcharray=[];
    foreach($proparray as $key => $value) {
      array_push($searcharray, $key . "='" . $value . "'"); 
    }
    $sql = "SELECT * FROM " . $tablename
     . " where " . implode(" and ", $searcharray);
    if (($result = $this->getdblink()->query($sql))===false) return false;
    $return=[];
    for ($i=0; $i<$result->num_rows; $i++) {
      $row=$result->fetch_array(MYSQLI_ASSOC);
      array_push($return, $row);
    }
    return $return;
  }
}

class NodeFemale extends Node{
  public $partnerNode;
  public $children=array();
  public $childtablekeys=array();

  function load($source) {
    parent::load($source);
    if (isset($source->childtablekeys)) {
      foreach ($source->childtablekeys as $key => $value) {
        $this->childtablekeys[$key]=new Properties();
        $this->childtablekeys[$key]->cloneFromArray($value);
      }
    }
    if (isset($source->children)) {
      foreach ($source->children as $key => $value) {
        $this->children[$key]=new NodeMale();
        $this->children[$key]->parentNode=$this;
        $this->children[$key]->load($value);
      }
    }
  }
  
    //It loads data from a json, if update is true only fields and relationship present at original will be updated
  function loadasc($source) {
    parent::loadasc($source);
    if (isset($source->childtablekeys)) {
      foreach ($source->childtablekeys as $key => $value) {
        $this->childtablekeys[$key]=new Properties();
        $this->childtablekeys[$key]->cloneFromArray($value);
      }
    }
    if (!isset($source->partnerNode) || !$source->partnerNode) return false;
    $this->partnerNode= new NodeMale();
    $this->partnerNode->loadasc($source->partnerNode);
  }
  
  function getChild($obj) {
    $keyname=array_keys($obj)[0];
    $i=count($this->children);
    while($i--) {
      if (isset($this->children[$i]->properties->$keyname) && $this->children[$i]->properties->$keyname==obj.$keyname)
        return $this->children[$i];
    }
    return false;
  }
  function addChild($child) {
    array_push($this->children,$child);
    $child->parentNode=$this;
  }
  function db_loadchildtablekeys() {
    $sql="show columns from " . $this->properties->childtablename;
    if (($result = $this->getdblink()->query($sql))===false) return false;
    for ($i=0; $i<$result->num_rows; $i++) {
      $row=$result->fetch_array(MYSQLI_ASSOC);
      $this->childtablekeys[$i]=new stdClass();
      $this->childtablekeys[$i]->Field=$row["Field"];
      $this->childtablekeys[$i]->Type=$row["Type"];
    }
    return true;
  }

  function db_loadmychildren() {  
    $sql = "SELECT t.*, l.sort_order FROM "
    . TABLE_LINKS . " l"
    . " inner join " . $this->properties->childtablename . " t on t.id=l.child_id"
    .  " WHERE"
    .  " l.relationships_id=" . $this->properties->id
    .  " and l.parent_id=" . $this->partnerNode->properties->id
    . " order by l.sort_order";
    if (($result = $this->getdblink()->query($sql))===false) return false;
    for ($i=0; $i<$result->num_rows; $i++) {
      $row=$result->fetch_array(MYSQLI_ASSOC);
      $this->children[$i] = new NodeMale();
      if ($row["sort_order"]) $this->children[$i]->sort_order=$row["sort_order"];
      unset($row["sort_order"]);
      $this->children[$i]->properties->cloneFromArray($row);
      $this->children[$i]->parentNode=$this;
    }
    return true;
  }
  
  function db_loadmytree($level=null) {
    if ($level===0) return true;
    if ($level) $level--;
    if ($this->db_loadmychildren()===false) return false;
    for ($i=0; $i<count($this->children); $i++)  {
      if ($this->children[$i]->db_loadmytree($level)===false) return false;
    }
  }

  function db_loadroot() {
    $sql = "SELECT r.* FROM "
      . TABLE_RELATIONSHIPS . " r"
      . " WHERE" . " r.parenttablename='" . $this->properties->parenttablename . "'"
      . " AND " . " r.childtablename='" . $this->properties->childtablename . "'";
    if (($result = $this->getdblink()->query($sql))===false) return false;
    $row=$result->fetch_array(MYSQLI_ASSOC);
    $this->properties->cloneFromArray($row);
    $this->db_loadchildtablekeys();
    $sql = "SELECT t.* FROM "
      .  $this->properties->childtablename . " t" 
      . " where t.id not in ("
      .  "SELECT t.id FROM "
        . $this->properties->childtablename . " t "
        . " inner join " . TABLE_LINKS . " l on l.relationships_id=" . $this->properties->id . " and t.id=l.child_id"
        . " WHERE 1"
      . ")";
    if (($result = $this->getdblink()->query($sql))===false || $result->num_rows==0) return false;
    $row=$result->fetch_array(MYSQLI_ASSOC);
      $this->children[0] = new NodeMale();
      $this->children[0]->properties->cloneFromArray($row);
      $this->children[0]->parentNode=$this;
  }

  function avoidrecursion(){
    $this->partnerNode=null;
    for ($i=0; $i<count($this->children); $i++)  {
      $this->children[$i]->avoidrecursion();
    }
  }
}

class NodeMale extends Node{
  public $parentNode;
  public $relationships=array();
  //optional variable $sort_order

  //It loads data from a json, if update is true only fields and relationship present at original will be updated
  function load($source) {
    parent::load($source);
    if (isset($source->sort_order)) $this->sort_order=$source->sort_order;
    if (isset($source->relationships)) {
      foreach ($source->relationships as $i => $value) {
        $this->relationships[$i]=new NodeFemale();
        $this->relationships[$i]->partnerNode=$this;
        $this->relationships[$i]->load($value);
      }
    }
    return true;
  }
  
    //It loads data from a json, just direct ascendents
  function loadasc($source) {
    parent::loadasc($source);
    if (!isset($source->parentNode) || !$source->parentNode) return false;
    $this->parentNode=new NodeFemale();
    $this->parentNode->loadasc($source->parentNode);
    return true;
  }

  function getRelationship($obj) {
    $keyname=array_keys($obj)[0];
    $i=count($this->relationships);
    while($i--) {
      if (isset($this->relationships[$i]->properties->$keyname) && $this->relationships[$i]->properties->$keyname==$obj[$keyname])
        return $this->relationships[$i];
    }
    return false;
  }
  //It load relationships of a determined node from its parentNode->childtablename
  function db_loadmyrelationships() {
    $sql = "SELECT r.* FROM "
      . TABLE_RELATIONSHIPS . " r"
      . " WHERE" . " r.parenttablename='" . $this->parentNode->properties->childtablename . "'";
    if (($result = $this->getdblink()->query($sql))===false) return false;
    for ($i=0; $i<$result->num_rows; $i++) {
      $row=$result->fetch_array(MYSQLI_ASSOC);
      $this->relationships[$i] = new NodeFemale();
      $this->relationships[$i]->properties->cloneFromArray($row);
      $this->relationships[$i]->partnerNode=$this;
      $this->relationships[$i]->db_loadchildtablekeys();
    }
    return true;
  }
  
  function db_loadmytree($level=null) {
    if ($level===0) return true;
    if ($level) $level--;
    if ($this->db_loadmyrelationships()===false) return false;
    for ($i=0; $i<count($this->relationships); $i++)  {
      if ($this->relationships[$i]->db_loadmytree($level)===false) return false;
    }
  }
  
  function db_loadmyself(){
    $sql = "SELECT t.*";
    if (isset($this->parentNode->partnerNode) && isset($this->parentNode->partnerNode->id)) $sql .= ", l.sort_order";
    $sql .= " FROM " . $this->parentNode->childtablename . " t";
    if (isset($this->parentNode->partnerNode) && isset($this->parentNode->partnerNode->id) && isset($this->parentNode->id))
      $sql .= " left join " . TABLE_LINKS . " l on t.id=l.child_id" . " and " . "l.relationships_id='" . $this->parentNode->id . "'" . " and " . "l.parent_id='" . $this->parentNode->partnerNode->id . "'";
    $sql .=" where " . "t.id =" . $this->properties->id;
    if (($result = $this->getdblink()->query($sql))===false) return false;
    $row=$result->fetch_array(MYSQLI_ASSOC);
    if (isset($row["sort_order"])) {
      $this->sort_order=$row["sort_order"];
      unset($row["sort_order"]);
    }
    $this->properties->cloneFromArray($row);
    return true;
  }

  function db_insertmyself() {
    $myproperties=get_object_vars($this->properties);
    foreach ($myproperties as $key => $value) {
      $myproperties[$key]='"' . $value . '"';
    }
    $sql = "INSERT INTO "
      . $this->parentNode->properties->childtablename
      . " ("
        . implode(", ", array_keys($myproperties))
      . " ) VALUES ("
      . implode(", ", array_values($myproperties))
      . " )";
    if (($result = $this->getdblink()->query($sql))===false) return false;
    $this->properties->id = $this->getdblink()->insert_id;
    if (isset($this->parentNode->partnerNode->properties->id)) {
      if ($this->db_insertmylink()===false) return false;
    }
    return true;
  }
  
  function db_insertmylink() {
    if ($this->db_setmylink()===false) return false;
    //We try to update sort_order at the rest of elements
    if (isset($this->sort_order) && $this->sort_order) {
      $sql="update " . TABLE_LINKS
      . " set" . " sort_order=sort_order+1"
      . " where"
      . " relationships_id='" . $this->parentNode->properties->id . "'"
      . " and parent_id=" . $this->parentNode->partnerNode->properties->id
      . " and sort_order >= " . $this->sort_order
      . " and child_id !=" . $this->properties->id;
      if (($result = $this->getdblink()->query($sql))===false) return false;
    }
  }
  
  function db_insertmytree($level=null) {
    if ($level===0) return true;
    if ($level) $level--;
    if ($this->db_insertmyself()===false) return false;
    for ($i=0; $i<count($this->relationships); $i++)  {
      for ($j=0; $j<count($this->relationships[$i]->children); $j++)  {
        if ($this->relationships[$i]->children[$j]->db_insertmytree($level)===false) return false;
      }
    }
  }
  
  function db_setmylink() {
    //we will insert the relationship
    //we do not check for no duplication key, but code is: if ($this->db_isduplicate()) { echo "duplicate"; return false; }
    if (!isset($this->sort_order)) $this->sort_order=1; //first element by default
    $sql = "INSERT INTO "
      . TABLE_LINKS
      . " (parent_id, child_id, sort_order, relationships_id)"
      . " values ('". $this->parentNode->partnerNode->properties->id. "'"
      . ", '" . $this->properties->id . "'"
      . ", '" . $this->sort_order . "'"
      . ", '" . $this->parentNode->properties->id . "')";
      if (($result = $this->getdblink()->query($sql))===false) return false;
      return true;
  }
  
  //Deletes a node. Must be a end node so nodes bellow could appear as linked to the deleted one.
  function db_deletemyself() {
    if (!isset($this->properties->id) || $this->properties->id==null) return false;
    if (isset($this->parentNode->properties->childtablelocked) && $this->parentNode->properties->childtablelocked==1) return false;
      $sql="DELETE FROM "
      . $this->parentNode->properties->childtablename
      . " where id=" . $this->properties->id . " LIMIT 1";
      if (($result = $this->getdblink()->query($sql))===false) return false;
    
    if (isset($this->parentNode->properties->id) && isset($this->parentNode->partnerNode->properties->id)) {
      $this->db_deletemylink();
    }
    return true;
  }

  function db_deletemylink() {
    //Now we got to remove the relation from the database and update the sort_order of the borthers
    if ($this->db_releasemylink()===false) return false; //if there is any problem we abort
    //We try to update sort_order at bro for that we need the object to be updated
    if (isset($this->sort_order) && $this->sort_order) {
      $sql="update " . TABLE_LINKS
      . " set" . " sort_order=sort_order-1"
      . " where"
      . " relationships_id='" . $this->parentNode->properties->id . "'"
      . " and parent_id=" . $this->parentNode->partnerNode->properties->id
      . " and sort_order > " . $this->sort_order;
      if (($result = $this->getdblink()->query($sql))===false) return false;
    }
  }
  
  function db_deletemytree(){
    $this->db_loadmytree();
    $this->db_deletemyself();
    for ($i=0; $i<count($this->relationships); $i++) {
      for ($j=0; $j<count($this->relationships[$i]->children); $j++) {
        $this->relationships[$i]->children[$j]->db_deletemyself();
      }
    }
  }
  
  function execfunctree($myfunc) {
    $this->$myfunc();
    for ($i=0; $i<count($this->relationships); $i++)  {
      for ($j=0; $j<count($this->relationships[$i]->children); $j++)  {
        $this->relationships[$i]->children[j]->execfunctree($myfunc);
      }
    }
  }
    
  function db_releasemylink(){
    //Now we got to remove the relation from the database and update the sort_order of the borthers
    $sql="DELETE FROM "
      . TABLE_LINKS
      . " where"
      . " child_id='" . $this->properties->id . "'"
      . " and relationships_id='" . $this->parentNode->properties->id . "'"
      . " and parent_id=" . $this->parentNode->partnerNode->properties->id;
    if (($result = $this->getdblink()->query($sql))===false) return false;
    return true;
  }
  
  function db_updatemyproperties(){
      //We update the fields
      //First we search for the updatable fields
      $myproperties=get_object_vars($this->properties);
      $setSentences=array();
      foreach ($myproperties as $key =>$value) {
        array_push($setSentences, $key . "=" . '"' . mysql_escape_string($value) . '"');
      }
      $sql = "update ".
        $this->parentNode->properties->childtablename  .
        " set ";
      $sql .= implode(", ", $setSentences);
      $sql .=" where id=" . $this->properties->id;
      if (($result = $this->getdblink()->query($sql))===false) return false;
  }
  
  function db_updatemysort_order($old_sort_order){
    $sql="update " . TABLE_LINKS
    . " set" . " sort_order=" . $this->sort_order
    . " where"
    . " relationships_id='" . $this->parentNode->properties->id . "'"
    . " and parent_id=" . $this->parentNode->partnerNode->properties->id
    . " and child_id=" . $this->properties->id;
    if (($result = $this->getdblink()->query($sql))===false) return false;
    
    $sql="update " . TABLE_LINKS
    . " set" . " sort_order=" . $old_sort_order
    . " where"
    . " relationships_id='" . $this->parentNode->properties->id . "'"
    . " and parent_id=" . $this->parentNode->partnerNode->properties->id
    . " and sort_order=" . $this->sort_order
    . " and child_id!=" . $this->properties->id
    . " LIMIT 1";
    if (($result = $this->getdblink()->query($sql))===false) return false;
    return true;
  }

  function db_replacemyself($newchildid=null) {
    if (!$newchildid) return false;
    //We replace child_id with new child_id
      $sql="update " . TABLE_LINKS
      . " set" . " child_id=" . $newchildid
      . " where"
      . " relationships_id='" . $this->parentNode->properties->id . "'"
      . " and parent_id=" . $this->parentNode->partnerNode->properties->id
      . " and child_id=" . $this->properties->id;
      if (($result = $this->getdblink()->query($sql))===false) return false;
      return true;
  }

  function avoidrecursion(){
    $this->parentNode=null;
    for ($i=0; $i<count($this->relationships); $i++)  {
      $this->relationships[$i]->avoidrecursion();
    }
  }
}

?>