<div class="boxlist" style="text-align:center;">
  <span style="z-index:1; position:relative;">
    <div data-id="admnbuts" class="btmiddleright">
      <div class="admnbtsgrid"></div>
    </div>
    <div data-id="butedit" class="btmiddleleft"></div>
    <a href="" data-hbutton="true"></a>
    <script>
      if (thisNode.selected) DomMethods.setActive(thisNode); //restablish the active status after clonning parent rel and when refreshing setSelected
      thisNode.writeProperty(thisElement, "code");
      if (webuser.isWebAdmin()) {
        DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
        thisNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, refreshOnLog: true});
      }
      if (Config.languagesOn==true) {
        if (webuser.isWebAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=admnbuts]'), parent: thisElement.parentElement});
          thisNode.appendThis(thisElement.parentElement.querySelector('.admnbtsgrid'), "templates/butchpos.php", {position: 'vertical'});
          if (thisNode.parentNode.children.length>1) thisNode.appendThis(thisElement.parentElement.querySelector('.admnbtsgrid'), "templates/butdelete.php");
          thisNode.parentNode.getNewNode().then((newNode) => {
            newNode.sort_order=thisNode.sort_order + 1;
            thisNode.parentNode.appendThis(thisElement.parentElement.querySelector('.admnbtsgrid'), "templates/butaddnewnode.php", {newNode: newNode});
          });
        }
        thisElement.addEventListener("click", function(event) {
          event.preventDefault();
          DomMethods.setActive(thisNode);
          webuser.extra.language=thisNode;
          myalert.properties.alertmsg=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"langbox"}).getNextChild({"name":"changelangwait"}).getRelationship("domelementsdata").getChild().properties.value;
          myalert.showalert();
          loadLabels().then(function(){ 
            domelementsrootmother.dispatchEvent("changeLanguage");
            myalert.properties.timeout=3000;
            myalert.hidealert();
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