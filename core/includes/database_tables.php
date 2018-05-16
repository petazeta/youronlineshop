<?php
/*
  Table Names to constants.
  In case there would be prefix (__***) it is removed from the contastant name
*/

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
  $databaseTableNames[] = $myTable->properties->$key;
}
$standardTables=preg_replace('/__(.+)$/', '$1', $databaseTableNames);
for ($i=0; $i<count($databaseTableNames); $i++) {
  define('TABLE_' . strtoupper($standardTables[$i]), $databaseTableNames[$i]);
}
?>
