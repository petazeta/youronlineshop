<?php
/*
  Table Names to constants.
*/

$databaseTableNames=Node::db_gettables();

for ($i=0; $i<count($databaseTableNames); $i++) {
  define('TABLE_' . strtoupper($databaseTableNames[$i]), $databaseTableNames[$i]);
}
?>
