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
  <table style="margin: auto">
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
  document.querySelector("[class=mainblock]").style.minWidth="300px";
  document.querySelector("[class=mainblock]").style.width="100%";
  var catalogbox=leftcolumn.querySelector('div[data-phone]');
  var logbox=rightcolumn.querySelector('div[data-phone]');
  var cartbox=rightcolumn.querySelectorAll('div[data-phone]')[1];
  var myTable=document.querySelector("#smartphoneboxestp").content.querySelector("table");
  var boxes=[catalogbox, cartbox, logbox];
  var boxColumns=0;
  if (window.screen.width<400) {
   boxes.splice(2,1);
   var boxContainer=document.createDocumentFragment();
   boxContainer.appendChild(logbox);
   document.querySelector("header").appendChild(intoColumns(myTable.cloneNode(true), boxContainer, boxColumns));
  }
  var boxContainer=document.createDocumentFragment();
  boxes.forEach(function(box){
    boxContainer.appendChild(box);
  });
  document.querySelector("header").appendChild(intoColumns(myTable.cloneNode(true), boxContainer, boxColumns));

  leftcolumn.style.display="none";
  rightcolumn.style.display="none";
}
window.addEventListener("load", function(){
  if (window.screen.width<700) {
    fitincolumn();
  }
});
</script>