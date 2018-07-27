<div id="logcontainer"></div>
<script>
var mycart=new cart();
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  var logboxparent=this.getChild().getNextChild({name: "labels"}).getNextChild({name:"middle"}).getNextChild({name:"logbox"}).getRelationship({name:"domelements"});
  logboxparent.refreshView(document.getElementById("logcontainer"), "includes/templates/logbox.php");
});
webuser.addEventListener("log", function(){
  if (!this.properties.id) {
    (new Node()).refreshView(document.getElementById("centralcontent"), "includes/templates/loginform.php");
  }
  else {
    this.refreshView(document.getElementById("centralcontent"),  "includes/templates/loggedindata.php");
  }
});
</script>
