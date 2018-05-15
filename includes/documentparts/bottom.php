<footer>
  <table style="width:100%;">
    <tr>
      <td></td>
      <template>
	<span></span>
	<script>thisElement.innerHTML=thisNode.properties.innerHTML</script>
      </template>
      <td style="text-align:right;"></td>
      <template>
	<span></span>
	<script>thisElement.innerHTML=thisNode.properties.innerHTML</script>
      </template>
    </tr>
  </table>
</footer>
<script type="text/javascript">
webuser.addEventListener("loadses", function(){
  var license=labelsRoot.getNextChild({"name":"bottom"}).getNextChild({"name":"license"});
  var licensecontainer=document.querySelector("footer > table").rows[0].cells[0];
  license.refreshView(licensecontainer, licensecontainer.nextElementSibling.content);
  var designed=labelsRoot.getNextChild({"name":"bottom"}).getNextChild({"name":"designed"});
  var designedcontainer=document.querySelector("footer > table").rows[0].cells[1];
  designed.refreshView(designedcontainer, designedcontainer.nextElementSibling.content);
});
</script>