<?php
class Node {
  public $properties;
  //optional variable: $extra
  function __construct() {
    $this->properties=new stdClass();
  }
  function copyProperties($origin, $someKeys=null) {
    Node::copyCleanValues($origin->properties, $this->properties, $someKeys);
  }
  function copyPropertiesFromArray($origin, $someKeys=null) {
    Node::copyCleanValues($origin, $this->properties, $someKeys);
  }
  
  function getdblink(){
    global $dblink;
    if (!$dblink) {
      try {
        $dblink=new mysqli(DB_HOST, DB_USERNAME, DB_USERPWD, DB_DATABASENAME);
      }
      catch(Exception $e) {
        return false;
      }
    }
    //$dblink->set_charset("utf8mb4");
    return $dblink;
  }
  static function checkdblink($resultError=null){
  /* //For later recomend to study PDO
    try {
      $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" .DB_DATABASENAME, DB_USERNAME, DB_USERPWD);
      // set the PDO error mode to exception
      $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      echo "Connected successfully";
    } catch(PDOException $e) {
      echo "Connection failed: " . $e->getMessage();
    }
  */
    try {
      $dblink=new mysqli(DB_HOST, DB_USERNAME, DB_USERPWD, DB_DATABASENAME);
    }
    catch(Exception $e) {
      return false;
    }
    if ($dblink->connect_errno) {
      if ($resultError) $resultError->errorMessage= $dblink->connect_error;
      return false;
    }
    return true;
  }
  static function checkphpversion($resultError){
    $verCode=phpversion();
    if (version_compare($verCode,'5.6')<0) {
      $resultError->errorMessage="Required version: 5.6. Your version is: " . $verCode;
      return false;
    }
    else return true;
  }
  function load($source, $levelup=null, $leveldown=null, $thisProperties=null, $thisPropertiesUp=null, $thisPropertiesDown=null){
    if (gettype($source)=='string') $source=json_decode($source);
    if (gettype($thisProperties)=='string') $thisProperties=[$thisProperties];
    if (isset($source->properties)) $this->copyProperties($source, $thisProperties);

    if (isset($source->nodelist) && is_array($source->nodelist) && count($source->nodelist)>0) { //**** DEPRECATED
      $this->nodelist=[];
      for ($i=0; $i<count($source->$list); $i++) {
        $listNode=new Node();
        if (isset($source->nodelist[$i]->parentNode)) {
          $listNode=new NodeMale();
        }
        else if (isset($source->nodelist[$i]->partnerNode)) {
          $listNode=new NodeFemale();
        }
        $listNode->load($source->nodelist[$i]);
        $this->nodelist[$i]=$listNode;
      }
    }
    if (isset($source->extra)) $this->extra=$source->extra;
  }
  //This function is to quickly copy plain properties from one object to another
  //copyKeys can be an array with some properties names for copy just them
  static function copyCleanValues($sourceObj, $targetObj=null, $copyKeys=null){
    if ($targetObj===null) $targetObj=new stdClass;
    foreach ($sourceObj as $key => $value) {
      if (gettype($copyKeys)=='array' && !in_array($key, $copyKeys)) continue;
      if (gettype($value) == "string" && is_numeric($value)) $targetObj->{$key}=(float)$value;
      else $targetObj->{$key}=$value;
    }
    return $targetObj;
  }
}

class NodeFemale extends Node{
  public $partnerNode;
  public $children=[];
  public $childtablekeys=[];
  public $childtablekeysinfo=[];
  public $syschildtablekeys=[];
  public $syschildtablekeysinfo=[];

  function load($source, $levelup=null, $leveldown=null, $thisProperties=null, $thisPropertiesUp=null, $thisPropertiesDown=null) {
    parent::load($source);
    if (isset($source->childtablekeys)) {
      foreach ($source->childtablekeys as $key => $value) {
        $this->childtablekeys[$key]=$value;
      }
    }
    if (isset($source->childtablekeysinfo)) {
      foreach ($source->childtablekeysinfo as $key => $value) {
        $this->childtablekeysinfo[$key]=$value;
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
    if ($levelup !== 0 && !($levelup < 0)) { //level null and undefined like infinite
      $this->loadasc($source, $levelup, $thisPropertiesUp);
    }
    if ($leveldown !== 0 && !($leveldown < 0)) {
      $this->loaddesc($source, $leveldown, $thisPropertiesDown);
    }
  }
  
  function loaddesc($source, $level=null, $thisProperties=null) {
    if (gettype($source)=='string') $source=json_decode($source);
    if ($level===0) return false;
    if ($level) $level--;
    if (!isset($source->children) || !$source->children) return false;
    for ($i = 0; $i < count($source->children); $i++) {
      $this->children[$i]=new NodeMale();
      $this->children[$i]->parentNode=$this;
      $this->children[$i]->load($source->children[$i], 0, 0, $thisProperties);
      $this->children[$i]->loaddesc($source->children[$i], $level, $thisProperties);
    }
  }
    //It loads data from a json, if update is true only fields and relationship present at original will be updated
  function loadasc($source, $level=null, $thisProperties=null) {
    if (gettype($source)=='string') $source=json_decode($source);
    if (!isset($source->partnerNode) || !$source->partnerNode) return false;
    if ($level===0) return false;
    if ($level) $level--;
    if (gettype($source->partnerNode)=='array') {
      if (gettype($this->partnerNode)!="array") $this->partnerNode=[$this->partnerNode];
      for ($i=0; $i < count($source->partnerNode); $i++) {
	$this->partnerNode[$i]=new NodeMale();
	$this->partnerNode[$i]->load($source->partnerNode[$i], 0, 0, $thisProperties);
	$this->partnerNode[$i]->loadasc($source->partnerNode[$i], $level, $thisProperties);
      }
    }
    else {
      if (!$this->partnerNode) $this->partnerNode=new NodeMale();
      $this->partnerNode->load($source->partnerNode, 0, 0, $thisProperties);
      $this->partnerNode->loadasc($source->partnerNode, $level, $thisProperties);
    }
  }
  function cutUp(){
    $this->partnerNode=null;
  }
  function cutDown(){
    $this->children=[];
  }
  function getChild($obj) {
    $keyname=array_keys($obj)[0];
    $i=count($this->children);
    while($i--) {
      if (isset($this->children[$i]->properties->$keyname) && $this->children[$i]->properties->$keyname==$obj->$keyname)
        return $this->children[$i];
    }
    return false;
  }
  function addChild($child) {
    array_push($this->children,$child);
    $child->parentNode=$this;
    return $child;
  }
  function cloneChildrenFromQuery($result){
    for ($i=0; $i<$result->num_rows; $i++) {
      $row=$result->fetch_assoc();
      //clean system vars
      foreach ($row as $key => $value) {
	if (in_array($key, $this->syschildtablekeys)) unset($row[$key]);
      }
      $this->children[$i] = new NodeMale();
      if (isset($row['sort_order'])) $this->children[$i]->sort_order=$row['sort_order'];
      unset($row['sort_order']);
      $this->children[$i]->copyPropertiesFromArray($row);
      $this->children[$i]->parentNode=$this;
    }
  }
  function db_loadchildtablekeys() {
    $this->childtablekeys=[];
    $this->childtablekeysinfo=[];
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
      $row=$result->fetch_assoc();
      $syskey=new stdClass();
      $syskey->type='foreignkey';
      Node::copyCleanValues($row, $syskey);
      // to constant table names
      if (DB_REMOVE_PREFIX) $syskey->parenttablename = preg_replace('/.*__(.+)$/', '$1', $syskey->parenttablename);
      $syskey->parenttablename='TABLE_' . strtoupper($syskey->parenttablename);
      $this->syschildtablekeysinfo[]=$syskey;
      $this->syschildtablekeys[]=$syskey->name;
    }
    $sql='show columns from ' . constant($this->properties->childtablename);
    if (($result = $this->getdblink()->query($sql))===false) return false;

    for ($i=0; $i<$result->num_rows; $i++) {
      $row=$result->fetch_assoc();
      if (preg_match('/.+_position$/', $row['Field'])) {
	$syskey=new stdClass();
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
      $infokeys=new stdClass();
      Node::copyCleanValues($row, $infokeys);
      $this->childtablekeysinfo[]=$infokeys;
    }
    return true;
  }

  function db_loadmychildren($filter=null, $order=null, $limit=null) {
    $this->db_loadchildren($this, $filter, $order, $limit);
  }

  function db_loadchildren($thisParent, $filter=null, $order=null, $limit=null) {
    if (is_array($thisParent)) {
      $foreigncolumnnames=[];
      foreach ($thisParent as $myParent) {
        foreach ($myParent->syschildtablekeysinfo as $syskey) {
          if ($syskey->parenttablename==$myParent->properties->parenttablename) {
            if ($syskey->type=='foreignkey') array_push($foreigncolumnnames, $syskey->name);
          }
        }
      }
    }
    else {
      foreach ($thisParent->syschildtablekeysinfo as $syskey) {
        if ($syskey->parenttablename==$thisParent->properties->parenttablename) {
          if ($syskey->type=='foreignkey') $foreigncolumnname=$syskey->name;
          if ($syskey->type=='sort_order') $positioncolumnname=$syskey->name;
        }
      }
    }
    $filterValid=[];
    if ($filter && is_array($filter)) {
      $myfilter=implode(' AND ', $filter);
      $thisParent->extra=new stdclass();
      $thisParent->extra->filter=$myfilter;
      $filterKeys=array_keys($filter);
      foreach ($filterKeys as $filterKey) {
	if (isset($thisParent->childtablekeys) && in_array($filterKey, $thisParent->childtablekeys) ||
	  isset($thisParent->syschildtablekeys) && in_array($filterKey, $thisParent->syschildtablekeys) ) {
	  $filterValid[]=$filterKey . '=' . '\'' . $filter[$filterKey] . '\'';
	}
      }
      $filter=implode(' AND ', $filterValid);
    }
    if (is_array($thisParent)) {
      $sql = 'SELECT *' . ' FROM ';
      $sql .=  constant($thisParent[0]->properties->childtablename) . ' WHERE ';
      $foreigncolumnnamesfilter=[];
      for ($i=0; $i<count($foreigncolumnnames); $i++) {
        array_push($foreigncolumnnamesfilter, $foreigncolumnnames[$i] . '=' . $thisParent[$i]->partnerNode->properties->id);
      }
      $sql .=implode(' AND ', $foreigncolumnnamesfilter);
      if ($filter) {
        $sql .= ' AND ' . $filter;
      }
      if ($order) $sql .= ' ORDER BY ' . $order;
      if ($limit) $sql .= ' LIMIT ' . $limit;
    }
    else {
      $sql = 'SELECT t.*';
      if (isset($thisParent->properties->sort_order) && $thisParent->properties->sort_order) $sql .= ', t.' . $positioncolumnname . ' as sort_order';
      $sql .= ' FROM '
      . constant($thisParent->properties->childtablename) . ' t'
      . ' WHERE t.' . $foreigncolumnname . '=' . $thisParent->partnerNode->properties->id;
      if ($filter) {
        $sql .= ' AND ' . $filter;
      }
      if ($order) $sql .= ' ORDER BY ' . $order;
      else if (isset($thisParent->properties->sort_order) && $thisParent->properties->sort_order) {
        $sql .= ' ORDER BY t.' . $positioncolumnname;
      }
      if ($limit) $sql .= ' LIMIT ' . $limit;
    }

    if (($result = $this->getdblink()->query($sql))===false) return false;
    $this->cloneChildrenFromQuery($result);
  }
  
  function db_loadmypartner($child_id) {
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
    . ' WHERE c.id=?';
    
    $stmt = $this->getdblink()->prepare($sql);
    $stmt->bind_param('i', $child_id);
    $stmt->execute();
    if (($result = $stmt->get_result()) === false) return false;
    
    if ($result->num_rows > 1) {
      $this->partnerNode=[];
      for ($i=0; $i<$result->num_rows; $i++) {
	$row=$result->fetch_assoc();
	foreach ($row as $key => $value) {
	  if (in_array($key, $this->syschildtablekeys)) unset($row[$key]);
	}
	$this->partnerNode[$i] = new NodeMale();
	$this->partnerNode[$i]->copyPropertiesFromArray($row);
	$this->partnerNode[$i]->relationships[0]=$this;
      }
    }
    else if ($result->num_rows==1) {
      $row=$result->fetch_assoc();
      foreach ($row as $key => $value) {
	if (in_array($key, $this->syschildtablekeys)) unset($row[$key]);
      }
      $this->partnerNode = new NodeMale();
      $this->partnerNode->copyPropertiesFromArray($row);
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
    if ($this->db_loadmypartner($this->children[0]->properties->id)===false) return false;
    if (gettype($this->partnerNode)=='array') {
      for ($i=0; $i<count($this->partnerNode); $i++)  {
	if ($this->partnerNode[$i]->db_loadmytreeup($level)===false) return false;
      }
    }
    else if ($this->partnerNode && $this->partnerNode->db_loadmytreeup($level)===false) return false;
  }
  function db_insertmytree($level=null, $extra=null, $keepid=false, $justlangcontent=false) {
    if ($level===0) return true;
    if ($level) $level--;
    for ($j=0; $j<count($this->children); $j++) {
      if ($this->children[$j]->db_insertmytree($level, $extra, $keepid, $justlangcontent)===false) return false;
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
      . ' WHERE t.' . $foreigncolumnname . ' IS NULL'
      . ' LIMIT 1';
    if (($result = $this->getdblink()->query($sql))===false || $result->num_rows==0) return false;
    $this->cloneChildrenFromQuery($result);
    return true;
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
    return true;
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
    return true;
  }
  function db_loadtables($prefix=null) {
    if (!$prefix && defined('DB_PREFIX')) {
      $prefix=DB_PREFIX;
    }
    if ($prefix) {
      $colname="Tables_in_" . DB_DATABASENAME;
      $sql="SHOW TABLES" .
      " WHERE " . $colname .
      " LIKE " . "'" . $prefix . "\_\_%'";
    }
    else {
      $sql="SHOW TABLES";
    }
    if (($result = $this->getdblink()->query($sql))===false) return false;
    $this->cloneChildrenFromQuery($result);
    //table key label is something like Tables_in_dbname and we make it in a key like name
    foreach($this->children as $key => $value) {
      $myKey=array_keys((array)$value->properties)[0];
      $this->children[$key]->properties->name = $value->properties->$myKey;
      unset($this->children[$key]->properties->$myKey);
    }
    $result->free_result();
  }
  function db_initdb() {
    if ($this->db_loadtables()===false) return false;
    if (count($this->children)>0) {
      return false;
    }
    $sql = file_get_contents('includes/database.sql');
    if (!$sql) return false;
    /* execute multi query */
    if (($result = $this->getdblink()->multi_query($sql))===false) return false;
    $results=1;
    while ($this->getdblink()->next_result()) {
      $results++;
    }
    $this->properties->numresults=$results;
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
    return true;
  }
  function db_loadall($filter=null, $order=null, $limit=null) {
    $sql = 'SELECT t.* FROM '
    . constant($this->properties->childtablename) . ' t'
    .  ' WHERE 1';
    if ($filter && is_array($filter)) {
      $filterValid=[];
      $myfilter=implode(' AND ', $filter);
      $filterKeys=array_keys($filter);
      foreach ($filterKeys as $filterKey) {
	  $filterValid[]=$filterKey . '=' . '\'' . $filter[$filterKey] . '\'';
      }
      $filter=implode(' AND ', $filterValid);
    }
    if ($filter) {
      $sql .= ' AND ' . $filter;
    }
    if ($order) $sql .= ' ORDER BY ' . $order;
    if ($limit) $sql .= ' LIMIT ' . $limit;
    
    if (($result = $this->getdblink()->query($sql))===false) return false;
    $this->cloneChildrenFromQuery($result);
    return true;
  }
  function db_removeall($filter=null, $limit=null) {
    $sql = 'DELETE FROM '
    . constant($this->properties->childtablename)
    .  ' WHERE 1';
    if ($filter && is_array($filter)) {
      $filterValid=[];
      $myfilter=implode(' AND ', $filter);
      $filterKeys=array_keys($filter);
      foreach ($filterKeys as $filterKey) {
	  $filterValid[]=$filterKey . '=' . '\'' . $filter[$filterKey] . '\'';
      }
      $filter=implode(' AND ', $filterValid);
    }
    if ($filter) {
      $sql .= ' AND ' . $filter;
    }
    if ($limit) $sql .= ' LIMIT ' . $limit;
    
    if (($result = $this->getdblink()->query($sql))===false) return false;
    $this->cloneChildrenFromQuery($result);
    return true;
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
      $row=$result->fetch_assoc();
      $this->copyPropertiesFromArray($row);
      if (DB_REMOVE_PREFIX) $this->properties->name=preg_replace('/.*__(.+)$/', '$1', $this->properties->name);
      if (DB_REMOVE_PREFIX) $this->properties->childtablename=preg_replace('/.*__(.+)$/', '$1', $this->properties->childtablename);
      $this->properties->childtablename='TABLE_' . strtoupper($this->properties->childtablename);
      if (DB_REMOVE_PREFIX) $this->properties->parenttablename=preg_replace('/.*__(.+)$/', '$1', $this->properties->parenttablename);
      $this->properties->parenttablename='TABLE_' . strtoupper($this->properties->parenttablename);
      //stablish the sort_order statment
      foreach ($this->syschildtablekeysinfo as $syskey) {
	if ($syskey->type=='sort_order' &&  $syskey->parenttablename==$this->properties->parenttablename) {
	  $this->properties->sort_order=true;
	}
	if ($syskey->type=='foreignkey' &&  $syskey->parenttablename=='TABLE_LANGUAGES') {
	  $this->properties->language=true;
	}
      }
    }
  }
  function db_deletemytree(){
    $this->db_loadmytree();
    $this->db_deletemytree_proto();
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
  function db_deletemychildren(){
    for ($i=0; $i<count($this->children); $i++) {
      $this->children[$i]->db_deletemyself();
    }
  }
  function db_insertmychildren($extra=null, $keepid=false){
    for ($i=0; $i<count($this->children); $i++) {
      $this->children[$i]->db_insertmyself($extra, $keepid);
    }
  }
  //Get root male node
  function getrootnode() {
    if (!$this->partnerNode) return false;
    else return $this->partnerNode->getrootnode();
  }
  function cloneNode($levelup=null, $leveldown=null, $thisProperties=null, $thisPropertiesUp=null, $thisPropertiesDown=null) {
    $myClon=new NodeFemale();
    $myClon->load($this, $levelup, $leveldown, $thisProperties, $thisPropertiesUp, $thisPropertiesDown);
    return $myClon;
  }
  
}

class NodeMale extends Node{
  public $parentNode;
  public $relationships=array();
  //optional variable $sort_order

  //It loads data from a json, if update is true only fields and relationship present at original will be updated
  function load($source, $levelup=null, $leveldown=null, $thisProperties=null, $thisPropertiesUp=null, $thisPropertiesDown=null) {
    parent::load($source, null, null, $thisProperties);
    if (isset($source->sort_order)) $this->sort_order=$source->sort_order;
    if ($levelup !== 0 && !($levelup < 0)) { //level null and undefined like infinite
      $this->loadasc($source, $levelup, $thisPropertiesUp);
    }
    if ($leveldown !== 0 && !($leveldown < 0)) {
      $this->loaddesc($source, $leveldown, $thisPropertiesDown);
    }
  }
  function loaddesc($source, $level=null, $thisProperties=null) {
    if (gettype($source)=='string') $source=json_decode($source);
    if (isset($source->sort_order)) $this->sort_order=$source->sort_order;
    if ($level===0) return false;
    if ($level) $level--;
    if (!isset($source->relationships) || !$source->relationships) return false;
    for ($i = 0; $i < count($source->relationships); $i++) {
      $this->relationships[$i]=new NodeFemale();
      $this->relationships[$i]->partnerNode=$this;
      $this->relationships[$i]->load($source->relationships[$i], 0, 0, $thisProperties);
      $this->relationships[$i]->loaddesc($source->relationships[$i], $level, $thisProperties);
    }
  }
  function loadasc($source, $level=null, $thisProperties=null) {
    if (gettype($source)=='string') $source=json_decode($source);
    if (isset($source->sort_order)) $this->sort_order=$source->sort_order;
    if (!isset($source->parentNode) || !$source->parentNode) return false;
    if ($level===0) return false;
    if ($level) $level--;
    if (gettype($source->parentNode)=="array") {
      if (gettype($this->parentNode)!="array") $this->parentNode=[$this->parentNode];
      for ($i=0; $i < count($source->parentNode); $i++) {
	$this->parentNode[$i]=new NodeFemale();
	$this->parentNode[$i]->load($source->parentNode[$i], 0, 0, $thisProperties);
	$this->parentNode[$i]->loadasc($source->parentNode[$i], $level, $thisProperties);
      }
    }
    else {
      if (!$this->parentNode) $this->parentNode=new NodeFemale();
      $this->parentNode->load($source->parentNode, 0, 0, $thisProperties);
      $this->parentNode->loadasc($source->parentNode, $level, $thisProperties);
    }
  }
  function cutUp(){
    $this->parentNode=null;
  }
  function cutDown(){
    $this->relationships=[];
  }
  function getRelationship($value) {
    $i=count($this->relationships);
    while($i--) {
      if (isset($this->relationships[$i]->properties->name) && $this->relationships[$i]->properties->name==$value)
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
      $row=$result->fetch_assoc();
      $this->relationships[$i] = new NodeFemale();
      $this->relationships[$i]->copyPropertiesFromArray($row);
      if (DB_REMOVE_PREFIX) $this->relationships[$i]->properties->name=preg_replace('/.*__(.+)$/', '$1', $this->relationships[$i]->properties->name);
      if (DB_REMOVE_PREFIX) $this->relationships[$i]->properties->childtablename=preg_replace('/.*__(.+)$/', '$1', $this->relationships[$i]->properties->childtablename);
      $this->relationships[$i]->properties->childtablename='TABLE_' . strtoupper($this->relationships[$i]->properties->childtablename);
      if (DB_REMOVE_PREFIX) $this->relationships[$i]->properties->parenttablename=preg_replace('/.*__(.+)$/', '$1', $this->relationships[$i]->properties->parenttablename);
      $this->relationships[$i]->properties->parenttablename='TABLE_' . strtoupper($this->relationships[$i]->properties->parenttablename);
      $this->relationships[$i]->partnerNode=$this;
      $this->relationships[$i]->db_loadchildtablekeys();
      //stablish the sort_order statment
      foreach ($this->relationships[$i]->syschildtablekeysinfo as $syskey) {
	if ($syskey->type=='sort_order' &&  $syskey->parenttablename==$this->relationships[$i]->properties->parenttablename) {
	  $this->relationships[$i]->properties->sort_order=true;
	}
	if ($syskey->type=='foreignkey' &&  $syskey->parenttablename=='TABLE_LANGUAGES') {
	  $this->relationships[$i]->properties->language=true;
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
	$row=$result->fetch_assoc();
	$this->parentNode[$i] = new NodeFemale();
	$this->parentNode[$i]->copyPropertiesFromArray($row);
	if (DB_REMOVE_PREFIX) $this->parentNode[$i]->properties->name=preg_replace('/.*__(.+)$/', '$1', $this->parentNode[$i]->properties->name);
	if (DB_REMOVE_PREFIX) $this->parentNode[$i]->properties->childtablename=preg_replace('/.*__(.+)$/', '$1', $this->parentNode[$i]->properties->childtablename);
	$this->parentNode[$i]->properties->childtablename='TABLE_' . strtoupper($this->parentNode[$i]->properties->childtablename);
	if (DB_REMOVE_PREFIX) $this->parentNode[$i]->properties->parenttablename=preg_replace('/.*__(.+)$/', '$1', $this->parentNode[$i]->properties->parenttablename);
	$this->parentNode[$i]->properties->parenttablename='TABLE_' . strtoupper($this->parentNode[$i]->properties->parenttablename);
	$this->parentNode[$i]->db_loadchildtablekeys();
	//stablish the sort_order statment
	foreach ($this->parentNode[$i]->syschildtablekeysinfo as $syskey) {
	  if ($syskey->type=='sort_order' && $syskey->parenttablename==$this->parentNode[$i]->properties->parenttablename) {
	    $this->parentNode[$i]->properties->sort_order=true;
	  }
	  if ($syskey->type=='foreignkey' &&  $syskey->parenttablename=='TABLE_LANGUAGES') {
	    $this->parentNode[$i]->properties->language=true;
	  }
	}
	$this->parentNode[$i]->children[0]=$this;
      }
    }
    else if ($result->num_rows==1) {
      $row=$result->fetch_assoc();
      $this->parentNode = new NodeFemale();
      $this->parentNode->copyPropertiesFromArray($row);
      if (DB_REMOVE_PREFIX) $this->parentNode->properties->name=preg_replace('/.*__(.+)$/', '$1', $this->parentNode->properties->name);
      if (DB_REMOVE_PREFIX) $this->parentNode->properties->childtablename=preg_replace('/.*__(.+)$/', '$1', $this->parentNode->properties->childtablename);
      $this->parentNode->properties->childtablename='TABLE_' . strtoupper($this->parentNode->properties->childtablename);
      if (DB_REMOVE_PREFIX) $this->parentNode->properties->parenttablename=preg_replace('/.*__(.+)$/', '$1', $this->parentNode->properties->parenttablename);
      $this->parentNode->properties->parenttablename='TABLE_' . strtoupper($this->parentNode->properties->parenttablename);
      $this->parentNode->db_loadchildtablekeys();
      //stablish the sort_order statment
      foreach ($this->parentNode->syschildtablekeysinfo as $syskey) {
	if ($syskey->type=='sort_order' && $syskey->parenttablename==$this->parentNode->properties->parenttablename) {
	  $this->parentNode->properties->sort_order=true;
	}
	if ($syskey->type=='foreignkey' &&  $syskey->parenttablename=='TABLE_LANGUAGES') {
	  $this->parentNode->properties->language=true;
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
    if (isset($this->parentNode->properties->sort_order) && $this->parentNode->properties->sort_order) {
      foreach ($this->parentNode->syschildtablekeysinfo as $syskey) {
	if ($syskey->parenttablename==$this->parentNode->properties->parenttablename && $syskey->type=='sort_order') $positioncolumnname=$syskey->name;
      }
    }
    if (!is_numeric($this->properties->id)) return false;
    $sql = 'SELECT t.*';
    if (isset($this->parentNode->properties->sort_order) && $this->parentNode->properties->sort_order) $sql .= ', ' . $positioncolumnname . 'AS sort_order';
    $sql .= ' FROM ' . constant($this->parentNode->properties->childtablename) . ' t';
    $sql .=' WHERE ' . 't.id = ' . $this->properties->id;
    
    if (($result = $this->getdblink()->query($sql))===false) return false;
    if ($result->num_rows==0) return false;
    $row=$result->fetch_assoc();
    if (isset($row['sort_order'])) {
      $this->sort_order=$row['sort_order'];
      unset($row['sort_order']);
    }
    foreach ($row as $key => $value) {
      if (in_array($key, $this->parentNode->syschildtablekeys)) unset($row[$key]);
    }
    $this->copyPropertiesFromArray($row);
    return true;
  }

  function db_insertmyself($extra=null, $keepid=false) { 
    global $dblink;
    $myproperties=get_object_vars($this->properties);
    
    if ($extra) {
      //$extra could be generic, we resume the ones that are not in table columns
      //$this->parentNode->db_loadchildtablekeys();
      foreach ($extra as $key => $value) {
        if ( !in_array($key, $this->parentNode->childtablekeys)
            && !in_array($key, $this->parentNode->syschildtablekeys) ) {
          unset($extra[$key]);
        }
      }
    }
    if ($extra) $myproperties = array_merge($myproperties, $extra);

    //Now we add a value for the properties that are null and cannot be null
    if (isset($this->parentNode->childtablekeysinfo) && isset($this->parentNode->syschildtablekeys)) {
      foreach ($this->parentNode->childtablekeys as $key => $value) {
        if  ($this->parentNode->childtablekeysinfo[$key]->Null=='NO' && (!isset($this->parentNode->childtablekeysinfo[$key]->Default) || $this->parentNode->childtablekeysinfo[$key]->Default===null) && $this->parentNode->childtablekeysinfo[$key]->Extra!='auto_increment'){
          if (!in_array($value, array_keys($myproperties)) || $myproperties[$value]===null) {
            if (strpos($this->parentNode->childtablekeysinfo[$key]->Type, 'int')!==false || strpos($this->parentNode->childtablekeysinfo[$key]->Type, 'decimal')!==false) {
              $myproperties[$value]=0;
            }
            else {
              $myproperties[$value]='';
            }
          }
        }
      }
    }
    
    if (!$keepid && isset($myproperties['id'])) unset($myproperties['id']);
    
    if (count(array_keys($myproperties))==0) {
      $sql = 'INSERT INTO '
        . constant($this->parentNode->properties->childtablename)
        . ' VALUES ()';
    }
    else {
      $cleankeys=[];
      $cleanvalues=[];
      foreach ($myproperties as $key => $value) {
        $value=$this->getdblink()->real_escape_string($value);
        $key=$this->getdblink()->real_escape_string($key);
        array_push($cleankeys, "`$key`");
        array_push($cleanvalues, "'$value'");
      }
    
      $sql = 'INSERT INTO '
        . constant($this->parentNode->properties->childtablename)
        . ' (' . implode(', ', $cleankeys) . ')'
        . ' VALUES '
        . ' (' . implode(', ', array_values($cleanvalues)) . ')';
    }

    if (($result=$this->getdblink()->query($sql))===false) return false;
    $this->properties->id = $this->getdblink()->insert_id;

    if (isset($this->parentNode->partnerNode->properties->id)) {
      //We add the info of the ids added
      if (!isset($this->extra)) $this->extra=new stdClass();
      if (!isset($this->extra->data)) $this->extra->data="";
      $this->extra->data.=$this->properties->id . ' ' . $this->parentNode->partnerNode->properties->id;

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
    $param_types="";
    $param_values=[];
    $sql = 'UPDATE ' . constant($this->parentNode->properties->childtablename) . ' t'
    . ' SET t.' . $positioncolumnname . '=t.' . $positioncolumnname . ' + 1'
    . ' WHERE'
    . ' t.' . $foreigncolumnname . '=' . $this->parentNode->partnerNode->properties->id
    . ' AND t.id !=' . $this->properties->id
    . ' AND t.' . $positioncolumnname . ' >= ' . $this->sort_order;
    
    if (($result = $this->getdblink()->query($sql))===false) return false;
    return true;
  }
  
  function db_insertmytree($level=null, $extra=null, $keepid=false, $justlangcontent=false) {
    if ($level===0) return true;
    if ($level) $level--;
    if ($justlangcontent) { //We check if we are inserting just lang content
      $islangcontent=false;
      foreach ($this->parentNode->syschildtablekeysinfo as $syskey) {
        if ($syskey->type=='foreignkey' && $syskey->parenttablename=='TABLE_LANGUAGES') {
          $islangcontent=true;
          break;
        }
      }
    }
    if (!$justlangcontent || $justlangcontent && $islangcontent) {
      if ($this->db_insertmyself($extra, $keepid)===false) return false;
    }
    for ($i=0; $i<count($this->relationships); $i++) {
      $this->relationships[$i]->db_insertmytree($level, $extra, $keepid, $justlangcontent);
    }
  }
  
  function db_setmylink() {
    if ( !is_numeric($this->properties->id)) return false;
    //we will insert the relationship
    foreach ($this->parentNode->syschildtablekeysinfo as $syskey) {
      if ($syskey->parenttablename==$this->parentNode->properties->parenttablename) {
	if ($syskey->type=='foreignkey') $foreigncolumnname=$syskey->name;
	else if ($syskey->type=='sort_order') $positioncolumnname=$syskey->name;
      }
    }
    $sql = 'UPDATE ' . constant($this->parentNode->properties->childtablename) . ' t'
    . ' SET ' . $foreigncolumnname . '=' . $this->parentNode->partnerNode->properties->id;
    if (isset($this->parentNode->properties->sort_order) && $this->parentNode->properties->sort_order) {
      if (!isset($this->sort_order)) $this->sort_order=1; //first element by default
      $sql .= ', ' . $positioncolumnname . '=' . $this->sort_order;
    }
    $sql .=' WHERE ' . 't.id =' . $this->properties->id;
    if (($result = $this->getdblink()->query($sql))===false) return false;
    return true;
  }
  
  //Deletes a node. Must be a end node so nodes bellow could appear as linked to the deleted one.
  function db_deletemyself() {
    if ( !is_numeric($this->properties->id)) return false;
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
    if ( !is_numeric($this->sort_order) || $this->sort_order<1) return false;
    //Now we got to remove the relation from the database and update the sort_order of the borothers
    if ($this->db_releasemylink()===false) return false; //if there is any problem we abort
    //We try to update sort_order at bro for that we need the object to be updated
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
  
  function db_deletemytree(){
    $this->db_loadmytree();
    $this->db_deletemytree_proto();
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
    if ( !is_numeric($this->properties->id)) return false;
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
  
  function db_updatemyproperties($proparray){
    if ( !is_numeric($this->properties->id)) return false;
    global $dblink;
    //We update the fields
    //We take in acount for sql injections
    
    $cleansentence=[];
    foreach ($proparray as $key => $value) {
      $value=$this->getdblink()->real_escape_string($value);
      $key=$this->getdblink()->real_escape_string($key);
      array_push($cleansentence, "`$key`" . '=' . "'$value'");
    }
    
    $sql = 'UPDATE '
    . constant($this->parentNode->properties->childtablename)  .
      ' SET ';
    $sql .= implode(",", $cleansentence);
    $sql .=' WHERE id=' . $this->properties->id;

    return $this->getdblink()->query($sql);
  }
  
  function db_updatemysort_order($new_sort_order){
    if ( !is_numeric($this->properties->id) || !is_numeric($new_sort_order)) return false;
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
    return true;
  }

  function db_replacemyself($newchildid) {
    if ( !is_numeric($this->properties->id) || !is_numeric($newchildid) ) return false;
    
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
    if (!isset($this->sort_order) || !$this->sort_order) return;
    $sql = 'UPDATE ' . constant($this->parentNode->properties->childtablename) . ' t'
    . ' SET t.' . $positioncolumnname . '=' . $this->sort_order
    . ' WHERE ' . 't.id =' . $newchildid;
    if (($result = $this->getdblink()->query($sql))===false) return false;
  }
  
  function session($sesname=null, $action="load") {
    switch ($action) {
      case "load":
        if (isset($_SESSION[$sesname])) {
          $data=unserialize($_SESSION[$sesname]);
          $this->load($data);
        }
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
  
  //Search in the database for the records equal to the element properties
  function db_search($tablename=null, $proparray=null) {
    if (!$tablename) $tablename = $this->parentNode->properties->childtablename;
    if (!$proparray) {
      $proparray = $this->properties;
    }
    $return=[];
    if (count(get_object_vars($proparray))==0) {
      $sql = 'SELECT * FROM ' . constant($tablename);
      $result=$this->getdblink()->query($sql);
      while ($row = $result->fetch_assoc()) {
          array_push($return, $row);
      }
      return $return;
    }
    
    $searcharray = []; // search string array
    $params=[];
    
    foreach ($proparray as $key => $value) {
      $value=$this->getdblink()->real_escape_string($value);
      $key=$this->getdblink()->real_escape_string($key);
      array_push($searcharray, "$key = '$value'");
      array_push($params, $key);
      array_push($params, $value);
    }
    
    $sql = 'SELECT * FROM ' . constant($tablename) . ' where ' . implode(' and ', $searcharray);
    $result=$this->getdblink()->query($sql);
    while ($row = $result->fetch_assoc()) {
        array_push($return, $row);
    }
    return $return;
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
  //Get root male node
  function getrootnode() {
    if (!$this->parentNode) return $this;
    else if ($this->parentNode->partnerNode) {
      return $this->parentNode->partnerNode->getrootnode();
    }
    else return $this;
  }
  function cloneNode($levelup=null, $leveldown=null, $thisProperties=null, $thisPropertiesUp=null, $thisPropertiesDown=null) {
    $myClon=new NodeMale();
    $myClon->load($this, $levelup, $leveldown, $thisProperties, $thisPropertiesUp, $thisPropertiesDown);
    return $myClon;
  }
  function addRelationship($rel) {
    array_push($this->relationships, $rel);
    $rel->partnerNode=$this;
    return $rel;
  }
}

?>
