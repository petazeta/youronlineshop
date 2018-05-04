<template>
  <div style="padding-bottom: 1em">
    <div class="msgbox" data-js='thisElement.innerHTML=thisNode.properties.username;'></div>
  </div>
  <table class="formtable">
    <tr>
      <td>
        <table>
	  <tr></tr>
	  <script>
	    var userdata=thisNode.getRelationship({"name":"user_userdata"}).children[0];
	    userdata.getTp("includes/templates/singlefield.php", function(){
	      var coltp=userdata.xmlTp.cloneNode(true);
	      userdata.refreshPropertiesView(thisElement,coltp);
	      intoColumns.apply(thisElement, [2]);
	    });
	  </script>
        </table>
      </td>
    </tr>
  </table>
  <div style="width:100%; text-align:center; padding-bottom: 1em;">
    <a href="" class="btn" data-js='
	thisElement.onclick=function(){
	  var launcher=new NodeMale();
	  launcher.refreshView(document.getElementById("centralcontent"), "includes/templates/showorders.php");
	  return false;
	}
    '>Show orders</a>
  </div>
  <div style="width:100%; text-align:center; padding-bottom: 1em;">
    <a href="" class="btn" data-js='
	thisElement.onclick=function(){
	  var launcher=new NodeMale();
	  launcher.refreshView(document.getElementById("centralcontent"), "includes/templates/showaddress.php");
	  return false;
	}
    '>Show address</a>
  </div>
</template>