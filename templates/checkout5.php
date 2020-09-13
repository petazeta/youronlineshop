<template>
  <!-- we show order made and give the option to go to the user area-->
  <template>
    <div class="msgbox">
      <span></span>
      <script>
        var title=thisNode.getNextChild({"name":"chkt5add"}).getRelationship({name:"domelementsdata"}).getChild();
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
      //We show the order
      webuser.getRelationship({name:"orders"}).getChild().refreshView(thisElement, "templates/order.php");
    </script>
    <div style="margin:1em auto; display:table;">
      <button class="btn"></button>
      <script>
        var bckloginlabel=thisNode.getNextChild({"name":"chkt4userarea"}).getRelationship({name:"domelementsdata"}).getChild();
        bckloginlabel.writeProperty(thisElement);
        //adding the edition pencil
        var launcher = new Node();
        launcher.thisNode = bckloginlabel;
        launcher.editElement = thisElement;
        launcher.createInput = true;
        launcher.visibility="visible";
        launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
        thisElement.onclick=function(){
          webuser.refreshView(document.getElementById("centralcontent"), "templates/loggedindata.php");
        };
      </script>
    </div>
    <form>
      <div style="display:table;">
        <input type="hidden" name="customsubject">
        <script>
          var myNode=thisNode.getNextChild({name:"mails"}).getNextChild({name:"newordercustomer"}).getNextChild({name:"subject"}).getRelationship("domelementsdata").getChild();
          myNode.writeProperty(thisElement, null, "value");
          var launcher = new Node();
          launcher.thisNode = myNode;
          launcher.editElement = thisElement;
          launcher.thisAttribute = "value";
          launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
          if (webuser.isWebAdmin() || webuser.isSystemAdmin()) thisElement.type="input";
        </script>
      </div>
      <div style="display:table;">
        <textarea name="custommessage" style="visibility:hidden;"></textarea>
        <script>
          var myNode=thisNode.getNextChild({name:"mails"}).getNextChild({name:"newordercustomer"}).getNextChild({name:"message"}).getRelationship("domelementsdata").getChild();
          myNode.writeProperty(thisElement, null, "value");
          var launcher = new Node();
          launcher.thisNode = myNode;
          launcher.editElement = thisElement;
          launcher.thisAttribute = "value";
          launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
          if (webuser.isWebAdmin() || webuser.isSystemAdmin()) thisElement.style.visibility="visible";
        </script>
      </div>
      <div style="display:table;">
        <input type="hidden" name="adminsubject">
        <script>
          var myNode=thisNode.getNextChild({name:"mails"}).getNextChild({name:"neworderadmin"}).getNextChild({name:"subject"}).getRelationship("domelementsdata").getChild();
          myNode.writeProperty(thisElement, null, "value");
          var launcher = new Node();
          launcher.thisNode = myNode;
          launcher.editElement = thisElement;
          launcher.thisAttribute = "value";
          launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
          if (webuser.isWebAdmin() || webuser.isSystemAdmin()) thisElement.type="input";
        </script>
      </div>
      <div style="display:table;">
        <textarea name="adminmessage" style="visibility:hidden;"></textarea>
        <script>
          var myNode=thisNode.getNextChild({name:"mails"}).getNextChild({name:"neworderadmin"}).getNextChild({name:"message"}).getRelationship("domelementsdata").getChild();
          myNode.writeProperty(thisElement, null, "value");
          var launcher = new Node();
          launcher.thisNode = myNode;
          launcher.editElement = thisElement;
          launcher.thisAttribute = "value";
          launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
          if (webuser.isWebAdmin() || webuser.isSystemAdmin()) thisElement.style.visibility="visible";
        </script>
      </div>
    </form>
    <script>
      //We send notifications:
      if (Config.newordermailcustomer_On) {
        var mailuser = new user();
        mailuser.sendmail(webuser.properties.username, thisElement.elements.customsubject, thisElement.elements.custommessage, 'USER_ORDERSADMIN');
      }
      //We send notifications:
      if (Config.newordermailadmin_On) {
        var mailuser = new user();
        mailuser.sendmail('USER_ORDERSADMIN', thisElement.elements.customsubject, thisElement.elements.custommessage, webuser.properties.username);
      }
    </script>
  </template>
  <div style="text-align:center"></div>
  <script>
    var checkout=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"checkout"});
    checkout.refreshView(thisElement,thisElement.previousElementSibling);
  </script>
</template>
