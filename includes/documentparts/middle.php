<template title="smart phone boxes">
  <table>
    <tr>
      <td></td>
    </tr>
  </table>
</template>
<table style="width:100%">
  <tr>
    <td>
      <?php include("includes/documentparts/left.php"); ?>
    </td>
    <td class="centercolumn">
      <?php include("includes/documentparts/center.php"); ?>
    </td>
    <td>
      <?php include("includes/documentparts/right.php"); ?>
    </td>
  </tr>
</table>
<template title="smart phone boxes">
  <table>
    <tr>
      <td style="padding:1em 0.5em;"></td>
    </tr>
  </table>
</template>
<script type="text/javascript">
var smartPhonesTp=document.currentScript.previousElementSibling.content.cloneNode(true);
function fitincolumn() {
  var centralcontent=document.getElementById("centralcontent");
  document.getElementById("mainblock").style.minWidth="300px";
  document.getElementById("mainblock").style.width="100%";
  var logbox=document.getElementById("logboxcontainer");
  var cartbox=document.getElementById("cartcontainer");
  var catalogbox=document.getElementById("leftcontainer");
  logbox.style.display="table";
  centralcontent.style.padding="0px 5px";
  logbox.style.margin="1em auto 0 auto";
  document.querySelector("header").insertBefore(logbox, document.querySelector("header").firstElementChild);
  //Get the template table cell, insert logboxes
  var myTable=smartPhonesTp.querySelector("table");
  var myCell=myTable.rows[0].cells[0].cloneNode(true);
  myTable.rows[0].cells[0].appendChild(catalogbox);
  myCell.appendChild(cartbox);
  myTable.rows[0].appendChild(myCell);
  
  centralcontent.parentElement.insertBefore(myTable, centralcontent);

  var leftcolumn=document.getElementById("mainblock").querySelector("table.leftcolumn").parentElement;
  var rightcolumn=document.getElementById("mainblock").querySelector("table.rightcolumn").parentElement;

  leftcolumn.style.display="none";
  rightcolumn.style.display="none";
}
window.addEventListener('load',function(){ if (window.screen.availWidth<500) {fitincolumn();}});
</script>