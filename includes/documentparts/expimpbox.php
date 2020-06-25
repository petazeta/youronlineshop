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
        thisNode.appendThis(document.getElementById("centralcontent"),"templates/expimplang.php");
        return false;
      }
    </script>
  </span>
</template>
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
  var containerExpNode=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name: "expimp"});
  var langContainerExpNode=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name: "expimplang"});
  var expTemplate=document.querySelector("#expimp").previousElementSibling;
  var langExpTemplate=expTemplate.previousElementSibling;
  var containerExp=document.querySelector("#expimp");
  if (webuser.isWebAdmin() || webuser.isUserAdmin() || webuser.isProductAdmin()) {
    containerExp.innerHTML="";
    if (Config.importExportOn) {
      containerExpNode.appendThis(document.querySelector("#expimp"), expTemplate);
    }
    if (Config.expimplang_On) {
      langContainerExpNode.appendThis(document.querySelector("#expimp"), langExpTemplate);
    }
  }
  webuser.addEventListener("log",
    function() {
      if (!this.isWebAdmin() && !webuser.isUserAdmin() && !webuser.isProductAdmin()) {
        //to remove the openbutton when logs after webadmin
        containerExp.innerHTML="";
      }
      else {
        containerExp.innerHTML="";
        if (Config.importExportOn) {
          containerExpNode.appendThis(document.querySelector("#expimp"), expTemplate);
        }
        if (Config.expimplang_On) {
          langContainerExpNode.appendThis(document.querySelector("#expimp"), langExpTemplate);
        }
      }
    },
    "expimpButton"
  );
});
</script>