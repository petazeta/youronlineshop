<template>
  <div style="padding-bottom: 1rem">
    <div class="msgbox">
      Insert the required data to create new user.
    </div>
  </div>
  <div>
    <form action="dblogin.php">
      <table class="formtable" style="box-shadow: 0px 3px 6px rgb(136, 136, 136);">
        <tr>
          <td>
	    <div class="form-group">
	      <label class="form-label">User-Name</label>
	      <input class="form-control" placeholder="your-user-name" name="user_name">
	    </div>
          </td>
        </tr>
        <tr>
          <td>
	    <div class="form-group">
	      <label class="form-label">Password</label>
	      <input type="password" class="form-control" placeholder="password" name="user_password">
	    </div>
          </td>
        </tr>
        <tr>
          <td style="text-align:center">
	    <div style="padding-bottom: 1rem">
	      <input type="hidden" name="parameters" value='{"action":"create"}'>
	      <input type="submit" class="form-btn" value="Create">
            </div>
          </td>
        </tr>
      </table>
    </form>
    <script>
      thisElement.onsubmit=function() {
	myalert.properties.timeout=5000;
	var min=4, max=15;
	if (!checklength(thisElement.elements.user_name.value, min, max)) {
	  alert("User name between " + min + " and " + max + " characters!");
	  return false;
	}
	if (!checklength(thisElement.elements.user_password.value, min, max)) {
	  alert("Password between " + min + " and " + max + " characters!");
	  return false;
	}
	webuser.create(thisElement.elements.user_name.value, thisElement.elements.user_password.value, null, function(){
	  if (this.extra && this.extra.error) {
	    myalert.properties.alertmsg=this.extra.errormsg;
	    myalert.showalert();
	    return false;
	  }
	  myalert.load({properties:{alertmsg: "User created. Login ok", timeout:3000}});
	  myalert.showalert();
	});
	return false;
      }
    </script>
    <div style="text-align:center;">
      <a href="" class="btn" data-js='
	  thisElement.onclick=function(){
	    webuser.refreshView(document.getElementById("centralcontent"), "includes/templates/loginform.php");
	    return false;
	  }
      '>Back to log in</a>
    </div>
  </div>
</template>