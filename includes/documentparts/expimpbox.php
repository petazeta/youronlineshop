<template>
  <div class="space"></div>
  <span data-note="relative position container for admn buttons">
    <a href="javascript:" class="minibtn"></a>
    <script>
      var expTxt=thisNode.getRelationship("domelementsdata").getChild();
      expTxt.writeProperty(thisElement);
      //adding the edition pencil
      var launcher = new Node();
      launcher.thisNode = expTxt;
      launcher.editElement = thisElement;
      launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");

      thisElement.onclick=function(){
        document.getElementById("centralcontent").innerHTML="";
        thisNode.appendThis(document.getElementById("centralcontent"),"templates/expimp.php");
        return false;
      }
    </script>
  </span>
</template>
<div id="expimp" style="text-align:center;"></div>
<script>
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  //We add the export facility
  function showExpImp(){
    if (Config.importExportOn==false) return;
    var containerExpNode=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name: "expimp"});
    var containerExp=document.querySelector("#expimp");
    containerExpNode.refreshView(containerExp, containerExp.previousElementSibling);
  }
  if (webuser.isWebAdmin() || webuser.isUserAdmin()) {
    showExpImp();
  }
  webuser.addEventListener("log",
    function() {
      if (!this.isWebAdmin() && !webuser.isUserAdmin()) {
        //to remove the openbutton when logs after webadmin
        var containerExp=document.querySelector("#expimp");
        containerExp.innerHTML="";
      }
      else {
        showExpImp();
      }
    },
    "expimpButton"
  );
});
</script>