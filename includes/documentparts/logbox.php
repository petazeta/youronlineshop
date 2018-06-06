<div></div>
<template id="logboxtp">
  <div class="sidebox">
    <div class="boxtitle">
      <a href=""></a>
      <script>
	var setlogstatus=function(){
	  var logbox=thisNode.getChild({"name":"logboxout"});
	  if (webuser.properties.id) {
	    logbox=thisNode.getChild({"name":"logboxin"});
	  }
	  thisElement.textContent=logbox.getNextChild({"name":"status"}).getRelationship({name: "domelementsdata"}).getChild().properties.value;
	}
	setlogstatus();
	webuser.addEventListener("log", function() {
	  setlogstatus();
	});
	thisElement.addEventListener("click", function(event){
	  event.preventDefault();
	  if (webuser.properties.id) {
	    webuser.refreshView(document.getElementById("centralcontent"), "includes/templates/loggedindata.php")
	  }
	  else {
	    webuser.refreshView(document.getElementById("centralcontent"), "includes/templates/loginform.php");
	  }
	  return false;
	});
      </script>
    </div>
    <div class="boxbody">
      <table style="text-align:center;" class="boxlist">
	<tr>
	  <td class="boxlist">
	    <a href=""></a>
	    <script>
	      var setlogname=function(){
		var logbox=thisNode.getChild({"name":"logboxout"});
		if (webuser.properties.id) {
		  logbox=thisNode.getChild({"name":"logboxin"});
		}
		thisElement.textContent=webuser.properties.username || logbox.getNextChild({"name":"username"}).getRelationship({name: "domelementsdata"}).getChild().properties.value;
	      }
	      setlogname();
	      webuser.addEventListener("log", function() {
		setlogname();
	      });
	      thisElement.addEventListener("click", function(event){
		event.preventDefault();
		if (webuser.properties.id) {
		  webuser.refreshView(document.getElementById("centralcontent"), "includes/templates/loggedindata.php")
		}
		else {
		  webuser.refreshView(document.getElementById("centralcontent"), "includes/templates/loginform.php");
		}
		return false;
	      });
	    </script>
	  </td>
	</tr>
      </table>
      <div style="padding-top:0.5em; text-align: center;">
	<a href="" class="btn"></a>
	<script>
	  var setlogtitle=function(){
	    var logbox=thisNode.getChild({"name":"logboxout"});
	    if (webuser.properties.id) {
	      logbox=thisNode.getChild({"name":"logboxin"});
	    }
	    thisElement.textContent=logbox.getNextChild({"name":"title"}).getRelationship({name: "domelementsdata"}).getChild().properties.value;
	  }
	  setlogtitle();
	  webuser.addEventListener("log", function() {
	    setlogtitle();
	  });
	  thisElement.addEventListener("click", function(event){
	    event.preventDefault();
	    if (webuser.properties.id) {
	      webuser.logoff();
	    }
	    else {
	      webuser.refreshView(document.getElementById("centralcontent"), "includes/templates/loginform.php");
	    }
	    return false;
	  });
	</script>
      </div>
    </div>                                  
  </div>
</template>
<script>
var mycart=new cart();
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  var logboxparent=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"logbox"}).getRelationship({"name":"domelements"});
  logboxparent.refreshView(document.querySelector("#logboxtp").previousElementSibling, document.querySelector("#logboxtp"));
});
webuser.addEventListener("log", function(){
  if (!this.properties.id) {
    this.refreshView(document.getElementById("centralcontent"), "includes/templates/loginform.php");
  }
  else {
    this.refreshView(document.getElementById("centralcontent"),  "includes/templates/loggedindata.php");
  }
});
</script>
