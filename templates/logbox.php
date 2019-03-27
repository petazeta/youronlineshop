<template id="logboxtp">
  <div class="sidebox">
    <div class="boxtitle">
      <a href=""></a>
      <script>
	var setlogstatus=function(){
	  var logbox=thisNode.getChild({name:"logboxout"});
	  if (webuser.properties.id) {
	    logbox=thisNode.getChild({name:"logboxin"});
	  }
	  var myNode=logbox.getNextChild({name:"status"}).getRelationship({name: "domelementsdata"}).getChild();
	  myNode.writeProperty(thisElement);
	}
	setlogstatus();
	webuser.addEventListener("log", function() {
	  setlogstatus();
	}, "setlogstatus");
	thisElement.addEventListener("click", function(event){
	  event.preventDefault();
	  if (webuser.properties.id) {
	    webuser.refreshView(document.getElementById("centralcontent"), "templates/loggedindata.php")
	  }
	  else {
	    (new Node()).refreshView(document.getElementById("centralcontent"), "templates/loginform.php");
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
		var logbox=thisNode.getChild({name:"logboxout"});
		if (webuser.properties.id) {
		  logbox=thisNode.getChild({name:"logboxin"});
		}
		thisElement.textContent=webuser.properties.username || logbox.getNextChild({name:"username"}).getRelationship({name: "domelementsdata"}).getChild().properties.value;
	      }
	      setlogname();
	      webuser.addEventListener("log", function() {
		setlogname();
	      }, "setlogname");
	      thisElement.addEventListener("click", function(event){
		event.preventDefault();
		if (webuser.properties.id) {
		  webuser.refreshView(document.getElementById("centralcontent"), "templates/loggedindata.php")
		}
		else {
		  (new Node()).refreshView(document.getElementById("centralcontent"), "templates/loginform.php");
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
	    var logbox=thisNode.getChild({name:"logboxout"});
	    if (webuser.properties.id) {
	      logbox=thisNode.getChild({name:"logboxin"});
	    }
	    var myNode=logbox.getNextChild({name:"title"}).getRelationship({name: "domelementsdata"}).getChild();
	    myNode.writeProperty(thisElement);
	  }
	  setlogtitle();
	  webuser.addEventListener("log", function() {
	    setlogtitle();
	  }, "setlogtitle");
	  thisElement.addEventListener("click", function(event){
	    event.preventDefault();
	    if (webuser.properties.id) {
	      webuser.logoff();
	    }
	    else {
	      (new Node()).refreshView(document.getElementById("centralcontent"), "templates/loginform.php");
	    }
	    return false;
	  });
	</script>
      </div>
    </div>                                  
  </div>
</template>