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
    if (!$tablename) $tablename=$this->parentNode->properties->childtablename;
    if (!$proparray) {
      $proparray=$this->properties;
    }
    $searcharray=[];
    foreach($proparray as $key => $value) {
      array_push($searcharray, $key . '=\'' . $value . '\''); 
    }
    $sql = 'SELECT * FROM ' . constant($tablename)
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
  function session($sesname, $action="load") {
    switch ($action) {
      case "load":
	if (!isset($_SESSION[$sesname])) return false;
	$data=unserialize($_SESSION[$sesname]);
	$this->load($data);
	$this->loadasc($data);
	break;
      case "write":
	$_SESSION[$sesname]=serialize($this);
	break;
      case "check":
	if (isset($_SESSION[$sesname])) return true;
	return false;
	break;
    }
  }
}

class NodeFemale extends Node{
  public $partnerNode;
  public $children=[];
  public $childtablekeys=[];
  public $childtablekeystypes=[];
  public $syschildtablekeys=[];
  public $syschildtablekeysinfo=[];

  function load($source) {
    parent::load($source);
    if (isset($source->childtablekeys)) {
      foreach ($source->childtablekeys as $key => $value) {
        $this->childtablekeys[$key]=$value;
      }
    }
    if (isset($source->childtablekeystypes)) {
      foreach ($source->childtablekeystypes as $key => $value) {
        $this->childtablekeystypes[$key]=$value;
      }
    }
    if (isset($source->syschildtablekeys)) {
      foreach ($source->syschildtablekeys as $key => $value) {
        $this->syschildtablekeys[$key]=$value;
      }
    }
    if (isset($source->syschildtablekeysinfo)) {
      foreach ($source->syschildtablekeysinfo as $key => $value) {
        $this->syschildtablekeysinfo[$key]=$value;
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
        $this->childtablekeys[$key]=$value;
      }
    }
    if (isset($source->childtablekeystypes)) {
      foreach ($source->childtablekeystypes as $key => $value) {
        $this->childtablekeystypes[$key]=$value;
      }
    }
    if (isset($source->syschildtablekeys)) {
      foreach ($source->syschildtablekeys as $key => $value) {
        $this->syschildtablekeys[$key]=$value;
      }
    }
    if (isset($source->syschildtablekeysinfo)) {
      foreach ($source->syschildtablekeysinfo as $key => $value) {
        $this->syschildtablekeysinfo[$key]=$value;
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
      //clean system vars
      foreach ($row as $key => $value) {
	if (in_array($key, $this->syschildtablekeys)) unset($row[$key]);
      }
      $this->children[$i] = new NodeMale();
      if (isset($row['sort_order'])) $this->children[$i]->sort_order=$row['sort_order'];
      unset($row['sort_order']);
      $this->children[$i]->properties->cloneFromArray($row);
      $this->children[$i]->parentNode=$this;
    }
  }
  function db_loadchildtablekeys() {
    $this->childtablekeys=[];
    $this->childtablekeystypes=[];
    $this->syschildtablekeys=[];
    $this->syschildtablekeysinfo=[];
    //lets load systablekeys (referenced columns)
    $sql = 'SELECT r.REFERENCED_TABLE_NAME as parenttablename, r.COLUMN_NAME as name FROM '
    . 'INFORMATION_SCHEMA.KEY_COLUMN_USAGE' . ' r'
    . " WHERE"
    . ' TABLE_SCHEMA= SCHEMA()'
    . " AND r.TABLE_NAME='" . constant($this->properties->childtablename) . "'"
    . " AND r.REFERENCED_TABLE_NAME IS NOT NULL";
    if (($result = $this->getdblink()->query($sql))===false) return false;
    for ($i=0; $i<$result->num_rows; $i++) {
      $row=$result->fetch_array(MYSQLI_ASSOC);
      $syskey=new Properties();
      $syskey->type='foreignkey';
      $syskey->cloneFromArray($row);
      // to constant table names
      $syskey->parenttablename='TABLE_' . strtoupper(preg_replace('/.*__(.+)$/', '$1', $syskey->parenttablename));
      $this->syschildtablekeysinfo[]=$syskey;
      $this->syschildtablekeys[]=$syskey->name;
    }
    $sql='show columns from ' . constant($this->properties->childtablename);
    if (($result = $this->getdblink()->query($sql))===false) return false;

    for ($i=0; $i<$result->num_rows; $i++) {
      $row=$result->fetch_array(MYSQLI_ASSOC);
      if (preg_match('/.+_position$/', $row['Field'])) {
	$syskey=new Properties();
	$syskey->name=$row['Field'];
	$syskey->type='sort_order';
	$refkey=preg_replace('/(.+)_position$/', '$1', $row['Field']);
	foreach($this->syschildtablekeysinfo as $keyinfo) {
	  if ($keyinfo->name==$refkey) {
	    $syskey->parenttablename=$keyinfo->parenttablename;
	    break;
	  }
	}
	$this->syschildtablekeysinfo[]=$syskey;
	$this->syschildtablekeys[]=$row['Field'];
	continue;
      }
      if (in_array($row['Field'], $this->syschildtablekeys)) continue;
      $this->childtablekeys[]=$row['Field'];
      $this->childtablekeystypes[]=$row['Type'];
    }
    return true;
  }

  function db_loadmychildren($filter=null, $order=null, $limit=null) {
    foreach ($this->syschildtablekeysinfo as $syskey) {
      if ($syskey->parenttablename==$this->properties->parenttablename) {
	if ($syskey->type=='foreignkey') $foreigncolumnname=$syskey->name;
	if ($syskey->type=='sort_order') $positioncolumnname=$syskey->name;
      }
    }
    $filterValid=[];
    if ($filter && is_array($filter)) {
      $filterKeys=array_keys($filter);
      foreach ($filterKeys as $filterKey) {
	if (isset($this->childtablekeys) && in_array($filterKey, $this->childtablekeys) ||
	  isset($this->syschildtablekeys) && in_array($filterKey, $this->syschildtablekeys) ) {
	  $filterValid[]=$filterKey . '=' . '\'' . $filter[$filterKey] . '\'';
	}
      }
      $filter=implode(' AND ', $filterValid);
    }
    $sql = 'SELECT t.*';
    if (isset($this->properties->sort_order) && $this->properties->sort_order) $sql .= ', t.' . $positioncolumnname . ' as sort_order';
    $sql .= ' FROM '
    . constant($this->properties->childtablename) . ' t'
    . ' WHERE t.' . $foreigncolumnname . '=' . $this->partnerNode->properties->id;
    if ($filter) {
      $sql .= ' AND ' . $filter;
    }
    if ($order) $sql .= ' ORDER BY ' . $order;
    else if (isset($this->properties->sort_order) && $this->properties->sort_order) {
      $sql .= ' ORDER BY t.' . $positioncolumnname;
    }
    if ($limit) $sql .= ' LIMIT ' . $limit;

    if (($result = $this->getdblink()->query($sql))===false) return false;
    $this->cloneChildrenFromQuery($result);
  }
  
  function db_loadmypartner($child) {
    if (!isset($this->syschildtablekeysinfo)) $this->db_loadchildtablekeys();
    foreach ($this->syschildtablekeysinfo as $syskey) {
      if ($syskey->parenttablename==$this->properties->parenttablename) {
	if ($syskey->type=='foreignkey') $foreigncolumnname=$syskey->name;
	if ($syskey->type=='sort_order') $positioncolumnname=$syskey->name;
      }
    }
    $sql = 'SELECT t.* FROM '
    . constant($this->properties->parenttablename) . ' t'
    . ' inner join ' . constant($this->properties->childtablename) . ' c'
    . ' on t.id=c.' . $foreigncolumnname
    . ' WHERE c.id=' . $child->properties->id;
    if (($result = $this->getdblink()->query($sql))===false) return false;
    if ($result->num_rows > 1) {
      $this->partnerNode=[];
      for ($i=0; $i<$result->num_rows; $i++) {
	$row=$result->fetch_array(MYSQLI_ASSOC);
	foreach ($row as $key => $value) {
	  if (in_array($key, $this->syschildtablekeys)) unset($row[$key]);
	}
	$this->partnerNode[$i] = new NodeMale();
	$this->partnerNode[$i]->properties->cloneFromArray($row);
	$this->partnerNode[$i]->relationships[0]=$this;
      }
    }
    else if ($result->num_rows==1) {
      $row=$result->fetch_array(MYSQLI_ASSOC);
      foreach ($row as $key => $value) {
	if (in_array($key, $this->syschildtablekeys)) unset($row[$key]);
      }
      $this->partnerNode = new NodeMale();
      $this->partnerNode->properties->cloneFromArray($row);
      $this->partnerNode->relationships[0]=$this;
    }
  }
  
  function db_loadmytree($level=null, $filter=null, $order=null, $limit=null) {
    if ($level===0) return true;
    if ($level) $level--;
    if ($this->db_loadmychildren($filter, $order, $limit)===false) return false;
    for ($i=0; $i<count($this->children); $i++)  {
      if ($this->children[$i]->db_loadmytree($level, $filter, $order, $limit)===false) return false;
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
  function db_insertmytree($level=null, $extra=null) {
    if ($level===0) return true;
    if ($level) $level--;
    for ($j=0; $j<count($this->children); $j++) {
      if ($this->children[$j]->db_insertmytree($level, $extra)===false) return false;
    }
  }
  function db_loadroot() {
    $this->db_loadchildtablekeys();
    foreach ($this->syschildtablekeysinfo as $syskey) {
      if ($syskey->parenttablename==$this->properties->parenttablename) {
	if ($syskey->type=='foreignkey') $foreigncolumnname=$syskey->name;
	if ($syskey->type=='sort_order') $positioncolumnname=$syskey->name;
      }
    }
    $sql = 'SELECT t.* FROM '
      . constant($this->properties->childtablename) . ' t'
      . ' WHERE t.' . $foreigncolumnname . ' IS NULL';
    if (($result = $this->getdblink()->query($sql))===false || $result->num_rows==0) return false;
    $this->cloneChildrenFromQuery($result);
  }
  
  function db_loadunlinked() {
    foreach ($this->syschildtablekeysinfo as $syskey) {
      if ($syskey->parenttablename==$this->properties->parenttablename) {
	if ($syskey->type=='foreignkey') $foreigncolumnname=$syskey->name;
	if ($syskey->type=='sort_order') $positioncolumnname=$syskey->name;
      }
    }
    $sql = "SELECT t.* FROM "
    . constant($this->properties->childtablename) . ' t'
    . ' WHERE t.' . $foreigncolumnname . ' IS NULL';
    if (($result = $this->getdblink()->query($sql))===false) return false;
    $this->cloneChildrenFromQuery($result);
  }
  function db_loadlinked() {
    foreach ($this->syschildtablekeysinfo as $syskey) {
      if ($syskey->parenttablename==$this->properties->parenttablename) {
	if ($syskey->type=='foreignkey') $foreigncolumnname=$syskey->name;
	if ($syskey->type=='sort_order') $positioncolumnname=$syskey->name;
      }
    }
    $sql = "SELECT t.* FROM "
    . constant($this->properties->childtablename) . ' t'
    . ' WHERE t.' . $foreigncolumnname . ' IS NOT NULL';
    if (($result = $this->getdblink()->query($sql))===false) return false;
    $this->cloneChildrenFromQuery($result);
  }
  function db_loadmychildrennot() {
    foreach ($this->syschildtablekeysinfo as $syskey) {
      if ($syskey->parenttablename==$this->properties->parenttablename) {
	if ($syskey->type=='foreignkey') $foreigncolumnname=$syskey->name;
	if ($syskey->type=='sort_order') $positioncolumnname=$syskey->name;
      }
    }
    $sql = "SELECT t.* FROM "
    . constant($this->properties->childtablename) . ' t'
    . ' WHERE t.' . $foreigncolumnname . ' != ' . $this->partnerNode->properties->id;
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
    $sql = 'SELECT r.TABLE_NAME as childtablename, r.REFERENCED_TABLE_NAME as parenttablename, r.TABLE_NAME as name FROM '
      . 'INFORMATION_SCHEMA.KEY_COLUMN_USAGE' . ' r'
      . " WHERE"
      . ' TABLE_SCHEMA= SCHEMA()'
      . " AND r.REFERENCED_TABLE_NAME='" . constant($this->properties->parenttablename) . "'"
      . " AND r.TABLE_NAME='" . constant($this->properties->childtablename) . "'";
    if (($result = $this->getdblink()->query($sql))===false) return false;
    else if ($result->num_rows==1) {
      $row=$result->fetch_array(MYSQLI_ASSOC);
      $this->properties->cloneFromArray($row);
      $this->properties->name=preg_replace('/.*__(.+)$/', '$1', $this->properties->name);
      $this->properties->childtablename='TABLE_' . strtoupper(preg_replace('/.*__(.+)$/', '$1', $this->properties->childtablename));
      $this->properties->parenttablename='TABLE_' . strtoupper(preg_replace('/.*__(.+)$/', '$1', $this->properties->parenttablename));
      //stablish the sort_order statment
      foreach ($this->syschildtablekeysinfo as $syskey) {
	$this->properties->sort_order=false;
	if ($syskey->type=='sort_order' &&  $syskey->parenttablename==$this->properties->parenttablename) {
	  $this->properties->sort_order=true;
	  break;
	}
      }
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
    $sql = 'SELECT r.TABLE_NAME as childtablename, r.REFERENCED_TABLE_NAME as parenttablename, r.TABLE_NAME as name FROM '
      . 'INFORMATION_SCHEMA.KEY_COLUMN_USAGE' . ' r'
      . " WHERE"
      . ' TABLE_SCHEMA= SCHEMA()'  
      . ' AND r.REFERENCED_TABLE_NAME=\'' . constant($this->parentNode->properties->childtablename) . '\'';
    if (($result = $this->getdblink()->query($sql))===false) return false;
    for ($i=0; $i<$result->num_rows; $i++) {
      $row=$result->fetch_array(MYSQLI_ASSOC);
      $this->relationships[$i] = new NodeFemale();
      $this->relationships[$i]->properties->cloneFromArray($row);
      $this->relationships[$i]->properties->name=preg_replace('/.*__(.+)$/', '$1', $this->relationships[$i]->properties->name);
      $this->relationships[$i]->properties->childtablename='TABLE_' . strtoupper(preg_replace('/.*__(.+)$/', '$1', $this->relationships[$i]->properties->childtablename));
      $this->relationships[$i]->properties->parenttablename='TABLE_' . strtoupper(preg_replace('/.*__(.+)$/', '$1', $this->relationships[$i]->properties->parenttablename));
      $this->relationships[$i]->partnerNode=$this;
      $this->relationships[$i]->db_loadchildtablekeys();
      //stablish the sort_order statment
      foreach ($this->relationships[$i]->syschildtablekeysinfo as $syskey) {
	$this->relationships[$i]->properties->sort_order=false;
	if ($syskey->type=='sort_order' &&  $syskey->parenttablename==$this->relationships[$i]->properties->parenttablename) {
	  $this->relationships[$i]->properties->sort_order=true;
	  break;
	}
      }
    }
    //we must set the first relationship the selfrelationship one
    foreach($this->relationships as $key => $value) {
      if ($value->properties->childtablename==$value->properties->parenttablename && $key!=0) {
	$changedRel=$this->relationships[0];
	$this->relationships[0]=$this->relationships[$key];
	$this->relationships[$key]=$changedRel;
	break;
      }
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

    $sql = 'SELECT r.TABLE_NAME as childtablename, r.REFERENCED_TABLE_NAME as parenttablename, r.TABLE_NAME as name FROM '
      . 'INFORMATION_SCHEMA.KEY_COLUMN_USAGE' . ' r'
      . " WHERE"
      . ' TABLE_SCHEMA= SCHEMA()'
      . ' AND r.TABLE_NAME=\'' . constant($mytablename) . '\''
      . ' AND r.REFERENCED_TABLE_NAME IS NOT NULL';
    if (($result = $this->getdblink()->query($sql))===false) return false;
    if ($result->num_rows > 1) {
      $this->parentNode=[];
      for ($i=0; $i<$result->num_rows; $i++) {
	$row=$result->fetch_array(MYSQLI_ASSOC);
	$this->parentNode[$i] = new NodeFemale();
	$this->parentNode[$i]->properties->cloneFromArray($row);
	$this->parentNode[$i]->properties->name=preg_replace('/.*__(.+)$/', '$1', $this->parentNode[$i]->properties->name);
	$this->parentNode[$i]->properties->childtablename='TABLE_' . strtoupper(preg_replace('/.*__(.+)$/', '$1', $this->parentNode[$i]->properties->childtablename));
	$this->parentNode[$i]->properties->parenttablename='TABLE_' . strtoupper(preg_replace('/.*__(.+)$/', '$1', $this->parentNode[$i]->properties->parenttablename));
	$this->parentNode[$i]->db_loadchildtablekeys();
	//stablish the sort_order statment
	foreach ($this->parentNode[$i]->syschildtablekeysinfo as $syskey) {
	  $this->parentNode[$i]->properties->sort_order=false;
	  if ($syskey->type=='sort_order' && $syskey->parenttablename==$this->parentNode[$i]->properties->parenttablename) {
	    $this->parentNode[$i]->properties->sort_order=true;
	    break;
	  }
	}
	$this->parentNode[$i]->children[0]=$this;
      }
    }
    else if ($result->num_rows==1) {
      $row=$result->fetch_array(MYSQLI_ASSOC);
      $this->parentNode = new NodeFemale();
      $this->parentNode->properties->cloneFromArray($row);
      $this->parentNode->properties->name=preg_replace('/.*__(.+)$/', '$1', $this->parentNode->properties->name);
      $this->parentNode->properties->childtablename='TABLE_' . strtoupper(preg_replace('/.*__(.+)$/', '$1', $this->parentNode->properties->childtablename));
      $this->parentNode->properties->parenttablename='TABLE_' . strtoupper(preg_replace('/.*__(.+)$/', '$1', $this->parentNode->properties->parenttablename));
      $this->parentNode->db_loadchildtablekeys();
      //stablish the sort_order statment
      foreach ($this->parentNode->syschildtablekeysinfo as $syskey) {
	$this->parentNode->properties->sort_order=false;
	if ($syskey->type=='sort_order' && $syskey->parenttablename==$this->parentNode->properties->parenttablename) {
	  $this->parentNode->properties->sort_order=true;
	  break;
	}
      }
      $this->parentNode->children[0]=$this;
    }
  }
  
  function db_loadmytree($level=null, $filter=null, $order=null, $limit=null) {
    if ($level===0) return true;
    if ($level) $level--;
    if ($this->db_loadmyrelationships()===false) return false;
    for ($i=0; $i<count($this->relationships); $i++)  {
      if ($this->relationships[$i]->db_loadmytree($level, $filter, $order, $limit)===false) return false;
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
    if ($this->parentNode->properties->sort_order) {
      foreach ($this->parentNode->syschildtablekeysinfo as $syskey) {
	if ($syskey->parenttablename==$this->parentNode->properties->parenttablename && $syskey->type=='sort_order') $positioncolumnname=$syskey->name;
      }
    }
    $sql = 'SELECT t.*';
    if ($this->parentNode->properties->sort_order) $sql .= ', ' . $positioncolumnname . 'AS sort_order';
    $sql .= ' FROM ' . constant($this->parentNode->properties->childtablename) . ' t';
    $sql .=' WHERE ' . 't.id =' . $this->properties->id;
    if (($result = $this->getdblink()->query($sql))===false) return false;
    $row=$result->fetch_array(MYSQLI_ASSOC);
    if (isset($row['sort_order'])) {
      $this->sort_order=$row['sort_order'];
      unset($row['sort_order']);
    }
    foreach ($row as $key => $value) {
      if (in_array($key, $this->parentNode->syschildtablekeys)) unset($row[$key]);
    }
    $this->properties->cloneFromArray($row);
    return true;
  }

  function db_insertmyself($extra=null) {
    $myecho=null;
    $myproperties=get_object_vars($this->properties);
    if (isset($myproperties['id'])) unset($myproperties['id']);
    foreach ($myproperties as $key => $value) {
      $myproperties[$key]='\'' .  mysql_escape_string($value) . '\'';
    }
    if ($extra) {
      $filterValid=[];
      foreach ($extra as $key => $value) {
	if (isset($this->parentNode->childtablekeys) && in_array($key, $this->parentNode->childtablekeys) ||
	  isset($this->parentNode->syschildtablekeys) && in_array($key, $this->parentNode->syschildtablekeys) ) {
	  $myproperties[$key]='\'' .  mysql_escape_string($value) . '\'';
	}
      }
    }
    
    $sql = 'INSERT INTO '
      . constant($this->parentNode->properties->childtablename)
      . ' ('
        . implode(', ', array_keys($filterValid))
      . ' ) VALUES ('
      . implode(', ', array_values($filterValid))
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
    //We try to update sort_order at the rest of elements
    if (!isset($this->sort_order)) return;
    foreach ($this->parentNode->syschildtablekeysinfo as $syskey) {
      if ($syskey->parenttablename==$this->parentNode->properties->parenttablename) {
	if ($syskey->type=='foreignkey') $foreigncolumnname=$syskey->name;
	if ($syskey->type=='sort_order') $positioncolumnname=$syskey->name;
      }
    }
    $sql = 'UPDATE ' . constant($this->parentNode->properties->childtablename) . ' t'
    . ' SET t.' . $positioncolumnname . '=t.' . $positioncolumnname . ' + 1'
    . ' WHERE'
    . ' t.' . $foreigncolumnname . '=' . $this->parentNode->partnerNode->properties->id
    . ' AND t.id !=' . $this->properties->id
    . ' AND t.' . $positioncolumnname . ' >= ' . $this->sort_order;
    if (($result = $this->getdblink()->query($sql))===false) return false;
  }
  
  function db_insertmytree($level=null, $extra=null) {
    if ($level===0) return true;
    if ($level) $level--;
    
    if ($this->db_insertmyself($extra)===false) return false;
    for ($i=0; $i<count($this->relationships); $i++) {
      $this->relationships[$i]->db_insertmytree($level, $extra);
    }
  }
  
  function db_setmylink() {
    //we will insert the relationship
    foreach ($this->parentNode->syschildtablekeysinfo as $syskey) {
      if ($syskey->parenttablename==$this->parentNode->properties->parenttablename) {
	if ($syskey->type=='foreignkey') $foreigncolumnname=$syskey->name;
	if ($syskey->type=='sort_order') $positioncolumnname=$syskey->name;
      }
    }
    $sql = 'UPDATE ' . constant($this->parentNode->properties->childtablename) . ' t'
    . ' SET ' . $foreigncolumnname . '=' . $this->parentNode->partnerNode->properties->id;
    if ($this->parentNode->properties->sort_order) {
      if (!isset($this->sort_order)) $this->sort_order=1; //first element by default
      $sql .= ', ' . $positioncolumnname . '=' . $this->sort_order;
    }
    $sql .=' WHERE ' . 't.id =' . $this->properties->id;
    if (($result = $this->getdblink()->query($sql))===false) return false;
  }
  
  //Deletes a node. Must be a end node so nodes bellow could appear as linked to the deleted one.
  function db_deletemyself() {
    if (!isset($this->properties->id) || $this->properties->id==null) return false;
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
    foreach ($this->parentNode->syschildtablekeysinfo as $syskey) {
      if ($syskey->parenttablename==$this->parentNode->properties->parenttablename) {
	if ($syskey->type=='foreignkey') $foreigncolumnname=$syskey->name;
	if ($syskey->type=='sort_order') $positioncolumnname=$syskey->name;
      }
    }
    $sql = 'UPDATE ' . constant($this->parentNode->properties->childtablename) . ' t'
    . ' SET t.' . $positioncolumnname . '=t.' . $positioncolumnname . ' - 1'
    . ' WHERE'
    . ' t.' . $foreigncolumnname . '=' . $this->parentNode->partnerNode->properties->id
    . ' AND t.' . $positioncolumnname . ' > ' . $this->sort_order;
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
    foreach ($this->parentNode->syschildtablekeysinfo as $syskey) {
      if ($syskey->parenttablename==$this->parentNode->properties->parenttablename) {
	if ($syskey->type=='foreignkey') $foreigncolumnname=$syskey->name;
	if ($syskey->type=='sort_order') $positioncolumnname=$syskey->name;
      }
    }
    $sql='UPDATE ' . constant($this->parentNode->properties->childtablename) . ' t'
    . ' SET ' . $foreigncolumnname . '=NULL'
    . ' WHERE t.id=' . $this->properties->id;
    if (($result = $this->getdblink()->query($sql))===false) return false;
  }
  
  function db_updatemyproperties(){
      //We update the fields
      //First we search for the updatable fields
      $myproperties=get_object_vars($this->properties);
      if (isset($myproperties['id'])) unset($myproperties['id']);
      $setSentences=array();
      foreach ($myproperties as $key =>$value) {
        array_push($setSentences, $key . '=' . '\'' . mysql_escape_string($value) . '\'');
      }
      $sql = 'UPDATE '
      . constant($this->parentNode->properties->childtablename)  .
        ' SET ';
      $sql .= implode(', ', $setSentences);
      $sql .=' WHERE id=' . $this->properties->id;
      if (($result = $this->getdblink()->query($sql))===false) return false;
  }
  
  function db_updatemysort_order($new_sort_order){
    foreach ($this->parentNode->syschildtablekeysinfo as $syskey) {
      if ($syskey->parenttablename==$this->parentNode->properties->parenttablename) {
	if ($syskey->type=='foreignkey') $foreigncolumnname=$syskey->name;
	if ($syskey->type=='sort_order') $positioncolumnname=$syskey->name;
      }
    }
    $sql = 'UPDATE ' . constant($this->parentNode->properties->childtablename) . ' t'
    . ' SET t.' . $positioncolumnname . '=' . $new_sort_order
    . ' WHERE ' . 't.id =' . $this->properties->id;
    if (($result = $this->getdblink()->query($sql))===false) return false;

    $sql = 'UPDATE ' . constant($this->parentNode->properties->childtablename) . ' t'
    . ' SET t.' . $positioncolumnname . '=' . $this->sort_order
    . ' WHERE'
    . ' t.id !=' . $this->properties->id
    . ' AND t.' . $foreigncolumnname . '=' . $this->parentNode->partnerNode->properties->id
    . ' AND t.' . $positioncolumnname . '=' . $new_sort_order;
    if (($result = $this->getdblink()->query($sql))===false) return false;
  }

  function db_replacemyself($newchildid=null) {
    if (!$newchildid) return false;
    
    //We replace child_id with new child_id
    foreach ($this->parentNode->syschildtablekeysinfo as $syskey) {
      if ($syskey->parenttablename==$this->parentNode->properties->parenttablename) {
	if ($syskey->type=='foreignkey') $foreigncolumnname=$syskey->name;
	if ($syskey->type=='sort_order') $positioncolumnname=$syskey->name;
      }
    }
    $sql = 'UPDATE ' . constant($this->parentNode->properties->childtablename) . ' t'
    . ' SET t.' . $foreigncolumnname . '=' . 'NULL'
    . ' WHERE ' . 't.id =' . $this->properties->id;
    if (($result = $this->getdblink()->query($sql))===false) return false;
    $sql = 'UPDATE ' . constant($this->parentNode->properties->childtablename) . ' t'
    . ' SET t.' . $foreigncolumnname . '=' . $this->parentNode->partnerNode->properties->id
    . ' WHERE ' . 't.id =' . $newchildid;
    if (($result = $this->getdblink()->query($sql))===false) return false;
    //update sort_order
    if (!isset($this->sort_order)) return;
    $sql = 'UPDATE ' . constant($this->parentNode->properties->childtablename) . ' t'
    . ' SET t.' . $positioncolumnname . '=' . $this->sort_order
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