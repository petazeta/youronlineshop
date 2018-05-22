<template>
  <div style="padding-bottom: 1em">
    <div class="msgbox"></div>
    <script>
      thisElement.innerHTML=thisNode.properties.username;
    </script>
  </div>
  <table class="formtable">
    <tr>
      <td>
        <table>
	  <tr></tr>
	  <script>
	  var datarel=thisNode.getRelationship({"name":"usersdata"});
	  function showdata(){
	    datarel.children[0].refreshPropertiesView(thisElement,"includes/templates/singlefield.php", function(){intoColumns.apply(thisElement, [2]);});
	  }
	  if (datarel.children.length==0) {
	    datarel.loadfromhttp({action: "load my children", user_id: webuser.properties.id}, showdata)
	  }
	  else showdata();
	  </script>
        </table>
      </td>
    </tr>
  </table>
  <div style="width:100%; text-align:center; padding-bottom: 1em;">
    <a href="" class="btn">Show orders</a>
    <script>
      thisElement.onclick=function(){
	var launcher=new NodeMale();
	launcher.refreshView(document.getElementById("centralcontent"), "includes/templates/showorders.php");
	return false;
      }
    </script>
  </div>
  <div style="width:100%; text-align:center; padding-bottom: 1em;">
    <a href="" class="btn">Show address</a>
    <script>
      thisElement.onclick=function(){
	var launcher=new NodeMale();
	launcher.refreshView(document.getElementById("centralcontent"), "includes/templates/showaddress.php");
	return false;
      }
    </script>
  </div>
  <script>
    //if cart it is not empty -> redirect to checkout
    if (mycart.getRelationship({name:"cartitem"}).children.length>0) {
      webuser.refreshView(document.getElementById("centralcontent"), document.getElementById("checkout1tp").content);
    }
  </script>
</template>