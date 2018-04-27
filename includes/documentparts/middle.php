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
<script type="text/javascript">
function fitincolumn() {
  var centralcontent=document.getElementById("centralcontent");
  document.getElementById("mainblock").style.minWidth="300px";
  document.getElementById("mainblock").style.width="100%";
  var logbox=document.getElementById("logboxcontainer");
  var cartbox=document.getElementById("cartcontainer");
  var catalogbox=document.getElementById("leftcontainer");
  logbox.style.display="inline-block";
  cartbox.style.display="inline-block";
  catalogbox.style.display="inline-block";
  centralcontent.style.padding="0px 5px";
  var divboxes=centralcontent.parentElement.insertBefore(document.createElement("div"), centralcontent);
  divboxes.appendChild(logbox);
  divboxes.appendChild(catalogbox);
  divboxes.appendChild(cartbox);

  var leftcolumn=document.getElementById("mainblock").querySelector("table.leftcolumn").parentElement;
  var rightcolumn=document.getElementById("mainblock").querySelector("table.rightcolumn").parentElement;

  leftcolumn.style.display="none";
  rightcolumn.style.display="none";
}
window.addEventListener('load',function(){ if (window.screen.availWidth<500) {fitincolumn();}});
</script>