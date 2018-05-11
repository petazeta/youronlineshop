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
      myalert.properties.timeout=2000;
      var minchar=5;
      function checkInput(data) {
	for (var key in data.properties) {
	  if (!data.properties[key] ||
	  (typeof data.properties[key]=="string" && data.properties[key].length < minchar)) {
	    result.extra.error=true;
	    result.extra.errorkey=key;
	    result.extra.errormsg="Error: Not enought characters at " + result.extra.errorkey;
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