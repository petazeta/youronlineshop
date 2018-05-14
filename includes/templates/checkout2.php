<template>
  <div class="msgbox">
    Just one last thing.<br>Check if your address is ok, change it or fill it.
    <br>Use street field to write also street number and so on.<br>pc is postal code.
  </div>
  <div data-js='
    webuser.refreshView(thisElement,"includes/templates/useraddress.php");
  '>
  </div>
  <div style="width:100%; text-align:center;">
  <a href="" class="btn">Finish Order</a>
  <script>
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