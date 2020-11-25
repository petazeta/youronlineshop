<!--
-->
<div class="centerelements">
  <template>
    <div class="msgbox" style="position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <span></span>
      <script>
        var title=thisNode.getNextChild({"name":"chkt4add"}).getRelationship({name:"domelementsdata"}).getChild();
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
      //We show the payment types available
      (new Node()).refreshView(thisElement, "templates/paymentlist.php");
    </script>
    <div class="dashbuttons">
      <div style="position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <button type="button" class="btn" data-id="but"></button>
        <script>
          var buttonLabel=thisNode.getNextChild({"name":"chkt4next"}).getRelationship({name:"domelementsdata"}).getChild();
          buttonLabel.writeProperty(thisElement);
          thisElement.onclick=function(){
            //we save the selected payment type main characterisitics at orderpaymenttypes table. add myself or add my tree
            let orderpaymenttype=webuser.getRelationship({name:"orders"}).getChild().getRelationship({name:"orderpaymenttypes"}).getChild();
            //orderpaymenttype is different from peymenttypes
            let detailsobj={template: orderpaymenttype.properties.template, vars: JSON.parse(orderpaymenttype.properties.vars)};
            orderpaymenttype.properties.details=JSON.stringify(detailsobj);
            orderpaymenttype.loadfromhttp({action: "add myself"}).then(function(){
            //We have added the orderpaymenttype to the order
              (new Node()).refreshView(document.getElementById("centralcontent"),"templates/checkout5.php");
            });
            return false;
          };
        </script>
        <input type="hidden" disabled>
        <script>
          var myNode=thisNode.getNextChild({"name":"chkt4next"}).getRelationship({name:"domelementsdata"}).getChild();
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
  if (Config.chkt4_On==false) {
    (new Node()).refreshView(document.getElementById("centralcontent"),"templates/checkout5.php");
  }
  else {
    checkout.refreshView(thisElement,thisElement.firstElementChild);
  }
</script>