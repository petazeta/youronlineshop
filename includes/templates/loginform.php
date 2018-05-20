<template>
  <div style="padding-bottom: 1rem">
    <div class="msgbox"></div>
    <script>
      thisElement.textContent=labelsRoot.getNextChild({"name":"middle"}).getNextChild({"name":"lgintt"}).properties.innerHTML;
    </script>
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
	      <input type="hidden" name="parameters" value='{"action":"login"}'>
	      <input type="submit" class="form-btn" value="Log in">
	    </div>
	  </td>
	</tr>
      </table>
    </form>
    <script>
      thisElement.onsubmit=function() {
	var min=4, max=15;
	if (!checklength(thisElement.elements.user_name.value, min, max)) {
	  alert("User name between " + min + " and " + max + " characters!");
	  return false;
	}
	if (!checklength(thisElement.elements.user_password.value, min, max)) {
	  alert("Password between " + min + " and " + max + " characters!");
	  return false;
	}
	webuser.login(thisElement.elements.user_name.value, thisElement.elements.user_password.value, function(){
	  if (this.extra.error) {
	    myalert.load({properties:{alertmsg: this.extra.errormsg, timeout:3000}});
	    myalert.showalert();
	    return false;
	  }
	  myalert.load({properties:{alertmsg: "Login ok", timeout:3000}});
	  myalert.showalert();
	});
	return false;
      }
    </script>
    <div style="text-align:center;">
      <a href="" class="btn">Create a new user</a>
      <script>
	thisElement.onclick=function(){
	  webuser.refreshView(document.getElementById("centralcontent"), "includes/templates/newform.php");
	  return false;
	}
      </script>
    </div>

  </div>
</template>