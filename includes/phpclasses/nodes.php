<?php
class Properties {
  function cloneFromArray($row) {
    foreach ($row as $rowKey => $rowValue) {
      if (gettype($rowValue)=='object') continue;
      if (gettype($rowValue)=='array') continue;
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
      $dblink->query('SET character_set_results=\'' . DB_CHARSET . '\'');
    }
    return $dblink;
  }
  function load($source){
    if (gettype($source)=='string') $source=json_decode($source);
    if (isset($source->properties))
      $this->properties->cloneFromArray($source->properties);
    if (isset($source->extra)) $this->extra=$source->extra;
  }
  function loadasc($source){
    if (gettype($source)=='string') $source=json_decode($source);
    if (isset($source->properties))
      $this->properties->cloneFromArray($source->properties);
    if (isset($source->extra)) $this->extra=$source->extra;
  }
  function db_search($tablename=null, $proparray=null) {
    if (!$tablename) $tablename=constant($this->parentNode->properties->childtablename);
    if (!$proparray) {
      $proparray=$this->properties;
    }
    $searcharray=[];
    foreach($proparray as $key => $value) {
      array_push($searcharray, $key . '=\'' . $value . '\''); 
    }
    $sql = 'SELECT * FROM ' . $tablename
     . ' where ' . implode(' and ', $searcharray);
    if (($result = $this->getdblink()->query($sql))===false) return false;
    $return=[];
    for ($i=0; $i<$result->num_rows; $i++) {
      $row=$result->fetch_array(MYSQLI_ASSOC);
      array_push($return, $row);
    }
    return $return;
  }
  function db_deletemytree(){
    $this->db_loadmytree();
    $this->db_deletemytree_proto();
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
    if (gettype($source->partnerNode)=='array') {
      $this->partnerNode=[];
      foreach($source->partnerNode as $sourcePartnerNode) {
	$partnerNode=new NodeMale();
	$partnerNode->loadasc($sourcePartnerNode);
	$this->partnerNode[]=$partnerNode;
      }
    }
    else {
      $this->partnerNode= new NodeMale();
      $this->partnerNode->loadasc($source->partnerNode);
    }
    return true;
  }
  function cutUp(){
    $this->partnerNode=null;
  }
  function cutDown(){
    $this->children=null;
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
  function cloneChildrenFromQuery($result){
    for ($i=0; $i<$result->num_rows; $i++) {
      $row=$result->fetch_array(MYSQLI_ASSOC);
      //clean system vars _*
      foreach ($row as $key => $value) {
	if (preg_match('/^_+/', $key)) unset($row[$key]);
      }
      $this->children[$i] = new NodeMale();
      if (isset($row['sort_order'])) $this->children[$i]->sort_order=$row['sort_order'];
      unset($row['sort_order']);
      $this->children[$i]->properties->cloneFromArray($row);
      $this->children[$i]->parentNode=$this;
    }
  }
  function db_loadchildtablekeys() {
    $sql='show columns from ' . constant($this->properties->childtablename);
    if (($result = $this->getdblink()->query($sql))===false) return false;
    $this->childtablekeys=[];
    for ($i=0; $i<$result->num_rows; $i++) {
      $row=$result->fetch_array(MYSQLI_ASSOC);
      if (preg_match('/^_+/', $row['Field'])) {
	continue;
      }
      $index=array_push($this->childtablekeys, new stdClass()) -1;
      $this->childtablekeys[$index]->Field=$row['Field'];
      $this->childtablekeys[$index]->Type=$row['Type'];
    }
    return true;
  }

  function db_loadmychildren($filter=null, $order=null, $limit=null) {
    $parentTableOriginalName=strtolower(substr($this->properties->parenttablename, 6));
    $sql = 'SELECT t.*';
    if ($this->properties->sort_order) $sql .= ', t._' . $parentTableOriginalName . '_position as sort_order';
    $sql .= ' FROM '
    . constant($this->properties->childtablename) . ' t'
    . ' WHERE t._' . $parentTableOriginalName . '=' . $this->partnerNode->properties->id;
    if ($filter) {
      $sql .= ' AND ' . $filter;
    }
    if ($order) $sql .= ' ORDER BY ' . $order;
    else if ($this->properties->sort_order) {
      $sql .= ' ORDER BY t._' . $parentTableOriginalName . '_position';
    }
    if ($limit) $sql .= ' LIMIT ' . $limit;

    if (($result = $this->getdblink()->query($sql))===false) return false;
    $this->cloneChildrenFromQuery($result);
  }
  
  function db_loadmypartner($child) {
    if (!isset($this->properties->id)) return false; //Virtual mother case
    $parentTableOriginalName=strtolower(substr($this->properties->parenttablename, 6));
    $sql = 'SELECT t.* FROM '
    . constant($this->properties->parenttablename) . ' t'
    . ' inner join ' . constant($this->properties->childtablename). ' c'
    . ' on t.id=c._' . $parentTableOriginalName
    . ' WHERE c.id=' . $child->properties->id;
    if (($result = $this->getdblink()->query($sql))===false) return false;
    if ($result->num_rows > 1) {
      $this->partnerNode=[];
      for ($i=0; $i<$result->num_rows; $i++) {
	$row=$result->fetch_array(MYSQLI_ASSOC);
	foreach ($row as $key => $value) {
	  if (preg_match('/^_+/', $key)) unset($row[$key]);
	}
	$this->partnerNode[$i] = new NodeMale();
	$this->partnerNode[$i]->properties->cloneFromArray($row);
	$this->partnerNode[$i]->relationships[0]=$this;
      }
    }
    else if ($result->num_rows==1) {
      $row=$result->fetch_array(MYSQLI_ASSOC);
      foreach ($row as $key => $value) {
	if (preg_match('/^_+/', $key)) unset($row[$key]);
      }
      $this->partnerNode = new NodeMale();
      $this->partnerNode->properties->cloneFromArray($row);
      $this->partnerNode->relationships[0]=$this;
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
  
  function db_loadmytreeup($level=null) {
    if ($level===0) return true;
    if ($level) $level--;
    if ($this->db_loadmypartner($this->children[0])===false) return false;
    if (gettype($this->partnerNode)=='array') {
      for ($i=0; $i<count($this->partnerNode); $i++)  {
	if ($this->partnerNode[$i]->db_loadmytreeup($level)===false) return false;
      }
    }
    else if ($this->partnerNode && $this->partnerNode->db_loadmytreeup($level)===false) return false;
  }

  function db_loadroot() {
    $sql = 'SELECT r.* FROM '
    . TABLE_RELATIONSHIPS . ' r'
    . ' WHERE' . ' r.parenttablename=\'' . $this->properties->parenttablename . '\''
    . ' AND ' . ' r.childtablename=\'' . $this->properties->childtablename . '\'';
    if (($result = $this->getdblink()->query($sql))===false) return false;
    $row=$result->fetch_array(MYSQLI_ASSOC);
    $this->properties->cloneFromArray($row);
    $this->db_loadchildtablekeys();
    $parentTableOriginalName=strtolower(substr($this->properties->parenttablename, 6));
    $sql = 'SELECT t.* FROM '
      . constant($this->properties->childtablename) . ' t'
      . ' WHERE t._' . $parentTableOriginalName . ' IS NULL';
    if (($result = $this->getdblink()->query($sql))===false || $result->num_rows==0) return false;
    $this->cloneChildrenFromQuery($result);
  }
  
  function db_loadunlinked() {
    $parentTableOriginalName=strtolower(substr($this->properties->parenttablename, 6));
    $sql = "SELECT t.* FROM "
    . constant($this->properties->childtablename) . ' t'
    . ' WHERE t._' . $parentTableOriginalName . ' IS NULL';
    if (($result = $this->getdblink()->query($sql))===false) return false;
    $this->cloneChildrenFromQuery($result);
  }
  function db_loadlinked() {
    $parentTableOriginalName=strtolower(substr($this->properties->parenttablename, 6));
    $sql = "SELECT t.* FROM "
    . constant($this->properties->childtablename) . ' t'
    . ' WHERE t._' . $parentTableOriginalName . ' IS NOT NULL';
    if (($result = $this->getdblink()->query($sql))===false) return false;
    $this->cloneChildrenFromQuery($result);
  }
  function db_loadmychildrennot() {
    $parentTableOriginalName=strtolower(substr($this->properties->parenttablename, 6));
    $sql = "SELECT t.* FROM "
    . constant($this->properties->childtablename) . ' t'
    . ' WHERE t._' . $parentTableOriginalName . ' != ' . $this->partnerNode->properties->id;
    if (($result = $this->getdblink()->query($sql))===false) return false;
    $this->cloneChildrenFromQuery($result);
  }
  function db_loadall($filter=null, $order=null, $limit=null) {
    $sql = 'SELECT t.* FROM '
    . constant($this->properties->childtablename) . ' t'
    .  ' WHERE 1';
    if ($filter) {
      $sql .= ' AND ' . $filter;
    }
    if ($order) $sql .= ' ORDER BY ' . $order;
    if ($limit) $sql .= ' LIMIT ' . $limit;
    
    if (($result = $this->getdblink()->query($sql))===false) return false;
    $this->cloneChildrenFromQuery($result);
  }
  function db_loadthisrel()  {
    $this->db_loadchildtablekeys();
    $sql = "SELECT r.* FROM "
      . TABLE_RELATIONSHIPS . " r"
      . " WHERE" . " r.parenttablename='" . $this->properties->parenttablename . "'"
      . " AND " . " r.childtablename='" . $this->properties->childtablename . "'";
    if (($result = $this->getdblink()->query($sql))===false) return false;
    else if ($result->num_rows==1) {
      $row=$result->fetch_array(MYSQLI_ASSOC);
      $this->properties->cloneFromArray($row);
    }
  }
  function db_loadtables() {
    $sql = "SHOW TABLES";
    if (($result = $this->getdblink()->query($sql))===false) return false;
    $this->cloneChildrenFromQuery($result);
  }
  function db_deletemytree_proto(){
    for ($i=0; $i<count($this->children); $i++) {
      $this->children[$i]->db_deletemytree_proto();
    }
  }
  function avoidrecursion(){
    if ($this->partnerNode) {
      if (gettype($this->partnerNode)=='array') {
	foreach ($this->partnerNode as $i => $value) {
	  $this->partnerNode[$i]->avoidrecursionup();
	}
      }
    }
    for ($i=0; $i<count($this->children); $i++)  {
      $this->children[$i]->avoidrecursiondown();
    }
  }
  function avoidrecursiondown(){
    $this->partnerNode=null;
    for ($i=0; $i<count($this->children); $i++)  {
      $this->children[$i]->avoidrecursiondown();
    }
  }
  function avoidrecursionup(){
    $this->children=[];
    if ($this->partnerNode) {
      if (gettype($this->partnerNode)=='array') {
	foreach ($this->partnerNode as $i => $value) {
	  $this->partnerNode[$i]->avoidrecursionup();
	}
      }
      else $this->partnerNode->avoidrecursionup();
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
    if (gettype($source->parentNode)=='array') {
      $this->parentNode=[];
      foreach($source->parentNode as $sourceparentNode) {
	$parentNode=new NodeFemale();
	$parentNode->loadasc($sourceparentNode);
	$this->parentNode[]=$parentNode;
      }
    }
    else {
      $this->parentNode=new NodeFemale();
      $this->parentNode->loadasc($source->parentNode);
    }
    return true;
  }
  function cutUp(){
    $this->parentNode=null;
  }
  function cutDown(){
    $this->relationships=null;
  }
  function getRelationship($obj) {
    if (gettype($obj)=='string') {
      $obj=['name' => $obj];
    }
    $keyname=array_keys($obj)[0];
    $i=count($this->relationships);
    while($i--) {
      if (isset($this->relationships[$i]->properties->$keyname) && $this->relationships[$i]->properties->$keyname==$obj[$keyname])
        return $this->relationships[$i];
    }
    return false;
  }
  //It load relationships of a determined node from its parentNode->properties->childtablename
  function db_loadmyrelationships() {
    $sql = 'SELECT r.* FROM '
      . TABLE_RELATIONSHIPS . ' r'
      . ' WHERE' . ' r.parenttablename=\'' . $this->parentNode->properties->childtablename . '\'';
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
  
  //It load relationships of a determined node from its parentNode->properties->childtablename
  function db_loadmyparent() {
    if ($this->parentNode) {
      $mytablename=$this->parentNode->properties->childtablename;
    }
    else if (count($this->relationships) > 0) $mytablename=$this->relationships[0]->properties->parenttablename;
    else return false;

    $sql = 'SELECT t.* FROM '
    . constant($mytablename) . ' t'
    . ' WHERE t.id=' . $this->properties->id;
    if (($result = $this->getdblink()->query($sql))===false) return false;
    $row=$result->fetch_array(MYSQLI_ASSOC);
    $candidates=[];
    foreach ($row as $key => $value) {
      if (preg_match('/^_+/', $key) && $row[$key]!=null && !preg_match('/_position$/', $key))
	$candidates[]='\'' . 'TABLE_' . strtoupper(str_replace('_', '', $key)) . '\'';
    }
    if (count($candidates)==0) return false;
    $sql = 'SELECT r.* FROM '
    . TABLE_RELATIONSHIPS . ' r'
    . ' WHERE' . ' r.childtablename=\'' . $mytablename . '\''
    . ' AND r.parenttablename IN (' . implode(', ',$candidates) . ')';
    if (($result = $this->getdblink()->query($sql))===false) return false;
    if ($result->num_rows > 1) {
      $this->parentNode=[];
      for ($i=0; $i<$result->num_rows; $i++) {
	$row=$result->fetch_array(MYSQLI_ASSOC);
	$this->parentNode[$i] = new NodeFemale();
	$this->parentNode[$i]->properties->cloneFromArray($row);
	$this->parentNode[$i]->db_loadchildtablekeys();
	$this->parentNode[$i]->children[0]=$this;
      }
    }
    else if ($result->num_rows==1) {
      $row=$result->fetch_array(MYSQLI_ASSOC);
      $this->parentNode = new NodeFemale();
      $this->parentNode->properties->cloneFromArray($row);
      $this->parentNode->db_loadchildtablekeys();
      $this->parentNode->children[0]=$this;
    }
  }
  
  function db_loadmytree($level=null) {
    if ($level===0) return true;
    if ($level) $level--;
    if ($this->db_loadmyrelationships()===false) return false;
    for ($i=0; $i<count($this->relationships); $i++)  {
      if ($this->relationships[$i]->db_loadmytree($level)===false) return false;
    }
  }
  
  function db_loadmytreeup($level=null) {
    if ($level===0) return true;
    if ($level) $level--;
    if ($this->db_loadmyparent()===false) return false;
    if (gettype($this->parentNode)=='array') {
      for ($i=0; $i<count($this->parentNode); $i++)  {
	if ($this->parentNode[$i]->db_loadmytreeup($level)===false) return false;
      }
    }
    else if ($this->parentNode && $this->parentNode->db_loadmytreeup($level)===false) return false;
  }
  
  function db_loadmyself(){
    $parentTableOriginalName=strtolower(substr($this->parentNode->properties->parenttablename, 6));
    $sql = 'SELECT t.*';
    if ($this->parentNode->properties->sort_order) $sql .= ', ' . '_' . $parentTableOriginalName . '_position' . 'AS sort_order';
    $sql .= ' FROM ' . constant($this->parentNode->properties->childtablename) . ' t';
    $sql .=' WHERE ' . 't.id =' . $this->properties->id;
    if (($result = $this->getdblink()->query($sql))===false) return false;
    $row=$result->fetch_array(MYSQLI_ASSOC);
    if (isset($row['sort_order'])) {
      $this->sort_order=$row['sort_order'];
      unset($row['sort_order']);
    }
    foreach ($row as $key => $value) {
      if (preg_match('/^_+/', $key)) unset($row[$key]);
    }
    $this->properties->cloneFromArray($row);
    return true;
  }

  function db_insertmyself() {
    $myproperties=get_object_vars($this->properties);
    foreach ($myproperties as $key => $value) {
      $myproperties[$key]='"' . $value . '"';
    }
    $sql = 'INSERT INTO '
      . constant($this->parentNode->properties->childtablename)
      . ' ('
        . implode(', ', array_keys($myproperties))
      . ' ) VALUES ('
      . implode(', ', array_values($myproperties))
      . ' )';
    if (($result = $this->getdblink()->query($sql))===false) return false;
    $this->properties->id = $this->getdblink()->insert_id;
    if (isset($this->parentNode->partnerNode->properties->id)) {
      if ($this->db_insertmylink()===false) return false;
    }
    return true;
  }
  
  function db_insertmylink() {
    if ($this->db_setmylink()===false) return false;
    $parentTableOriginalName=strtolower(substr($this->parentNode->properties->parenttablename, 6));
    //We try to update sort_order at the rest of elements
    if (!isset($this->sort_order)) return;
    $sql = 'UPDATE ' . constant($this->parentNode->properties->childtablename) . ' t'
    . ' SET t.' . '_' . $parentTableOriginalName . '_position' . '=t.' . '_' . $parentTableOriginalName . '_position + 1'
    . ' WHERE'
    . ' t.' . '_' . $parentTableOriginalName . '=' . $this->parentNode->partnerNode->properties->id
    . ' AND t.id !=' . $this->properties->id
    . ' AND t.' . '_' . $parentTableOriginalName . '_position' . ' >= ' . $this->sort_order;
    if (($result = $this->getdblink()->query($sql))===false) return false;
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
    $parentTableOriginalName=strtolower(substr($this->parentNode->properties->parenttablename, 6));
    $sql = 'UPDATE ' . constant($this->parentNode->properties->childtablename) . ' t'
    . ' SET ' . '_' . $parentTableOriginalName . '=' . $this->parentNode->partnerNode->properties->id;
    if ($this->parentNode->properties->sort_order) {
      if (!isset($this->sort_order)) $this->sort_order=1; //first element by default
      $sql .= ', ' . '_' . $parentTableOriginalName . '_position' . '=' . $this->sort_order;
    }
    $sql .=' WHERE ' . 't.id =' . $this->properties->id;
    if (($result = $this->getdblink()->query($sql))===false) return false;
  }
  
  //Deletes a node. Must be a end node so nodes bellow could appear as linked to the deleted one.
  function db_deletemyself() {
    if (!isset($this->properties->id) || $this->properties->id==null) return false;
    if (isset($this->parentNode->properties->childtablelocked) && $this->parentNode->properties->childtablelocked==1) return false;
    $sql='DELETE FROM '
    . constant($this->parentNode->properties->childtablename)
    . ' WHERE id=' . $this->properties->id . ' LIMIT 1';
    if (($result = $this->getdblink()->query($sql))===false) return false;
    if (isset($this->parentNode->properties->id) && isset($this->parentNode->partnerNode->properties->id)) {
      $this->db_deletemylink();
    }
    return true;
  }

  function db_deletemylink() {
    //Now we got to remove the relation from the database and update the sort_order of the borothers
    if ($this->db_releasemylink()===false) return false; //if there is any problem we abort
    //We try to update sort_order at bro for that we need the object to be updated
    if (!isset($this->sort_order)) return;
    $parentTableOriginalName=strtolower(substr($this->parentNode->properties->parenttablename, 6));
    $sql = 'UPDATE ' . constant($this->parentNode->properties->childtablename) . ' t'
    . ' SET t.' . '_' . $parentTableOriginalName . '_position' . '=t.' . '_' . $parentTableOriginalName . '_position - 1'
    . ' WHERE'
    . ' t.' . '_' . $parentTableOriginalName . '=' . $this->parentNode->partnerNode->properties->id
    . ' AND t.' . '_' . $parentTableOriginalName . '_position' . ' > ' . $this->sort_order;
    if (($result = $this->getdblink()->query($sql))===false) return false;
  }
  
  function db_deletemytree_proto(){
    $this->db_deletemyself();
    for ($i=0; $i<count($this->relationships); $i++) {
      $this->relationships[$i]->db_deletemytree_proto();
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
    $parentTableOriginalName=strtolower(substr($this->parentNode->properties->parenttablename, 6));
    $sql='UPDATE ' . constant($this->parentNode->properties->childtablename) . ' t'
    . ' SET ' . '_' . $parentTableOriginalName . '=NULL'
    . ' WHERE t.id=' . $this->properties->id;
    if (($result = $this->getdblink()->query($sql))===false) return false;
  }
  
  function db_updatemyproperties(){
      //We update the fields
      //First we search for the updatable fields
      $myproperties=get_object_vars($this->properties);
      $setSentences=array();
      foreach ($myproperties as $key =>$value) {
        array_push($setSentences, $key . '=' . '"' . mysql_escape_string($value) . '"');
      }
      $sql = 'UPDATE '.
        constant($this->parentNode->properties->childtablename)  .
        ' SET ';
      $sql .= implode(', ', $setSentences);
      $sql .=' WHERE id=' . $this->properties->id;
      if (($result = $this->getdblink()->query($sql))===false) return false;
  }
  
  function db_updatemysort_order($new_sort_order){
    $parentTableOriginalName=strtolower(substr($this->parentNode->properties->parenttablename, 6));
    $sql = 'UPDATE ' . constant($this->parentNode->properties->childtablename) . ' t'
    . ' SET t.' . '_' . $parentTableOriginalName . '_position' . '=' . $new_sort_order
    . ' WHERE ' . 't.id =' . $this->properties->id;
    if (($result = $this->getdblink()->query($sql))===false) return false;

    $sql = 'UPDATE ' . constant($this->parentNode->properties->childtablename) . ' t'
    . ' SET t.' . '_' . $parentTableOriginalName . '_position' . '=' . $this->sort_order
    . ' WHERE'
    . ' t.id !=' . $this->properties->id
    . ' AND t.' . '_' . $parentTableOriginalName . '=' . $this->parentNode->partnerNode->properties->id
    . ' AND t.' . '_' . $parentTableOriginalName . '_position' . '=' . $new_sort_order;
    if (($result = $this->getdblink()->query($sql))===false) return false;
  }

  function db_replacemyself($newchildid=null) {
    if (!$newchildid) return false;
    
    //We replace child_id with new child_id
    $parentTableOriginalName=strtolower(substr($this->parentNode->properties->parenttablename, 6));
    $sql = 'UPDATE ' . constant($this->parentNode->properties->childtablename) . ' t'
    . ' SET t.' . '_' . $parentTableOriginalName . '=' . 'NULL'
    . ' WHERE ' . 't.id =' . $this->properties->id;
    if (($result = $this->getdblink()->query($sql))===false) return false;
    $sql = 'UPDATE ' . constant($this->parentNode->properties->childtablename) . ' t'
    . ' SET t.' . '_' . $parentTableOriginalName . '=' . $this->parentNode->partnerNode->properties->id
    . ' WHERE ' . 't.id =' . $newchildid;
    if (($result = $this->getdblink()->query($sql))===false) return false;
    //update sort_order
    if (!isset($this->sort_order)) return;
    $sql = 'UPDATE ' . constant($this->parentNode->properties->childtablename) . ' t'
    . ' SET t.' . '_' . $parentTableOriginalName . '_position' . '=' . $this->sort_order
    . ' WHERE ' . 't.id =' . $newchildid;
    if (($result = $this->getdblink()->query($sql))===false) return false;
  }
  function avoidrecursion() {
    if ($this->parentNode) {
      if (gettype($this->parentNode)=='array') {
	foreach ($this->parentNode as $i => $value) {
	  $this->parentNode[$i]->avoidrecursionup();
	}
      }
      else $this->parentNode->avoidrecursionup();
    }
    for ($i=0; $i<count($this->relationships); $i++)  {
      $this->relationships[$i]->avoidrecursiondown();
    }
  }
  function avoidrecursionup(){
    $this->relationships=[];
    if ($this->parentNode) {
      if (gettype($this->parentNode)=='array') {
	foreach ($this->parentNode as $i => $value) {
	  $this->parentNode[$i]->avoidrecursionup();
	}
      }
      else $this->parentNode->avoidrecursionup();
    }
  }
  function avoidrecursiondown(){
    $this->parentNode=null;
    for ($i=0; $i<count($this->relationships); $i++)  {
      $this->relationships[$i]->avoidrecursiondown();
    }
  }
}

?>