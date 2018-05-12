<template>
  <div style="padding-bottom: 1rem">
    <div class="msgbox">
      <p>Would you like to start trying your own Store on Internet?</p>
      <p>Fill the following form, follow the instructions from the email that you will receive
      and enjoy a Store Web Site like this.</p>
    </div>
  </div>
  <div>
    <form action="dblogin.php" method="POST">
      <table class="formtable" style="box-shadow: 0px 3px 6px rgb(136, 136, 136);">
	<tr>
	  <td>
	    <div class="form-group">
	      <label class="form-label">Choose User-Name</label>
	      <input class="form-control" placeholder="user-name" name="user_name">
	    </div>
	  </td>
	</tr>
	<tr>
	  <td>
	    <div class="form-group">
	      <label class="form-label">Choose Password</label>
	      <input type="password" class="form-control" placeholder="password" name="user_password">
	    </div>
	  </td>
	</tr>
	<tr>
	  <td>
	    <div class="form-group">
	      <label class="form-label">Write your Email address</label>
	      <input class="form-control" placeholder="email" name="user_email">
	    </div>
	  </td>
	</tr>
	<tr>
	  <td style="text-align:center">
	    <div style="padding-bottom: 1rem">
	      <input type="hidden" name="parameters" value='{"action":"create"}'>
	      <input type="submit" class="form-btn" value="Send">
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
	if (!validateEmail(thisElement.elements.user_email.value)) {
	  alert("Email is not correct");
	  return false;
	}
	webuser.create(thisElement.elements.user_name.value, thisElement.elements.user_password.value, thisElement.elements.user_email.value, function(){
	  var myalertmsg="";
	  if (this.extra.error===true) {
	    if (this.extra.usernameok!=true) myalertmsg="username error";
	    else myalertmsg="password error";
	  }
	  else {
	    myalertmsg="User created. Login ok.";
	  }
	  myalert.load({properties:{alertmsg: myalertmsg, timeout:3000}});
	  myalert.showalert();
	  //We must copy database structure maybe copy tables //maybe first allow change password adminweb adminorders
	  // CREATE TABLE table2 LIKE table1;INSERT INTO table2 SELECT * FROM table1
	});
	return false;
      }
    </script>
  </div>
<template>