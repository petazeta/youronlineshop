<template>
  <div class="space"></div>
  <span style="position:relative;">
    <div data-id="butedit" class="btmiddleleft"></div>
    <a href="javascript:" class="minibtn"></a>
    <script>
      var extraTxt=thisNode.getRelationship("domelementsdata").getChild();
      extraTxt.writeProperty(thisElement);
      //adding the edition pencil
      if (webuser.isWebAdmin()) {
        DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
        extraTxt.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
      }
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