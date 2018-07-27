<footer>
  <table style="width:100%;">
    <tr>
      <td></td>
      <td style="text-align:right;"></td>
    </tr>
  </table>
  <img id="statsLink" style="display:none">
</footer>
<script type="text/javascript">
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  var license=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"bottom"}).getNextChild({"name":"license"}).getRelationship({name: "domelementsdata"}).getChild();
  var licensecontainer=document.querySelector("footer > table").rows[0].cells[0];
  license.refreshView(licensecontainer, "includes/templates/license.php");
  var designed=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"bottom"}).getNextChild({"name":"designed"}).getRelationship({name: "domelementsdata"}).getChild();
  var designedcontainer=document.querySelector("footer > table").rows[0].cells[1];
  designed.refreshView(designedcontainer, "includes/templates/designed.php");
});
</script>