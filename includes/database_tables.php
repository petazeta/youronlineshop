<?php
/*
  Table Names in case there would be prefix
*/

$standardTables=[
"addresses",
"domelements",
"itemcategories",
"items",
"links",
"orderitems",
"orders",
"relationships",
"users",
"usersdata",
"userstypes"
];

$sql="SHOW TABLES";

$tablesRequester=new NodeFemale();

if (($result = $tablesRequester->getdblink()->query($sql))===false) return false;

for ($i=0; $i<$result->num_rows; $i++) {
  $row=$result->fetch_array(MYSQLI_ASSOC);
  $tablesRequester->children[$i] = new NodeMale();
  $tablesRequester->children[$i]->properties->cloneFromArray($row);
  $tablesRequester->children[$i]->parentNode=$tablesRequester;
}
$databaseTableNames=[];
foreach($tablesRequester->children as $myTable) {
  $key=array_keys((array)$myTable->properties)[0];
  array_push($databaseTableNames, $myTable->properties->$key);
}
foreach ($standardTables as $stdTable) {
  $key=array_search($stdTable, $databaseTableNames);
  if ($key!==false) {
    define('TABLE_' . strtoupper($stdTable), $databaseTableNames[$key]);
  }
  else {
    foreach ($databaseTableNames as $dbTableName) {
      if (preg_match("/_" . $stdTable . "$/i", $dbTableName)) {
	define('TABLE_' . strtoupper($stdTable), $dbTableName);
      }
    }
  }
}

?>
