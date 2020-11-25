<div class="userimage"></div>
<script>
  if (window.getComputedStyle(thisElement).backgroundImage) {
    DomMethods.setSizeFromStyle(thisElement);
  }
</script>
<div></div>
<script>
  var setlogstatus=function(){
    var logbox=thisNode.getChild({name:"logboxout"});
    if (webuser.properties.id) {
      logbox=thisNode.getChild({name:"logboxin"});
    }
    var myNode=logbox.getNextChild({name:"title"}).getRelationship({name: "domelementsdata"}).getChild();
    myNode.writeProperty(thisElement);
  }
  setlogstatus();
  webuser.addEventListener("log", function() {
    setlogstatus();
  }, "setlogstatus");
  thisElement.parentElement.addEventListener("click", function(event){
    event.preventDefault();
    if (webuser.properties.id) {
      webuser.refreshView(document.getElementById("centralcontent"), "templates/loggedindata.php")
    }
    else {
      (new Node()).refreshView(document.getElementById("centralcontent"), "templates/loginform.php");
    }
    return false;
  });
  //Continuar con lo que viene en logbox_old.php
</script>