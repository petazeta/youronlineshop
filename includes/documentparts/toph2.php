<div></div>
<script>
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  var headtt=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"top"}).getNextChild({"name":"headsubtitle"});
  headtt.getRelationship({name: "domelementsdata"}).getChild().refreshView(document.querySelector("#topheadsubtitle div"), "templates/toph2.php");
});
</script>