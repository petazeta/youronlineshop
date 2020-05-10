<template>
  <div class="space"></div>
  <span data-note="relative position container for admn buttons">
    <a href="javascript:" class="minibtn"></a>
    <script>
      var extraTxt=thisNode.getRelationship("domelementsdata").getChild();
      extraTxt.writeProperty(thisElement);
      //adding the edition pencil
      var launcher = new Node();
      launcher.thisNode = extraTxt;
      launcher.editElement = thisElement;
      launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
        
      thisElement.onclick=function(){
        document.getElementById("centralcontent").innerHTML="";
        (new Node()).appendThis(document.getElementById("centralcontent"), "templates/extraedition.php");
        return false;
      }
    </script>
  </span>
</template>
<div id="extraedition" style="text-align:center;"></div>
<script>
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  //We add the currency symbol editor and extra pages
  function showExtraEdition(){
    var containerExtraNode=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name: "extraEdition"});
    var containerExtra=document.querySelector("#extraedition");
    containerExtraNode.refreshView(containerExtra, containerExtra.previousElementSibling);
  }
  if (webuser.isWebAdmin()) {
    showExtraEdition();
  }
  webuser.addEventListener("log",
    function() {
      if (!this.isWebAdmin()) {
        //to remove the openbutton when logs after webadmin
        var containerExtra=document.querySelector("#extraedition");
        containerExtra.innerHTML="";
      }
      else {
        showExtraEdition();
      }
    },
    "extraButton"
  );
});
</script>