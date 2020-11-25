<!--
-->
<div class="centerelements">
  <template>
    <div class="msgbox" style="position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <span></span>
      <script>
        var title=thisNode.getNextChild({"name":"chkt2add"}).getRelationship({name:"domelementsdata"}).getChild();
        title.writeProperty(thisElement);
        //adding the edition pencil
        if (webuser.isWebAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          title.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
        }
      </script>
    </div>
    <div id="useraddress"></div>
    <script>
      var myParams={fieldtype: 'input'};
      if (Config.chktaddressOn) myParams.showAddress=true;
      //webuser.refreshView(thisElement,"templates/userdata.php", params);
      webuser.refreshView(thisElement, "templates/useraddressview.php", myParams).then(()=> thisElement.querySelector('[data-id=save]').style.display='none');
    </script>
    <div class="dashbuttons">
      <div style="position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <button type="button" class="btn" data-id="but"></button>
        <script>
          var buttonLabel=thisNode.getNextChild({"name":"chkt2next"}).getRelationship({name:"domelementsdata"}).getChild();
          buttonLabel.writeProperty(thisElement);
          thisElement.addEventListener("click", function() {
            document.getElementById('useraddress').querySelector('button[type=submit]').click();
            if (webuser.saveError==false) (new Node()).refreshView(document.getElementById("centralcontent"),"templates/checkout3.php");
          });
        </script>
        <input type="hidden" disabled>
        <script>
          var myNode=thisNode.getNextChild({"name":"chkt2next"}).getRelationship({name:"domelementsdata"}).getChild();
          myNode.writeProperty(thisElement);
          thisElement.onblur=function(){
            thisElement.type="hidden";
            thisElement.parentElement.querySelector('button[data-id=but]').innerHTML=thisElement.value;
          }
          //adding the edition pencil
          if (webuser.isWebAdmin()) {
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
            myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
          }
        </script>
      </div>
    </div>
  </template>
</div>
<script>
  var checkout=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"checkout"});
  if (Config.chkt2_On==false) {
    (new Node()).refreshView(document.getElementById("centralcontent"),"templates/checkout3.php");
  }
  else {
    checkout.refreshView(thisElement,thisElement.firstElementChild);
  }
</script>