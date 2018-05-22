<template>
  <div style="padding-bottom: 1em">
    <div class="msgbox">Address</div>
  </div>
  <div></div>
  <script>
    webuser.refreshView(thisElement,"includes/templates/useraddress.php");
  </script>
  <div style="width:100%; text-align:center; padding-bottom: 1em;">
    <a href="" class="btn">Go back to login page</a>
    <script>
      thisElement.onclick=function(){
	webuser.refreshView(document.getElementById("centralcontent"), "includes/templates/loggedindata.php");
	return false;
      }
    </script>
  </div>
</template>