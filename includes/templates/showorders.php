<template>
  <div style="width:100%; text-align:center;padding:1em 0 1.5em 0">
    <form>
      <select class="btn">
	<option value="new">Show New orders</option>
	<option value="archived">Show Archived orders</option>
      </select>
      <script>
	thisElement.onchange=function(){
	  var container=closesttagname.call(this,"DIV").nextElementSibling;
	  var launcher=new NodeMale();
	  launcher.filterorders=thisElement.options[thisElement.selectedIndex].value;
	  launcher.refreshView(container,"includes/templates/userorders.php");
	}
      </script>
    </form>
  </div>
  <div></div>
  <script>
    var launcher=new NodeMale();
    launcher.filterorders="new";
    launcher.refreshView(thisElement,"includes/templates/userorders.php");
  </script>
  <div style="width:100%; text-align:center;padding-top:20px;">
  <a href="" class="btn">Go to login page</a>
  <script>
    thisElement.onclick=function(){
      webuser.refreshView(document.getElementById("centralcontent"), "includes/templates/loggedindata.php");
      return false;
    };
  </script>
  </div>
</template>