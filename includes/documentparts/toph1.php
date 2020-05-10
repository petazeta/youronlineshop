<div class="title"></div>
<script>
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  var headtt=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"top"}).getNextChild({"name":"headtitle"});
  headtt.getRelationship({name: "domelementsdata"}).getChild().refreshView(document.querySelector('header div.pgtitle > div.title'), "templates/toph1.php");
});
</script>