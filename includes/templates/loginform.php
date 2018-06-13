<template>
  <template>
    <div style="padding-bottom: 1rem">
      <div class="msgbox"></div>
      <script>
	var myNode=thisNode.getNextChild({name:"lgintt"}).getRelationship("domelementsdata").getChild();
	myNode.writeProperty(thisElement);
	DomMethods.propertyToEdit(myNode, thisElement)
      </script>
    </div>
    <div>
      <form>
	<table class="formtable" style="box-shadow: 0px 3px 6px rgb(136, 136, 136);">
	  <tr>
	    <td>
	      <div class="form-group">
		<div class="adminsinglelauncher">
		  <label class="form-label"></label>
		  <script>
		    thisNode.getNextChild({name:"userName"}).getRelationship("domelementsdata").getChild().writeProperty(thisElement);
		  </script>
		  <div class="btrightedit"></div>
		  <script>
		    if (webuser.isWebAdmin()) {
		      var admnlauncher=new NodeMale();
		      admnlauncher.buttons=[{ 
			template: document.getElementById("butedittp"),
			args:{thisNode: thisNode.getNextChild({name:"userName"}).getRelationship({name: "domelementsdata"}).getChild(), editElement:thisElement.parentElement.firstElementChild}
		      }]
		      admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
		    }
		  </script>
		</div>
		<input class="form-control" placeholder="" name="user_name">
		<script>
		  thisNode.getNextChild({name:"userName"}).getRelationship("domelementsdata").getChild().writeProperty(thisElement, null, "placeholder");
		</script>
	      </div>
	    </td>
	  </tr>
	  <tr>
	    <td>
	      <div class="form-group">
		<div class="adminsinglelauncher">
		  <label class="form-label"></label>
		  <script>
		    thisNode.getNextChild({name:"password"}).getRelationship("domelementsdata").getChild().writeProperty(thisElement);
		  </script>
		  <div class="btrightedit"></div>
		  <script>
		    if (webuser.isWebAdmin()) {
		      var admnlauncher=new NodeMale();
		      admnlauncher.buttons=[{ 
			template: document.getElementById("butedittp"),
			args:{thisNode: thisNode.getNextChild({name:"userName"}).getRelationship({name: "domelementsdata"}).getChild(), editElement:thisElement.parentElement.firstElementChild}
		      }]
		      admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
		    }
		  </script>
		</div>
		<input type="password" class="form-control" placeholder="" name="user_password">
		<script>
		  thisNode.getNextChild({name:"password"}).getRelationship("domelementsdata").getChild().writeProperty(thisElement, null, "placeholder");
		</script>
	      </div>
	    </td>
	  </tr>
	  <tr>
	    <td style="text-align:center">
	      <div style="padding-bottom: 1rem">
		<input type="submit" class="btn" value="" style="font-size:medium;">
		<script>
		  thisNode.getNextChild({name:"login"}).getRelationship("domelementsdata").getChild().writeProperty(thisElement, null, "value");
		</script>
		<input type="hidden">
		<script>
		  var thisNode=thisNode.getNextChild({name:"login"}).getRelationship("domelementsdata").getChild();
		  if (webuser.isWebAdmin()) {
		    thisNode.writeProperty(thisElement, null, "value");
		    thisElement.type="text";
		    DomMethods.activeEdition(thisNode, thisElement,
		      function() {
			if (thisNode.properties[thisNode.getFirstPropertyKey()] != editElement.value) { //just when content change and not void
			  DbMethods.changeProperty(thisNode);
			}
		      }
		    );
		  }
		</script>
	      </div>
	    </td>
	  </tr>
	</table>
	<input type="text" name="userCharError" style="display:none">
	<script>
	  var myNode=thisNode.getNextChild({name:"userCharError"}).getRelationship("domelementsdata").getChild();
	  if (webuser.isWebAdmin()) {
	    myNode.writeProperty(myElement, null, "value");

	    DomMethods.activeEdition(myNode, myElement,
	      function() {
		if (myNode.properties[myNode.getFirstPropertyKey()] != myElement.value) { //just when content change and not void
		  DbMethods.changeProperty(myNode);
		}
	      }
	    );
	  }
	</script>
	<input type="hidden" name="pwdCharError">
	<script>
	  thisNode.getNextChild({name:"pwdCharError"}).getRelationship("domelementsdata").getChild().writeProperty(thisElement, null, "value");
	</script>
	<input type="hidden" name="loginOk">
	<script>
	  thisNode.getNextChild({name:"loginOk"}).getRelationship("domelementsdata").getChild().writeProperty(thisElement, null, "value");
	</script>
	<input type="hidden" name="userError">
	<script>
	  thisNode.getNextChild({name:"userError"}).getRelationship("domelementsdata").getChild().writeProperty(thisElement, null, "value");
	</script>
	<input type="hidden" name="pwdError">
	<script>
	  thisNode.getNextChild({name:"pwdError"}).getRelationship("domelementsdata").getChild().writeProperty(thisElement, null, "value");
	</script>
      </form>
      <script>
	thisElement.onsubmit=function() {
	  var min=4, max=15;
	  if (!DomMethods.checklength(thisElement.elements.user_name.value, min, max)) {
	    alert(eval(this.elements.userCharError.value));
	    return false;
	  }
	  if (!DomMethods.checklength(thisElement.elements.user_password.value, min, max)) {
	    alert(eval(this.elements.pwdCharError.value));
	    return false;
	  }
	  webuser.login(thisElement.elements.user_name.value, thisElement.elements.user_password.value, function(){
	    if (this.extra.error) {
	      myalert.properties.alertmsg=thisElement.elements[this.extra.errorName].value;
	      myalert.properties.timeout=3000;
	      myalert.showalert();
	      return false;
	    }
	    myalert.properties.alertmsg=thisElement.elements.loginOk.value;
	    myalert.properties.timeout=3000;
	    myalert.showalert();
	  });
	  return false;
	}
      </script>
      <div style="text-align:center;">
	<button class="btn"></button>
	<script>
	  thisNode.getNextChild({name:"signIn"}).getRelationship("domelementsdata").getChild().writeProperty(thisElement);
	  thisElement.onclick=function(){
	    (new NodeMale()).refreshView(document.getElementById("centralcontent"), "includes/templates/newform.php");
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