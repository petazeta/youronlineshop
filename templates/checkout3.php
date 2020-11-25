<!--
-->
<div style="text-align:center">
  <template>
    <div class="msgbox" style="position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <span></span>
      <script>
        var title=thisNode.getNextChild({"name":"chkt3add"}).getRelationship({name:"domelementsdata"}).getChild();
        title.writeProperty(thisElement);
        //adding the edition pencil
        if (webuser.isWebAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          title.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
        }
      </script>
    </div>
    <div></div>
    <script>
      //We show the shipping types available
      (new Node()).refreshView(thisElement, "templates/shippinglist.php");
    </script>
    <div class="dashbuttons">
      <div style="position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <button type="button" class="btn" data-id="but"></button>
        <script>
          var myNode=thisNode.getNextChild({"name":"chkt3next"}).getRelationship({name:"domelementsdata"}).getChild();
          myNode.writeProperty(thisElement);
          thisElement.onclick=function(){
            //we save the selected shipping type main characterisitics at ordershippingtypes table. add myself or add my tree
            var ordershippingtype=webuser.getRelationship({name:"orders"}).getChild().getRelationship({name:"ordershippingtypes"}).getChild();
            ordershippingtype.loadfromhttp({action: "add myself"}).then(function(){
            //We have added the ordershippingtype to the order
              (new Node()).refreshView(document.getElementById("centralcontent"),"templates/checkout4.php");
            });
            return false;
          };
        </script>
        <input type="hidden" disabled>
        <script>
          var myNode=thisNode.getNextChild({"name":"chkt3next"}).getRelationship({name:"domelementsdata"}).getChild();
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
  if (Config.chkt3_On==false) {
    (new Node()).refreshView(document.getElementById("centralcontent"),"templates/checkout4.php");
  }
  else {
    checkout.refreshView(thisElement,thisElement.firstElementChild);
  }
</script>