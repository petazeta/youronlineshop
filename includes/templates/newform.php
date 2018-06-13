<template>
  <template>
    <div style="padding-bottom: 1rem">
      <div class="msgbox">
	Insert the required data to create new user.
      </div>
    </div>
    <div>
      <form>
	<table class="formtable" style="box-shadow: 0px 3px 6px rgb(136, 136, 136);">
	  <tr>
	    <td>
	      <div class="form-group">
		<label class="form-label"></label>
		<script>
		  thisNode.getNextChild({name:"userName"}).getRelationship("domelementsdata").getChild().appendProperty(thisElement);
		</script>
		<input class="form-control" placeholder="" name="user_name">
		<script>
		  thisNode.getNextChild({name:"userName"}).getRelationship("domelementsdata").getChild().appendProperty(thisElement, null, "placeholder");
		</script>
	      </div>
	    </td>
	  </tr>
	  <tr>
	    <td>
	      <div class="form-group">
		<label class="form-label"></label>
		<script>
		  thisNode.getNextChild({name:"password"}).getRelationship("domelementsdata").getChild().appendProperty(thisElement);
		</script>
		<input type="password" class="form-control" placeholder="" name="user_password">
		<script>
		  thisNode.getNextChild({name:"password"}).getRelationship("domelementsdata").getChild().appendProperty(thisElement, null, "placeholder");
		</script>
	      </div>
	    </td>
	  </tr>
	  <tr>
	    <td style="text-align:center">
	      <div style="padding-bottom: 1rem">
		<input type="submit" class="btn" value="" style="font-size:medium">
		<script>
		  thisNode.getNextChild({name:"signIn"}).getRelationship("domelementsdata").getChild().appendProperty(thisElement, null, "value");
		</script>
	      </div>
	    </td>
	  </tr>
	</table>
	<input type="hidden" name="userCharError">
	<script>
	  thisNode.getNextChild({name:"userCharError"}).getRelationship("domelementsdata").getChild().appendProperty(thisElement, null, "value");
	</script>
	<input type="hidden" name="pwdCharError">
	<script>
	  thisNode.getNextChild({name:"pwdCharError"}).getRelationship("domelementsdata").getChild().appendProperty(thisElement, null, "value");
	</script>
	<input type="hidden" name="loginOk">
	<script>
	  thisNode.getNextChild({name:"signedIn"}).getRelationship("domelementsdata").getChild().appendProperty(thisElement, null, "value");
	</script>
	<input type="hidden" name="userExistsError">
	<script>
	  thisNode.getNextChild({name:"userExistsError"}).getRelationship("domelementsdata").getChild().appendProperty(thisElement, null, "value");
	</script>
      </form>
      <script>
	thisElement.addEventListener("submit", function(e) {
	  e.preventDefault();
	  var min=4, max=15;
	  if (!DomMethods.checklength(thisElement.elements.user_name.value, min, max)) {
	    alert(eval(this.elements.userCharError.value));
	    return false;
	  }
	  if (!DomMethods.checklength(thisElement.elements.user_password.value, min, max)) {
	    alert(eval(this.elements.pwdCharError.value));
	    return false;
	  }
	  webuser.create(thisElement.elements.user_name.value, thisElement.elements.user_password.value, null, function(){
	    if (this.extra && this.extra.error) {
	      myalert.properties.alertmsg=thisElement.elements[this.extra.errorName].value;
	      myalert.properties.timeout=3000;
	      myalert.showalert();
	      return false;
	    }
	    myalert.properties.alertmsg=thisElement.elements.signedIn.value;
	    myalert.properties.timeout=3000;
	    myalert.showalert();
	  });
	  return false;
	});
      </script>
      <div style="text-align:center;">
	<button class="btn"></button>
	<script>
	  thisNode.getNextChild({name:"loginBack"}).getRelationship("domelementsdata").getChild().appendProperty(thisElement);
	  thisElement.onclick=function(){
	    (new NodeMale()).refreshView(document.getElementById("centralcontent"), "includes/templates/loginform.php");
	    return false;
	  }
	</script>
      </div>
    </div>
  </template>
  <div></div>
  <script>
    var logform=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"logform"});
    logform.refreshView(thisElement,thisElement.previousElementSibling);
  </script>
</template>