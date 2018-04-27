<template id="butdeletetp">
  <a title="Remove" href="" style="" class="butdel">
    <img src="includes/css/images/trash.png"/>
  </a>
  <script>
    //normalize
    var launcher=thisNode;
    var thisNode=launcher.myNode;
    thisElement.onclick=function() {
      var launcher=new Alert();
      launcher.myTp=thisElement.parentElement.querySelector("template").content;
      //normailize
      launcher.myNode=thisNode;
      launcher.showalert();
      return false;
    }
  </script>
  <template>
    <div class="alert">
      <table class="mytable">
	<tr>
	  <td>
	    <h1 style="font-size:1.5em">DELETE</h1>
	    <div>ATENTION: This element and its descedants will be removed.</div>
	  </td>
	</tr>
	<tr>
	  <td>
	    <template>
	      <form action="dbrequest.php">
		<input type="hidden" name="json"/>
		<script>
		  var mydata=new NodeMale();
		  mydata.properties.id=thisNode.properties.id;
		  mydata.sort_order=thisNode.sort_order;
		  mydata.parentNode=new NodeFemale();
		  mydata.parentNode.loadasc(thisNode.parentNode, 1);
		  thisElement.value=JSON.stringify(mydata);
		</script>
		<input type="hidden" name="parameters" value="" data-js='thisElement.value=JSON.stringify({action:"delete my tree", user_id: webuser.properties.id});'/>
		<table style="margin:auto;">
		  <tr>
		    <td>
		      <input type="button" class="form-btn" value="Don't remove" name="exit">
		    </td>
		    <td><input type="submit" class="form-btn" value="Remove"></td>
		  </tr>
		</table>
	      </form>
	      <script>
		//normalize
		var thisLauncher=thisNode.myLauncher;
		thisElement.onsubmit=function() {
		  var myresult=new NodeMale();
		  var thisParent=thisNode.parentNode;
		  myresult.loadfromhttp(this, function(){
		    thisParent.removeChild(thisNode);
		    //for no children add a eventlistener to refreshChildrenView event
		    thisParent.refreshChildrenView();
		    thisParent.dispatchEvent("deleteNode", [thisNode]);
		    thisNode.dispatchEvent("deleteNode");
		  });
		  thisLauncher.hidealert();
		  return false;
		}
		thisElement.elements.exit.onclick=function(){
		  thisLauncher.hidealert();
		}
	      </script>
	    </template>
	  </td>
	  <script>
	    //normalize
	    var launcher=thisNode;
	    var thisNode=launcher.myNode;
	    thisNode.myLauncher=launcher;
	    var myFormTp=thisElement.querySelector("template").content.cloneNode(true);
	    thisNode.setView(myFormTp);
	    thisElement.insertBefore(myFormTp, thisElement.querySelector("template"));
	  </script>
	</tr>
      </table>
    </div>
  </template>
</template>