<template>
  <template>
    <div class="msgbox"></div>
    <script>
      thisNode.getNextChild({"name":"chkt2add"}).getRelationship({name:"domelementsdata"}).getChild().appendProperty(thisElement);
    </script>
    <div></div>
    <script>
      webuser.refreshView(thisElement,"includes/templates/useraddress.php");
    </script>
    <div style="width:100%; text-align:center;">
    <button class="btn"></button>
    <script>
      thisNode.getNextChild({"name":"chkt2next"}).getRelationship({name:"domelementsdata"}).getChild().appendProperty(thisElement);
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
	    (!checklength(value, minchar, maxchar))) {
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
	  if (!validateEmail(userdata.properties.email)) {
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
	myalert.properties.alertmsg="Order done";
	myalert.showalert();
	webuser.refreshView(document.getElementById("centralcontent"), "includes/templates/loggedindata.php");
	return false;
      };
    </script>
  </template>
  <div></div>
  <script>
    var checkout=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"checkout"});
    checkout.refreshView(thisElement,thisElement.previousElementSibling);
  </script>
</template>