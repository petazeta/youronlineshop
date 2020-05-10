<header>
  <div class="pgtitle">
    <?php include("includes/documentparts/toph1.php"); ?>
    <?php include("includes/documentparts/toph2.php"); ?>
  </div>
  <nav class="menus">
    <div class="toolbar">
      <a class="toolbaricon" id="logcontainer" href=""></a>
      <a class="toolbaricon" id="cartcontainer" href=""></a>
      <?php include('includes/documentparts/cartbox.php'); ?>
    </div>
    <div class="menuscontainer">
      <?php include("includes/documentparts/menus.php"); ?>
    </div>
  </nav>
</header>
<script>
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  var logboxparent=this.getChild().getNextChild({name: "labels"}).getNextChild({name:"middle"}).getNextChild({name:"logbox"}).getRelationship({name:"domelements"});
  logboxparent.refreshView(document.getElementById("logcontainer"), "templates/logicon.php");
  var cartboxtt=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"cartbox"}).getNextChild({name: "crtbxtt"}).getRelationship({name: "domelementsdata"}).getChild();
  cartboxtt.refreshView(document.querySelector("#cartcontainer"), "templates/carticon.php");
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

