
<style>
html,body{
    margin:0;
    height:100%;
    background-color: black;
}
img{
  display:block;
  width:100%;
  object-fit: cover;
}
</style>

<div id="imgag">

</div>


<script>

var x = 0;
/*
var ims = [
  "a.png",
  "b.png",
];
*/


<?php
$dirit = new DirectoryIterator($cwdd);
echo "var ims = [";
// filtrar no imagenes
$exts = array("png", "jpg", "jpeg");
foreach ($dirit as $fileinfo) {
  //console_log(end(explode(".", $fileinfo)));
  if (in_array(strtolower(end(explode(".", $fileinfo))), $exts)) {
    echo '"'.substr($cwdd, 13)."/".$fileinfo.'",';
  //  console_log("dd");
//    console_log('"'.substr($cwdd, 13)."/".$fileinfo.'",');
  }
}
echo "];";
?>

ims.sort();
function cha() {
document.getElementById('imgag').innerHTML = '<img src="' + ims[x] + '">'
x = (x+1) % ims.length
setTimeout(cha, 5500);
}
//document.getElementById('imgag').webkitRequestFullscreen();
setTimeout(cha, 0);





</script>




