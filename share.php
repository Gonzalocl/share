<?php
$str1 = '<form action="/'.basename(__FILE__).'" method="get"><input name="dir" type="submit" value="';
$str2 = '"></form>';
function console_log( $data ){
  echo '<script>';
//  echo 'console.log('. json_encode( $data ) .')';
 // echo 'console.log("dd/dd")';
  echo 'console.log("'.$data.'")';
  echo '</script>';
}
if ($_GET["run"]) {
  $cwdd = $_GET["run"];
  include("sl.php");
}
else {


$cwdd = dirname(__FILE__);
if ($_GET["dir"]) {
  $cwdd = $_GET["dir"];
  if (is_file($cwdd)) {
    header("Location: http://localhost".substr("$cwdd", 13)); /* Redirect browser */
    exit();
  }
  $cwdd = $_GET["dir"];
}

echo '<form action="/'.basename(__FILE__).'" method="get"><input name="run" type="submit" value="'.$cwdd.'"></form>';

$dirit = new DirectoryIterator($cwdd);
foreach ($dirit as $fileinfo) {
  /*console_log($cwdd);
  console_log($fileinfo);*/
  echo $str1.$cwdd."/".$fileinfo.$str2;
}
}
?>
