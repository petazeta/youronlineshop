<header>
  <div class="headertop">
    <div class="pgtitle"></div>
    <div class="toolbar">
      <a class="toolbaricon" id="logcontainer" href=""></a>
      <a class="toolbaricon" id="cartcontainer" href=""></a>
      <?php include('includes/documentparts/cartbox.php'); ?>
    </div>
  </div>
</header>
<div class="pgsubtitle"></div>
<script>
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  var pagTit=this.getChild().getNextChild({name: "labels"}).getNextChild({name:"not located"}).getNextChild({name: "pagTit"}).getRelationship("domelementsdata").getChild();
  if (pagTit.properties.value) pagTit.writeProperty(document, null, "title");

  var logboxparent=this.getChild().getNextChild({name: "labels"}).getNextChild({name:"middle"}).getNextChild({name:"logbox"}).getRelationship({name:"domelements"});
  logboxparent.refreshView(document.getElementById("logcontainer"), "templates/logicon.php");
  var cartboxtt=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"cartbox"}).getNextChild({name: "crtbxtt"}).getRelationship({name: "domelementsdata"}).getChild();
  cartboxtt.refreshView(document.querySelector("#cartcontainer"), "templates/carticon.php");
  if (Config.pageTitle_On) {
    var headtt=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"top"}).getNextChild({"name":"headtitle"});
    headtt.getRelationship({name: "domelementsdata"}).getChild().refreshView(document.querySelector('div.pgtitle'), "templates/toph1.php");
  }
  if (Config.pageSubTitle_On) {
    var headsubtt=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"top"}).getNextChild({"name":"headsubtitle"});
    headsubtt.getRelationship({name: "domelementsdata"}).getChild().refreshView(document.querySelector("div.pgsubtitle"), "templates/toph2.php");
  }
});
webuser.addEventListener("log", function(){
  if (!this.properties.id) {
    (new Node()).refreshView(document.getElementById("centralcontent"), "templates/loginform.php");
  }
  else {
    this.refreshView(document.getElementById("centralcontent"),  "templates/loggedindata.php");
  }
}, "logchangecentralcontent");
</script>

