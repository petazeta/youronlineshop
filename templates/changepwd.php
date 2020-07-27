<template>
  <template>
    <div style="text-align:center">
      <div class="msgbox">
	<span></span>
	<script>
	  var title=thisNode.getNextChild({"name":"titmsg"}).getRelationship({name:"domelementsdata"}).getChild();
	  title.writeProperty(thisElement);
	  //adding the edition pencil
	  var launcher = new Node();
	  launcher.thisNode = title;
	  launcher.editElement = thisElement;
	  launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
	</script>
      </div>
    </div>
    <div>
      <form>
	<table class="formtable" style="box-shadow: 0px 3px 6px rgb(136, 136, 136);">
	  <tr>
	    <td>
	      <div class="form-group">
		<div style="display:table;">
		  <label class="form-label" for="new_password"></label>
		  <script>
		    var myNode=thisNode.getNextChild({name:"newpwd"}).getRelationship("domelementsdata").getChild();
		    myNode.writeProperty(thisElement);
		    var launcher = new Node();
		    launcher.thisNode = myNode;
		    launcher.editElement = thisElement;
		    launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
		  </script>
		</div>
		<input type="password" class="form-control" placeholder="" name="new_password">
		<script>
		  var myNode=thisNode.getNextChild({name:"newpwd"}).getRelationship("domelementsdata").getChild();
		  myNode.writeProperty(thisElement, null, "placeholder");
		  var launcher = new Node();
		  launcher.thisNode = myNode;
		  launcher.editElement = thisElement;
		  launcher.thisAttribute = "placeholder";
		  launcher.createInput=true;
		  launcher.visibility="visible";
		  launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
		</script>
	      </div>
	    </td>
	  </tr>
	  <tr>
	    <td>
	      <div class="form-group">
		<div style="display:table;">
		  <label class="form-label" for="repeat_password"></label>
		  <script>
		    var myNode=thisNode.getNextChild({name:"repeatpwd"}).getRelationship("domelementsdata").getChild();
		    myNode.writeProperty(thisElement);
		    var launcher = new Node();
		    launcher.thisNode = myNode;
		    launcher.editElement = thisElement;
		    launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
		  </script>
		</div>
		<input type="password" class="form-control" placeholder="" name="repeat_password">
		<script>
		  var myNode=thisNode.getNextChild({name:"repeatpwd"}).getRelationship("domelementsdata").getChild();
		  myNode.writeProperty(thisElement, null, "placeholder");
		  var launcher = new Node();
		  launcher.thisNode = myNode;
		  launcher.editElement = thisElement;
		  launcher.thisAttribute = "placeholder";
		  launcher.createInput=true;
		  launcher.visibility="visible";
		  launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
		</script>
	      </div>
	    </td>
	  </tr>
	  <tr>
	    <td style="text-align:center">
	      <div style="padding-bottom: 1rem; display:table; margin: auto;">
		<input type="submit" class="btn" value="" style="font-size:medium;">
		<script>
		  var myNode=thisNode.getNextChild({name:"btsmt"}).getRelationship("domelementsdata").getChild();
		  myNode.writeProperty(thisElement, null, "value");
		  var launcher = new Node();
		  launcher.thisNode = myNode;
		  launcher.editElement = thisElement;
		  launcher.thisAttribute = "value";
		  launcher.createInput=true;
		  launcher.visibility="visible";
		  launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
		</script>
	      </div>
	    </td>
	  </tr>
	</table>
	<div style="display:table;">
	  <input type="hidden" name="pwdCharError">
	  <script>
	    var myNode=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"logform"}).getNextChild({name:"pwdCharError"}).getRelationship("domelementsdata").getChild();
	    myNode.writeProperty(thisElement, null, "value");
	    var launcher = new Node();
	    launcher.thisNode = myNode;
	    launcher.editElement = thisElement;
	    launcher.thisAttribute = "value";
	    launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
	    if (webuser.isWebAdmin()) thisElement.type="input";
	  </script>
	</div>
	<div style="display:table;">
	  <input type="hidden" name="pwdOk">
	  <script>
	    var myNode=thisNode.getNextChild({name:"pwdChangeOk"}).getRelationship("domelementsdata").getChild();
	    myNode.writeProperty(thisElement, null, "value");
	    var launcher = new Node();
	    launcher.thisNode = myNode;
	    launcher.editElement = thisElement;
	    launcher.thisAttribute = "value";
	    launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
	    if (webuser.isWebAdmin()) thisElement.type="input";
	  </script>
	</div>
	<div style="display:table;">
	  <input type="hidden" name="pwdNotOk">
	  <script>
	    var myNode=thisNode.getNextChild({name:"pwdChangeError"}).getRelationship("domelementsdata").getChild();
	    myNode.writeProperty(thisElement, null, "value");
	    var launcher = new Node();
	    launcher.thisNode = myNode;
	    launcher.editElement = thisElement;
	    launcher.thisAttribute = "value";
	    launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
	    if (webuser.isWebAdmin()) thisElement.type="input";
	  </script>
	</div>
	<div style="display:table;">
	  <input type="hidden" name="pwdDoubleError">
	  <script>
	    var myNode=thisNode.getNextChild({name:"pwdDoubleError"}).getRelationship("domelementsdata").getChild();
	    myNode.writeProperty(thisElement, null, "value");
	    var launcher = new Node();
	    launcher.thisNode = myNode;
	    launcher.editElement = thisElement;
	    launcher.thisAttribute = "value";
	    launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
	    if (webuser.isWebAdmin()) thisElement.type="input";
	  </script>
	</div>
      </form>
      <script>
	thisElement.onsubmit=function() {
	  var min=4, max=15;
	  if (!DomMethods.checklength(thisElement.elements.new_password.value, min, max)) {
	    alert(eval(this.elements.pwdCharError.value));
	    return false;
	  }
          //check that the content is the same
	  if (thisElement.elements.new_password.value != thisElement.elements.repeat_password.value) {
	    alert(this.elements.pwdDoubleError.value);
	    return false;
	  }
          webuser.updatePwd(thisElement.elements.new_password.value).then(function(myNode){
	    if (myNode.extra.error) {
	      myalert.properties.alertmsg=thisElement.elements.pwdNotOk.value;
	      myalert.properties.timeout=3000;
	      myalert.showalert();
	      return false;
	    }
	    myalert.properties.alertmsg=thisElement.elements.pwdOk.value;
	    myalert.properties.timeout=3000;
	    myalert.showalert();
	  });
	  return false;
	}
      </script>
    </div>
    <div style="margin:auto; display:table;">
      <button class="btn"></button>
      <script>
        var bckloginlabel=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"backToLoginLb"});
        bckloginlabel.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
        //adding the edition pencil
        var launcher = new Node();
        launcher.thisNode = bckloginlabel.getRelationship("domelementsdata").getChild();
        launcher.editElement = thisElement;
        launcher.createInput=true;
        launcher.visibility="visible";
        launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
        thisElement.onclick=function(){
          (new Node()).refreshView(document.getElementById("centralcontent"), "templates/loggedindata.php");
        }
      </script>
    </div>
  </template>
  <div></div>
  <script>
    var pwdform=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"changepwd"});
    pwdform.refreshView(thisElement,thisElement.previousElementSibling);
  </script>
</template>