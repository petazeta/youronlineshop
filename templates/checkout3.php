<template>
  <template>
    <div class="msgbox">
      <span></span>
      <script>
        var title=thisNode.getNextChild({"name":"chkt3add"}).getRelationship({name:"domelementsdata"}).getChild();
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
      //We show the shipping types available
      (new Node()).refreshView(thisElement, "templates/shippinglist.php");
    </script>
    <div style="margin:auto; display:table;">
      <button class="btn"></button>
      <script>
        var buttonLabel=thisNode.getNextChild({"name":"chkt3next"}).getRelationship({name:"domelementsdata"}).getChild();
        buttonLabel.writeProperty(thisElement);
        var launcher = new Node();
        launcher.thisNode = buttonLabel;
        launcher.editElement = thisElement;
        launcher.createInput=true;
        launcher.visibility="visible";
        launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
        
        thisElement.onclick=function(){
          //we save the selected shipping type main characterisitics at ordershippingtypes table. add myself or add my tree
          var ordershippingtype=webuser.getRelationship({name:"orders"}).children[0].getRelationship({name:"ordershippingtypes"}).children[0];
          ordershippingtype.loadfromhttp({action: "add myself", user_id: webuser.properties.id}, function(){
          //We have added the ordershippingtype to the order
            (new Node()).refreshView(document.getElementById("centralcontent"),"templates/checkout4.php");
          });
          return false;
        };
      </script>
    </div>
  </template>
  <div style="text-align:center"></div>
  <script>
    var checkout=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"checkout"});
    if (Config.chkt3_On==false) {
      (new Node()).refreshView(document.getElementById("centralcontent"),"templates/checkout4.php");
    }
    else {
      checkout.refreshView(thisElement,thisElement.previousElementSibling);
    }
  </script>
</template>
