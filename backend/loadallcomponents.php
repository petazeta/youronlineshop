<?php
//Load all files from folder templates
//themeId: id

require('includes/themes.php');

$themeId="root"; //Default

$content = json_decode(trim(file_get_contents("php://input")));
if (isset($content->theme_id)) $themeId=$content->theme_id;

$theme=new Theme($themeId);

$fileList=$theme->getTpFilesList();

$tpcontent="";
foreach ($fileList as $key => $value) {
  $template=file_get_contents($value);
  $tpcontent .= "<template id='tp$key'>\n" . $template . "\n</template>\n";
}
//header('Access-Control-Allow-Origin: *'); //To allow use of external
echo $tpcontent;
//We can also create a plain file:
//file_put_contents('../alltemplates.html', $tpcontent);
?>