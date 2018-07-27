<footer>
  <table style="width:100%;">
    <tr>
      <td></td>
      <template>
	<span></span>
	<script>thisElement.innerHTML=thisNode.properties.value</script>
      </template>
      <td style="text-align:right;"></td>
      <template>
	<span></span>
	<script>thisElement.innerHTML=thisNode.properties.value</script>
      </template>
    </tr>
  </table>
  <img id="statsLink" style="display:none">
</footer>
<script type="text/javascript">
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  var license=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"bottom"}).getNextChild({"name":"license"}).getRelationship({name: "domelementsdata"}).getChild();
  var licensecontainer=document.querySelector("footer > table").rows[0].cells[0];
  license.refreshView(licensecontainer, getTpContent(licensecontainer.nextElementSibling));
  var designed=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"bottom"}).getNextChild({"name":"designed"}).getRelationship({name: "domelementsdata"}).getChild();
  var designedcontainer=document.querySelector("footer > table").rows[0].cells[1];
  designed.refreshView(designedcontainer, getTpContent(designedcontainer.nextElementSibling));
});
</script>