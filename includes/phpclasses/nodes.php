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
      if (defined('DB_CHARSET')) $dblink->set_charset(DB_CHARSET);
      $dblink->query('SET character_set_results=\'' . DB_CHARSET . '\'');
    }
    return $dblink;
  }
  function checkdblink(){
    global $dblink;
    //error handler function
    function customError($errno, $errstr) {
      //if (!$dblink->connect_errno) echo "<b>Error:</b> [$errno] $errstr";
    }
    //set error handler
    set_error_handler("customError");
    
    $dblink=new mysqli(DB_HOST, DB_USERNAME, DB_USERPWD, DB_DATABASENAME);
    restore_error_handler();
    if ($dblink->connect_errno) return false;
    return true;
  }
  function checkphpversion(){
    if (version_compare(phpversion(),'5.6')<0) return false;
    else return true;
  }
  function load($source, $levelup=null, $leveldown=null, $thisProperties=null, $thisPropertiesUp=null, $thisPropertiesDown=null){
    if (gettype($source)=='string') $source=json_decode($source);
    if (isset($source->properties)) {
      if ($thisProperties) {
        for ($i=0; $i < count($thisProperties); $i++) {
          if (in_array($thisProperties[$i], array_keys((array)$source->properties))) {
            $propkey=$thisProperties[$i];
            $myProperties[$propkey]=$source->properties->$propkey;
          }
        }
        $this->properties->cloneFromArray($myProperties);
      }
      else $this->properties->cloneFromArray($source->properties);
    }
    if (isset($source->nodelist) && is_array($source->nodelist)) {
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
  function cloneNode($levelup=null, $leveldown=null, $thisProperties=null, $thisPropertiesUp=null, $thisPropertiesDown=null) {
    $myClon=new get_class($this);
    $myClon->load($this, $levelup, $leveldown, $thisProperties, $thisPropertiesUp, $thisPropertiesDown);
    return $myClon;
  }
  function loadasc($source, $level=null, $thisProperties=null){
    if (gettype($source)=='string') $source=json_decode($source);
    return $source;
  }
  function loaddesc($source, $level=null, $thisProperties=null){
    if (gettype($source)=='string') $source=json_decode($source);
    return $source;
  }
  function db_deletemytree(){
    $this->db_loadmytree();
    $this->db_deletemytree_proto();
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
    $source=parent::loaddesc($source); //No thisProperties filter for females
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
    $source=parent::loadasc($source); //No thisProperties filter for females
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
    $this->children=null;
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
      $row=$result->fetch_array(MYSQLI_ASSOC);
      $syskey=new Properties();
      $syskey->type='foreignkey';
      $syskey->cloneFromArray($row);
      // to constant table names
      if (DB_REMOVE_PREFIX) $syskey->parenttablename = preg_replace('/.*__(.+)$/', '$1', $syskey->parenttablename);
      $syskey->parenttablename='TABLE_' . strtoupper($syskey->parenttablename);
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
      $infokeys=new Properties();
      $infokeys->cloneFromArray($row);
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
  function db_loadtables($prefix=null) {
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
  function db_removeall($filter=null, $limit=null) {
    $sql = 'DELETE FROM '
    . constant($this->properties->childtablename)
    .  ' WHERE 1';
    if ($filter) {
      $sql .= ' AND ' . $filter;
    }
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
    $source=parent::loaddesc($source);
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
    $source=parent::loadasc($source);
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
	$row=$result->fetch_array(MYSQLI_ASSOC);
	$this->parentNode[$i] = new NodeFemale();
	$this->parentNode[$i]->properties->cloneFromArray($row);
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
      $row=$result->fetch_array(MYSQLI_ASSOC);
      $this->parentNode = new NodeFemale();
      $this->parentNode->properties->cloneFromArray($row);
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
    $sql = 'SELECT t.*';
    if (isset($this->parentNode->properties->sort_order) && $this->parentNode->properties->sort_order) $sql .= ', ' . $positioncolumnname . 'AS sort_order';
    $sql .= ' FROM ' . constant($this->parentNode->properties->childtablename) . ' t';
    $sql .=' WHERE ' . 't.id = ?';
    
    $param_types="i";
    $param_values=[$this->properties->id];
    
    $return=$this->stmt_get_result($param_types, $param_values, $sql);
    if ($return===false || count($return)==0) return false;
    $row=$return[0];
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

  function db_insertmyself($extra=null, $keepid=false) { 
    global $dblink;
    $myproperties=get_object_vars($this->properties);
    
    if ($extra) $myproperties = array_merge($myproperties, $extra);

    //Now we add a value for the properties that are null and cannot be null
    if (isset($this->parentNode->childtablekeysinfo) && isset($this->parentNode->syschildtablekeys)) {
      foreach ($this->parentNode->childtablekeys as $key => $value) {
        if  ($this->parentNode->childtablekeysinfo[$key]->Null=='NO' && $this->parentNode->childtablekeysinfo[$key]->Default===null && $this->parentNode->childtablekeysinfo[$key]->Extra!='auto_increment'){
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

    $param_keys = [];
    $param_types = "";
    $param_values = [];
    $mysqlproperties = []; // search string array
    
    $this->stmt_generate_params($param_types, $param_values, $param_keys, $myproperties);
    
    if (count($param_keys)==0) {
      $sql = 'INSERT INTO '
        . constant($this->parentNode->properties->childtablename)
        . ' VALUES ()';
      if (($result = $this->getdblink()->query($sql))===false) return false;
      $this->properties->id = $this->getdblink()->insert_id;
    }
    else {
      foreach ($param_keys as $key => $value) {
        $mysqlproperties[$value]='?';
      }
      $sql = 'INSERT INTO '
        . constant($this->parentNode->properties->childtablename)
        . ' ('
          . implode(', ', array_keys($mysqlproperties))
        . ' ) VALUES ('
        . implode(', ', array_values($mysqlproperties))
        . ' )';
      $stmt = $this->getdblink()->prepare($sql);
      if ( version_compare(phpversion(),'5.6')<0) {
        //patch for php 5.4 alternative to splat operator
        $bind_param_args=[];
        array_push($bind_param_args, $stmt, $param_types);
        $param_values_by_reference=[];
        for ($i=0; $i<count($param_values); $i++) {
          $param_values_by_reference[$i]=&$param_values[$i];
        }
        $bind_param_args=array_merge($bind_param_args, $param_values_by_reference);
        call_user_func_array("mysqli_stmt_bind_param", $bind_param_args);
        //patch for php 5.4 alternative to splat operator
      }
      else {
        eval('$stmt->bind_param($param_types, ...$param_values);'); // ... = "splat" operator
      }
      if ($stmt->execute()===false) return false;
      $this->properties->id = $stmt->insert_id;
    }

    if (isset($this->parentNode->partnerNode->properties->id)) {
      //We add the info of the ids added
      if (!isset($this->extra)) $this->extra=new stdClass();
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
      
    $param_keys = [];
    $param_types = "";
    $param_values = [];
    $updatearray = []; // search string array
    
    $this->stmt_generate_params($param_types, $param_values, $param_keys, $proparray);
    
    if (count($param_keys)==0) {
      return false;
    }
    
    foreach ($param_keys as $key => $value) {
      array_push($updatearray, $value . '= ?');
    }
    $sql = 'UPDATE '
    . constant($this->parentNode->properties->childtablename)  .
      ' SET ';
    $sql .= implode(', ', $updatearray);
    $sql .=' WHERE id=' . $this->properties->id;

    $stmt = $this->getdblink()->prepare($sql);

    eval('$stmt->bind_param($param_types, ...$param_values);'); // ... = "splat" operator

    return $stmt->execute();
  }
  
  function db_updatemysort_order($new_sort_order){
    if ( !is_numeric($this->properties->id)) return false;
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
  
  //Search in the database for the records equal to the element properties
  function db_search($tablename=null, $proparray=null, $condarray=null) {
    if (!$tablename) $tablename = $this->parentNode->properties->childtablename;
    if (!$proparray) {
      $proparray = $this->properties;
    }
    $param_keys = [];
    $param_types = "";
    $param_values = [];
    $searcharray = []; // search string array
    
    $this->stmt_generate_params($param_types, $param_values, $param_keys, $proparray);
    
    if (count($param_keys)==0) {
      $sql = 'SELECT * FROM ' . constant($tablename);
      $return = $this->getdblink()->query($sql);
      return $return;
    }
    if (!$condarray) {
      $condarray=[];
    }
    foreach ($param_keys as $key => $value) {
      if (!isset($condarray[$value])) {
        $condarray[$value] = '= ?';
      }
      array_push($searcharray, $value . $condarray[$value]);
    }
    
    $sql = 'SELECT * FROM ' . constant($tablename) . ' where ' . implode(' and ', $searcharray);

    $return=$this->stmt_get_result($param_types, $param_values, $sql);

    return $return;
  }
  function stmt_generate_params(&$param_types, &$param_values, &$param_keys, $proparray){
    // $param_keys = []; the valid keys: excluding  no database column keys
    // $param_types = ""; the types for the binded parameters, see https://secure.php.net/manual/en/mysqli-stmt.bind-param.php
    // $param_values = []; the values for the binded parameters  . '= ?'
    if (!$proparray) {
      $proparray = $this->properties;
    }
    //first we search if the properties are actual table columns
    foreach ($proparray as $key => $value) {
      if (isset($this->parentNode->childtablekeys) ) {
	if (!in_array($key, $this->parentNode->childtablekeys) ) {
	  if (isset($this->parentNode->syschildtablekeys) ) { //I dont understand well, maybe we dont need to insert any record at syskeys
	    if (!in_array($key, $this->parentNode->syschildtablekeys) ) {
	      continue;
	    }
	  }
	  else {
	    continue;
	  }
	}
      }
      array_push($param_values, $value);
      array_push($param_keys, $key);
      if (isset($this->parentNode->childtablekeysinfo) || isset($this->parentNode->syschildtablekeys) ) {
	$keypos=array_search($key, $this->parentNode->childtablekeys);
	if ($keypos!==false) {
	  if (strpos('int',$this->parentNode->childtablekeysinfo[$keypos]->Type)!==false) {
	    $param_types .= "i";
	  }
	  else if (strpos('decimal',$this->parentNode->childtablekeysinfo[$keypos]->Type)!==false) {
	    $param_types .= "d";
	  }
	  else {
	    $param_types .= "s";
	  }
	}
	else { //it is syskey
	  $param_types .= "i";
	}
      }
      else {
	if ($key === "id" || substr($key, 0, 1) === "_") {
	  // The key or a foreign key is probably an integer
	  $param_types .= "i";
	} else {
	  // Is is probably a string
	  $param_types .= "s";
	}
      }
    }
  }
  
  function stmt_get_result($param_types, $param_values, $sql) {
    //generates an associative array containing the request result
    //it is an alternative for mysqli get_result function that needs an extra php module
    $stmt = $this->getdblink()->prepare($sql);
    if ( version_compare(phpversion(),'5.6')<0) {
      //patch for php 5.4 alternative to splat operator
      $bind_param_args=[];
      array_push($bind_param_args, $stmt, $param_types);
      $param_values_by_reference=[];
      for ($i=0; $i<count($param_values); $i++) {
	$param_values_by_reference[$i]=&$param_values[$i];
      }
      $bind_param_args=array_merge($bind_param_args, $param_values_by_reference);
      call_user_func_array("mysqli_stmt_bind_param", $bind_param_args);
      //patch for php 5.4 alternative to splat operator
    }
    else {
      eval('$stmt->bind_param($param_types, ...$param_values);'); // ... = "splat" operator
    }
    $stmt->execute();
    
    $result_fields = $stmt->result_metadata();
    $field_keys=[];
    $result_values=[];
    for ($i=0; $i<$stmt->field_count; $i++) {
      array_push($field_keys, $result_fields->fetch_field()->name);
      $result_values[$i]=null;
    }
    if ( version_compare(phpversion(),'5.6')<0) {
      //patch for php 5.4 alternative to splat operator
      $bind_result_args=[];
      array_push($bind_result_args, $stmt);
      $result_values_by_reference=[];
      for ($i=0; $i<count($result_values); $i++) {
	$result_values_by_reference[$i]=&$result_values[$i];
      }
      $bind_result_args=array_merge($bind_result_args, $result_values_by_reference);
      call_user_func_array("mysqli_stmt_bind_result", $bind_result_args);
      //patch for php 5.4 alternative to splat operator
    }
    else {
      eval('$stmt->bind_result(...$result_values);');
    }
    $return=[];
    /* fetch values */
    while ($stmt->fetch()) {
      $row = array_combine($field_keys, $result_values);
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
}

?>
