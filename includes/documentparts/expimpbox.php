<template>
  <div class="space"></div>
  <span data-note="relative position container for admn buttons">
    <div data-id="butedit" class="btmiddleright"></div>
    <a href="javascript:" class="minibtn"></a>
    <script>
      var expTxt=thisNode.getRelationship("domelementsdata").getChild();
      expTxt.writeProperty(thisElement);
      //adding the edition pencil
      if (webuser.isWebAdmin()) {
        DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
        expTxt.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, refreshOnLog: true});
      }
      thisElement.onclick=function(){
        document.getElementById("centralcontent").innerHTML="";
        thisNode.appendThis(document.getElementById("centralcontent"), thisParams.template);
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
  if (webuser.isWebAdmin() || webuser.isSystemAdmin() || webuser.isUserAdmin() || webuser.isProductAdmin()) {
    document.querySelector("#expimp").innerHTML="";
    if (Config.importExportOn) {
      containerExpNode.appendThis(document.querySelector("#expimp"), document.querySelector("#expimp").previousElementSibling, {template: "templates/expimp.php"});
    }
    if ((webuser.isWebAdmin() || webuser.isSystemAdmin()) && Config.expimplang_On) {
      langContainerExpNode.appendThis(document.querySelector("#expimp"), document.querySelector("#expimp").previousElementSibling, {template: "templates/expimplang.php"});
    }
  }
  webuser.addEventListener("log",
    function() {
      document.querySelector("#expimp").innerHTML=""; //to remove the openbutton when logs after webadmin
      if (this.isAdmin()) {
        if (Config.importExportOn) {
          containerExpNode.appendThis(document.querySelector("#expimp"), document.querySelector("#expimp").previousElementSibling, {template: "templates/expimp.php"});
        }
        if (Config.expimplang_On) {
          langContainerExpNode.appendThis(document.querySelector("#expimp"), document.querySelector("#expimp").previousElementSibling, {template: "templates/expimplang.php"});
        }
      }
    },
    "expimpButton"
  );
});
</script>