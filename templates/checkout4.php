<template>
  <template>
    <div class="msgbox">
      <span></span>
      <script>
        var title=thisNode.getNextChild({"name":"chkt4add"}).getRelationship({name:"domelementsdata"}).getChild();
        title.writeProperty(thisElement);
        //adding the edition pencil
        var launcher = new Node();
        launcher.thisNode = title;
        launcher.editElement = thisElement;
        launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
      </script>
    </div>
    <div></div>
    <script>
      //We show the payment types available
      (new Node()).refreshView(thisElement, "templates/paymentlist.php");
    </script>
    <div style="margin:auto; display:table;">
      <button class="btn"></button>
      <script>
        var buttonLabel=thisNode.getNextChild({"name":"chkt4next"}).getRelationship({name:"domelementsdata"}).getChild();
        buttonLabel.writeProperty(thisElement);
        var launcher = new Node();
        launcher.thisNode = buttonLabel;
        launcher.editElement = thisElement;
        launcher.createInput=true;
        launcher.visibility="visible";
        launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
        
        thisElement.onclick=function(){
          //we save the selected payment type main characterisitics at orderpaymenttypes table. add myself or add my tree
          var orderpaymenttype=webuser.getRelationship({name:"orders"}).getChild().getRelationship({name:"orderpaymenttypes"}).gitChild();
          orderpaymenttype.loadfromhttp({action: "add myself", user_id: webuser.properties.id}).then(function(){
          //We have added the orderpaymenttype to the order
            (new Node()).refreshView(document.getElementById("centralcontent"),"templates/checkout5.php");
          });
          return false;
        };
      </script>
    </div>
  </template>
  <div style="text-align:center"></div>
  <script>
    var checkout=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"checkout"});
    if (Config.chkt4_On==false) {
      (new Node()).refreshView(document.getElementById("centralcontent"),"templates/checkout5.php");
    }
    else {
      checkout.refreshView(thisElement,thisElement.previousElementSibling);
    }
  </script>
</template>
