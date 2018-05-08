<div></div>
<template>
  <table class="box" id=logbox>
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
	      webuser.loginbutton="logbox"; //So the program will know what to do after login
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
			  webuser.loginbutton="logbox"; //So the program will know what to do after login
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
			  webuser.loginbutton="logbox"; //So the program will know what to do after login
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
webuser.addEventListener("loadses", function(){
  var logboxparent=labelsRoot.getNextChild({"name":"middle"}).getNextChild({"name":"logbox"}).getRelationship({"name":"domelements"});
  logboxparent.refreshView(document.querySelector("#logboxcontainer > div"), document.querySelector("#logboxcontainer > template").content);
});
webuser.addEventListener("log", function(){
  if (!this.properties.id) {
    if (this.loginbutton=="create")
      this.refreshView(document.getElementById("centralcontent"), "includes/templates/newform.php");
    else
      this.refreshView(document.getElementById("centralcontent"), "includes/templates/loginform.php");
  }
  else {
    if (this.loginbutton=="checkout")
      this.refreshView(document.getElementById("centralcontent"), document.getElementById("checkout1tp").content);
    else
      this.refreshView(document.getElementById("centralcontent"),  "includes/templates/loggedindata.php");
  }
});
</script>
