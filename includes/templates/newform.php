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
	if (!checklength(thisElement.elements.user_name.value, 4, 8)) {
	  alert("User name between 4 and 8 characters!");
	  return false;
	}
	if (!checklength(thisElement.elements.user_password.value, 6, 10)) {
	  alert("Password between 6 and 10 characters!");
	  return false;
	}
	webuser.loginbutton="create";
	webuser.create(thisElement.elements.user_name.value, thisElement.elements.user_password.value, function(){
	  var myalertmsg="";
	  if (this.extra.error===true) {
	    if (this.extra.usernameok!=true) myalertmsg="username error";
	    else myalertmsg="password error";
	  }
	  else {
	    myalertmsg="User created. Loggin ok";
	  }
	  myalert.load({properties:{alertmsg: myalertmsg, timeout:2000}});
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