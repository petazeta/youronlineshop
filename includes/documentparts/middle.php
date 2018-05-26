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
    <td class="maxwidth">
      <?php include("includes/documentparts/center.php"); ?>
    </td>
    <td>
      <?php include("includes/documentparts/right.php"); ?>
    </td>
  </tr>
</table>
<template id="smartphoneboxestp">
  <table>
    <tr>
      <td style="padding:1em 0.5em;"></td>
    </tr>
  </table>
</template>
<script type="text/javascript">
var smartPhonesTp=document.querySelector("#smartphoneboxestp");
function fitincolumn() {
  var centralcontent=document.getElementById("centralcontent");
  var leftcolumn=closesttagname.call(document.querySelector("section.leftcolumn"), 'TD');
  var rightcolumn=closesttagname.call(document.querySelector("section.rightcolumn"), 'TD');
  document.getElementById("mainblock").style.minWidth="300px";
  document.getElementById("mainblock").style.width="100%";
  var catalogbox=leftcolumn.querySelector('div[data-phone]');
  var logbox=rightcolumn.querySelector('div[data-phone]');
  var cartbox=rightcolumn.querySelectorAll('div[data-phone]')[1];
  logbox.style.display="table";
  centralcontent.style.padding="0px 5px";
  logbox.style.margin="1em auto 0 auto";
  document.querySelector("header").insertBefore(logbox, document.querySelector("header").firstElementChild);
  //Get the template table cell, insert logboxes
  var myTable=smartPhonesTp.content.querySelector("table").cloneNode(true);
  var myCell=myTable.rows[0].cells[0].cloneNode(true);
  myTable.rows[0].cells[0].appendChild(catalogbox);
  myCell.appendChild(cartbox);
  myTable.rows[0].appendChild(myCell);
  
  centralcontent.parentElement.insertBefore(myTable, centralcontent);

  leftcolumn.style.display="none";
  rightcolumn.style.display="none";
}
window.addEventListener("load", function(){
  if (window.screen.width<500) {
    fitincolumn();
  }
});
</script>