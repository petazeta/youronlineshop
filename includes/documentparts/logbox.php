<div></div>
<template id="logboxtp">
  <table class="box">
    <tr>
      <th class="boxhead">
      <a href=""></a>
	<script>
	  var setlogstatus=function(){
	    var logbox=thisNode.getChild({"name":"logboxout"});
	    if (webuser.properties.id) {
	      logbox=thisNode.getChild({"name":"logboxin"});
	    }
	    thisElement.textContent=logbox.getNextChild({"name":"status"}).properties.innerHTML;
	  }
	  setlogstatus();
	  webuser.addEventListener("log", function() {
	    setlogstatus();
	  });
	  thisElement.onclick=function(){
	    if (webuser.properties.id) {
	      webuser.refreshView(document.getElementById("centralcontent"), "includes/templates/loggedindata.php")
	    }
	    else {
	      webuser.refreshView(document.getElementById("centralcontent"), "includes/templates/loginform.php");
	    }
	    return false;
	  }
	</script>
      </th>
    </tr>
    <tr>
      <td class="content">
        <table class="boxInside">
          <tr>
             <td class="rowborder border-bottom">
             </td>
          </tr>
          <tr>
            <td>
              <table style="width:100%; text-align:center;">
                <tr>
                  <td class="row border-bottom">
                    <a href=""></a>
		    <script>
		      var setlogname=function(){
			var logbox=thisNode.getChild({"name":"logboxout"});
			if (webuser.properties.id) {
			  logbox=thisNode.getChild({"name":"logboxin"});
			}
			thisElement.textContent=webuser.properties.username || logbox.getNextChild({"name":"username"}).properties.innerHTML;
		      }
		      setlogname();
		      webuser.addEventListener("log", function() {
			setlogname();
		      });
		      thisElement.onclick=function(){
			if (webuser.properties.id) {
			  webuser.refreshView(document.getElementById("centralcontent"), "includes/templates/loggedindata.php")
			}
			else {
			  webuser.refreshView(document.getElementById("centralcontent"), "includes/templates/loginform.php");
			}
			return false;
		      }
		    </script>
                  </td>
                </tr>
		<tr>
		  <td class="rowborder">
		  </td>
		</tr>
                <tr>
                  <td>
                    <a href="" class="btn"></a>
		    <script>
		      var setlogtitle=function(){
			var logbox=thisNode.getChild({"name":"logboxout"});
			if (webuser.properties.id) {
			  logbox=thisNode.getChild({"name":"logboxin"});
			}
			thisElement.textContent=logbox.getNextChild({"name":"title"}).properties.innerHTML;
		      }
		      setlogtitle();
		      webuser.addEventListener("log", function() {
			setlogtitle();
		      });
		      thisElement.onclick=function(){
			if (webuser.properties.id) {
			  webuser.logoff();
			}
			else {
			  webuser.refreshView(document.getElementById("centralcontent"), "includes/templates/loginform.php");
			}
			return false;
		      }
		    </script>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
	    <td class="rowborder">
	    </td>
          </tr>
        </table>
      </td>
    </tr>                                  
  </table>
</template>
<script>
var mycart=new cart();
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  var logboxparent=labelsRoot.getNextChild({"name":"middle"}).getNextChild({"name":"logbox"}).getRelationship({"name":"domelements"});
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
