<template>
  <div class="space"></div>
  <span data-note="relative position container for admn buttons">
    <a href="javascript:" class="minibtn"></a>
    <script>
      var formatTxt=thisNode.getRelationship("domelementsdata").getChild();
      formatTxt.writeProperty(thisElement);
      //adding the edition pencil
      var launcher = new Node();
      launcher.thisNode = formatTxt;
      launcher.editElement = thisElement;
      launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
        
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