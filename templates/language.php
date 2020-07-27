<template>
  <div class="boxlist" style="text-align:center;">
    <span style="z-index:1">
      <a href="" data-hbutton="true"></a>
      <script>
        if (thisNode.selected) DomMethods.setActive(thisNode); //restablish the active status after clonning parent rel and when refreshing setSelected
        thisNode.writeProperty(thisElement, "code");
        var launcher = new Node();
        launcher.thisNode = thisNode;
        launcher.editElement = thisElement;
        launcher.btposition="btmiddleleft";
        if (webuser.isSystemAdmin()) launcher.editable=true;
        launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
        var admnlauncher=new Node();
        admnlauncher.thisNode=thisNode;
        admnlauncher.editElement = thisElement;
        admnlauncher.btposition="btmiddleright";
        admnlauncher.elementsListPos="vertical";
        admnlauncher.newNode=thisNode.parentNode.newNode.cloneNode(0, null); // we duplicate it so newNode can be reused
        admnlauncher.newNode.loadasc(thisNode, 2, "id"); //the parent is not the same
        admnlauncher.newNode.sort_order=thisNode.sort_order + 1;
        if (thisNode.parentNode.children.length==1) admnlauncher.excludeButtons=["templates/butdelete.php"];
        if (webuser.isSystemAdmin()) admnlauncher.editable=true;
        
        if (Config.languagesOn==true) {
          admnlauncher.appendThis(thisElement.parentElement, "templates/addadmnbuts.php");
          thisElement.addEventListener("click", function(event) {
            event.preventDefault();
            DomMethods.setActive(thisNode);
            webuser.extra.language=thisNode;
            loadLabels(function(){ 
              domelementsrootmother.dispatchEvent("changeLanguage");
            });
            return false;
          });
        }
        else {
          thisElement.addEventListener("click", function(event) {
            event.preventDefault();
          });
        }
      </script>
    </span>
  </div>
</template>