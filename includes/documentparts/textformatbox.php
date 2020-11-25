<template>
  <div class="space"></div>
  <span style="position:relative">
    <div data-id="butedit" class="btmiddleleft"></div>
    <a href="javascript:" class="minibtn"></a>
    <script>
      var formatTxt=thisNode.getRelationship("domelementsdata").getChild();
      formatTxt.writeProperty(thisElement);
      //adding the edition pencil
      if (webuser.isWebAdmin()) {
        DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
        formatTxt.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
      }
      thisElement.onclick=function(){
        document.getElementById("centralcontent").innerHTML="";
        thisNode.appendThis(document.getElementById("centralcontent"), "templates/texteditor.php");
        return false;
      }
    </script>
  </span>
</template>
<div id="textedit" style="text-align:center;"></div>
<script>
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  //We add the currency symbol editor and text edition facility
  function showTextEdit(){
    var containerEditNode=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name: "textEdit"});
    var containerEdit=document.querySelector("#textedit");
    containerEditNode.refreshView(containerEdit, containerEdit.previousElementSibling);
  }
  if (webuser.isWebAdmin() || webuser.isProductAdmin()) {
    showTextEdit();
  }
  webuser.addEventListener("log",
    function() {
      if (!this.isWebAdmin() && !this.isProductAdmin()) {
        //to remove the openbutton when logs after webadmin
        var containerEdit=document.querySelector("#textedit");
        containerEdit.innerHTML="";
      }
      else {
        showTextEdit();
      }
    },
    "texteditButton"
  );
});
</script>