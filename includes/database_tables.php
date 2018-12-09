<?php
/*
  Table Names to constants.
  In case there would be prefix (__***) it is removed from the contastant name
*/

$tablesRequester=new NodeFemale();
$tablesRequester->db_loadtables();

$databaseTableNames=[];
foreach($tablesRequester->children as $myTable) {
  $databaseTableNames[] = $myTable->properties->name;
}
if (DB_REMOVE_PREFIX) $standardTables=preg_replace('/.*__(.+)$/', '$1', $databaseTableNames);
else $standardTables=$databaseTableNames;

for ($i=0; $i<count($databaseTableNames); $i++) {
  define('TABLE_' . strtoupper($standardTables[$i]), $databaseTableNames[$i]);
}
?>
