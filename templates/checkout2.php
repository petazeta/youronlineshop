<template>
  <template>
    <div class="msgbox">
      <span></span>
      <script>
	var title=thisNode.getNextChild({"name":"chkt2add"}).getRelationship({name:"domelementsdata"}).getChild();
	title.writeProperty(thisElement);
	//adding the edition pencil
	var launcher = new Node();
	launcher.thisNode = title;
	launcher.editElement = thisElement;
	launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
      </script>
    </div>
    <form>
      <div></div>
      <script>
        webuser.formMode=true;
        webuser.refreshView(thisElement,"templates/useraddress.php");
      </script>
      <div style="margin:auto; display:table;">
        <input type="submit" class="btn" value="" style="font-size:medium;">
        <script>
          var buttonLabel=thisNode.getNextChild({"name":"chkt2next"}).getRelationship({name:"domelementsdata"}).getChild();
          buttonLabel.writeProperty(thisElement);
          var launcher = new Node();
          launcher.thisNode = buttonLabel;
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
          if (Config.chktaddressOn) {
            webuser.getRelationship("addresses").getChild().loadfromhttp({action:"edit my properties", user_id: webuser.properties.id, properties: webuser.addressdata.properties}, function(){
              for (var i=0; i<webuser.getRelationship("addresses").childtablekeys.length; i++) {
                var propname=webuser.getRelationship("addresses").childtablekeys[i];
                if (propname=="id") continue;
                webuser.getRelationship("addresses").getChild().properties[propname]=webuser.addressdata.properties[propname];
              }
            });
          }
        });
        (new Node()).refreshView(document.getElementById("centralcontent"),"templates/checkout3.php");
        return false;
      };
    </script>
  </template>
  <div style="text-align:center"></div>
  <script>
    var checkout=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"checkout"});
    if (Config.chkt2_On==false) {
      (new Node()).refreshView(document.getElementById("centralcontent"),"templates/checkout3.php");
    }
    else {
      checkout.refreshView(thisElement,thisElement.previousElementSibling);
    }
  </script>
</template>
