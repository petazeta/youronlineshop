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
  <a href="" class="btn">Go to log in page</a>
  <script>
    thisElement.onclick=function(){
      webuser.refreshView(document.getElementById("centralcontent"), "includes/templates/loggedindata.php");
      return false;
    };
  </script>
</template>