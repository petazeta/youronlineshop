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
function fitincolumn() {
  var newStyle=document.createElement("style");
  newStyle.textContent="header h1 {font-size: 2em !important;}"
  + " header h2 {font-size: 1.2em !important;}"
  + " nav span { margin: 0.2em 0.4em !important;}";
  document.head.appendChild(newStyle);
  var centralcontent=document.getElementById("centralcontent");
  var leftcolumn=closesttagname.call(document.querySelector("section.leftcolumn"), 'TD');
  var rightcolumn=closesttagname.call(document.querySelector("section.rightcolumn"), 'TD');
  document.querySelector("[class=mainblock]").style.minWidth="300px";
  document.querySelector("[class=mainblock]").style.width="100%";
  var catalogbox=leftcolumn.querySelector('div[data-phone]');
  var logbox=rightcolumn.querySelector('div[data-phone]');
  var cartbox=rightcolumn.querySelectorAll('div[data-phone]')[1];
  console.log(document.querySelector("#smartphoneboxestp"));
  var myTable=getTpContent(document.querySelector("#smartphoneboxestp")).querySelector("table");
  var boxes=[catalogbox, cartbox, logbox];
  var boxColumns=0;
  centralcontent.style.paddingLeft="0.8em";
  centralcontent.style.paddingRight="0.8em";
  if (window.screen.width<400) {
    centralcontent.style.paddingLeft="0";
    centralcontent.style.paddingRight="0";
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
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  if (window.screen.width<700) {
    fitincolumn();
  }
});
</script>