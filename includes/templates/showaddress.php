<template>
  <div style="padding-bottom: 1em">
    <div class="msgbox">Address</div>
  </div>
  <div data-js='
    webuser.refreshView(thisElement,"includes/templates/useraddress.php");
  '>
  </div>
  <div style="width:100%; text-align:center; padding-bottom: 1em;">
    <a href="" class="btn" data-js='
      thisElement.onclick=function(){
	webuser.refreshView(document.getElementById("centralcontent"), "includes/templates/loggedindata.php");
	return false;
      }
    '>Go back to login page</a>
  </div>
</template>