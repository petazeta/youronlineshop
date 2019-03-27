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
    <div></div>
    <script>
      webuser.refreshView(thisElement,"templates/useraddress.php");
    </script>
    <div style="margin:auto; display:table;">
      <button class="btn"></button>
      <script>
	var buttonLabel=thisNode.getNextChild({"name":"chkt2next"}).getRelationship({name:"domelementsdata"}).getChild();
	buttonLabel.writeProperty(thisElement);
	var launcher = new Node();
	launcher.thisNode = buttonLabel;
	launcher.editElement = thisElement;
	launcher.createInput=true;
	launcher.visibility="visible";
	launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
	  
	thisElement.onclick=function(){
	  var addressdata=webuser.getRelationship({"name":"addresses"}).children[0];
	  var userdata=webuser.getRelationship({"name":"usersdata"}).children[0];
	  var result=new NodeMale();
	  result.extra={};
	  myalert.properties.timeout=5000;
	  var minchar=3;
	  var maxchar=120;
	  function checkInput(data) {
	    for (var key in data.properties) {
	      var value=data.properties[key];
	      if(!data.properties.hasOwnProperty(key)) continue;
	      if (key=="id") continue;
	      if (!value ||
	      (!DomMethods.checklength(value, minchar, maxchar))) {
		result.extra.charsNum=0;
		result.extra.error=true;
		result.extra.errorkey=key;
		result.extra.errorvalue=value;
		result.extra.errormsg="Error: Not enought characters at " + result.extra.errorkey + ".";
		result.extra.errormsg += " Enter at least " + minchar + " characters.";
		break;
	      }
	    }
	  }
	  checkInput(userdata);
	  if (!result.extra.error) checkInput(addressdata);
	  if (!result.extra.error) {
	    if (!DomMethods.validateEmail(userdata.properties.email)) {
	      result.extra.error=true;
	      result.extra.errorkey="email";
	      result.extra.errormsg="Error: Email not correct";
	    }
	  }
	  if (result.extra.error) {
	    myalert.properties.alertmsg=result.extra.errormsg;
	    myalert.showalert();
	    return false;
	  }
	  thisNode.refreshView(document.getElementById("centralcontent"),"templates/checkout3.php");
	  return false;
	};
      </script>
    </div>
  </template>
  <div style="text-align:center"></div>
  <script>
    var checkout=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"checkout"});
    checkout.refreshView(thisElement,thisElement.previousElementSibling);
  </script>
</template>