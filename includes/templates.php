<?php
//Load all files from folder includes/templates
//add to the template the id=filename
$dir    = 'includes/templates';
$dir='templates';
$tpfiles = array_diff(scandir($dir), array('..', '.'));
foreach ($tpfiles as $key => $value) {
  $pos = strpos($value, '.');
  $filename = substr($value, 0, $pos);
  $template=file_get_contents($dir . '/' . $value);
  $template=str_replace('<template>', "<template id='tp$filename'>", $template);
  echo $template . "\n";
}
?>