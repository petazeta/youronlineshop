<template>
  <div style="margin:auto; display:table">
    <div class="msgbox"></div>
    <script>
      var addresstt=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"addresstt"});
      addresstt.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
      //adding the edition pencil
      var launcher = new Node();
      launcher.thisNode = addresstt.getRelationship("domelementsdata").getChild();
      launcher.editElement = thisElement;
      launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
    </script>
  </div>
  <form>
    <div style="text-align:center;"></div>
    <script>
      webuser.formMode=true;
      webuser.refreshView(thisElement,"templates/useraddress.php");
    </script>
    <div style="padding-bottom: 1rem; display:table; margin: auto;">
      <input type="submit" class="btn" value="" style="font-size:medium;">
      <script>
        var savelabel=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"not located"}).getNextChild({name:"save"});
        savelabel.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
        //adding the edition pencil
        var launcher = new Node();
        launcher.thisNode =savelabel.getRelationship("domelementsdata").getChild();
        launcher.editElement = thisElement;
        launcher.createInput=true;
        launcher.visibility="visible";
        launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
      </script>
    </div>
  </form>
  <script>
    thisElement.onsubmit=function() {
      if (!webuser.checkValidData(thisElement)) {
        return false;
      }
      //Now we save the data: save tree
      webuser.getRelationship("usersdata").getChild().loadfromhttp({action:"edit my properties", user_id: webuser.properties.id, properties: webuser.userdata.properties}, function(){
        for (var i=0; i<webuser.getRelationship("usersdata").childtablekeys.length; i++) {
          var propname=webuser.getRelationship("usersdata").childtablekeys[i];
          if (propname=="id") continue;
          webuser.getRelationship("usersdata").getChild().properties[propname]=webuser.userdata.properties[propname];
        }
        webuser.getRelationship("addresses").getChild().loadfromhttp({action:"edit my properties", user_id: webuser.properties.id, properties: webuser.addressdata.properties}, function(){
          for (var i=0; i<webuser.getRelationship("addresses").childtablekeys.length; i++) {
            var propname=webuser.getRelationship("addresses").childtablekeys[i];
            if (propname=="id") continue;
            webuser.getRelationship("addresses").getChild().properties[propname]=webuser.addressdata.properties[propname];
          }
          var savedlabel=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"not located"}).getNextChild({name:"saved"});
          myalert.properties.alertmsg=savedlabel.getRelationship("domelementsdata").getChild().properties.value;
          myalert.properties.timeout=3000;
          myalert.showalert();
        });
      });
      return false;
    };
  </script>
  
  <div style="margin:auto; display:table;">
    <button class="btn"></button>
    <script>
      var bckloginlabel=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"backToLoginLb"});
      bckloginlabel.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
      //adding the edition pencil
      var launcher = new Node();
      launcher.thisNode = bckloginlabel.getRelationship("domelementsdata").getChild();
      launcher.editElement = thisElement;
      launcher.createInput=true;
      launcher.visibility="visible";
      launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
      thisElement.onclick=function(){
	(new Node()).refreshView(document.getElementById("centralcontent"), "templates/loggedindata.php");
      }
    </script>
  </div>
</template>