<!-- we show order made and give the option to go to the user area-->
<div class="centerelements">
  <template>
    <div class="msgbox" style="position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <span></span>
      <script>
        var title=thisNode.getNextChild({"name":"chkt5add"}).getRelationship({name:"domelementsdata"}).getChild();
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
      //We show the order
      webuser.getRelationship({name:"orders"}).getChild().refreshView(thisElement, "templates/order.php");
    </script>
    <div class="dashbuttons">
      <div style="position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <button type="button" class="btn" data-id="but"></button>
        <script>
          var bckloginlabel=thisNode.getNextChild({"name":"chkt4userarea"}).getRelationship({name:"domelementsdata"}).getChild();
          bckloginlabel.writeProperty(thisElement);
          thisElement.onclick=function(){
            webuser.refreshView(document.getElementById("centralcontent"), "templates/loggedindata.php");
          };
        </script>
        <input type="hidden" disabled="true">
        <script>
          var myNode=thisNode.getNextChild({"name":"chkt4userarea"}).getRelationship({name:"domelementsdata"}).getChild();
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
    <div>
      <div style="display:table; position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <input type="hidden" name="customsubject" disabled="true">
        <script>
          var myNode=thisNode.getNextChild({name:"mails"}).getNextChild({name:"newordercustomer"}).getNextChild({name:"subject"}).getRelationship("domelementsdata").getChild();
          myNode.writeProperty(thisElement);
          //adding the edition pencil
          if (webuser.isWebAdmin() || webuser.isSystemAdmin()) {
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
            myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
            thisElement.type="text";
          }
        </script>
      </div>
      <div style="display:table; position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <textarea name="custommessage" style="visibility:hidden;" disabled="true"></textarea>
        <script>
          var myNode=thisNode.getNextChild({name:"mails"}).getNextChild({name:"newordercustomer"}).getNextChild({name:"message"}).getRelationship("domelementsdata").getChild();
          myNode.writeProperty(thisElement);
          //adding the edition pencil
          if (webuser.isWebAdmin() || webuser.isSystemAdmin()) {
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
            myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
            thisElement.style.visibility="visible"
          }
        </script>
      </div>
      <div style="display:table; position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <input type="hidden" name="adminsubject" disabled="true">
        <script>
          var myNode=thisNode.getNextChild({name:"mails"}).getNextChild({name:"neworderadmin"}).getNextChild({name:"subject"}).getRelationship("domelementsdata").getChild();
          myNode.writeProperty(thisElement);
          //adding the edition pencil
          if (webuser.isWebAdmin() || webuser.isSystemAdmin()) {
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
            myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
            thisElement.type="text";
          }
        </script>
      </div>
      <div style="display:table; position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <textarea name="adminmessage" style="visibility:hidden;" disabled="true"></textarea>
        <script>
          var myNode=thisNode.getNextChild({name:"mails"}).getNextChild({name:"neworderadmin"}).getNextChild({name:"message"}).getRelationship("domelementsdata").getChild();
          myNode.writeProperty(thisElement);
          //adding the edition pencil
          if (webuser.isWebAdmin() || webuser.isSystemAdmin()) {
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
            myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
            thisElement.style.visibility="visible"
          }
        </script>
      </div>
    </div>
    <script>
      //We send notifications:
      if (Config.newordermailcustomer_On) {
        var mailuser = new user();
        mailuser.sendmail(webuser.properties.username, thisElement.querySelector("[name=customsubject]").value, thisElement.querySelector("[name=custommessage]").value, 'USER_ORDERSADMIN');
      }
      //We send notifications:
      if (Config.newordermailadmin_On) {
        var mailuser = new user();
        mailuser.sendmail('USER_ORDERSADMIN', thisElement.querySelector("[name=adminsubject]").value, thisElement.querySelector("[name=adminmessage]").value, webuser.properties.username);
      }
    </script>
  </template>
</div>
<script>
  var checkout=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"checkout"});
  checkout.refreshView(thisElement,thisElement.firstElementChild);
</script>