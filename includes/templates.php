<?php
//Load all files from folder templates
//add to the template the id=filename
$dir='templates';
$tpfiles = array_diff(scandir($dir), array('..', '.'));
foreach ($tpfiles as $key => $value) {
  $pos = strpos($value, '.');
  $filename = substr($value, 0, $pos);
  $template=file_get_contents($dir . '/' . $value);
  echo "<template id='tp$filename'>\n" . $template . "\n</template>\n";
}
?>